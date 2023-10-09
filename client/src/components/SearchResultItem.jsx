const SearchResultItem = ({ user, handleFunction }) => {
  return (
    <div className="flex items-center justify-between border-solid border-2 bg-blue-300 font-semibold border-blue-500 rounded-md py-1 px-2 my-2">
      <div className="flex items-center">
        <img src={user.dp} alt="dp" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="font-semibold text-lg">{user.email}</p>
        </div>
      </div>
      <button onClick={() => handleFunction(user._id)} className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2">
        Add
      </button>
    </div>
  );
};

export default SearchResultItem;
