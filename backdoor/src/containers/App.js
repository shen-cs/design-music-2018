import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SceneCard from '../components/SceneCard';
import firebase from  '../firebase';
import '../css/App.css';

class App extends Component {

  arr = [1, 2, 3, 4, 5];
  renderCard = (num) => {
    return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={num}>
      <SceneCard sceneNum={num}/>
    </Grid>
    )
  }

  handleResetAll = () => {
    this.arr.forEach((sceneNum) => {
      const controlRef = firebase.database().ref(`control_${sceneNum}`);
      controlRef.remove();
    })
  }

  render() {
    return (
      <div>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Design Music Backdoor
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="App">
        <Grid container spacing={32}>
          {this.arr.map(this.renderCard)}
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}
            className="center-flex-container">
            <Button size="large" color="primary" variant='raised' onClick={this.handleResetAll}>
              Reset all
            </Button>
          </Grid>
        </Grid>
        </div>
      </div>
    );
  }
}

export default App;
