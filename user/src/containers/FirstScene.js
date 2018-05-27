import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import firebase from '../firebase';
import '../css/common.css';

export default class extends Component {
  componentDidMount() {
    this.firebaseRef = firebase.database().ref('records');
  }
  saveData = (title) => () => {
    this.firebaseRef.push({
			timestamp: new Date().toString(),
			type: title
		})
  }
  renderBtn = (item, index) => (
    <div key={index} style={{padding: 10}}>
      <RaisedButton 
        label={item.title} 
        onClick={this.saveData(item.title)}
        fullWidth
        buttonStyle={{backgroundColor: item.color}}/>
    </div>
  ) 
  render() {
    const items = [
			{
				color: 'deeppink',
				title: 'lala'
			},
			{
				color: 'cyan',
				title: 'wooow'
			},
			{
				color: 'yellow',
				title: 'woohoo'
			}
		];
    return (
      <div className="col-flex-container stretch">
			  {items.map(this.renderBtn)}
      </div>
    )
  }
}