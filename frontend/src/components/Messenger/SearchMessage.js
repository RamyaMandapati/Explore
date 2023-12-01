import axios from "axios";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";

const SearchMessage = () => {
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const onSearch = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    // setusers(data.filter((u) => u.name.toLowerCase().includes(query)));

    const searchUsers = async () => {
      try {
        const res = await axios.get(`/api/profile?userName=${query}`);

        console.log(res);

        if (res.status === 200) {
          setUsers(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (query.length !== 0) searchUsers();
  }, [query]);

  const OpenConversation = async (userId) => {
    try {
      const data = {
        senderId: userId,
        receiverId: user && user._id,
      };
      let res = await axios.post(`/api/conversation`, data);
      if (res.data) {
        history.push(`/messenger/${res.data._id}`);
        window.location.reload();
      }
    } catch (err) {
      console.log(err.response.data.message);

      alert(err.response.data.message);
    }
    setQuery("");
  };

  return (
    <div className="mb-2">
      <div className="flex gap-2 items-center border border-gray-200 rounded-md p-2 bg-white shadow-md px-4">
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search for a user..."
          className="input w-full bg-transparent border-none blockm-0 rounded-md"
          value={query}
          onChange={(e) => onSearch(e)}
        />
        <MdSearch />
      </div>

      {/* search results */}
      {query.length > 0 && (
        <div className="bg-white mt-1 shadow-md">
          <p className="p-2 px-4 font-bold">Search results</p>
          <ul className="">
            {users.map((u, i) => (
              <button
                onClick={() => OpenConversation(u._id)}
                className="p-2 w-full px-4 hover:bg-gray-100 flex items-center gap-4 cursor-pointer"
              >
                <img
                  className="w-8 h-8 aspect-square rounded-full"
                  src={
                    u.profilePhoto || 
                    "https://res.cloudinary.com/dylqg3itm/image/upload/v1700327154/explore/default-avatar-profile-icon-of-social-media-user-vector_gqejru.jpg"
                  }
                  alt=""
                />
                <p>{u.userName}</p>
              </button>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchMessage;
