import React, { Component } from "react";
import TextFieldGroup from "../common/TextFieldGroup";
import { connect} from 'react-redux';
import { withRouter } from "react-router-dom";
import _ from 'lodash';

import {registerUser} from "../../actions/authActions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      userName: this.state.userName,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors} = this.state;
    const hasError = !_.isEmpty(errors);
    console.log(hasError);

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your account</p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="userName"
                  name="userName"
                  value={this.state.name}
                  onChange={this.onChange}
                  // error={errors.userName}
                />
                <TextFieldGroup
                  placeholder="password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  // error={errors.password}
                />
                <TextFieldGroup
                  placeholder="password2"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  // error={errors.password2}
                />
                { hasError && <div className="alert alert-danger" role="alert">{errors.toString()}</div>}

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
