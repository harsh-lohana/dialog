import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ChatContext from "../context/ChatProvider";
import ChatBox from "../components/ChatBox";
import UserChats from "../components/UserChats";
import Loader from "../components/Loader";
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
import toast from "react-hot-toast";
import SearchResultItem from "../components/SearchResultItem";

const Chats = () => {
  const { user, chats, setChats, setSelectedChat } = useContext(ChatContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);

  const handleSearch = async () => {
    if (!search) {
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
        const { data } = await axios.get(`/api/users?search=${search}`, config);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast.error("Error occured!");
      }
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      console.log(chats);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      {user && (
        <div className="w-[100%] h-[100vh]">
          <Navbar dp={user.dp} onOpen={onOpen} />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Search Users</ModalHeader>
              <ModalCloseButton />
              <ModalBody className="flex justify-between flex-col">
                <div className="flex w-full justify-between items-center">
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-[300px] border-solid border-2 border-blue-500 rounded-md bg-blue-300 h-8"
                  />
                  <button
                    onClick={handleSearch}
                    className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
                  >
                    Search
                  </button>
                </div>
                {loading ? (
                  <Loader />
                ) : (
                  searchResult?.map((result) => (
                    <SearchResultItem
                      key={result._id}
                      user={result}
                      handleFunction={() => accessChat(result._id)}
                    />
                  ))
                )}
              </ModalBody>
              <ModalFooter>
                <button
                  onClick={onClose}
                  className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
                >
                  Close
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <div className="flex justify-between">
            <div>{user && <UserChats fetchAgain={fetchAgain} />}</div>
            <div>{user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;
