import { useContext } from "react";
import ChatContext from "../context/ChatProvider";
import { getSender } from "../utils/chatLogic";
import UpdateGroupModal from "./UpdateGroupModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = useContext(ChatContext);
  return (
    <>
      {selectedChat ? (
        <div>
          {selectedChat.isGroup ? (
            <div className="flex justify-between items-center p-2 bg-gray-600 rounded-t-xl h-14">
              <h3 className="text-lg font-semibold">{selectedChat.name}</h3>
              <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
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
