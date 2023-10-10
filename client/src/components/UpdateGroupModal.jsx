import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import ChatContext from "../context/ChatProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader";
import SearchResultItem from "./SearchResultItem";

const UpdateGroupModal = ({ children, fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const [groupChatName, setGroupChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      toast.error("No search input!");
      return;
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/users?search=${query}`, config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast.error("Error occured!");
      }
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      toast.success("Group renamed!");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleAddUser = async (addUser) => {
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      toast.error("User alredy in group!");
      return;
    }
    if (selectedChat.admin._id !== user._id) {
      toast.error("Only admins can add users!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/add`,
        {
          chatId: selectedChat._id,
          userId: addUser._id,
        },
        config
      );
      toast.success("User added!");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setLoading(false);
    }
    setGroupChatName("");
  };
  const handleRemoveUser = async (removeUser) => {
    if (selectedChat.admin._id !== user._id && removeUser._id !== user._id) {
      toast.error("Only admins can remove users!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/remove`,
        {
          chatId: selectedChat._id,
          userId: removeUser._id,
        },
        config
      );
      toast.success("User removed!");
      removeUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" d="flex" justifyContent="center">
            {selectedChat.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Group name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Group name"
                  onChange={(e) => setGroupChatName(e.target.value)}
                  className="w-[300px] mb-3 border-solid border-2 border-blue-500 rounded-md bg-blue-300 h-8"
                />
              </div>
              {renameLoading ? <Loader /> : null}
              <button
                onClick={handleRename}
                className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md px-2 h-8 w-20 mb-2"
              >
                Update
              </button>
            </div>
            <div className="flex">
              {selectedChat.users.map((u) => (
                <div
                  className="flex gap-1 bg-blue-300 p-1 m-1 my-2 text-md font-semibold rounded-md"
                  key={u._id}
                >
                  <p>{u.name}</p>
                  <button onClick={() => handleRemoveUser(u)}>x</button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="users">Add users</label>
              <input
                type="text"
                id="users"
                placeholder="Add users"
                onChange={(e) => handleSearch(e.target.value)}
                className="w-[300px] border-solid border-2 border-blue-500 rounded-md bg-blue-300 h-8"
              />
            </div>
            {loading ? (
              <Loader />
            ) : (
              searchResult?.map((result) => (
                <SearchResultItem
                  key={result._id}
                  user={result}
                  handleFunction={() => handleAddUser(result)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => handleRemoveUser(user)}
              className="border-solid border-2 bg-red-300 font-semibold border-red-500 text-red-700 rounded-md py-1 px-2 my-2"
            >
              Leave
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
