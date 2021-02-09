import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import DashboardActions from './DashboardActions';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Dashboard = ({
  getCurrentProfile,
  auth,
  profile
}) => {
  const { profile: userProfile, loading } = profile;
  const { user } = auth;
  useEffect(()=> {
    getCurrentProfile();
  }, []);
  return loading && userProfile === null ? <Spinner /> : <Fragment>
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
      <i className="fas fa-user" />
      Welcome {user && user.name}
    </p>
    {userProfile !== null ? (
      <Fragment>
        <DashboardActions />
      </Fragment>
    ) : (
      <Fragment>
        <p>You have not yet set up a profile, please add some info</p>
        <Link to="/create-profile" className="btn btn-primary my-1">
          Create Profile
        </Link>
      </Fragment>
    )}
  </Fragment>;
};


Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}; 

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);