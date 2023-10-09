const ChatItem = ({ name, latestMessage, bg }) => {
  return (
    <div className={`flex items-center justify-between border-solid border-2 ${bg} font-semibold border-blue-500 rounded-md py-1 px-2 my-2 mx-2 cursor-pointer`}>
      <div className="flex items-center">
        {/* <img src={dp} alt="dp" className="w-10 h-10 rounded-full mr-3" /> */}
        <div>
          <p className="font-semibold text-lg bg-blue-300">{name}</p>
          <p className="font-semibold text-lg">{latestMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
