import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import FirstScene from './FirstScene';
import SecondScene from './SecondScene';
import ThirdScene from './ThirdScene';
import FourthScene from './FourthScene';
import FifthScene from './FifthScene';
import SixthScene from './SixthScene';

export default class extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={FirstScene}/>
          <Route exact path='/second' component={SecondScene}/>
          <Route exact path='/third' component={ThirdScene}/>
          <Route exact path='/fourth' component={FourthScene}/>
          <Route exact path='/fifth' component={FifthScene}/>
          <Route exact path='/sixth' component={SixthScene}/>
        </Switch>
      </main>
    )
  }
}