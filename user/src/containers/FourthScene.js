import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';
import ShadowButton from '../components/ShadowButton';
import temple from '../assets/buttons/4/temple.png';
import store from '../assets/buttons/4/store.png';
import bike from '../assets/buttons/4/bike.png';
import { contents } from '../constants';
import '../css/common.css';

export default class extends Component {
  componentDidMount() {
    this.firebaseRef = firebase.database().ref('records_4');
  }
  saveData = (type) => () => {
    this.firebaseRef.push({
			timestamp: new Date().toString(),
			type: type
		})
  }
  renderBtn = (item, index) => (
    <ShadowButton src={item.img} key={index} alt={`沸-${index+1}`}
      imgStyle={{width: '75%'}} onClick={this.saveData(item.type)}/>
  ) 
  render() {
    const resources = [ 
      { img: temple, type: 'temple' },
      { img: store, type: 'store' },
      { img: bike, type: 'bike' }
    ];
    return (
      <div className="col-flex-container">
        <div className="text-container">
          <Typography
            variant='display2'
            paragraph
            color='default'>
            {contents[3].title}
          </Typography>
          <Typography align='left'
            variant='subheading'
            paragraph
            color='textSecondary'
            style={{marginTop: 20}}>
            {contents[3].description}
          </Typography>
        </div>
        <Grid container spacing={0}>
          {resources.map(this.renderBtn)}
        </Grid>
      </div>
    )
  }
}