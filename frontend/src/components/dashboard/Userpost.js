import React from 'react';
import './Travelfeed.css';
function UserPost() {
    return (
        <div className="user-post">
            <div className="post-header">
                <img src="path_to_user_image" alt="Miranda Shaffer" className="profile-pic" />
                <div className="post-details">
                    <span className="username">Miranda Shaffer</span>
                    <span className="post-date">June 21, 12:45 pm</span>
                    <span className="location">California, California, USA</span>
                    <span className="travel-date">Apr 20, 2023 - Apr 27, 2023</span>
                    <p className="post-description">
                        Wanting to explore the main attractions of LA and New York and see what it's known for.
                        Would also love to do activities (walks, hikes) and find the best cafes.
                    </p>
                </div>
            </div>
            <div className="post-images">
                {/* You can loop through image URLs and generate these dynamically */}
                <img src="path_to_image1" alt="Scenery 1" />
                <img src="path_to_image2" alt="Scenery 2" />
                <img src="path_to_image3" alt="Scenery 3" />
            </div>
            <div className="post-footer">
                {/* ... Add like, comment icons and counts here ... */}
            </div>
        </div>
    );
}

export default UserPost;
