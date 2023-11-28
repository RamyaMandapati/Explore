import { useState } from 'react';
import {
  MdOutlineCalendarViewMonth,
  MdOutlineLocationOn,
} from 'react-icons/md';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Trips = ({ isLoading, profile }) => {
  const [viewAll, setviewAll] = useState(false);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const trips = viewAll
    ? profile.tripsCreated
    : profile.tripsCreated.slice(0, 3);

  return (
    <div id='trips' className='bg-white p-8 my-4 rounded-md'>
      <p className='text-xl mb-2 text-left font-bold'>Trips</p>
      <ul className='grid grid-cols-3 gap-4'>
        {trips.map((trip) => (
          <div key={trip._id} className='w-full'>
            <img
              src='https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              alt={trip?.itineraryName}
              className='aspect-video rounded-sm'
            />
            <h2 className='text-left text-lg text-slate-800 font-semibold my-4 mb-2'>
              {trip?.itineraryName}
            </h2>
            <div className='flex items-center gap-1'>
              <MdOutlineLocationOn />

              {trip?.destination}
            </div>
            <div className='flex items-center gap-1'>
              <MdOutlineCalendarViewMonth />
              {new Date(trip?.startDate).toLocaleDateString()} -{' '}
              {new Date(trip?.endDate).toLocaleDateString()}
            </div>

            <Link
              to={`/itinerary/${trip._id}`}
              className='mt-2 hover:bg-gray-200 inline-block bg-gray-100 p-2 px-4 rounded-md text-orange-600'
            >
              View Details
            </Link>
          </div>
        ))}
      </ul>
      <div className='text-right'>
        {profile.tripsCreated.length > 3 && !viewAll && (
          <button
            onClick={() => setviewAll(true)}
            className='uppercase inline-block mt-4 text-blue-400 '
          >
            Show All ({profile.tripsCreated.length}){' '}
          </button>
        )}
      </div>
    </div>
  );
};

export default Trips;