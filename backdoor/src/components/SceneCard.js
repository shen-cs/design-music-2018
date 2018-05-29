import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import blueGrey from '@material-ui/core/colors/blueGrey';
import firebase from  '../firebase';
import Typography from '@material-ui/core/Typography';
import '../css/common.css';

class SceneCard extends Component {
  state = {
    active: false,
    started: false,
    stopped: false,
    exported: false,
    firebaseData: 0,
  }
  componentWillMount() {
    const { sceneNum } = this.props;
    this.controlRef = firebase.database().ref(`control_${sceneNum}`);
    
    this.controlRef.on('value', (snap) => {
      const statusDict = snap.val();
      if(statusDict) {
        let newState = {};
        Object.keys(statusDict).forEach(key => {
          newState[key] = statusDict[key].status;
        })
        this.setState({
          ...newState,
        })
      }
      else {
        this.setState({
          active: false,
          started: false,
          stopped: false,
          exported: false,
        })
      }
    })
    this.recordRef = firebase.database().ref(`records_${sceneNum}`);
    this.recordRef.on('value', (snap) => {
      if(snap.val()) {
        this.setState({
          firebaseData: Object.keys(snap.val()).length,
        })
      }
      else {
        this.setState({
          firebaseData: 0,
        })
      }
    })
    // this.cleanup();
    this.controlRef.child('nextScene').set({
      status: false
    })
  }

  handleStart = () => {
    this.controlRef.child('start').set({
      status: true,
    })
    // then display will turn "started" on
  }
  handleStop = () => {
    this.controlRef.child('stop').set({
      status: true,
    })
  }

  handleExport = () => {
    this.controlRef.child('export').set({
      status: true,
    })
  }
  handleDelete = () => {
    this.recordRef.remove();
  }

  handleNextScene = () => {
    this.controlRef.child('nextScene').set({
      status: true,
    })
    // display side will turn off the active for this scene
  }
  cleanup = () => {
    const cleanupList = ['start', 'stop', 'export'];
    cleanupList.forEach(item => {
      this.controlRef.child(item).set({
        status: false,
      })
    })
  }
  render() {
    const { sceneNum } = this.props;
    const { active, started, stopped, exported, firebaseData } = this.state;
    const subheader = `${active ? 'active': 'inactive'}${started ? ', started' : ''}${stopped ? ', stopped' : ''}`
    return (
      <Card>
        <CardHeader 
          avatar={<Avatar style={{backgroundColor: active ? red[500]: blueGrey[100]}}/>}
          title={`Scene ${sceneNum}`}
          subheader={subheader}/>
        <CardContent>
          <div className="row-flex-container">
            <Typography variant='subheading' color='inherit' style={{flex: 1}}>
              Firebase status: {firebaseData}
            </Typography>
            <Button size="small" color="secondary" onClick={this.handleDelete}>
              delete
            </Button>
          </div>
          <div className="row-flex-container">
            <Typography variant='subheading' color='inherit' style={{flex: 1}}>
              Export status: {exported ? 'exported' : 'pending'}
            </Typography>
            <Button size="small" color="primary" onClick={this.handleExport} disabled={!active}>
              Export
            </Button>
          </div>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={this.handleStart} disabled={!active}>
            Start
          </Button>
          <Button size="small" color="primary" onClick={this.handleStop} disabled={!active}>
            Stop
          </Button>
          <Button size="small" color="primary" onClick={this.handleNextScene} disabled={!active}>
            Next Scene
          </Button>
        </CardActions>
      </Card>
    )
  }
}

export default SceneCard;