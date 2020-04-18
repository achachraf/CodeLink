import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileEducation = ({
  education: { school,degree, fieldofstudy, current, to, from, description }
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="DD/MM/YYYY">{from}</Moment> -{" "}
        {current ? "Now" : <Moment format="DD/MM/YYYY">{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      {fieldofstudy && (
        <p>
          <strong>Field Of Study: </strong> {fieldofstudy}
        </p>
      )}
      {description && (
        <p>
          <strong>Description: </strong> {description}
        </p>
      )}
      
    </div>
  );
};

ProfileEducation.propTypes = {};

export default ProfileEducation;
