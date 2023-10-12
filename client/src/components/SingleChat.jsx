import { useContext, useEffect, useState } from "react";
import ChatContext from "../context/ChatProvider";
import { getSender } from "../utils/chatLogic";
import UpdateGroupModal from "./UpdateGroupModal";
import Loader from "./Loader";
import axios from "axios";
import toast from "react-hot-toast";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setLoading(true);
        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );
        console.log(data);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error.message);
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage) {
      toast.error("Input is empty!");
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col justify-end h-full">
          {selectedChat.isGroup ? (
            <div className="flex justify-between items-center p-2 bg-gray-600 rounded-t-xl h-14">
              <h3 className="text-lg font-semibold">{selectedChat.name}</h3>
              <UpdateGroupModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              >
                <button className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2">
                  info
                </button>
              </UpdateGroupModal>
            </div>
          ) : (
            <div className="flex gap-2 items-center p-2 bg-gray-600 rounded-t-xl">
              <img
                src={getSender(user, selectedChat.users).dp}
                alt="dp"
                className="w-10 h-10 rounded-full"
              />
              <h3 className="text-lg font-semibold">
                {getSender(user, selectedChat.users).name}
              </h3>
            </div>
          )}
          <div className="h-[88.15%] min-w-full flex items-center justify-center">
            {loading ? <Loader /> : <div>{messages.map(m => <h1>{m.content}</h1>)}</div>}
          </div>
          <form className="flex justify-between items-start overflow-hidden rounded-b-xl ml-3">
            <input
              type="text"
              placeholder="Start typing..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="focus:outline-none w-[90%] mb-3 border-solid border-2 border-blue-500 rounded-md bg-blue-300 h-10"
            />
            <button
              onClick={sendMessage}
              className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 h-10 mx-2"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="text-3xl font-semibold flex justify-center items-center h-full">
          <h3>Click chat to start</h3>
        </div>
      )}
    </>
  );
};

export default SingleChat;
