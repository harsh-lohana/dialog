import { useContext } from "react";
import ChatContext from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain,  setFetchAgain}) => {
  const { selectedChat } = useContext(ChatContext);
  return <div className="bg-gray-500 h-[85vh] w-[49vw] rounded-xl">
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
  </div>;
};

export default ChatBox;
