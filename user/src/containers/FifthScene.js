import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';
import ShadowButton from '../components/ShadowButton';
import helpless from '../assets/buttons/5/perish_1.png';
import strong from '../assets/buttons/5/perish_2.png';
import tight from '../assets/buttons/5/perish_3.png';
import { contents } from '../constants';
import '../css/common.css';

export default class extends Component {
  componentDidMount() {
    this.firebaseRef = firebase.database().ref('records_5');
  }
  saveData = (type) => () => {
    this.firebaseRef.push({
			timestamp: new Date().toString(),
			type: type
		})
  }
  renderBtn = (item, index) => (
    <ShadowButton src={item.img} key={index} alt={`滅-${index+1}`}
      imgStyle={{width: '75%'}} onClick={this.saveData(item.type)}/>
  ) 
  render() {
    const resources = [ 
      { img: helpless, type: 'helpless' },
      { img: strong, type: 'strong' },
      { img: tight, type: 'tight' }
    ];
    return (
      <div className="col-flex-container">
        <div className="text-container">
          <Typography
            variant='display2'
            paragraph
            color='default'>
            {contents[4].title}
          </Typography>
          <Typography align='left'
            variant='subheading'
            paragraph
            color='textSecondary'
            style={{marginTop: 20}}>
            {contents[4].description}
          </Typography>
        </div>
        <Grid container spacing={0}>
          {resources.map(this.renderBtn)}
        </Grid>
      </div>
    )
  }
}