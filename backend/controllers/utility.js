const { contract } = require('../smart-contract/contract')
const dateclashCheck = async (taskDate) => {
    const tasks = await contract.methods.allTask().call();
    const foundTask = tasks.find(task => task.date === taskDate);

    if (foundTask) {
        return foundTask.name;
    }
    return "No Task Found";
}

const priorityCheck = async (id, account) => {
    const tasks = await contract.methods.allTask().call({from: account});
    const result = tasks[id - 1].name.includes("priority")
    return result;
}
module.exports = { dateclashCheck, priorityCheck }