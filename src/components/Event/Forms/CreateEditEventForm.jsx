/* eslint-disable react/forbid-prop-types,max-len */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
/* actions & helpers */
import { toDateTimeString, Row, Col, bindAll } from 'utils';
import { createEvent as defaultCreateEvent, editEvent as defaultEditEvent, getHotspots, getGroups, getMatchesLeague } from 'actions';
import util from 'util';
/* data */
import strings from 'lang';
import * as data from 'components/Event/Event.config';
import Clubs from 'fxconstants/build/clubsObj.json';
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
import Checkbox from 'material-ui/Checkbox';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import Error from 'components/Error';
import Spinner from 'components/Spinner';
import { SketchPicker } from 'react-color';
import FormField from 'components/Form/FormField';
import { AutoCompleteValidator, SelectValidator } from 'react-material-ui-form-validator';
import { ValidatorForm } from 'react-form-validator-core';
/* css */
import styled, { css } from 'styled-components';
import constants from 'components/constants';

const moment = require('moment');

const initialState = props => ({
  event: {
    hotspots: props.hotspotId ? [props.hotspotId] : [],
    group: props.groupId ? { value: props.groupId } : {},
    match: props.matchId ? { value: props.matchId } : {},
    price: {},
    discount: {},
    deposit: {},
    is_charged: { value: true },
    seats: {},
    start_time_register: {},
    end_time_register: {},
    start_time_checkin: {},
    end_time_checkin: {},
    notes: {},
    is_fan2friend_minigame: {},
  },
  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
});

class CreateEventForm extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    loading: PropTypes.bool,
    callback: PropTypes.func,

    hotspotId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    groupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    matchId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    dataSourceGroups: PropTypes.array,
    dataSourceHotspots: PropTypes.array,
    dataSourceMatches: PropTypes.array,

    dispatchLeagueMatches: PropTypes.func,
    dispatchHotspots: PropTypes.func,
    dispatchGroups: PropTypes.func,

    toggle: PropTypes.bool,
    isEditing: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...initialState(props),
      dataSourceMatches: [],
      dataSourceHotspots: [],
      dataSourceGroups: [],
    };
    bindAll([
      'getFormData',
      'submit',
      'closeDialog',
      'onDragHomeColor',
      'onDragAwayColor',
      'onDragFreeFolkColor',
      'handleSelectMatch',
    ], this);
  }

  componentDidMount() {
    if (!this.props.matchId) {
      const now = Date.now();
      const params = {
        start_time: parseInt(now / 1000),
        end_time: parseInt(now / 1000) + 2592000,
      };
      this.props.dispatchLeagueMatches(params);
    }

    if (!this.props.hotspotId) this.props.dispatchHotspots();
    if (!this.props.groupId) this.props.dispatchGroups();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isEditing) {
      const __group = newProps.event.group_id ? { value: newProps.event.group_id, text: newProps.dataSourceGroups.find(o => o.value === newProps.event.group_id) && newProps.dataSourceGroups.find(o => o.value === newProps.event.group_id).text } : {};
      this.setState({
        event: {
          event_id: newProps.event.event_id,
          hotspots: newProps.event.hotspot_id ? [newProps.event.hotspot_id] : [],
          group: __group,
          match: newProps.event.match_id ? { value: newProps.event.match_id } : {},
          seats: { value: newProps.event.seats, text: newProps.event.seats && newProps.event.seats.toString() },
          price: { value: newProps.event.price, text: newProps.event.price && newProps.event.price.toString() },
          discount: { value: newProps.event.discount, text: newProps.event.discount && newProps.event.discount.toString() },
          deposit: { value: newProps.event.deposit, text: newProps.event.deposit && newProps.event.deposit.toString() },
          is_charged: { value: newProps.event.is_charged },
          notes: { value: newProps.event.notes },

          start_time_register: { value: newProps.event.start_time_register, text: toDateTimeString(moment(newProps.event.start_time_register * 1000)) },
          end_time_register: { value: newProps.event.end_time_register, text: toDateTimeString(moment(newProps.event.end_time_register * 1000)) },
          start_time_checkin: { value: newProps.event.start_time_checkin, text: toDateTimeString(moment(newProps.event.start_time_checkin * 1000)) },
          end_time_checkin: { value: newProps.event.end_time_checkin, text: toDateTimeString(moment(newProps.event.end_time_checkin * 1000)) },

          home_color: { value: newProps.event.home_color },
          away_color: { value: newProps.event.away_color },
          free_folk_color: { value: newProps.event.free_folk_color },

          is_fan2friend_minigame: { value: newProps.event.is_fan2friend_minigame },

          /* for fun??? */
          created_user_id: { value: newProps.event.created_user_id },
          created_user_type: { value: newProps.event.created_user_type },
          status: { value: newProps.event.status },
          checkin_total: { value: newProps.event.checkin_total },
          register_total: { value: newProps.event.register_total },
        },
      });
    }
  }

  // componentWillUpdate(nextProps) {
  // if (this.props.showForm !== nextProps.showForm) {
  //   this.clearState();
  // }
  // }

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

  getFormData() {
    const event = this.state.event;

    return {
      match_id: event.match.value,
      group_id: event.group.value,
      seats: event.seats.value,
      price: event.price.value,
      discount: event.discount.value,
      deposit: event.deposit.value || 0,
      is_charged: true,
      notes: event.notes.value || '',

      start_time_register: event.start_time_register.value,
      end_time_register: event.end_time_register.value,
      start_time_checkin: event.start_time_checkin.value,
      end_time_checkin: event.end_time_checkin.value,

      home_color: event.home_color.value,
      away_color: event.away_color.value,
      free_folk_color: event.free_folk_color.value,

      is_fan2friend_minigame: event.is_fan2friend_minigame.value,
    };
  }

  clearState() {
    this.setState(initialState(this.props));
  }

  __renderHotspotSelectorItems() {
    const ids = this.state.event.hotspots;
    return this.props.dataSourceHotspots && this.props.dataSourceHotspots.map(o => (<MenuItem
      key={o.value}
      insetChildren
      checked={ids && ids.indexOf(o.value) > -1}
      value={o.value}
      primaryText={o.text}
    />));
  }

  submit() {
    const that = this;
    const event = that.state.event;

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }),
    }, () => {
      const createEventFn = that.props.dispatch ? that.props.dispatch : that.props.defaultCreateFunction;
      const editEventFn = that.props.dispatch ? that.props.dispatch : that.props.defaultEditFunction;

      const doCreateEvent = (eventData, payload) => new Promise((resolve) => {
        resolve(createEventFn(eventData, payload));
      });
      const doEditEvent = (eventId, eventData) => new Promise((resolve) => {
        resolve(editEventFn(eventId, eventData));
      });

      event.hotspots && Promise.all(event.hotspots.map((o) => {
        that.setState({
          submitResults: update(that.state.submitResults, {
            data: {
              $push: [{
                hotspot_name: !that.props.hotspotId ? that.props.dataSourceHotspots.find(h => h.value === o).textShort : event.match.text,
                submitting: true,
              }],
            },
          }),
        });
        const eventData = this.getFormData();
        eventData.hotspot_id = o;
        return this.props.isEditing ? doEditEvent(this.state.event.event_id, eventData) : doCreateEvent(eventData, this.state.payload);
      })).then((results) => {
        const resultsReport = event.hotspots.map((hotspotId, index) => {
          const hotspotName = !that.props.hotspotId ? that.props.dataSourceHotspots.find(o => o.value === hotspotId).textShort : event.match.text;
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
    this.setState({
      submitResults: update(this.state.submitResults, {
        show: { $set: false },
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
            value: (Clubs[o.home.club_id] && Clubs[o.home.club_id].home_color) || '#ffffff',
          },
        },
        away_color: {
          $set: {
            value: (Clubs[o.away.club_id] && Clubs[o.away.club_id].away_color) || '#000000',
          },
        },
        free_folk_color: {
          $set: {
            value: '#ffffff',
          },
        },
        start_time_register: {
          $set: {
            text: toDateTimeString(moment(matchStartTime * 1000)),
            value: matchStartTime,
          },
        },
        end_time_register: {
          $set: {
            text: toDateTimeString(moment(matchEndTime * 1000)),
            value: matchEndTime,
          },
        },
        start_time_checkin: {
          $set: {
            text: toDateTimeString(moment(matchStartTime * 1000)),
            value: matchStartTime,
          },
        },
        end_time_checkin: {
          $set: {
            text: toDateTimeString(moment(matchEndTime * 1000)),
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

  render() {
    const {
      toggle = true,
      loading = false,
      showForm,
    } = this.props;

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
            return that.props.dataSourceHotspots.find(o => o.value === values[0]).text;
          default: {
            const arrayNames = values.map(value => `[${that.props.dataSourceHotspots.find(o => o.value === value).textShort}]`);
            return arrayNames.join(',  ');
          }
        }
      }}
      validators={['required']}
      errorMessages={[strings.validate_is_required]}
    >
      {this.__renderHotspotSelectorItems()}
    </SelectValidator>);
    // eslint-disable-next-line no-unused-vars
    const __renderHotspotSelect2 = () => (<FormField
      name="hotspots"
      label={strings.filter_notification_user}
      dataSource={this.props.dataSourceHotspots.map(o => ({ text: o.text, value: o.value }))}
      fullWidth
      // onChange={this.handleSelectHotspot.bind(this)}
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
    />);
    const __renderGroupSelector = () => (<AutoComplete
      name="group"
      hintText={strings.filter_group}
      floatingLabelText={strings.filter_group}
      searchText={this.state.event.group.text}
      value={this.state.event.group.value}
      dataSource={this.props.dataSourceGroups}
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
      maxSearchResults={100}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
    />);
    const __renderMatchSelector = () => (<AutoComplete
      name="match"
      hintText={strings.filter_match}
      floatingLabelText={strings.filter_match}
      // searchText={this.state.event.match && this.state.event.match.text}
      // value={this.state.event.match.value}
      dataSource={this.props.dataSourceMatches}
      onNewRequest={this.handleSelectMatch}
      filter={AutoComplete.fuzzyFilter}
      openOnFocus
      maxSearchResults={100}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
      validators={['required']}
      errorMessages={[strings.validate_is_required]}
    />);
    const __renderMatchPreview = () => (<div>
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
      filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
      openOnFocus
      errorText={this.state.event.seats.error}
      fullWidth
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
      fullWidth
      validators={['required', 'minNumber:0']}
      errorMessages={[strings.validate_is_required, util.format(strings.validate_minimum, 0)]}
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
      fullWidth
    />);
    const __renderDepositInput = () => (<AutoCompleteValidator
      name="deposit"
      hintText={strings.filter_deposit}
      floatingLabelText={strings.filter_deposit}
      searchText={this.state.event.deposit.text}
      value={this.state.event.deposit.value}
      dataSource={data.depositArr}
      onUpdateInput={(text) => {
        this.setState({
          event: update(this.state.event, {
            deposit: { $set: { value: text, text } },
          }),
        });
      }}
      onNewRequest={(o) => {
        this.setState({
          event: update(this.state.event, {
            deposit: { $set: o },
          }),
        });
      }}
      filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
      openOnFocus
      errorText={this.state.event.deposit.error}
      fullWidth
      validators={['required', 'minNumber:0', 'maxNumber:100']}
      errorMessages={[strings.validate_is_required, util.format(strings.validate_minimum, 0), util.format(strings.validate_maximum, 100)]}
    />);
    const __renderIsChargedCheckbox = () => (<Checkbox
      label={strings.event_is_charged}
      checked={this.state.event.is_charged.value || false}
      // disabled={this.state.isClosed}
      onCheck={() => {
        this.setState({
          event: update(this.state.event, {
            is_charged: {
              $set: {
                value: !this.state.event.is_charged.value,
              },
            },
          }),
        });
      }}
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
      fullWidth
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
      fullWidth
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
      fullWidth
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
      fullWidth
    />);
    const __renderNotesInput = () => (<TextField
      type="text"
      hintText={strings.tooltip_note}
      floatingLabelText={strings.tooltip_note}
      multiLine
      rows={1}
      rowsMax={4}
      value={this.state.event.notes.value}
      onChange={(event, notes) => this.setState({
        event: update(this.state.event, {
          notes: { $set: { text: notes, value: notes } },
        }),
      })}
      fullWidth
      errorText={this.state.event.notes.error}
    />);

    return (<div style={{ display: (!toggle || showForm) ? 'inline' : 'none' }}>
      <ValidatorForm
        onSubmit={this.submit}
        // onError={errors => console.log(errors)}
      >
        {loading && <Spinner />}
        {this.state.error && <Error text={this.state.error} />}

        <div>
          {!this.props.isEditing && !this.props.hotspotId && this.props.dataSourceHotspots && __renderHotspotSelector()}
          {!this.props.isEditing && !this.props.matchId && this.props.dataSourceMatches && __renderMatchSelector()}
          {!this.props.isEditing && this.state.event.match.home && __renderMatchPreview()}
          {!this.props.isEditing && !this.props.groupId && this.props.dataSourceGroups && __renderGroupSelector()}
          <Row>
            <Col flex={6}>{__renderSeatsInput()}</Col>
            <Col flex={6}>{__renderPriceInput()}</Col>
            <Col flex={6}>{__renderDepositInput()}</Col>
            <Col flex={6}>{__renderDiscountInput()}</Col>
          </Row>
          <Row>
            <Col flex={6}>{__renderIsChargedCheckbox()}</Col>
          </Row>
          <Row>
            <Col flex={3}>{__renderStartTimeRegisterPicker()}</Col>
            <Col flex={3}>{__renderEndTimeRegisterPicker()}</Col>
          </Row>
          <Row>
            <Col flex={3}>{__renderStartTimeCheckinPicker()}</Col>
            <Col flex={3}>{__renderEndTimeCheckinPicker()}</Col>
          </Row>

          {__renderNotesInput()}
        </div>
        <RaisedButton
          type="submit"
          label={strings.form_general_submit}
        />
      </ValidatorForm>

      <Dialog
        title={strings.form_create_events_dialog_desc}
        actions={<FlatButton
          label="Close"
          primary
          keyboardFocused
          onClick={() => {
            this.closeDialog();
            if (this.props.callback) {
              return this.props.callback();
            }
            return true;
            // if (toggle) {
            //   this.props.toggleShowForm(false);
            // } else {
            //   this.props.history.push('/events');
            // }
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
  // showForm: state.app.formCreateEvent.show,
  dataSourceHotspots: state.app.hotspots.data.map(o => ({
    text: `${o.name} - ${o.address}`,
    value: Number(o.id),
    textShort: o.name,
  })),
  dataSourceGroups: state.app.groups.data.map(o => ({
    text: `${o.name}`,
    value: Number(o.id),
    textShort: `${o.short_name}`,
  })),
  dataSourceMatches: state.app.matchesLeague.data.matches.map((o) => {
    const matchTime = toDateTimeString(o.date * 1000);
    return {
      text: `${Clubs[o.home.club_id] && Clubs[o.home.club_id].name} vs ${Clubs[o.away.club_id] && Clubs[o.away.club_id].name} - ${matchTime}`,
      value: o.id,
      date: o.date,
      home: o.home,
      away: o.away,
    };
  }),
});

const mapDispatchToProps = dispatch => ({
  defaultCreateFunction: params => dispatch(defaultCreateEvent(params)),
  defaultEditFunction: (eventId, params) => dispatch(defaultEditEvent(eventId, params)),
  dispatchHotspots: () => dispatch(getHotspots()),
  dispatchGroups: () => dispatch(getGroups()),
  dispatchLeagueMatches: params => dispatch(getMatchesLeague(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEventForm));
