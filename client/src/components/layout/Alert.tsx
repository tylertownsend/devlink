import React, { ReactElement } from 'react'
import PropTypes from 'prop-types';
import { connect, ConnectedProps } from 'react-redux'

import ApplicationState, { AlertState } from '../../state/applicationState';

type AlertProps = { alerts: Array<AlertState> };

// See how to return the propert type here
export const Alert = ( { alerts }: PropsFromRedux ) => {
    const alertElements = alerts != null && alerts.length > 0 ? alerts.map((alert: AlertState) => 
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    ) : <div></div>;
    return <React.Fragment>
      { alertElements }
    </React.Fragment>
}

// Alert.propTypes = {
//   alerts: PropTypes.array.isRequired
// }

function mapStateToProps (state: ApplicationState): AlertProps {
  return { alerts: state.alert };
}

// TODOO export connect<AlertProps, DefaultStateProps>
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Alert);