import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';
import ShadowButton from '../components/ShadowButton';
import surgeOne from '../assets/buttons/1/surge_1.png';
import surgeTwo from '../assets/buttons/1/surge_2.png';
import surgeThree from '../assets/buttons/1/surge_3.png';
import { contents } from '../constants';
import '../css/common.css';


class FirstScene extends Component {

  componentDidMount() {
    this.firebaseRef = firebase.database().ref('records_1');
  }
  saveData = (type) => () => {
    this.firebaseRef.push({
			timestamp: new Date().toString(),
			type: type
		})
  }
  renderBtn = (item, index) => (
    <ShadowButton src={item.img} key={index} alt={`湧-${index+1}`}
      imgStyle={{width: '75%'}} onClick={this.saveData(item.type)}/>
  ) 
  render() {
    const resources = [ 
      { img: surgeOne, type: 'bird' },
      { img: surgeTwo, type: 'leaf' },
      { img: surgeThree, type: 'frog' }
    ];
    return (
      <div className="col-flex-container">
        <div className="text-container">
          <Typography
            variant='display2'
            paragraph
            color='default'>
            {contents[0].title}
          </Typography>
          <Typography align='left'
            variant='subheading'
            paragraph
            color='textSecondary'
            style={{marginTop: 20}}>
            {contents[0].description}
          </Typography>
        </div>
        <Grid container spacing={0}>
          {resources.map(this.renderBtn)}
          
        </Grid>
      </div>
    )
  }
}

export default FirstScene;