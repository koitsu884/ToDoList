import React, { Component } from "react";
import { BrowserRouter, Route} from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ToDoList from "./ToDoList";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/list" component={ToDoList} />
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
