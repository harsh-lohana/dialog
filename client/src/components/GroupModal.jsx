import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import ChatContext from "../context/ChatProvider";
import SearchResultItem from "./SearchResultItem";
import Loader from "./Loader";

const GroupModal = ({ children }) => {
  const { user, chats, setChats } = useContext(ChatContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already exist!");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== deleteUser._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all feilds!");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      console.log(data.admin);
      toast.success("Group created successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" d="flex" justifyContent="center">
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <form>
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
            </form>
            <div className="flex">
              {selectedUsers.map((u) => (
                <div
                  className="flex gap-1 bg-blue-300 p-1 m-1 my-2 text-md font-semibold rounded-md"
                  key={u._id}
                >
                  <p>{u.name}</p>
                  <button onClick={() => handleDelete(u)}>x</button>
                </div>
              ))}
            </div>
            {loading ? (
              <Loader />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <SearchResultItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <button
              onClick={handleSubmit}
              className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
            >
              Create
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
