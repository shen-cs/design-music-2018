import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import FirstScene from './FirstScene';
import SecondScene from './SecondScene';
import ThirdScene from './ThirdScene';
import FourthScene from './FourthScene';
import FifthScene from './FifthScene';

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route path='/' exact component={FirstScene}/>
          <Route path='/second' exact component={SecondScene}/>
          <Route path='/third' exact component={ThirdScene}/>
          <Route path='/fourth' exact component={FourthScene}/>
          <Route path='/fifth' exact component={FifthScene}/>
        </Switch>
      </main>
    )
  }
}



export default App;
