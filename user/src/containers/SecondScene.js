import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';
import ShadowButton from '../components/ShadowButton';
import sun from '../assets/buttons/2/sun.png';
import cloud from '../assets/buttons/2/cloud.png';
import peace from '../assets/buttons/2/peace.png';
import { contents } from '../constants';
import '../css/common.css';

export default class extends Component {
  componentDidMount() {
    this.firebaseRef = firebase.database().ref('records_2');
  }
  saveData = (type) => () => {
    this.firebaseRef.push({
			timestamp: new Date().toString(),
			type: type
		})
  }
  renderBtn = (item, index) => (
    <ShadowButton src={item.img} key={index} alt={`濱-${index+1}`}
      imgStyle={{width: '75%'}} onClick={this.saveData(item.type)}/>
  ) 
  render() {
    const resources = [ 
      { img: sun, type: 'exhilirating' },
      { img: cloud, type: 'grieving' },
      { img: peace, type: 'peaceful' }
    ];
    return (
      <div className="col-flex-container">
        <div className="text-container">
          <Typography
            variant='display2'
            paragraph
            color='default'>
            {contents[1].title}
          </Typography>
          <Typography align='left'
            variant='subheading'
            paragraph
            color='textSecondary'
            style={{marginTop: 20}}>
            {contents[1].description}
          </Typography>
        </div>
        <Grid container spacing={0}>
          {resources.map(this.renderBtn)}
        </Grid>
      </div>
    )
  }
}