import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './SurveysReducer';

export default combineReducers({
  auth: authReducer, // key : name of the library/file
  form: reduxForm,
  surveys: surveysReducer,
});
