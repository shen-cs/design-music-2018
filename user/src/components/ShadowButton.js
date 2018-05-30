import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import '../css/common.css';

export default class extends Component {

  state = {
    clicked: false,
    // num: 0
  }
  handleTouchStart = (e) => {
    // e.preventDefault();
    
    this.setState({
      clicked: true,
    })
  }

  handleTouchLeave = (e) => {
    // e.preventDefault();

    this.setState({
      clicked: false,
    })
  }
  render() {
    const { src, alt, imgStyle } = this.props;
    const { clicked } = this.state;
    return (
      <Grid item xs={4} sm={4} md={4}>
        <div className="btn-container">
          <img src={src} alt={alt}
            style={imgStyle}
            className={`trans ${clicked ? '': 'shadow'}`}
            onMouseDown={this.handleTouchStart}
            onMouseUp={this.handleTouchLeave}
            onTouchStart={this.handleTouchStart}
            onTouchEnd={this.handleTouchLeave}
            onClick={this.props.onClick}/>
        </div>
      </Grid>
    )
  }
}