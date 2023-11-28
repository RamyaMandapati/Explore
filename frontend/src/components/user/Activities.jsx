import { useState } from 'react';

const Activities = ({ isLoading, profile }) => {
  const [viewAll, setviewAll] = useState(false);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const activities = viewAll
    ? profile.interestedActivity
    : profile.interestedActivity.slice(0, 3);

  return (
    <div id='activity' className='bg-white p-8 my-4 rounded-md'>
      <p className='text-xl mb-2 text-left font-bold'>My Interests</p>
      <ul className='flex gap-4 text-center'>
        {activities.map((ac, i) => (
          <p
            key={i}
            className='bg-gray-200 w-1/4 rounded-md text-orange-600 font-bold p-2 px-4'
          >
            {ac}
          </p>
        ))}
      </ul>

      <div className='text-right'>
        {!viewAll && (
          <button
            onClick={() => setviewAll(true)}
            className='uppercase inline-block mt-4 text-blue-400 '
          >
            Show All ({profile.interestedActivity.length})
          </button>
        )}
      </div>
    </div>
  );
};
export default Activities;
