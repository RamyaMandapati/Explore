import { useState } from 'react';

const Posts = ({ isLoading, profile }) => {
  const [viewAll, setviewAll] = useState(false);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const posts = viewAll
    ? profile.postsCreated
    : profile.postsCreated.slice(0, 3);

  return (
    <div className='bg-white p-8 my-4 rounded-md'>
      <p className='text-xl mb-2 text-left font-bold'>Posts</p>
      <div className='grid grid-cols-3 gap-4'>
        {posts?.map((post) => (
          <div key={post._id}>
            <img
              src={post?.imageUrls[0]}
              alt=''
              className='aspect-video w-full h-auto rounded-sm'
            />
          </div>
        ))}
      </div>

      <div className='text-right'>
        {profile.postsCreated.length > 3 && !viewAll && (
          <button
            onClick={() => setviewAll(true)}
            className='uppercase inline-block mt-4 text-blue-400 '
          >
            Show All ({posts.length})
          </button>
        )}
      </div>
    </div>
  );
};
export default Posts;