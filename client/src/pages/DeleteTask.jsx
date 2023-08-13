import Navigation from "../components/Navigation";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DeleteTask = ({ state }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [task, setTask] = useState({ numId: null, name: null, date: null });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [deleting, setDeleting] = useState(false); // Flag to indicate delete mode

  const handleTask = async (event) => {
    try {
      event.preventDefault();
      const { contract, account } = state;
      const taskID = document.querySelector("#taskID").value;
      let apiEndpoint = "";

      if (deleting) {
        apiEndpoint = `http://localhost:3000/api/ethereum/delete-task/${taskID}`;
      } else {
        apiEndpoint = `http://localhost:3000/api/ethereum/view-task/${taskID}`;
      }

      const res = await fetch(apiEndpoint, {
        method: deleting ? "DELETE" : "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.status === 204 && deleting) {
        // Delete success, reset state
        if (contract && contract.methods) {
          await contract.methods.deleteTask(taskID).send({ from: account });
          setDeleting(false);
          setModalContent("Task deleted successfully");
          setModalVisible(true);
        } else {
          setModalContent("Task cannot be deleted");
          setModalVisible(true);
        }
      } else if (res.status === 200 && !deleting) {
        // View success
        const data = await res.json();
        setTask(data.taskObj);
        setDeleting(
          data.taskObj.numId !== null &&
            data.taskObj.name !== null &&
            data.taskObj.date !== null
        );
        setModalVisible(false); // Hide modal if it was shown
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log("error", error);
      setModalContent(
        deleting ? "Failed to delete task" : "Task does not exist"
      );
      setModalVisible(true);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
    navigate("/view-all-tasks");

  };
  return (
    <>
      <Navigation />
      <div className="view_task todo_btn">
        {task.numId !== null && task.name !== null && task.date !== null ? (
          <div className="view_task_by_id  view_all_tasks_card">
            <p>Task ID: {task.numId}</p>
            <p>Task Name: {task.name}</p>
            <p>Task Date: {task.date}</p>
          </div>
        ) : (
          <div className="empty_div"></div>
        )}
        <form onSubmit={handleTask}>
          <label>
            ID:
            <input id="taskID" />
          </label>
          {deleting ? (
            <button type="submit">Delete Task</button>
          ) : (
            <button type="submit">View/Delete Task</button>
          )}
        </form>
        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <p>{modalContent}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeleteTask;
