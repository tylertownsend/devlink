import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = (content: any) => {
  const { component: Component,
    auth: { isAuthenticated, loading },
    ...rest 
  } = content;
  return(
    <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to='/login'/>) :( <Component />)}/>
  );
};

// PrivateRoute.propTypes = {
//   auth: PropTypes.object.isRequired
// }

const mapStateToProps = (state: any) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);