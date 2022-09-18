import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import PropTypes from 'prop-types';
import ApplicationState from '../../state/applicationState';

type LandingProps = {
  isAuthenticated: boolean;
}

export const Landing = ({ isAuthenticated }: PropsFromRedux) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard"></Redirect>;
  }
  return <React.Fragment>
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
  </React.Fragment>
  ;
}

const mapStateToProps = (state: ApplicationState): LandingProps => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(Landing);