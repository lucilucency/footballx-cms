/* global FX_API, FX_VERSION */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
/* actions & helpers */
import { toDateTimeString } from 'utils/time';
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
import {
  AutoCompleteValidator,
  SelectValidator,
  TextValidator,
} from 'react-material-ui-form-validator';
import FormField from 'components/Form/FormField';
/* css */
import styled, { css } from 'styled-components';
import constants from '../../constants';

const request = require('superagent');
const moment = require('moment');

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
    .query({}) // query string
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

const getHotspots = (props, context) => {
  const accessToken = localStorage.getItem('access_token');
  return request
    .get(`${FX_API}/${FX_VERSION}/hotspots`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Bearer ${accessToken}`)
    .query({}) // query string
    .then((res, err) => {
      if (!err) {
        const data = transformMatches(res.body.data);
        const hotspots = data.map(o => ({
          text: `${o.name} - ${o.address}`,
          value: o.id,
          textShort: o.name,
        }));
        context.setState({ hotspots });
      } else {
        console.error(err);
      }
    });
};

const getGroups = (props, context) => {
  const accessToken = localStorage.getItem('access_token');
  return request
    .get(`${FX_API}/${FX_VERSION}/groups`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Bearer ${accessToken}`)
    .query({}) // query string
    .then((res, err) => {
      if (!err) {
        const data = transformMatches(res.body.data);
        const groups = data.map(o => ({
          text: `${o.name}`,
          value: o.id,
          textShort: `${o.short_name}`,
        }));
        context.setState({ groups });
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
    hotspots: props.hotspotId ? [props.hotspotId] : [],
    group: props.groupId ? { value: props.groupId } : {},
    match: props.matchId ? { value: props.matchId } : {},
    price: {},
    discount: {},
    seats: {},
    start_time_register: {},
    end_time_register: {},
    start_time_checkin: {},
    end_time_checkin: {},
    notes: {},
  },
  cardLabelName: {},
  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
});

class CreateEventForm extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    hotspotId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // hotspotIds: PropTypes.arrayOf(PropTypes.number()),
    groupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    matchId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    toggle: PropTypes.bool,
    toggleShowForm: PropTypes.func,
    maxSearchResults: PropTypes.number,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...initialState(props),
      matches: [],
      hotspots: [],
      groups: [],
    };
    this.bindAll([
      'submitCreateEvent',
      'closeDialog',
      'onDragHomeColor',
      'onDragAwayColor',
      'onDragFreeFolkColor',
      'handleSelectMatch',
      'handleClearMatch',
    ]);
  }

  componentDidMount() {
    if (!this.props.matchId) getMatches(this.props, this);
    if (!this.props.hotspotId) getHotspots(this.props, this);
    if (!this.props.groupId) getGroups(this.props, this);
  }

  componentWillUpdate(nextProps) {
    if (this.props.showForm !== nextProps.showForm) {
      this.clearState();
    }
  }

  onDragHomeColor(color) {
    this.setState({
      event: update(this.state.event, {
        home_color: { value: { $set: color.hex } },
      }),
    });
  }

  onDragAwayColor(color) {
    this.setState({
      event: update(this.state.event, {
        away_color: { value: { $set: color.hex } },
      }),
    });
  }

  onDragFreeFolkColor(color) {
    this.setState({
      event: update(this.state.event, {
        free_folk_color: { value: { $set: color.hex } },
      }),
    });
  }

  hotspotItems() {
    const ids = this.state.event.hotspots;
    return this.state.hotspots && this.state.hotspots.map(o => (<MenuItem
      key={o.value}
      insetChildren
      checked={ids && ids.indexOf(o.value) > -1}
      value={o.value}
      primaryText={o.text}
    />));
  }

  clearState() {
    this.setState(initialState(this.props));
  }


  submitCreateEvent() {
    const that = this;
    const event = that.state.event;

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }),
    }, () => {
      const createEventFn = that.props.dispatch ? that.props.dispatch : that.props.defaultSubmitFunction;
      const doCreateEvent = (eventData, payload) => new Promise((resolve) => {
        resolve(createEventFn(eventData, payload));
      });

      event.hotspots && Promise.all(event.hotspots.map((o) => {
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
        const eventData = {
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

        return doCreateEvent(eventData, that.state.payload);
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

  // handleInputMatch(searchText) {
  // const that = this;
  // that.setState({
  //     event: update(that.state.event, {
  //         match: {text: {$set: searchText}}
  //     })
  // })
  // }

  handleClearMatch() {
    this.setState({
      event: update(this.state.event, {
        match: { $set: {} },
      }),
    });
  }

  handleSelectMatch(o) {
    const that = this;
    // const matchStartTime = o.date - 86400;
    const matchStartTime = parseInt(Date.now() / 1000);
    const matchEndTime = o.date + 7200;
    that.setState({
      event: update(that.state.event, {
        match: { $set: o },
        home_color: {
          $set: {
            value: Clubs[o.home.club_id] && Clubs[o.home.club_id].home_color,
          },
        },
        away_color: {
          $set: {
            value: Clubs[o.away.club_id] && Clubs[o.away.club_id].away_color,
          },
        },
        free_folk_color: {
          $set: {
            value: '#ffffff',
          },
        },
        start_time_register: {
          $set: {
            text: moment(matchStartTime * 1000),
            value: matchStartTime,
          },
        },
        end_time_register: {
          $set: {
            text: moment(matchEndTime * 1000),
            value: matchEndTime,
          },
        },
        start_time_checkin: {
          $set: {
            text: moment(matchStartTime * 1000),
            value: matchStartTime,
          },
        },
        end_time_checkin: {
          $set: {
            text: moment(matchEndTime * 1000),
            value: matchEndTime,
          },
        },
      }),
      payload: update(that.state.payload, {
        home: { $set: o.home.club_id },
        away: { $set: o.away.club_id },
        match_date: { $set: o.date },
        match_id: { $set: o.value },
      }),
    });
  }

  changeValue(e, key, transform) {
    const value = e.target.value;
    const next_state = {};
    next_state[key] = {
      value: transform ? transform(value) : value,
    };
    this.setState(next_state, () => {
      // this.isDisabled();
    });
  }

  __handleKeyPressOnForm(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.handleOpenDialog();
      }
    }
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
    const ClubImageContainer = styled.div`
            position: relative;
            display: flex;
            justify-content: space-around;
            flex-direction: row;
        `;
    const ClubColorPicker = styled.div`
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
        `;
    const ColorPreviewBox = styled.div`
            width: 36px;
            height: 14px;
            border-radius: 2px;
            ${props => props.color && css`
                background: ${props.color}
            `}
        `;
    const Swatch = styled.div`
            margin-top: 20px;
            padding: 0.3em;
            background: #fff;
            border-radius: 1px;
            box-shadow: 0 0 0 1px rgba(0,0,0,.1);
            display: inline-block;
            cursor: pointer;
        `;
    const PopOver = styled.div`
            position: absolute;
            z-index: 2;
        `;
    const Cover = styled.div`
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        `;
    
    const __renderHotspotSelector = () => (<SelectValidator
      name="hotspots"
      fullWidth
      multiple
      hintText={strings.tooltip_select_hotspots}
      value={this.state.event.hotspots}
      onChange={(event, index, values) => {
        this.setState({
          event: update(this.state.event, {
            hotspots: { $set: values },
          }),
        });
      }}
      selectionRenderer={(values) => {
        const that = this;
        switch (values.length) {
          case 0:
            return '';
          case 1:
            return that.state.hotspots.find(o => o.value === values[0]).text;
          default: {
            const arrayNames = values.map(value => `[${that.state.hotspots.find(o => o.value === value).textShort}]`);
            return arrayNames.join(',  ');
          }
        }
      }}

      validators={['required']}
      errorMessages={[strings.validate_is_required]}
    >
      {this.hotspotItems()}
    </SelectValidator>);
    const __renderHotspotSelect2 = () => (<FormField
      name="hotspots"
      label={strings.filter_notification_user}
      dataSource={this.state.hotspots.map(o => ({ text: o.text, value: o.value }))}
      fullWidth
      // onChange={this.handleSelectHotspot.bind(this)}
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
    />);
    const __renderGroupSelector = () => (<AutoCompleteValidator
      name="group"
      hintText={strings.filter_group}
      floatingLabelText={strings.filter_group}
      searchText={this.state.event.group && this.state.event.group.text}
      value={this.state.event.group.value}
      dataSource={this.state.groups}
      onNewRequest={(o) => {
        this.setState({
          event: update(this.state.event, {
            group: { $set: o },
          }),
        });
      }}
      onUpdateInput={(searchText) => {
        this.setState({
          event: update(this.state.event, {
            group: { $set: { value: searchText } },
          }),
        });
      }}
      filter={AutoComplete.caseInsensitiveFilter}
      openOnFocus
      maxSearchResults={maxSearchResults}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
      validators={[]}
      errorMessages={[]}
    />);
    const __renderMatchSelector = () => (<div>
      <AutoCompleteValidator
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
        filter={AutoComplete.fuzzyFilter}
        openOnFocus
        maxSearchResults={maxSearchResults}
        fullWidth
        listStyle={{ maxHeight: 300, overflow: 'auto' }}
        validators={['required']}
        errorMessages={[strings.validate_is_required]}
      />
    </div>);
    const __renderMatchPreview = () => (<div>
      {!this.props.matchId && <RaisedButton
        label={<small>{strings.form_create_event_clear_match}</small>}
        onClick={this.handleClearMatch}
        style={{ display: 'flex', margin: 'auto' }}
      />}
      <ClubImageContainer>
        <ClubColorPicker>
          <img
            src={Clubs[this.state.event.match.home.club_id] && Clubs[this.state.event.match.home.club_id].icon}
            alt=""
            width={100}
            height={100}
          />
          <div>
            <Swatch onClick={() => {
              const that = this;
              that.setState({
                event: update(that.state.event, {
                  home_color: {
                    displayColorPicker: { $set: !that.state.event.home_color.displayColorPicker || false },
                  },
                }),
              });
            }}
            >
              <ColorPreviewBox color={this.state.event.home_color.value} />
            </Swatch>

            {this.state.event.home_color.displayColorPicker ? <PopOver>
              <Cover onClick={() => {
                const that = this;
                that.setState({
                  event: update(that.state.event, {
                    home_color: {
                      displayColorPicker: { $set: false },
                    },
                  }),
                });
              }}
              />
              <SketchPicker
                color={this.state.event.home_color.value}
                onChange={this.onDragHomeColor}
              />
            </PopOver> : null}
          </div>
        </ClubColorPicker>

        <ClubColorPicker>

          <h3 style={{
            textAlign: 'center',
            height: 100,
            margin: 0,
            lineHeight: '100px',
          }}
          >{strings.event_versus}</h3>
          <div>
            <Swatch onClick={() => {
              const that = this;
              that.setState({
                event: update(that.state.event, {
                  free_folk_color: {
                    displayColorPicker: { $set: !that.state.event.free_folk_color.displayColorPicker || false },
                  },
                }),
              });
            }}
            >
              <ColorPreviewBox color={this.state.event.free_folk_color.value} />
            </Swatch>

            {this.state.event.free_folk_color.displayColorPicker ? <PopOver>
              <Cover onClick={() => {
                const that = this;
                that.setState({
                  event: update(that.state.event, {
                    free_folk_color: {
                      displayColorPicker: { $set: false },
                    },
                  }),
                });
              }}
              />
              <SketchPicker
                color={this.state.event.free_folk_color.value}
                onChangeComplete={this.onDragFreeFolkColor}
              />
            </PopOver> : null}
          </div>
        </ClubColorPicker>

        <ClubColorPicker>
          <img
            src={Clubs[this.state.event.match.away.club_id] && Clubs[this.state.event.match.away.club_id].icon}
            alt=""
            width={100}
            height={100}
          />
          <div>
            <Swatch onClick={() => {
              const that = this;
              that.setState({
                event: update(that.state.event, {
                  away_color: {
                    displayColorPicker: { $set: !that.state.event.away_color.displayColorPicker || false },
                  },
                }),
              });
            }}
            >
              <ColorPreviewBox color={this.state.event.away_color.value} />
            </Swatch>

            {this.state.event.away_color.displayColorPicker ? <PopOver>
              <Cover onClick={() => {
                const that = this;
                that.setState({
                  event: update(that.state.event, {
                    away_color: {
                      displayColorPicker: { $set: false },
                    },
                  }),
                });
              }}
              />
              <SketchPicker
                color={this.state.event.away_color.value}
                onChangeComplete={this.onDragAwayColor}
              />
            </PopOver> : null}
          </div>
        </ClubColorPicker>
      </ClubImageContainer>
    </div>);
    const __renderSeatsInput = () => (<AutoCompleteValidator
      name="seats"
      type="number"
      hintText={strings.filter_number_of_seats}
      floatingLabelText={strings.filter_number_of_seats}
      searchText={this.state.event.seats.text}
      value={this.state.event.seats.value}
      dataSource={data.seatsArr}
      onUpdateInput={(text) => {
        this.setState({
          event: update(this.state.event, {
            seats: { $set: { value: Number(text), text } },
          }),
        });
      }}
      onNewRequest={(o) => {
        this.setState({
          event: update(this.state.event, {
            seats: { $set: o },
          }),
        });
      }}
      // filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
      filter={AutoComplete.fuzzyFilter}
      openOnFocus
      errorText={this.state.event.seats.error}
      validators={['required', 'minNumber:0']}
      errorMessages={[strings.validate_is_required, util.format(strings.validate_minimum, 0)]}
    />);
    const __renderPriceInput = () => (<AutoCompleteValidator
      name="price"
      hintText={strings.filter_price}
      floatingLabelText={strings.filter_price}
      searchText={this.state.event.price.text}
      value={this.state.event.price.value}
      dataSource={data.priceArr}
      onUpdateInput={(text) => {
        this.setState({
          event: update(this.state.event, {
            price: { $set: { value: text, text } },
          }),
        });
      }}
      onNewRequest={(o) => {
        this.setState({
          event: update(this.state.event, {
            price: { $set: o },
          }),
        });
      }}
      filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
      openOnFocus
      errorText={this.state.event.price.error}
      validators={['required']}
      errorMessages={['this field is required']}
    />);
    const __renderDiscountInput = () => (<AutoCompleteValidator
      name="discount"
      hintText={strings.filter_discount}
      floatingLabelText={strings.filter_discount}
      searchText={this.state.event.discount.text}
      value={this.state.event.discount.value}
      dataSource={data.discountArr}
      onUpdateInput={(text) => {
        this.setState({
          event: update(this.state.event, {
            discount: { $set: { value: text, text } },
          }),
        });
      }}
      onNewRequest={(o) => {
        this.setState({
          event: update(this.state.event, {
            discount: { $set: o },
          }),
        });
      }}
      filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
      openOnFocus
      errorText={this.state.event.discount.error}
      validators={[]}
      errorMessages={[]}
    />);
    const __renderStartTimeRegisterPicker = () => (<DateTimePicker
      format="HH:mm, MM/DD/YYYY"
      hintText={strings.filter_date_start_register}
      floatingLabelText={strings.filter_date_start_register}
      onChange={(dateTime) => {
        this.setState({
          event: update(this.state.event, {
            start_time_register: {
              $set: {
                text: dateTime || '',
                value: dateTime ? dateTime.getTime() / 1000 : null,
              },
            },
          }),
        });
      }}
      DatePicker={DatePickerDialog}
      TimePicker={TimePickerDialog}
      value={this.state.event.start_time_register.text}
    />);
    const __renderEndTimeRegisterPicker = () => (<DateTimePicker
      format="HH:mm, MM/DD/YYYY"
      hintText={strings.filter_date_end_register}
      floatingLabelText={strings.filter_date_end_register}
      onChange={dateTime => this.setState({
        event: update(this.state.event, {
          end_time_register: {
            $set: {
              text: dateTime || '',
              value: dateTime ? dateTime.getTime() / 1000 : null,
            },
          },
        }),
      })}
      DatePicker={DatePickerDialog}
      TimePicker={TimePickerDialog}
      value={this.state.event.end_time_register.text}
    />);
    const __renderStartTimeCheckinPicker = () => (<DateTimePicker
      format="HH:mm, MM/DD/YYYY"
      hintText={strings.filter_date_start_check_in}
      floatingLabelText={strings.filter_date_start_check_in}
      onChange={dateTime => this.setState({
        event: update(this.state.event, {
          start_time_checkin: {
            $set: {
              text: dateTime || '',
              value: dateTime ? dateTime.getTime() / 1000 : null,
            },
          },
        }),
      })}
      DatePicker={DatePickerDialog}
      TimePicker={TimePickerDialog}
      value={this.state.event.start_time_checkin.text}
    />);
    const __renderEndTimeCheckinPicker = () => (<DateTimePicker
      format="HH:mm, MM/DD/YYYY"
      hintText={strings.filter_date_end_check_in}
      floatingLabelText={strings.filter_date_end_check_in}
      onChange={dateTime => this.setState({
        event: update(this.state.event, {
          end_time_checkin: {
            $set: {
              text: dateTime || '',
              value: dateTime ? dateTime.getTime() / 1000 : null,
            },
          },
        }),
      })}
      DatePicker={DatePickerDialog}
      TimePicker={TimePickerDialog}
      value={this.state.event.end_time_checkin.text}
    />);
    const __renderNotesInput = () => (<TextField
      type="text"
      hintText={strings.tooltip_note}
      floatingLabelText={strings.tooltip_note}
      multiLine
      rows={1}
      rowsMax={4}
      onChange={(event, notes) => this.setState({
        event: update(this.state.event, {
          notes: { $set: { text: notes, value: notes } },
        }),
      })}
      fullWidth
      errorText={this.state.event.notes.error}
    />);

    return (<div onKeyPress={e => this.__handleKeyPressOnForm(e)} role="form">
      <ValidatorForm
        onSubmit={this.submitCreateEvent}
        onError={errors => console.log(errors)}
      >
        {loading && <Spinner />}
        {this.state.error && <Error text={this.state.error} />}
        <FormContainer show={!toggle || showForm}>
          <div>
            {!this.props.hotspotId && this.state.hotspots && __renderHotspotSelector()}
            {!this.props.matchId && this.state.matches && __renderMatchSelector()}
            {this.state.event.match.home && __renderMatchPreview()}
            {/* input seats */}
            {__renderSeatsInput()}
            {/* select price */}
            {__renderPriceInput()}
            {!this.props.groupId && this.state.groups && __renderGroupSelector()}
            {/* select discount */}
            {__renderDiscountInput()}
            {/* select start_time_register */}
            {__renderStartTimeRegisterPicker()}
            {/* select end_time_register */}
            {__renderEndTimeRegisterPicker()}
            {/* select start_time_check_in */}
            {__renderStartTimeCheckinPicker()}
            {/* select end_time_check_in */}
            {__renderEndTimeCheckinPicker()}
            {/* input notes */}
            {__renderNotesInput()}

            <TextValidator
              name="cardLabelName"
              type="text"
              hintText={strings.hint_card_label_name}
              floatingLabelText={strings.filter_card_label_name}
              errorText={this.state.cardLabelName.errorText}
              onChange={e => this.changeValue(e, 'cardLabelName')}
              fullWidth
              validators={['required']}
              errorMessages={['this field is required']}
            />
          </div>
          <RaisedButton
            type="submit"
            label={strings.form_create_event}
          />
        </FormContainer>
      </ValidatorForm>

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
    </div>
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
