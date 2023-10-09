import { useContext } from "react";
import ChatContext from "../context/ChatProvider";

const SingleChat = ({fetchAgain,  setFetchAgain}) => {
    const { selectedChat } = useContext(ChatContext);
    return ( <>single chat</> );
}
 
export default SingleChat;