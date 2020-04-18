import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import {connect} from 'react-redux'

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToprops = state => ({
    auth: state.auth
})

export default connect(mapStateToprops)(PrivateRoute);
