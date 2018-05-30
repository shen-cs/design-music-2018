import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
import MusicIcon from '@material-ui/icons/MusicVideo';
// import MenuIcon from '@material-ui/icons/Menu';
import firebase from '../firebase';
import Main from './Main';
import { tracks } from '../constants';
import '../css/App.css';
import '../css/common.css';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 5,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 5,
  },
};
class App extends Component {
  state = {
    open: false,
    trackTitle: '源頭',
    activePath: '/'
  }
  
  componentWillMount() {
    const path = this.props.history.location.pathname;
    const { title } = tracks.filter(item => item.path === path)[0];
    this.setState({
      trackTitle: title
    })
    const firebaseRef = firebase.database().ref();
    const idxToPath = ['/', '/second', '/third', 'fourth', 'fifth', 'sixth'];
    let controlRefList = [];
    for(let i = 0; i < 6; i++) {
      const controlRef = firebaseRef.child(`control_${i+1}`);
      controlRefList[i] = controlRef;
      controlRefList[i].on('value', (snap) => {
        if(snap.val()) {
          const active = snap.val().active.status;
          if(active) {
            this.setState({
              activePath: idxToPath[i],
            }, this.navigate(idxToPath[i]))
          }
        }
      })
    }
  }


  onOpenChange = (args) => {
    this.setState({ open: !this.state.open });
  }
  toggleDrawer = (open) => () => {
    this.setState({ open });
  }

  navigate = (path) => () => {
    console.log(path);
    this.props.history.push(path);
  }
  // navigate = (item) => () => {
  //   this.props.history.push(item.path);
  //   this.setState({ 
  //     open: !this.state.open,
  //     trackTitle: item.title
  //   });  
  // }

  render() {
    const sidebar = (
      <List style={{width: 250}}>
        <ListSubheader>演奏曲目</ListSubheader>
        {tracks.map((item, index) => 
            <ListItem key={index}
              button onClick={this.navigate(item)}>
              <ListItemIcon>
                <MusicIcon/>
              </ListItemIcon>
              <ListItemText>
                {item.title}
              </ListItemText>
            </ListItem>
        )}
      </List>
    );
    // const { classes } = this.props;
    return (
      <div className="col-flex-container" style={{height: '100vh'}}>
        {/* <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.onOpenChange}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {this.state.trackTitle}
            </Typography>
          </Toolbar>
        </AppBar> */}
        <SwipeableDrawer
          open={this.state.open}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}>
          {sidebar}
          </div>
        </SwipeableDrawer>
        <Main/>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
