// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Todo {
    struct Task {
        uint256 id;
        string name;
        string date;
    }

    address private owner;
    Task task;
    mapping(address => mapping(uint256 => Task)) private userTasks; //list of all tasks
    mapping(address => uint256) private userTaskCount;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action"
        );
        _;
    }
    modifier checkId(uint256 id) {
        require(id != 0 && id <= userTaskCount[msg.sender], "Invalid Id");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createTask(string calldata _taskName, string calldata _date)
        public
    {
        uint256 taskId = userTaskCount[msg.sender] + 1;
        userTasks[msg.sender][taskId] = Task(taskId, _taskName, _date);
        userTaskCount[msg.sender]++;
    }

    function updateTask(
        uint256 _taskId,
        string calldata _taskName,
        string calldata _date
    ) public checkId(_taskId) {
        userTasks[msg.sender][_taskId] = Task(_taskId, _taskName, _date);
    }

    function allTask() public view returns (Task[] memory) {
        Task[] memory taskList = new Task[](userTaskCount[msg.sender]);
        for (uint256 i = 1; i <= userTaskCount[msg.sender]; i++) {
            taskList[i - 1] = userTasks[msg.sender][i];
        }
        return taskList;
    }

    function viewTask(uint256 _taskId)
        public
        view
        checkId(_taskId)
        checkId(_taskId)
        returns (Task memory)
    {
        return userTasks[msg.sender][_taskId];
    }

    // 2 Blockchain 12/09/21
    // 0 "" ""
    function deleteTask(uint256 _taskId) public checkId(_taskId) {
        delete userTasks[msg.sender][_taskId];
    }

    function contractOwner() public view returns (address) {
        return owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }
}
