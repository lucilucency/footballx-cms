import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import update from 'immutability-helper';
/* actions & helpers */
import { toDateTimeString } from 'utility/time';
import transformFxMatches from 'actions/transforms/matches/transformMatches';
import { createEvent } from 'actions';
/* data */
import strings from 'lang';
import * as data from 'components/Event/Event.config';
import Clubs from 'fxconstants/build/clubsObj.json';
import util from 'util';
/* components */
import CreateEventForm from 'components/Group/Forms/CreateEventForm';

export const FORM_NAME_CREATE_EVENTS = 'createEvent';


class CreateEventsForm extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
  }

  componentWillUpdate(nextProps) {
  }

  render() {
    return <CreateEventForm dispatch={this.props.createEvents} toggle={false} />;
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
});

const mapDispatchToProps = dispatch => ({
  createEvents: params => dispatch(createEvent(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEventsForm));
