import React, { Component } from 'react';
import Room from './views/Room';
import Login from './views/Login';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return loggedIn ? <Comp {...props} /> : <Redirect to="/" />;
      }}
    />
  );
};

class App extends Component {

  checkLoggedIn = () => {
    let token = sessionStorage.getItem("token");

    if (token !== null) {
      // do something to validate token here  
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={props => <Login {...props} />}
            />
            <ProtectedRoute
              exact
              path="/room"
              loggedIn={() => {
                return this.checkLoggedIn()
              }}
              component={(props) => <Room {...props}/>}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
