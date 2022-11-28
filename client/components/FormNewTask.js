import { Button, Container, Header, Icon, Form, Ref } from "semantic-ui-react";
import styles from "../styles/index.module.css";

const FormNewTask = ({
  nameField,
  descField,
  doneField,
  handlerAdd,
  handlerEditSave,
  handlerEditCancel,
  currentNumber,
  currentID,
  title,
  setTitle,
  setDone,
  done,
  pending,
  pendingSave,
}) => {
  const onChangeName = (event) => {
    setTitle(event.target.value);
  };
  const onChangeDone = (event) => {
    setDone(event.target.checked);
  };

  return (
    <Form>
      <h1 className={styles.header3}>
        {currentID === null
          ? "Enter new task"
          : "Edit task number " + currentNumber}
      </h1>
      <Form.Group widths="equal">
        <Ref innerRef={nameField}>
          <Form.Input
            control="input"
            label="Name"
            placeholder="set short name"
            required
            error={!title}
            onChange={onChangeName}
          ></Form.Input>
        </Ref>
        {currentID !== null && (
          <Form.Field label="Done" control="checkbox">
            <input
              type="checkbox"
              checked={done}
              onChange={onChangeDone}
              style={{
                width: 35,
                height: 35,
              }}
            />
          </Form.Field>
        )}
      </Form.Group>

      <Ref innerRef={descField}>
        <Form.Field control="textarea" label="Description"></Form.Field>
      </Ref>
      <Form.Field>
        {currentID === null && (
          <Container style={{ paddingBottom: 20 }}>
            <Button
              primary
              loading={pending}
              disabled={!title}
              onClick={handlerAdd}
              style={{ width: 100 }}
            >
              <Icon name="add" />
              Add
            </Button>
          </Container>
        )}
        {currentID !== null && (
          <Container style={{ paddingBottom: 20 }}>
            <Button
              loading={pendingSave}
              primary
              onClick={handlerEditSave}
              style={{ width: 150 }}
            >
              <Icon name="save" />
              Save
            </Button>
            <Button onClick={handlerEditCancel} style={{ width: 150 }}>
              <Icon name="cancel" />
              Cancel
            </Button>
          </Container>
        )}
      </Form.Field>
    </Form>
  );
};

export default FormNewTask;
