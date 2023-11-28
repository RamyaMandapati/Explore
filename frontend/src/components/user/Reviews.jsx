import axios from "axios";
import { useEffect, useState } from "react";

const Reviews = ({
  profile,
  isMyProfile,
  setProfile,
  currentUser,
  history,
}) => {
  const [review, setReview] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);

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

      // console.log(res);

      if (res.status === 200) {
        setReview("");
        setRating(0);
        setProfile(res.data);

        setIsLoading(true);

        setIsReviewed(true);

        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log(
    //   profile?.userReviews?.some((r) => r.user._id === currentUser._id)
    // );
    if (profile && currentUser) {
      setAllReviews(profile.userReviews.slice(0, 3));
      setIsReviewed(
        profile?.userReviews?.some((r) => r.user._id === currentUser._id)
      );
      setIsLoading(false);
    }
  }, [currentUser, profile]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const showAllReviews = () => setAllReviews(profile.userReviews);

  return (
    <div className="reviews my-8 bg-white shadow-md p-3 rounded-md">
      <div className="reviews-top">
        <h3>RATE {profile.userName}</h3>
        <a href="/#">VIEW ALL</a>
      </div>
      {isLoading ? null : (
        <div>
          {allReviews.map((review, i) => (
            <div className="review " key={i}>
              <img
                className="review-user-img rounded-full"
                src={
                  review.user.profilePhoto ||
                  "https://xsgames.co/randomusers/assets/avatars/male/63.jpg"
                }
                alt=""
              />
              <div
                className="review-content"
                onClick={() => history.push(`/profile/${review.user._id}`)}
              >
                <h4 className="text-left reviewer-name">
                  {review.user.userName}
                </h4>

                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i + 1 <= review.userRating ? "star selected" : "star"
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

          {/* add review form */}
          {isMyProfile ? null : isReviewed ? null : (
            <form onSubmit={addReview}>
              <h4 className="text-base text-left mb-2">Your review</h4>
              <textarea
                name="review"
                id="review"
                placeholder="Your feedback here.."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="border block w-full rounded-md p-2"
              ></textarea>
              <h4 className="text-base text-left mt-2">Ratings</h4>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? "star selected" : "star"}
                    onClick={() => handleStarClick(star)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white rounded-md mt-4 p-2 px-4"
              >
                Add review
              </button>
            </form>
          )}

          {profile.userReviews.length > 3 && (
            <button onClick={showAllReviews} className="text-orange-500">
              Show all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;
