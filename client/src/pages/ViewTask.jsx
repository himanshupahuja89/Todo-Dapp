import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ViewTask = ({ state }) => {
  const { contract, account } = state;
  const navigate = useNavigate(); // Initialize useNavigate

  const [task, setTask] = useState({ numId: null, name: null, date: null });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [redirectToWallet, setredirectToWallet] = useState(false);

  useEffect(() => {
    if (!contract || !account) {
      setModalContent("Please connect your wallet.");
      setModalVisible(true);
      setredirectToWallet(true);
    }
  }, []);
  const viewTask = async (event) => {
    try {
      event.preventDefault();
      const taskID = document.querySelector("#taskID").value;
      const res = await fetch(
        `http://localhost:3000/api/ethereum/view-task/${taskID}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ account }),
        }
      );
      const data = await res.json();
      if (data.status === 200) {
        setTask(data.taskObj);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      setModalContent("Task does not exist");
      setModalVisible(true);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
    if (redirectToWallet == true) {
      navigate("/");
    }
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
        <form onSubmit={viewTask}>
          <label>
            ID:
            <input id="taskID" />
          </label>
          <button type="submit">View Task</button>
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
export default ViewTask;
