// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'; // helps to communicate redux-form with redux-store
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          name={name}
          label={label}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {/* onSubmit={this.props.handleSubmit()} it is predefined prop inside redux-form*/}
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  //Name of recipient list i.e. name:'recipients'
  errors.recipients = validateEmails(values.recipients || '');

  _.each(formFields, ({ name, noValueError }) => {
    // If the name field is left empty or user didn't provide the name field
    if (!values[name]) {
      errors[name] = noValueError;
    }
  });

  return errors;
}

export default reduxForm({
  validate, // validating the correct format of email entered
  form: 'surveyForm',
  destroyOnUnmount: false,
})(SurveyForm);

// <Field type="text" name="surveyTitle" component="input" />
/*name="surveyTitle", the name property will tell the redux-form that we have one piece of data,
      being generated by our form called surveyData, once we start typing redux-form will see that action and
      automatically stores it's value inside a key which will be created in redux-store name "surveyTitle",
      type="text" means input should be of type "text",
      component="input" means it will be normal HTML input: <input/>*/
