import Layout from "../components/Layout";
import DataTable from "../components/DataTable";

import {
  Button,
  Label,
  Message,
  Container,
  Header,
  Transition,
  Icon,
  Popup,
} from "semantic-ui-react";
import { ethers } from "ethers";
import { createRef, useEffect, useRef, useState } from "react";
import FormNewTask from "../components/FormNewTask";

const ToDoList = () => {
  const [address, setAdress] = useState("");
  const [addressContract, setAddressContract] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [pending, setPending] = useState(false);
  const [pendingNewContract, setPendingNewContract] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentID, setCurrentID] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [title, setTitle] = useState("");
  const [done, setDone] = useState(false);
  const todoAddressFactory = "0x393C6F0d88186C51AD1C7e90097Dc1C5923d153b";
  const todoAbiFactory = [
    {
      inputs: [],
      name: "createToDoList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "ownerToDoList",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const todoAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_title",
          type: "string",
        },
        {
          internalType: "string",
          name: "_desc",
          type: "string",
        },
      ],
      name: "addToDo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "_ids",
          type: "uint256[]",
        },
      ],
      name: "deleteToDo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_title",
          type: "string",
        },
        {
          internalType: "string",
          name: "_desc",
          type: "string",
        },
        {
          internalType: "bool",
          name: "_completed",
          type: "bool",
        },
      ],
      name: "editToDo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "list",
      outputs: [
        {
          internalType: "string",
          name: "title",
          type: "string",
        },
        {
          internalType: "string",
          name: "desc",
          type: "string",
        },
        {
          internalType: "bool",
          name: "completed",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "taskCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "togleToDoStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const nameField = createRef();
  const descField = createRef();

  const timeout = (delay) => {
    return new Promise((res) => {
      setTimeout(res, delay);
    });
  };

  const showPopup = async (text, error = false) => {
    error ? setErrorMsg(text) : setMessage(text);
    const t = await timeout(5000);
    error ? setErrorMsg("") : setMessage("");
  };

  const connectMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const Accounts = await provider.send("eth_requestAccounts", []);
    const account = Accounts[0];
    setAdress(account);
    if (network.name !== "goerli") {
      showPopup("Switch to goerli network!", true);
      return;
    }
    if (account) {
      try {
        const todoFactory = new ethers.Contract(
          todoAddressFactory,
          todoAbiFactory,
          provider
        );
        const todoAddress = await todoFactory.ownerToDoList(account);
        setAddressContract(todoAddress);
        if (todoAddress !== "0x0000000000000000000000000000000000000000") {
          const todo = new ethers.Contract(todoAddress, todoAbi, provider);
          const taskCount = Number(await todo.taskCount());
          const newRecords = [];
          for (let index = 0; index < taskCount; index++) {
            const element = await todo.list(index);
            const record = {
              id: Number(element.id),
              completed: element.completed,
              desc: element.desc,
              title: element.title,
              index: index,
            };
            newRecords.push(record);
          }

          setRecords(newRecords);
        } else {
          showPopup("First create your note!", true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    connectMetamask();
    window.ethereum.on("chainChanged", networkSettingsChanged);
    window.ethereum.on("accountsChanged", networkSettingsChanged);
  }, []);

  const networkSettingsChanged = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    setRecords([]);
    connectMetamask();
  };

  const handlerAdd = async () => {
    try {
      setPending(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const todo = new ethers.Contract(addressContract, todoAbi, provider);
      const signer = provider.getSigner();
      const accWithSigner = todo.connect(signer);
      const tx = await accWithSigner.addToDo(
        nameField.current.lastChild.value,
        descField.current.lastChild.value
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        connectMetamask();
        showPopup("NEW TASK ADDED!");
        clearData();
      }
    } catch (error) {
      console.error(error);
      showPopup(error.message, true);
    } finally {
      setPending(false);
    }
  };

  const handlerCreate = async (event) => {
    try {
      setPendingNewContract(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const todoFactory = new ethers.Contract(
        todoAddressFactory,
        todoAbiFactory,
        provider
      );
      const accWithSigner = todoFactory.connect(signer);
      const tx = await accWithSigner.createToDoList();
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        connectMetamask();
        showPopup("CONGRATULATIONS!Contract created!");
      }
    } catch (error) {
      console.error(error);
      showPopup(error.message, true);
    } finally {
      setPendingNewContract(false);
    }
  };
  const handlerDelete = async (event) => {
    try {
      setPendingDelete(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const todo = new ethers.Contract(addressContract, todoAbi, provider);
      const signer = provider.getSigner();
      const accWithSigner = todo.connect(signer);
      const tx = await accWithSigner.deleteToDo(selectedRows);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        connectMetamask();
        showPopup("DELETE SUCCESS!");
        setSelectedRows([]);
      }
    } catch (error) {
      console.error(error);
      showPopup(error.message, true);
    } finally {
      setPendingDelete(false);
    }
  };
  const handlerCheckbox = (checked, id) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      const result = selectedRows.filter((i) => i !== id);
      setSelectedRows(result);
    }
  };
  const handlerEditClick = (e, record) => {
    setCurrentID(record.id);
    setCurrentNumber(record.index + 1);
    setTitle(record.title);
    setDone(record.completed);
    nameField.current.lastChild.value = record.title;
    descField.current.lastChild.value = record.desc;
  };
  const handlerEditCancel = (e, record) => {
    setCurrentID(null);
    clearData();
  };
  const clearData = () => {
    setTitle("");
    nameField.current.lastChild.value = "";
    descField.current.lastChild.value = "";
  };

  const handlerEditSave = async (e, record) => {
    try {
      setPendingSave(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const todo = new ethers.Contract(addressContract, todoAbi, provider);
      const signer = provider.getSigner();
      const accWithSigner = todo.connect(signer);
      const tx = await accWithSigner.editToDo(
        currentID,
        nameField.current.lastChild.value,
        descField.current.lastChild.value,
        done
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        connectMetamask();
        showPopup("UPDATE SUCCESS!");
        handlerEditCancel();
      }
    } catch (error) {
      console.error(error);
      showPopup(error.message, true);
    } finally {
      setPendingSave(false);
    }
  };

  const handlerToggle = async (e, record) => {
    try {
      setPending(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const todo = new ethers.Contract(addressContract, todoAbi, provider);
      const signer = provider.getSigner();
      const accWithSigner = todo.connect(signer);
      const tx = await accWithSigner.togleToDoStatus(record.id);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        connectMetamask();
        showPopup("UPDATE SUCCESS!");
      }
    } catch (error) {
      console.error(error);
      showPopup(error.message, true);
    } finally {
      setPending(false);
    }
  };

  return (
    <Layout>
      {address && (
        <>
          <Container textAlign="right">
            <Label color="red" size="large">
              {address}
            </Label>
            {!address && <Button onClick={connectMetamask}>Connect</Button>}
          </Container>
          <Transition.Group animation="drop" duration="1000">
            {message && (
              <Container style={{ margin: 10, width: 250, float: "right" }}>
                <Message positive>{message}</Message>
              </Container>
            )}
            {errorMsg && (
              <Container style={{ margin: 10, width: 250, float: "right" }}>
                <Message negative>{errorMsg}</Message>
              </Container>
            )}
          </Transition.Group>
        </>
      )}
      {addressContract == "0x0000000000000000000000000000000000000000" && (
        <Button onClick={handlerCreate} primary loading={pendingNewContract}>
          Create note
        </Button>
      )}
      {addressContract !== "0x0000000000000000000000000000000000000000" && (
        <>
          <DataTable
            records={records}
            handlerCheckbox={handlerCheckbox}
            handlerEditClick={handlerEditClick}
            handlerDelete={handlerDelete}
            handlerToggle={handlerToggle}
            selectedItems={selectedRows}
            currentID={currentID}
            pending={pending}
            pendingDelete={pendingDelete}
          />
          <Container style={{ paddingTop: 20 }}>
            <FormNewTask
              handlerAdd={handlerAdd}
              handlerEditSave={handlerEditSave}
              handlerEditCancel={handlerEditCancel}
              nameField={nameField}
              descField={descField}
              currentNumber={currentNumber}
              currentID={currentID}
              title={title}
              setTitle={setTitle}
              done={done}
              setDone={setDone}
              pending={pending}
              pendingSave={pendingSave}
            />
          </Container>
        </>
      )}
    </Layout>
  );
};

export default ToDoList;
