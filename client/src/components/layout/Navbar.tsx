import  React from 'react'
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import ApplicationState, { AuthState } from '../../state/applicationState';

type NavbarProps = {
  auth: AuthState;
}

export const Navbar = ({ auth, logout }: PropsFromRedux) => {
  const { isAuthenticated, loading } = auth;
  const guestLinks = (
    <ul>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );

  const authLinks = (
    <ul>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/posts">Posts</Link></li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user-alt"/>{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"/>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav> 
  )
}

// Navbar.propTypes = {
//   logout: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired
// }

function mapStateToProps(state: ApplicationState): NavbarProps {
  return {
    auth: state.auth
  }
};

const connector = connect(mapStateToProps, { logout })
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connect(mapStateToProps, { logout })(Navbar);
