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
      <ul className='grid grid-cols-4 gap-4'>
        {activities.map((ac, i) => (
          <p
            key={i}
            className='bg-gray-200 text-center rounded-md text-orange-600 font-bold p-2 px-4'
          >
            {ac}
          </p>
        ))}
      </ul>

      <div className='text-right'>
        {profile.interestedActivity.length > 3 && !viewAll && (
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