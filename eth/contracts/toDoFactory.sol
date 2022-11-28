// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract toDoFactory {
    mapping(address => address) public ownerToDoList;

    function createToDoList() public {
        toDoList tlist = new toDoList(msg.sender);
        ownerToDoList[msg.sender] = address(tlist);
    }
}

contract toDoList {
    address public owner;
    uint public taskCount;
    uint private currentId;

    struct toDo {
        string title;
        string desc;
        bool completed;
        uint id;
    }

    toDo[] public list;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not an owner!");
        _;
    }

    function addToDo(
        string calldata _title,
        string calldata _desc
    ) external onlyOwner {
        toDo memory newTodo = toDo({
            title: _title,
            desc: _desc,
            completed: false,
            id: currentId
        });
        list.push(newTodo);
        currentId += 1;
        taskCount = list.length;
    }

    function togleToDoStatus(uint _id) external onlyOwner {
        toDo storage t = list[getIndexByID(_id)];
        t.completed = !t.completed;
    }

    function editToDo(
        uint _id,
        string calldata _title,
        string calldata _desc,
        bool _completed
    ) external onlyOwner {
        toDo storage t = list[getIndexByID(_id)];
        t.completed = _completed;
        t.title = _title;
        t.desc = _desc;
    }

    function deleteToDo(uint[] memory _ids) external onlyOwner {
        for (uint i = 0; i < _ids.length; i++) {
            uint removeIndex = getIndexByID(_ids[i]);
            remove(removeIndex);
        }
        taskCount = list.length;
    }

    function remove(uint _removeIndex) private onlyOwner {
        for (uint i = _removeIndex; i < list.length - 1; i++) {
            list[i] = list[i + 1];
        }
        list.pop();
    }

    function getIndexByID(uint _id) private view returns (uint) {
        bool success;
        for (uint i = 0; i < list.length; i++) {
            if (list[i].id == _id) {
                success = true;
                return i;
            }
        }
        require(success, "element not found");
        return 0;
    }
}
