import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Search = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const onSearch = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {

    const searchUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/profile?userName=${query}`
        );

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

  return (
    <div className='mb-4 '>
      <div className='flex gap-2 items-center border border-gray-200 rounded-md p-2 bg-white shadow-md px-4'>
        <input
          type='search'
          name='search'
          id='search'
          placeholder='Search for a user...'
          className='input w-full bg-transparent border-none blockm-0 rounded-md'
          value={query}
          onChange={(e) => onSearch(e)}
        />
        <MdSearch />
      </div>

      {/* search results */}
      {query.length > 0 && (
        <div className='bg-white mt-1 shadow-md'>
          <p className='p-2 px-4 font-bold'>Search results</p>
          <ul className=''>
            {users.map((u, i) => (
              <button
                onClick={() => {
                  history.push(`/profile/${u._id}`);
                  setQuery('');
                }}
                className='p-2 w-full px-4 hover:bg-gray-100 flex items-center gap-4 cursor-pointer'
              >
                <img
                  className='w-8 h-8 aspect-square rounded-full'
                  src={
                    u.profilePhoto || './user_profile_picture.avif'
                  }
                  alt=''
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

export default Search;
