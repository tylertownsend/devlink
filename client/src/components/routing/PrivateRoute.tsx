import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, ConnectedProps } from 'react-redux';

type RootState = {
  auth: {
    isAuthenticated: boolean;
    loading: boolean;
  }
} 

function mapStateToProps(state: RootState) {
  return {
    auth: state.auth
  };
};

const connector = connect(
  mapStateToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

interface Props extends PropsFromRedux {
  component: any;
  exact: boolean;
  path: string;
}

const PrivateRoute = (content: Props) => {
  const { component: Component,
    auth: { isAuthenticated, loading },
    ...rest 
  } = content;
  console.log(Component);
  return(
    <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to='/login'/>) :( <Component />)}/>
  );
};

// PrivateRoute.propTypes = {
//   auth: PropTypes.object.isRequired
// }



export default connector(PrivateRoute);