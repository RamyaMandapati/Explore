import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { loadUser } from '../../actions/auth';
import {  useDispatch } from "react-redux";

const Reviews = ({ profile, isMyProfile, setProfile, currentUser }) => {
  const [review, setReview] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [viewAll, setViewAll] = useState(false);

  const dispatch = useDispatch();


  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const addReview = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:4000/api/profile/review/${profile._id}`,
        {
          user: currentUser._id,
          review,
          userRating: rating,
        }
      );

      console.log(res);

      if (res.status === 200) {
        setReview('');
        setRating(0);
         dispatch(loadUser);

        setIsLoading(true);

        setIsReviewed(true);

        setIsLoading(false);

        setViewAll(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsReviewed(
      profile?.userReviews?.some((r) => r.user._id === currentUser._id)
    );
    setIsLoading(false);
  }, [currentUser._id, profile?.userReviews]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const allReviews = viewAll
    ? profile?.userReviews
    : profile?.userReviews.slice(0, 2);

  return (
    <div className='reviews my-8 bg-white shadow-md p-3 rounded-md'>
      <div className='reviews-top'>
        <h3>RATE {profile.userName}</h3>
      </div>
      {isLoading ? null : (
        <div>
          {allReviews.map((review, i) => (
            <div className='review ' key={i}>
              <Link
                to={`/profile/${review.user._id}`}
                className=''
              >
                <img
                  className='w-[60px] rounded-full aspect-square'
                  src={
                    review.user.profilePhoto || './user_profile_picture.avif'
                  }
                  alt=''
                />
              </Link>

              <div className='review-content basis-4/6'>
                <Link
                  to={`/profile/${review.user._id}`}
                  className='text-left reviewer-name'
                >
                  {review.user.userName}
                </Link>

                <div className='flex items-center'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i + 1 <= review.userRating ? 'star selected' : 'star'
                      }
                    >
                      &#9733;
                    </span>
                  ))}
                </div>

                <p>{review.review}</p>
              </div>
            </div>
          ))}

          {profile.userReviews.length > 2 && (
            <button
              onClick={() => setViewAll((prev) => !prev)}
              className='bg-white mb-4 p-1 px-2 rounded-md text-orange-500 border border-orange-500 text-sm'
            >
              {viewAll ? 'Show less' : 'Show all'}
            </button>
          )}

          {/* add review form */}
          {isMyProfile ? null : isReviewed ? null : (
            <form onSubmit={addReview}>
              <h4 className='text-base text-left mb-2'>Your review</h4>
              <textarea
                name='review'
                id='review'
                placeholder='Your feedback here..'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className='border block w-full rounded-md p-2'
              ></textarea>
              <h4 className='text-base text-left mt-2'>Ratings</h4>
              <div className='star-rating'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? 'star selected' : 'star'}
                    onClick={() => handleStarClick(star)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>

              <button
                type='submit'
                className='bg-orange-500 text-white rounded-md mt-4 p-2 px-4'
              >
                Add review
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;