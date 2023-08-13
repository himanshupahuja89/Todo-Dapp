// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Todo{
    struct Task{
        uint id;
        string name;
        string date;
    }

    address owner;
    Task task;
    mapping(uint=>Task) tasks; //list of all tasks
    uint taskId=1;//taskId

    modifier checkId(uint id){
        require(id!=0 && id<taskId,"Invalid Id");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    function createTask(string calldata _taskName, string calldata _date) public {
        tasks[taskId] = Task(taskId,_taskName,_date);
        taskId++;
    }

    function updateTask(uint _taskId, string calldata _taskName, string calldata _date) public {
        tasks[_taskId] = Task(_taskId, _taskName, _date);
    }

    function allTask() public view returns(Task[] memory){
        Task[] memory taskList = new Task[](taskId-1); //array -> length -> taskId-1
        for(uint i=0; i< taskId-1;i++){
            taskList[i] = tasks[i+1];
        }
        return taskList;
    }

    function viewTask(uint _taskId) checkId(_taskId) public view returns(Task memory) {
        return tasks[_taskId];
    }

    // 2 Blockchain 12/09/21
    // 0 "" ""
    function deleteTask(uint _taskId) checkId(_taskId) public {
        delete tasks[_taskId];
    }
}
