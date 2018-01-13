/* eslint-disable no-unused-vars */
/* global FX_API, FX_VERSION */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
/* actions & helpers */
import { toDateTimeString } from 'utility/time';
import { transformEvents } from 'actions/transforms';
import { createEvent as defaultCreateEvent, toggleShowForm, sendNotificationTopic } from 'actions';
/* data */
import strings from 'lang';
import { topics } from 'components/topics';
import Clubs from 'fxconstants/build/clubsObj.json';
import util from 'util';
/* components */
import { TextValidator, AutoCompleteValidator } from 'react-material-ui-form-validator';

import {
  Dialog,
  FlatButton, RaisedButton,
  List, ListItem,
  RadioButton, RadioButtonGroup,
  AutoComplete,
} from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import FormField from 'components/Form/FormField';
import Spinner from 'components/Spinner/index';
import { ValidatorForm } from 'react-form-validator-core';
/* css */
import styled, { css } from 'styled-components';
import constants from '../../constants';

const request = require('superagent');

const FormContainer = styled.div`
  transition: max-height 1s;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
  ${props => (props.show ? css`
      max-height: 2000px;
  ` : css`
      max-height: 0;
  `)}
`;
const FormGroup = styled.div`
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const FormFieldStyled = styled(FormField)`
  width: 100%;
`;
const RadioButtonStyled = styled(RadioButton)`
  margin-bottom: 16px;
`;

const getEvents = (props, context) => {
  const now = Date.now();
  const params = {
    start_time: parseInt(now / 1000) - 7200,
    end_time: parseInt(now / 1000) + 2592000,
  };
  const accessToken = localStorage.getItem('access_token');

  return request
    .get(`${FX_API}/${FX_VERSION}/events?${queryString.stringify(params)}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Bearer ${accessToken}`)
    .query({}) // query string
    .then((res, err) => {
      if (!err) {
        const data = transformEvents(res.body.data);
        const events = data.filter(o => o.status === 1).map((o) => {
          const matchTime = toDateTimeString(o.match_date * 1000);
          return {
            text: `${o.hotspot_name} - ${Clubs[o.home] && Clubs[o.home].name} vs ${Clubs[o.away] && Clubs[o.away].name} - ${matchTime}`,
            value: o.event_id,
            data: o,
          };
        });
        context.setState({ events });
      } else {
        console.error(err);
      }
    });
};

const getEvent = (props, context) => {
  const now = Date.now();
  const params = {
    start_time: parseInt(now / 1000) - 7200,
    end_time: parseInt(now / 1000) + 2592000,
  };
  const accessToken = localStorage.getItem('access_token');

  return request
    .get(`${FX_API}/${FX_VERSION}/event/${props.eventId}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Bearer ${accessToken}`)
    .query({}) // query string
    .then((res, err) => {
      if (!err) {
        const data = transformEvents(res.body.data);
        console.log(data);
        // const events = data.filter(o => o.status === 1).map((o) => {
        //   const matchTime = toDateTimeString(o.match_date * 1000);
        //   return {
        //     text: `${o.hotspot_name} - ${Clubs[o.home] && Clubs[o.home].name} vs ${Clubs[o.away] && Clubs[o.away].name} - ${matchTime}`,
        //     value: o.event_id,
        //     data: o
        //   };
        // });
        // context.setState({ events });
      } else {
        console.error(err);
      }
    });
};

const initialState = props => ({
  // clubs: [],
  // events: [],
  userSegment: [],
  topics: [],
  message: '',
  submitResults: {
    data: [],
    show: false,
  },
  selectedEvent: {},
});

class CreateNotificationForm extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    toggle: PropTypes.bool,
    toggleShowForm: PropTypes.func,
    maxSearchResults: PropTypes.number,
    loading: PropTypes.bool,

    clubId: PropTypes.number,
    eventId: PropTypes.number,
    event: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    xusers: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    target: PropTypes.string,

    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      ...initialState(props),
      clubs: [],
      events: [],
      target: props.target || 'topic',
      xusers: props.xusers && props.xusers,
    };
    this.bindAll([
      'sendNotification',
      'closeDialog',
    ]);
  }

  componentDidMount() {
    if (!this.props.eventId && !this.props.event) getEvents(this.props, this);
    if (this.props.eventId && !this.props.event) getEvent(this.props, this);
  }

  componentWillUpdate(nextProps) {
    if (this.props.showForm !== nextProps.showForm) {
      this.clearState();
    }
  }

  sendNotification() {
    const that = this;

    if (that.state.topics.length) {
      const { topics } = that.state;

      that.setState({ submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }) }, () => {
        const sendNotificationFn = notificationData => new Promise((resolve) => {
          resolve(that.props.sendNotificationTopic(notificationData));
        });
        Promise.all(topics.map((topic) => {
          that.setState({
            submitResults: update(that.state.submitResults, {
              data: {
                $push: [{
                  topic,
                  submitting: true,
                }],
              },
            }),
          });
          return sendNotificationFn({
            topic,
            message: that.state.message,
          });
        })).then((results) => {
          const resultsReport = topics.map((topic, index) => {
            if (results[index].type.indexOf('OK') === 0) {
              return {
                topic,
                submitting: false,
              };
            }
            return {
              topic,
              submitting: false,
              error: results[index].error,
            };
          });
          that.setState({
            submitResults: update(that.state.submitResults, {
              data: { $set: resultsReport },
            }),
          });
        });
      });
    }
  }

  closeDialog() {
    const that = this;

    that.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: false },
      }),
    });
  }

  bindAll(methods) {
    methods.forEach((item) => {
      this[item] = this[item].bind(this);
    });
  }

  render() {
    const {
      toggle = true,
      maxSearchResults = 100,
      loading = false,
      showForm,
      eventId,
      clubId,
    } = this.props;

    const {
      xusers,
      selectedEvent,
    } = this.state;

    const eventData = selectedEvent.data;

    const topicsDataSource = [eventData && {
      text: util.format(topics.event_x_register.description, eventData.event_id),
      value: util.format(topics.event_x_register.code, eventData.event_id),
    }, eventData && {
      text: util.format(topics.event_x_checkin.description, eventData.event_id),
      value: util.format(topics.event_x_checkin.code, eventData.event_id),
    }, eventData && {
      text: util.format(topics.club_x.description, Clubs[eventData.home] && Clubs[eventData.home].name),
      value: util.format(topics.club_x.code, eventData.home),
    }, eventData && {
      text: util.format(topics.club_x.description, Clubs[eventData.away] && Clubs[eventData.away].name),
      value: util.format(topics.club_x.code, eventData.away),
    }];

    return (
      <ValidatorForm
        onSubmit={this.sendNotification}
        onError={errors => console.log(errors)}
      >
        {loading && <Spinner />}
        <FormContainer show={!toggle || showForm}>
          <RadioButtonGroup
            name="shipSpeed"
            defaultSelected={this.state.target}
            onChange={(e, value) => {
              this.setState({ target: value });
            }}
            style={{ display: 'flex', justifyContent: 'row' }}
          >
            <RadioButtonStyled
              value="topic"
              label={strings.form_send_notification_topic}
              checkedIcon={<ActionFavorite style={{ color: '#F44336' }} />}
              uncheckedIcon={<ActionFavoriteBorder />}
            />
            <RadioButtonStyled
              value="single_user"
              label={strings.form_send_notification_single_user}
              checkedIcon={<ActionFavorite style={{ color: '#F44336' }} />}
              uncheckedIcon={<ActionFavoriteBorder />}
            />
          </RadioButtonGroup>
          <FormGroup>
            {!this.props.eventId && this.state.events && <AutoCompleteValidator
              name="event"
              hintText={strings.filter_event}
              floatingLabelText={strings.filter_event}
              searchText={this.state.selectedEvent && this.state.selectedEvent.text}
              value={this.state.selectedEvent.value}
              dataSource={this.state.events}
              onNewRequest={(o) => {
                this.setState({
                  selectedEvent: update(this.state.selectedEvent, { $set: o }),
                });
              }}
              onUpdateInput={(searchText) => {
                this.setState({
                  selectedEvent: update(this.state.selectedEvent, { $set: { value: searchText } }),
                });
              }}
              filter={AutoComplete.caseInsensitiveFilter}
              openOnFocus
              maxSearchResults={maxSearchResults}
              fullWidth
              listStyle={{ maxHeight: 300, overflow: 'auto' }}
              validators={[]}
              errorMessages={[]}
            />}

            { this.state.target === 'single_user' && xusers && xusers.length && <FormFieldStyled
              name="xuser"
              label={strings.filter_notification_user}
              dataSource={xusers.map(peer => ({ text: `${peer.nickname}`, value: peer.id }))}
              fullWidth
              onChange={(returnData) => {
                this.setState({
                  userSegment: returnData.selectedElements,
                });
              }}
            /> }

            { this.state.target === 'topic' && <FormFieldStyled
              name="topic"
              label={strings.filter_notification_topic}
              dataSource={topicsDataSource}
              fullWidth
              onChange={(returnData) => {
                this.setState({
                  topics: returnData.selectedElements,
                });
              }}
            /> }

            <TextValidator
              name="message"
              hintText={strings.tooltip_message}
              floatingLabelText={strings.tooltip_message}
              onBlur={this.handleBlur}
              onChange={(event, text) => this.setState({
                message: text,
              })}
              fullWidth
              value={this.state.message}
              validators={['required']}
              errorMessages={[strings.validate_is_required]}
            />
          </FormGroup>
          <RaisedButton
            type="submit"
            label={strings.form_send_notification}
            style={{ marginTop: 20 }}
          />
        </FormContainer>

        <Dialog
          title={strings.form_send_notification}
          actions={<FlatButton
            label="Ok"
            primary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
              this.props.toggleShowForm(false);
              this.props.history.push('/events');
            }}
          />}
          modal={false}
          open={this.state.submitResults.show}
          onRequestClose={this.closeDialog}
        >
          <List>
            {this.state.submitResults.data.map(r => (<ListItem
              key={r.topic}
              primaryText={r.topic.toUpperCase()}
              leftIcon={r.error ?
                <IconFail color={constants.colorRed} title={strings.form_general_fail} />
                : <IconSuccess color={constants.colorSuccess} title={strings.form_general_success} />}
              secondaryText={r.error && r.error}
              secondaryTextLines={1}
            />))}
          </List>
        </Dialog>
      </ValidatorForm>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  showForm: state.app.formCreateEvent.show,
});

const mapDispatchToProps = dispatch => ({
  defaultCreateEvent: params => dispatch(defaultCreateEvent(params)),
  toggleShowForm: state => dispatch(toggleShowForm('sendNotification', state)),
  sendNotificationTopic: params => dispatch(sendNotificationTopic(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNotificationForm));
