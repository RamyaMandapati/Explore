const user = require("../models/user");

// update Preference
const updateUserPreference = async (req, res) => {
  try {
    const { interestedActivity, userId, country, city, state } = req.body;
    console.log(userId);
    const updatedUserPreference = await user.findOneAndUpdate(
      { _id: userId },
      {
        interestedActivity: interestedActivity,
        country: country,
        city: city,
        state: state,
      },
      { new: true }
    );
    console.log(updatedUserPreference);
    // Check if the user was found and updated
    if (updatedUserPreference) {
      res.status(200).json({ success: true, data: updatedUserPreference });
    } else {
      res.status(404).json({ success: false, message: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

module.exports = {
  updateUserPreference,
};
