import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeComment } from "./../../actions/post";
import Moment from "react-moment";


const CommentItem = ({
  postId,
  auth,
  comment: { _id, text, name, avatar, user, date },
  removeComment
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <a href={`profile/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </a>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="DD/MM/YYY">{date}</Moment>
        </p>
        {!auth.loading && auth.user._id === user && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              removeComment(postId, _id);
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,{removeComment})(CommentItem);
