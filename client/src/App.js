import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './client/css/style.css';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import CreateProfile from './components/profileforms/CreateProfile';
import EditProfile from './components/profileforms/EditProfile';
import Dashboard from './components/dashboard/Dashboard';
import AddExperience from './components/profileforms/AddExperience';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import AddEducation from './components/profileforms/AddEducation';
import Profiles from './components/profiles/Profiles';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return(
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Route exact path='/' component={Landing}/>
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register}/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/profiles' component={Profiles}/>
              <PrivateRoute exact path='/create-profile' component={CreateProfile}/>
              <PrivateRoute exact path='/edit-profile' component={EditProfile}/>
              <PrivateRoute exact path='/add-experience' component={AddExperience}/>
              <PrivateRoute exact path='/add-education' component={AddEducation}/>
              <PrivateRoute exact path='/dashboard' component={Dashboard}/>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
