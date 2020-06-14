import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const onSubmit = event => {
    event.preventDefault();
    console.log('SUCCESS');
  };
  return (
    <Fragment>
      {/* <div className="alert alert-danger">
        Invalid credentials
      </div> */}
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"/> Sign into Your Account
      </p>
      <form className="form" onSubmit={event => onSubmit(event)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={event => onChange(event)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={ event => onChange(event)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
}

export default Login;