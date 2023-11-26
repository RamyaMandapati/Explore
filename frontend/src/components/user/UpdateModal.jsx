import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { loadUser } from "../../actions/auth";
import { useDispatch } from "react-redux";

const UpdateModal = ({
  isModalOpen,
  setIsModalOpen,
  profileData,
  setProfile,
}) => {
  const modalRef = useRef();
  const dispatch = useDispatch();
  const {
    userName,
    bio,
    about,
    city,
    state,
    country,
    profilePhoto,
    coverPhoto,
  } = profileData;
  const [values, setValues] = useState({
    userName,
    bio,
    about,
    city,
    state,
    country,
    profilePhoto: profilePhoto ? profilePhoto : null,
    coverPhoto: coverPhoto ? coverPhoto : null,
  });

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePicChange = (e) => {
    setValues({
      ...values,
      profilePhoto: e.target.files[0],
    });
  };

  const handleCoverPicChange = (e) => {
    setValues({
      ...values,
      coverPhoto: e.target.files[0],
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", values.profilePhoto);
      formData.append("upload_preset", "thrryyss");

      const response1 = await axios.post(
        "https://api.cloudinary.com/v1_1/dylqg3itm/image/upload",
        formData
      );

      formData.append("file", values.coverPhoto);
      formData.append("upload_preset", "thrryyss");

      const response2 = await axios.post(
        "https://api.cloudinary.com/v1_1/dylqg3itm/image/upload",
        formData
      );

      const res = await axios.put(
        `http://localhost:4000/api/profile/${profileData._id}`,
        {
          ...values,
          profilePhoto: response1.data.secure_url,
          coverPhoto: response2.data.secure_url,
        }
      );

      console.log(res);

      if (res.status === 200) {
        setIsModalOpen(false);
        setProfile(res.data);
        dispatch(loadUser());
      }
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    const checkIfClickOuside = (e) => {
      //   console.log(modalRef.current.contains(e.target));
      // console.log(e.target.id);
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        e.target.id !== "edit-btn"
      ) {
        // console.log('This ran...');
        setIsModalOpen(false);
      }
    };

    document.addEventListener("click", checkIfClickOuside);

    return () => {
      document.removeEventListener("click", checkIfClickOuside);
    };
  }, [isModalOpen, setIsModalOpen]);

  return (
    <div className="bg-black/75 w-full z-50 fixed h-screen top-0 left-0 flex justify-center items-center">
      <div
        ref={modalRef}
        className="max-w-[600px] max-h-[650px] overflow-y-scroll w-full rounded-lg bg-white shadow-lg p-8"
      >
        <p className="text-lg font-semibold text-left">
          Update profile information
        </p>

        {/* form */}
        <form onSubmit={updateProfile}>
          <div className="my-4">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              name="userName"
              id="userName "
              placeholder="Enter username"
              value={values.userName}
              onChange={handleInputChange}
              className="border modal-input border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="my-4">
            <label htmlFor="bio">Bio</label>
            <input
              type="text"
              name="bio"
              id="bio "
              placeholder="Enter bio"
              value={values.bio}
              onChange={handleInputChange}
              className="border modal-input border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="my-4">
            <label htmlFor="about">About</label>
            <textarea
              name="about"
              id="about"
              placeholder="Write something about yourself"
              value={values.about}
              onChange={handleInputChange}
              className="border modal-input  border-gray-300 p-2 rounded-md"
            ></textarea>
          </div>
          <div className="my-4">
            <label htmlFor="city">City</label>
            <input
              type="text"
              name="city"
              id="city "
              placeholder="Enter city"
              value={values.city}
              onChange={handleInputChange}
              className="border modal-input border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="my-4">
            <label htmlFor="state">State</label>
            <input
              type="text"
              name="state"
              id="state"
              placeholder="Enter state"
              value={values.state}
              onChange={handleInputChange}
              className="border modal-input border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="my-4">
            <label htmlFor="country">country</label>
            <input
              type="text"
              name="country"
              id="country"
              placeholder="Enter country"
              value={values.country}
              onChange={handleInputChange}
              className="border modal-input border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="my-4">
            <label htmlFor="profilePhoto">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              id="profilePhoto"
              placeholder="Upload Profile Photo"
              onChange={handleProfilePicChange}
              className="border modal-input border-gray-300 p-2 rounded-md"
            />
          </div>

          <div className="my-4">
            <label htmlFor="coverPhoto">Cover Photo</label>
            <input
              type="file"
              name="coverPhoto"
              id="coverPhoto"
              placeholder="Upload Cover Photo"
              onChange={handleCoverPicChange}
              className="border modal-input border-gray-300 p-2 rounded-md"
            />
          </div>

          <div className="my-4 flex gap-4 items-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-orange-600 border border-orange-600 bg-white p-2 px-12 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 border border-orange-600 text-white p-2 px-12 rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
