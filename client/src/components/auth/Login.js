import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  onSubmit = e => {
    console.log(e);
  };

  render() {
      const errors = {};

    return (
      <div className="Login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Login</h1>
              <p>
                New to here? <Link to="/register">Register</Link>
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="name"
                  name="name"
                  // value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="password"
                  name="password"
                  type="password"
                  // value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input type="submit" value="Login" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
