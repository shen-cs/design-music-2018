import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';
import ShadowButton from '../components/ShadowButton';
import cyan from '../assets/buttons/3/cyan.png';
import red from '../assets/buttons/3/red.png';
import yellow from '../assets/buttons/3/yellow.png';
import { contents } from '../constants';
import '../css/common.css';

export default class extends Component {
  componentDidMount() {
    this.firebaseRef = firebase.database().ref('records_3');
  }
  saveData = (type) => () => {
    this.firebaseRef.push({
			timestamp: new Date().toString(),
			type: type
		})
  }
  renderBtn = (item, index) => (
    <ShadowButton src={item.img} key={index} alt={`滯-${index+1}`}
      imgStyle={{width: '75%'}} onClick={this.saveData(item.type)}/>
  ) 
  render() {
    const resources = [ 
      { img: cyan, type: 'grieving' },
      { img: red, type: 'exhilirating' },
      { img: yellow, type: 'peaceful' }
    ];
    return (
      <div className="col-flex-container">
        <div className="text-container">
          <Typography
            variant='display2'
            paragraph
            color='default'>
            {contents[2].title}
          </Typography>
          <Typography align='left'
            variant='subheading'
            paragraph
            color='textSecondary'
            style={{marginTop: 20}}>
            {contents[2].description}
          </Typography>
        </div>
        <Grid container spacing={0}>
          {resources.map(this.renderBtn)}
        </Grid>
      </div>
    )
  }
}