import React ,{ Fragment, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import ApplicationState from '../../state/applicationState';

type RegisterProps = {
  isAuthenticated: boolean | null;
}

export const Register = ({ setAlert, register, isAuthenticated}: PropsFromRedux) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e: any) => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const onSubmit = (event: any) => {
    event.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"/>Create Your Account
      </p>
      <form className="form" onSubmit={event => onSubmit(event)}>
        <div className="form-group">
          <input 
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={ event => onChange(event)}
            required
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email"
            value={email}
            onChange={ event => onChange(event)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength={6}
            value={password}
            onChange={ event => onChange(event)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength={6}
            value={password2}
            onChange={ event => onChange(event)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
}

function mapStateToProps(state: ApplicationState): RegisterProps {
  return { isAuthenticated: state.auth.isAuthenticated };
};

const connector = connect(mapStateToProps, { setAlert, register });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Register);