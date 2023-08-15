import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ViewAllTasks = ({ state }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [taskList, setTaskList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { contract, account } = state;

  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
    navigate("/");
  };

  useEffect(() => {
    const allTasks = async () => {
      if (!contract || !account) {
        setModalContent("Please connect your wallet.");
        setModalVisible(true);
      } else {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/ethereum/view-all-task`,
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
            setTaskList(data.taskList);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    allTasks();
  }, []);
  return (
    <>
      <Navigation />
      <div className="view_all_tasks">
        {taskList.map((task) => {
          return (
            <div
              className="view_all_tasks_card"
              key={task.taskId}
              style={
                task.id !== "" && task.name !== "" && task.date !== ""
                  ? {}
                  : { display: "none" }
              }
            >
              <p>{task.taskId}</p>
              <p>{task.name}</p>
              <p>{task.date}</p>
            </div>
          );
        })}
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
export default ViewAllTasks;
