import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

export const Alert = ({alerts}: any) => {
  if (alerts != null && alerts.length > 0 ) {
    return alerts.map((alert: any) => 
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    );
  } else {
    return <div></div>
  }
  
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
}

function mapStateToProps (state: any) {
  console.log('alert');
  console.log(state);
  return { alerts: state.alert }
}

export default connect(mapStateToProps)(Alert);