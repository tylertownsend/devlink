import React, { Fragment } from 'react';
import spinner from '../../client/img/spinner.gif'

export default () => {
  return <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
    />
  </Fragment>
}