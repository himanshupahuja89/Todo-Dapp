import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UpdateTask = ({ state }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [redirectToWallet, setredirectToWallet] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
    if (redirectToWallet == true) {
      setredirectToWallet(false);
      navigate("/");
    }
  };
  useEffect(() => {
    if (!contract || !account) {
      setModalContent("Please connect your wallet.");
      setModalVisible(true);
      setredirectToWallet(true);
    }
  }, []);

  const { contract, account } = state;

  const updateTask = async (event) => {
    event.preventDefault();
    const taskName = document.querySelector("#taskName").value;
    const taskDate = document.querySelector("#taskDate").value;
    const taskID = document.querySelector("#taskID").value;

    if (!contract || !account) {
      setModalContent("Please connect your wallet.");
      setModalVisible(true);
      setredirectToWallet(true);
      return;
    } else {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/ethereum/update-task`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ taskDate: taskDate }),
          }
        );
        const data = await res.json();
        if (data.status === 200) {
          await contract.methods
            .updateTask(taskID, taskName, taskDate)
            .send({ from: account });
          setModalContent(
            `Task ID ${taskID} updated with task name ${taskName} and date ${taskDate}`
          );
          setModalVisible(true);
        } else {
          throw new Error("Task cannot be updated because of date clash");
        }
      } catch (error) {
        setModalContent("Task cannot be updated");
        setModalVisible(true);
      }
    }
  };
  return (
    <>
      <Navigation />
      <div className="update_task todo_btn">
        <form onSubmit={updateTask}>
          <label>
            ID:
            <input id="taskID" />
          </label>
          <label>
            Name:
            <input id="taskName" />
          </label>
          <label>
            Date:
            <input id="taskDate" type="date" />
          </label>
          <button type="submit">Update Task</button>
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
export default UpdateTask;
