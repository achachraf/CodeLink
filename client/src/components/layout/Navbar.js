import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "./../../actions/auth";
import PropTypes from "prop-types";
import icon from './icon.png'

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developpers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt mr-1" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developpers</Link>
      </li>
      <li>
        <Link to="register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <div className="logo-group">
        <img class="logo" src={icon} width="40px" height="40px" />
        <h1>
          <Link to="/">
            CodeLink
          </Link>
        </h1>
      </div>
      
      {!loading && (isAuthenticated ? authLinks : guestLinks)}
    </nav>
  );
};

Navbar.prototype = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
