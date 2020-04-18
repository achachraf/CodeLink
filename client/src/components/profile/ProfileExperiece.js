import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperiece = ({
  experience: { company, title, location, current, to, from, description }
}) => {
  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <p>
        <Moment format="DD/MM/YYYY">{from}</Moment> -{" "}
        {current ? "Now" : <Moment format="DD/MM/YYYY">{to}</Moment>}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      {description && (
        <p>
          <strong>Description: </strong> {description}
        </p>
      )}
    </div>
  );
};

ProfileExperiece.propTypes = {};

export default ProfileExperiece;
