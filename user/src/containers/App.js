import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Drawer } from 'antd-mobile';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import AppBar from 'material-ui/AppBar';
import MusicIcon from 'material-ui/svg-icons/av/music-video';
import Main from './Main';
import { tracks } from '../constants';
import '../css/App.css';
import '../css/common.css';

class App extends Component {
  state = {
    open: false,
    trackTitle: '源頭',
  }
  
  componentWillMount() {
    const path = this.props.history.location.pathname;
    const { title } = tracks.filter(item => item.path === path)[0];
    this.setState({
      trackTitle: title
    })
  }


  onOpenChange = (args) => {
    this.setState({ open: !this.state.open });
  }
  
  navigate = (item) => () => {
    this.props.history.push(item.path);
    this.setState({ 
      open: !this.state.open,
      trackTitle: item.title
    });  
  }

  render() {
    const sidebar = (<List style={{width: '70vw'}}>
      <Subheader>演奏曲目</Subheader>
      {tracks.map((item, index) => {
        return (<ListItem key={index} onClick={this.navigate(item)}
          primaryText={<span style={{marginLeft: -20}}>{item.title}</span>} leftIcon={<MusicIcon/>}
        />);
      })}
    </List>);

    return (
      <div className="col-flex-container" style={{height: '100vh'}}>
        <AppBar onLeftIconButtonClick={this.onOpenChange} title={this.state.trackTitle} titleStyle={{fontSize: 20,}}/>
        <Drawer
          className="my-drawer"
          style={{flex: 1}}
          enableDragHandle
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={this.onOpenChange}>
            <Main/>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(App);
