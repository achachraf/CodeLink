import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "./../../actions/profile";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";

const ProfileGithub = ({ getGithubRepos, repos, username }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos]);

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">
        <i className="fab fa-github"></i> Github Repos
      </h2>
      {repos.length > 0 ? (
        <Fragment>
          {repos.map(repo => (
            <div className="repo bg-white p-1 my-1">
              <div>
                <h4>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h4>
                <p>
                  {repo.description}
                </p>
              </div>
              <div>
                <ul>
                  <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                  <li className="badge badge-dark">Watchers: {repo.watchers_count}</li>
                  <li className="badge badge-light">Forks: {repo.forks_count}</li>
                </ul>
              </div>
            </div>
          ))}
        </Fragment>
      ) : (
        <h4>No repos for this profil...</h4>
      )}
    </div>
  );
};

ProfileGithub.propTypes = {};

const mapStateToProps = state => ({
  repos: state.profile.repos
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
