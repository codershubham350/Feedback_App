import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  renderSurveys() {
    return this.props.surveys.reverse().map((survey) => {
      return (
        <div className="card blue-grey darken-1" key={survey._id}>
          <div className="card-content">
            <span
              className="card-title"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {survey.title}
            </span>
            <p style={{ fontStyle: 'italic', color: '#fbe9d7' }}>
              {survey.body}
            </p>
            <p className="right" style={{ color: '#f7f779' }}>
              Sent On:{new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action">
            <a style={{ cursor: 'pointer' }}>Yes: {survey.yes}</a>
            <a style={{ cursor: 'pointer' }}>No: {survey.no}</a>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderSurveys()}</div>;
  }
}

function mapStateToProps({ surveys }) {
  return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
