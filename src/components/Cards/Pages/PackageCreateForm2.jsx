/* global FX_API, FX_VERSION */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
/* actions & helpers */
import { toDateTimeString } from 'utility/time';
import transformMatches from 'actions/transforms/matches/transformMatches';
import { createEvent as defaultCreateEvent, toggleShowForm } from 'actions';
/* data */
import strings from 'lang';
import * as data from 'components/Event/Event.config';
import Clubs from 'fxconstants/build/clubsObj.json';
import util from 'util';
/* components */
import {
  AutoComplete,
  Dialog,
  FlatButton,
  List,
  ListItem,
  MenuItem,
  RaisedButton,
  TextField,
} from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import Error from 'components/Error/index';
import Spinner from 'components/Spinner/index';
import { SketchPicker } from 'react-color';
import { ValidatorForm } from 'react-form-validator-core';
import { AutoCompleteValidator, SelectValidator } from 'react-material-ui-form-validator';
/* css */
import styled, { css } from 'styled-components';
import constants from '../../constants';

const request = require('superagent');

const getMatches = (props, context) => {
  const now = Date.now();
  const params = {
    start_time: parseInt(now / 1000),
    end_time: parseInt(now / 1000) + 2592000,
  };
  const accessToken = localStorage.getItem('access_token');

  return request
    .get(`${FX_API}/${FX_VERSION}/matches?${queryString.stringify(params)}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Bearer ${accessToken}`)
    .then((res, err) => {
      if (!err) {
        const data = transformMatches(res.body.data);
        const matches = data.matches.filter(o => o.home && o.away).map((o) => {
          const matchTime = toDateTimeString(o.date * 1000);
          return {
            text: `${Clubs[o.home.club_id] && Clubs[o.home.club_id].name} vs ${Clubs[o.away.club_id] && Clubs[o.away.club_id].name} - ${matchTime}`,
            value: `${o.id}`,
            date: o.date,
            home: o.home,
            away: o.away,
          };
        });
        context.setState({ matches });
      } else {
        console.error(err);
      }
    });
};

const getCardLabels = (props, context) => {
  const accessToken = localStorage.getItem('access_token');

  return request
    .get(`${FX_API}/${FX_VERSION}/card/labels`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Bearer ${accessToken}`)
    .then((res, err) => {
      if (!err) {
        const data = res.body.data;
        const cardLabels = data.map(o => ({
          text: o.name,
          value: o.id,
        }));
        context.setState({ cardLabels });
      } else {
        console.error(err);
      }
    });
};

const initialState = props => ({
  // hotspots: [],
  // matches: [],
  // groups: [],
  event: {
    match: props.matchId ? { value: props.matchId } : {},
    cardLabel: props.cardLabelId ? { value: props.cardLabelId } : {},
    seats: {},
    notes: {},
  },
  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
});

class CreateEventForm extends React.Component {
  static propTypes = {
    matchId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    cardLabelId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    showForm: PropTypes.bool,
    toggle: PropTypes.bool,
    toggleShowForm: PropTypes.func,
    maxSearchResults: PropTypes.number,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    toggle: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...initialState(props),
      matches: [],
      cardLabels: [],
    };
    this.bindAll([
      'submitForm',
      'closeDialog',
      'handleSelectMatch',
      'handleClearMatch',
      'handleSelectCardLabel',
      'handleSelectSeats',
      'handleInputSeats',
      'handleInputNotes',
    ]);
  }

  componentDidMount() {
    if (!this.props.matchId) getMatches(this.props, this);
    if (!this.props.cardLabelId) getCardLabels(this.props, this);
  }

  componentWillUpdate(nextProps) {
    if (this.props.showForm !== nextProps.showForm) {
      this.clearState();
    }
  }

  clearState() {
    console.log('do clear state');
    this.setState(initialState(this.props));
  }

  submitForm() {
    const that = this;
    const event = that.state.event;

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }),
    }, () => {
      const submitFn = that.props.dispatch ? that.props.dispatch : that.props.defaultSubmitFunction;
      const doSubmit = (formData, payload) => new Promise((resolve) => {
        resolve(submitFn(formData, payload));
      });

      Promise.all(event.hotspots.map((o) => {
        that.setState({
          submitResults: update(that.state.submitResults, {
            data: {
              $push: [{
                hotspot_name: !that.props.hotspotId ? that.state.hotspots.find(h => h.value === o).textShort : event.match.text,
                submitting: true,
              }],
            },
          }),
        });
        const formData = {
          match_id: event.match.value,
          hotspot_id: o,
          group_id: event.group.value,
          price: event.price.value,
          discount: event.discount.value,
          seats: event.seats.value,
          start_time_register: event.start_time_register.value,
          end_time_register: event.end_time_register.value,
          start_time_checkin: event.start_time_checkin.value,
          end_time_checkin: event.end_time_checkin.value,
          notes: event.notes.value || '',
          home_color: event.home_color && event.home_color.value,
          away_color: event.away_color && event.away_color.value,
          free_folk_color: event.free_folk_color && event.free_folk_color.value,
        };

        return doSubmit(formData, that.state.payload);
      })).then((results) => {
        const resultsReport = event.hotspots.map((hotspotId, index) => {
          const hotspotName = !that.props.hotspotId ? that.state.hotspots.find(o => o.value === hotspotId).textShort : event.match.text;
          if (results[index].type.indexOf('OK') === 0) {
            return {
              hotspot_name: hotspotName,
              submitting: false,
            };
          }
          return {
            hotspot_name: hotspotName,
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

  closeDialog() {
    const that = this;

    that.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: false },
      }),
    });
  }

  handleClearMatch() {
    this.setState({
      event: update(this.state.event, {
        match: { $set: {} },
      }),
    });
  }

  handleSelectMatch(o) {
    const that = this;
    that.setState({
      event: update(that.state.event, {
        match: { $set: o },
      }),
      payload: update(that.state.payload, {
        home: { $set: o.home.club_id },
        away: { $set: o.away.club_id },
        match_date: { $set: o.date },
        match_id: { $set: o.value },
      }),
    });
  }

  handleSelectCardLabel(o) {
    const that = this;
    that.setState({
      event: update(that.state.event, {
        cardLabel: { $set: o },
      }),
    });
  }

  handleSelectSeats(o) {
    this.setState({
      event: update(this.state.event, {
        // seats: { $set: { value: Number(text), text } },
        seats: { $set: o },
      }),
    });
  }

  handleInputSeats(text) {
    console.log(text);
    // this.setState({
    //   event: update(this.state.event, {
    //     // seats: { $set: { value: Number(text), text } },
    //     seats: { $set: o },
    //   }),
    // });
  }

  handleInputNotes(event, notes) {
    console.log(notes);
    console.log(event.target.value);
    console.log(this.state.event);
    this.setState({
      event: update(this.state.event, {
        notes: { $set: { text: notes, value: notes } },
      }),
    }, function () {
      console.log(this.state.event);
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
    } = this.props;

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

    const __renderMatchSelector = () => (<AutoCompleteValidator
      name="match"
      ref={(input) => {
        this.inputMatch = input;
      }}
      hintText={strings.filter_match}
      floatingLabelText={strings.filter_match}
      searchText={this.state.event.match && this.state.event.match.text}
      value={this.state.event.match.value}
      dataSource={this.state.matches}
      onNewRequest={this.handleSelectMatch}
      // onUpdateInput={this.handleInputMatch}
      filter={AutoComplete.fuzzyFilter}
      openOnFocus
      maxSearchResults={maxSearchResults}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
      validators={['required']}
      errorMessages={[strings.validate_is_required]}
    />);
    const __renderCardLabelSelector = () => (<AutoCompleteValidator
      name="card_label_id"
      ref={(input) => { this.inputCardLabel = input; }}
      floatingLabelText={strings.filter_card_label}
      searchText={this.state.event.cardLabel && this.state.event.cardLabel.text}
      value={this.state.event.cardLabel.value}
      dataSource={this.state.cardLabels}
      onNewRequest={this.handleSelectCardLabel}
      filter={AutoComplete.fuzzyFilter}
      openOnFocus
      maxSearchResults={maxSearchResults}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
      validators={['required']}
      errorMessages={[strings.validate_is_required]}
    />);
    const __renderSeats = () => (<AutoCompleteValidator
      name="seats"
      type="number"
      hintText={strings.filter_seats}
      floatingLabelText={strings.filter_seats}
      searchText={this.state.event.seats && this.state.event.seats.text}
      value={this.state.event.seats.value}
      dataSource={data.seatsArr}
      onNewRequest={this.handleSelectSeats}
      onUpdateInput={this.handleInputSeats}
      // filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
      filter={AutoComplete.fuzzyFilter}
      openOnFocus
      errorText={this.state.event.seats.error}
      validators={['required', 'minNumber:0']}
      errorMessages={[strings.validate_is_required, util.format(strings.validate_minimum, 0)]}
    />);

    return (
      <ValidatorForm
        onSubmit={this.submitForm}
        onError={errors => console.log(errors)}
      >
        {loading && <Spinner />}
        {this.state.error && <Error text={this.state.error} />}
        <FormContainer show={!toggle || showForm}>
          <div>
            {!this.props.matchId && this.state.matches && __renderMatchSelector()}

            {/* card labels */}
            {__renderCardLabelSelector()}

            {/* input seats */}
            {__renderSeats()}

            {/* input notes */}
            <TextField
              type="text"
              hintText={strings.tooltip_note}
              floatingLabelText={strings.tooltip_note}
              value={this.state.event.notes.value}
              multiLine
              rows={1}
              rowsMax={4}
              onChange={this.handleInputNotes}
              fullWidth
              errorText={this.state.event.notes.error}
            />
          </div>
          <RaisedButton
            type="submit"
            label={strings.form_create_event}
          />
        </FormContainer>

        <Dialog
          title={strings.form_create_events_dialog_desc}
          actions={<FlatButton
            label="Ok"
            primary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
              // this.props.history.push('/events');
              this.props.toggleShowForm(false);
            }}
          />}
          modal={false}
          open={this.state.submitResults.show}
          onRequestClose={this.closeDialog}
        >
          <List>
            {this.state.submitResults.data.map(r => (<ListItem
              primaryText={r.hotspot_name}
              leftIcon={r.error ?
                <IconFail color={constants.colorRed} title={strings.form_create_event_fail} />
                : <IconSuccess
                  color={constants.colorSuccess}
                  title={strings.form_create_event_success}
                />}
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
  defaultSubmitFunction: params => dispatch(defaultCreateEvent(params)),
  toggleShowForm: state => dispatch(toggleShowForm('createEvent', state)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEventForm));
