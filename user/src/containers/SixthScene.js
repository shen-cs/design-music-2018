import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { contents } from '../constants';
// import background from '../assets/buttons/six.jpg';
import '../css/sixth.css';
import '../css/common.css';

export default class extends Component {
  
  render() {
    
    return (
      <div className="col-flex-container">
        <div className="text-container">
          <Typography
            variant='display2'
            paragraph
            color='default'>
            {contents[5].title}
          </Typography>
          <Typography align='left'
            variant='subheading'
            paragraph
            color='textSecondary'
            style={{marginTop: 20}}>
            {contents[5].description}
          </Typography>
        </div>
        {/* <img src={background} className="image"/> */}
      </div>
    )
  }
}