import { useState, useEffect } from "react";
import axios from "axios";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const fetchData = async () => {
    const data = await axios.get("/api");
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Chats</h1>
    </div>
  );
};

export default Chats;
