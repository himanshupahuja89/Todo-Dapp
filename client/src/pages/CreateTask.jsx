import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CreateTask = ({ state }) => {
  const { contract, account } = state;
  const navigate = useNavigate(); // Initialize useNavigate
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [redirectToWallet, setredirectToWallet] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
    if (redirectToWallet == true) {
      setredirectToWallet(false);
      navigate("/");
    } else {
      navigate("/view-all-tasks");
    }
  };
  useEffect(() => {
    if (!contract || !account) {
      setModalContent("Please connect your wallet.");
      setModalOpen(true);
      setredirectToWallet(true);
    }
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    const { contract, account } = state;
    const taskName = document.querySelector("#taskName").value;
    const taskDate = document.querySelector("#taskDate").value;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/ethereum/create-task`,
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
        if (contract && contract.methods) {
          await contract.methods
            .createTask(taskName, taskDate)
            .send({ from: account });
          setModalContent(`Task ${taskName} added at ${taskDate}`);
        }
      } else {
        alert("Task cannot be added");
      }
    } catch (error) {
      setModalContent(`Task already exists at ${taskDate}`);
      console.error(error);
    } finally {
      setModalOpen(true);
    }
  };
  return (
    <>
      <Navigation />
      <div className="create_task todo_btn">
        <form onSubmit={createTask}>
          <label>
            Name:
            <input id="taskName" />
          </label>
          <label>
            Date:
            <input id="taskDate" type="date" />
          </label>
          <button type="submit">Create Task</button>
        </form>

        {modalOpen && (
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
export default CreateTask;
