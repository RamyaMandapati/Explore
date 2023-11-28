import React, { useEffect, useState } from 'react';
import './reviews.css';
import { useSelector } from 'react-redux';
import { FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
import UpdateModal from './UpdateModal';
import Search from './Search';
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Trips from './Trips';
import Activities from './Activities';
import Posts from './Posts';
import Reviews from './Reviews';

const getAverageRatings = (reviews) => {
  return (
    reviews.reduce((sum, review) => sum + review.userRating, 0) / reviews.length
  );
};

const Dashboard = ({ posts, trips, profile }) => {
  return (
    <div className='bg-white shadow-md p-3 rounded-md'>
      <h2 className='text-2xl mb-4'>Your Dashboard</h2>

      <div className='my-4'>
        <p className='text-5xl text-orange-600 font-bold'>{profile.views}</p>
        <p>views today</p>
      </div>
      <div className='my-4'>
        <p className='text-5xl text-orange-600 font-bold'>{posts.length}</p>
        <p>posts created</p>
      </div>
      <div className='my-4'>
        <p className='text-5xl text-orange-600 font-bold'>{trips.length}</p>
        <p>trips created</p>
      </div>
    </div>
  );
};

export const Profile = () => {
  const { id } = useParams();
  const { loading, user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyProfile, setIsMyProfile] = useState(false);

  const followUser = async () => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/profile/follow/${user._id}`,
        { userToFollowId: profile._id }
      );

      // console.log(res);
      if (res.status === 200) setProfile(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  const unFollowUser = async () => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/profile/unfollow/${user._id}`,
        { userToUnfollowId: profile._id }
      );

      // console.log(res);
      if (res.status === 200) setProfile(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    const fetchProfile = async (id) => {
      try {
        const res = await axios.get(`http://localhost:4000/api/profile/${id}`);
        console.log(res);

        if (res.status === 200) {
          // check if own profile
          if (res.data._id === user._id) setIsMyProfile(true);

          setProfile(res.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user && id) {
      fetchProfile(id);
    } else if (!loading && user) {
      fetchProfile(user._id);
    }
  }, [id, loading, user]);

  useEffect(() => {
    // console.log('rannnn');
    if (profile && user && id) {
      // console.log(profile._id, user._id);
      if (profile._id === user._id) {
        setIsMyProfile(true);
      } else {
        setIsMyProfile(false);
      }
    }
  }, [id, profile, user]);

  return (
    <div className='bg-gray-100 h-auto'>
      <div className='container w-[90%] max-w-[1400px] mx-auto profile'>
        {isLoading ? (
          <div className='flex justify-center items-center w-full'>
            <div className='w-10 h-10 border-4 animate-spin border-gray-300 border-t-orange-600 rounded-full'></div>
          </div>
        ) : (
          <div className='w-full flex justify-between gap-8'>
            <div className='basis-8/12 grow '>
              {/* header   */}
              <div className='bg-white rounded-md overflow-hidden'>
                <div className=''>
                  <img
                    src={
                      profile.coverPhoto ||
                      'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                    }
                    className='w-full max-h-[200px] object-cover aspect-video'
                    alt=''
                  />
                </div>
                <div className='flex gap-8 px-8 py-4'>
                  <div className='basis-3/12'>
                    <img
                      src={
                        profile.profilePhoto
                          ? profile.profilePhoto
                          : 'https://xsgames.co/randomusers/assets/avatars/male/63.jpg'
                      }
                      alt=''
                      className='relative -top-[50%] aspect-square object-cover rounded-full border-[10px] border-white block'
                    />
                  </div>
                  <div id='user-desc' className='grow w-full'>
                    <div className='flex items-center justify-between gap-4'>
                      <div>
                        <h2 className='text-2xl'>
                          {loading ? null : profile?.userName}
                        </h2>
                        <p className='text-sm'>
                          {profile.city && profile.city + ','}{' '}
                          {profile.state && profile.state + ','}{' '}
                          {profile.country}
                        </p>
                      </div>
                      {isMyProfile ? (
                        <button
                          title='Edit'
                          id='edit-btn'
                          className='p-3 rounded-md hover:bg-gray-200'
                          onClick={(e) => {
                            console.log('clicked');
                            setIsModalOpen(true);
                          }}
                        >
                          <FaPencilAlt className='pointer-events-none' />
                        </button>
                      ) : null}
                    </div>

                    {/* modal */}
                    {isModalOpen ? (
                      <UpdateModal
                        profileData={profile}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        setProfile={setProfile}
                      />
                    ) : null}

                    {/* short bio */}
                    <p className='my-2'>{profile?.bio}</p>

                    {/* ratings */}
                    <div>
                      {profile.userReviews.length === 0 ? (
                        <p className='pb-2 text-gray-500'>0 Reviews</p>
                      ) : (
                        <ul className='flex my-2 gap-4 items-center'>
                          <div className='flex items-center text-lg'>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i + 1 <=
                                  getAverageRatings(profile.userReviews)
                                    ? 'star selected'
                                    : 'star'
                                }
                              >
                                &#9733;
                              </span>
                            ))}
                          </div>

                          <p className='font-bold'>
                            {getAverageRatings(profile.userReviews).toFixed(1)}{' '}
                            Ratings{' '}
                            <span className='text-orange-600'>
                              ({profile?.userReviews.length} reviews)
                            </span>
                          </p>
                        </ul>
                      )}
                    </div>

                    {/* followings/followers */}
                    <div className='flex items-center gap-4 uppercase'>
                      <div>
                        <span className='font-bold'>
                          {loading ? 0 : profile?.followers.length}
                        </span>{' '}
                        Followers
                      </div>
                      <div>
                        {' '}
                        <span className='font-bold'>
                          {loading ? 0 : profile?.following.length}
                        </span>{' '}
                        Following
                      </div>
                    </div>

                    {/* follow/unfollow */}
                    {isMyProfile ? null : (
                      <>
                        {profile.followers.includes(user._id) ? (
                          <button
                            onClick={unFollowUser}
                            className='bg-white text-orange-500 border border-orange-500  rounded-md p-1 px-4 mt-4'
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            onClick={followUser}
                            className='bg-orange-500 border border-orange-500 text-white rounded-md p-1 px-4 mt-4'
                          >
                            Follow
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* tabs */}
              <div className='flex my-8 divide-x divide-gray-200 rounded-tl-md rounded-tr-md overflow-hidden bg-white text-base uppercase'>
                <Link
                  to='/profile'
                  className='block basis-1/3  bg-orange-600 text-white py-3 text-center '
                >
                  Profile
                </Link>
                <a
                  href='#activity'
                  className='block basis-1/3  py-3 text-center '
                >
                  Activity & Interests
                </a>
                <a href='#trips' className='block basis-1/3  py-3 text-center '>
                  Trips
                </a>
              </div>

              {/* about */}
              <div className='bg-white p-8 my-4 rounded-md'>
                <p className='text-xl mb-2 text-left font-bold'>About</p>
                <p>{profile?.about}</p>
              </div>

              {/* posts */}
              <Posts isLoading={isLoading} profile={profile} />

              {/* activities */}
              <Activities isLoading={isLoading} profile={profile} />

              {/* trips */}
              <Trips isLoading={isLoading} profile={profile} />
            </div>
            <div className='basis-3/12'>
              <Search />
              <Dashboard
                profile={profile}
                posts={profile?.postsCreated}
                trips={profile.tripsCreated}
              />
              <Reviews
                currentUser={user}
                profile={profile}
                setProfile={setProfile}
                isMyProfile={isMyProfile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};