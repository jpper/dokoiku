import React from "react";

type ProfileProps = {
  name: string;
  URL: string;
};

export const Profile: React.FC<ProfileProps> = props => {
  return (
    <div className="Profile">
      <img
        src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
        alt="fb-propic"
      />
      {/* make image src image info */}
      <p>Name: </p> {/* populate with name info */}
      <p>Facebook: </p> {/* populate with FB link */}
    </div>
  );
};
