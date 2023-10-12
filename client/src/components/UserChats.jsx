import { useContext, useEffect, useState } from "react";
import ChatContext from "../context/ChatProvider";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "./Loader";
import { Box, Stack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { getSender } from "../utils/chatLogic";
import GroupModal from "./GroupModal";

const UserChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, selectedChat, setChats, setSelectedChat } =
    useContext(ChatContext);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="bg-gray-500 h-[85vh] w-[39vw] rounded-xl">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-2xl font-bold text-black">Chats</h2>
        <GroupModal>
          <button className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2">
            New group
          </button>
        </GroupModal>
      </div>
      {chats ? (
        <Stack overflowY="scroll" className="bg-gray-500 w-full">
          {chats.map((chat) => (
            <Box
              className="flex gap-2"
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "#64B5F6" : "#90CAF9"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              mx={2}
              my={1}
              h={16}
              w="95%"
              borderRadius="lg"
              key={chat._id}
            >
              {!chat.isGroup ? (
                <img
                  src={getSender(loggedUser, chat.users).dp}
                  alt="dp"
                  className="w-10 h-10 rounded-full"
                />
              ) : null}
              <div>
                <Text className="text-xl font-bold">
                  {!chat.isGroup
                    ? getSender(loggedUser, chat.users).name
                    : chat.name}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </div>
            </Box>
          ))}
        </Stack>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default UserChats;
