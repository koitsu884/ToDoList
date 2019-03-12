import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { compose } from "redux";

// import TextFieldGroup from "../common/TextFieldGroup";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import { registerUser } from "../../actions/authActions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = formValues => {
    const newUser = {
      userName: formValues.userName,
      password: formValues.password,
      password2: formValues.password2
    };
    this.props.registerUser(newUser, this.props.history);
  };

  renderError({ error, touched }) {
    if (touched && error) {
      return <small className="form-text text-danger">{error}</small>;
    }
  }

  renderInput = ({ input, meta, type, label }) => {
    const className = `form-control form-control-lg ${
      meta.error && meta.touched ? "is-invalid" : ""
    }`;
    return (
      <div className="form-group">
          <label>{label}</label>
          <input {...input} type={type} className={className} autoComplete="off" />
          {this.renderError(meta)}
      </div>
    );
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your account</p>
              <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Field
                  name="userName"
                  component={this.renderInput}
                  label="User Name"
                />
                <Field
                  name="password"
                  component={this.renderInput}
                  label="Password"
                  type="password"
                />
                <Field
                  name="password2"
                  component={this.renderInput}
                  label="Confirm Password"
                  type="password"
                />
                {!_.isEmpty(errors) && (
                  <div className="alert alert-danger" role="alert">
                    {errors.toString()}
                  </div>
                )}

                <button className="btn btn-info btn-block mt-4">Sign Up</button>
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

const validate = formValues => {
  const errors = {};

  if (!formValues.userName) {
    errors.userName = "You must enter a user name";
  }
  else if(formValues.userName.length < 5){
    errors.userName = "User name must have at least 5 charactors";
  }

  if (!formValues.password) {
    errors.password = "You must enter a password";
  }
  else if(formValues.password.length < 5){
    errors.password = "Password must have at least 5 charactors";
  }

  if (formValues.password != formValues.password2) {
    errors.password2 = "Password unmatch";
  }

  return errors;
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    { registerUser }
  ),
  reduxForm({ form: "register", validate: validate })
)(Register);
