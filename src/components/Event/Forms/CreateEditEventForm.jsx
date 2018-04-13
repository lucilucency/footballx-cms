/* eslint-disable react/forbid-prop-types,max-len,no-lonely-if */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { toDateTimeString, Row, Col, bindAll, FormWrapper } from 'utils';
import { createEvent as defaultCreateEvent, editEvent as defaultEditEvent, getHotspots, getGroups, getMatchesCompact } from 'actions';
import util from 'util';
import strings from 'lang';
import * as data from 'components/Event/Event.config';
import Clubs from 'fxconstants/build/clubsObj.json';
import {
  AutoComplete,
  Dialog,
  FlatButton,
  List,
  ListItem,
  MenuItem,
} from 'material-ui';
import Checkbox from 'material-ui/Checkbox';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import CircularProgress from 'material-ui/CircularProgress';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import Error from 'components/Error';
import Spinner from 'components/Spinner';
import { SketchPicker } from 'react-color';
import { AutoCompleteValidator, TextValidator } from 'react-material-ui-form-validator';
import styled, { css } from 'styled-components';
import constants from 'components/constants';
import HotspotSelector from './HotspotSelector';

const moment = require('moment');

const initialState = props => ({
  event: {
    hotspots: props.hotspot ? [{
      label: props.hotspot.name,
      value: props.hotspot,
    }] : null,
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
    mode: PropTypes.string,
    display: PropTypes.bool,
    toggle: PropTypes.bool,
    popup: PropTypes.bool,
    loading: PropTypes.bool,
    callback: PropTypes.func,

    hotspotId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    groupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    matchId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    dataSourceGroups: PropTypes.array,
    dataSourceHotspots: PropTypes.array,
    dataSourceMatches: PropTypes.array,
    dispatchMatchDs: PropTypes.func,
    dispatchHotspotDs: PropTypes.func,
    dispatchGroupDs: PropTypes.func,
  };

  static defaultProps = {
    mode: 'create',
    display: true,
    toggle: false,
    popup: false,
    loading: false,
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
      this.props.dispatchMatchDs(params);
    }

    if (!this.props.hotspotId) this.props.dispatchHotspotDs();
    if (!this.props.groupId) this.props.dispatchGroupDs();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.mode === 'edit') {
      const __group = newProps.event.group_id ? { value: newProps.event.group_id, text: newProps.dataSourceGroups.find(o => o.value === newProps.event.group_id) && newProps.dataSourceGroups.find(o => o.value === newProps.event.group_id).text } : {};
      const __hotspots = newProps.event.hotspot_id ? [{
        label: newProps.event.hotspot_name,
        value: {
          id: newProps.event.hotspot_id,
          name: newProps.event.hotspot_name,
        },
      }] : this.state.hotspots;
      this.setState({
        event: {
          event_id: newProps.event.event_id,
          hotspots: __hotspots,
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
    } else {
      if (newProps.hotspot) {
        this.setState({
          event: update(this.state.event, {
            hotspots: {
              $set: [{
                label: newProps.hotspot.name,
                value: newProps.hotspot,
              }],
            },
          }),
        });
      }
    }
  }

  // componentWillUpdate(nextProps) {
  // if (this.props.display !== nextProps.display) {
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
      is_charged: event.is_charged.value,
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

    const submitResultData = [];
    event.hotspots.forEach((o) => {
      submitResultData.push({
        submitAction: !that.props.hotspotId ? o.label : event.match.text,
        submitting: true,
      });
    });

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: { $set: submitResultData },
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
        const eventData = this.getFormData();
        eventData.hotspot_id = o.value.id;
        return this.props.mode === 'edit' ? doEditEvent(this.state.event.event_id, eventData) : doCreateEvent(eventData, this.state.payload);
      })).then((results) => {
        const resultsReport = event.hotspots.map((o, index) => {
          if (results[index].type.indexOf('OK') === 0) {
            return {
              submitAction: !that.props.hotspotId ? o.label : event.match.text,
              submitting: false,
            };
          }
          return {
            submitAction: !that.props.hotspotId ? o.label : event.match.text,
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
    const props = this.props;
    const {
      display,
      toggle,
      popup,
      loading,
      mode,
    } = this.props;

    const MatchWrapper = styled.div`
      position: relative;
      display: flex;
      justify-content: space-around;
      flex-direction: row;
    `;
    const ClubWrapper = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      
      img {
        box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
        background-color: rgba(255,255,255,0.1);
        width: 100px;
        height: 100px;
      }
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

    const __renderGroupSelector = () => (<div style={{ marginBottom: 20 }}>
      <AutoCompleteValidator
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
      />
    </div>);
    const __renderMatchSelector = () => (<AutoCompleteValidator
      name="match"
      hintText={strings.filter_match}
      floatingLabelText={strings.filter_match}
      // searchText={this.state.event.match && this.state.event.match.text}
      value={this.state.event.match.value}
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
      <MatchWrapper>
        <ClubWrapper>
          <img
            src={Clubs[this.state.event.match.home.club_id] && Clubs[this.state.event.match.home.club_id].icon}
            alt=""
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
        </ClubWrapper>

        <ClubWrapper>
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
        </ClubWrapper>

        <ClubWrapper>
          <img
            src={Clubs[this.state.event.match.away.club_id] && Clubs[this.state.event.match.away.club_id].icon}
            alt=""
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
        </ClubWrapper>
      </MatchWrapper>
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
      validators={['minNumber:0', 'maxNumber:100']}
      errorMessages={[util.format(strings.validate_minimum, 0), util.format(strings.validate_maximum, 100)]}
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
    const __renderNotesInput = () => (<TextValidator
      type="text"
      name="notes"
      hintText={strings.tooltip_note}
      floatingLabelText={strings.tooltip_note}
      multiLine
      rows={1}
      rowsMax={4}
      value={this.state.event.notes.value}
      onChange={(event, value) => this.setState({
        event: update(this.state.event, {
          notes: { $set: { text: value, value } },
        }),
      })}
      fullWidth
      validators={[]}
      errorMessages={[]}
    />);

    const actions = [
      null && <FlatButton
        type="reset"
        key="reset"
        label="Reset"
        secondary
        style={{ float: 'left' }}
      />,
      <FlatButton
        label={strings.form_general_close}
        key="cancel"
        primary
        onClick={() => (this.props.callback ? this.props.callback() : props.history.push('/events'))}
      />,
      <FlatButton
        key="submit"
        type="submit"
        label={strings.form_general_submit}
        primary
      />,
    ];

    return (<FormWrapper
      data-display={display}
      data-toggle={toggle}
      data-popup={popup}
      onSubmit={this.submit}
      // onError={errors => console.log(errors)}
    >
      {loading && <Spinner />}
      {this.state.error && <Error text={this.state.error} />}

      <div>
        {!(mode === 'edit') && !this.props.hotspotId && this.props.dataSourceHotspots && <HotspotSelector
          onSelect={(values) => {
            this.setState({
              event: update(this.state.event, {
                hotspots: {
                  $set: values,
                },
              }),
            });
          }}
        />}
        {!(mode === 'edit') && !this.props.matchId && this.props.dataSourceMatches && __renderMatchSelector()}
        {!(mode === 'edit') && this.state.event.match.home && __renderMatchPreview()}
        {!(mode === 'edit') && !this.props.groupId && this.props.dataSourceGroups && __renderGroupSelector()}
        <Row>
          <Col flex={6}>{__renderIsChargedCheckbox()}</Col>
        </Row>
        {this.state.event.is_charged.value && <Row>
          <Col flex={6}>{__renderSeatsInput()}</Col>
          <Col flex={6}>{__renderPriceInput()}</Col>
        </Row>}
        {this.state.event.is_charged.value && <Row>
          <Col flex={6}>{__renderDepositInput()}</Col>
          <Col flex={6}>{__renderDiscountInput()}</Col>
        </Row>}
        <Row>
          <Col flex={3}>{__renderStartTimeRegisterPicker()}</Col>
          <Col flex={3}>{__renderEndTimeRegisterPicker()}</Col>
        </Row>
        <Row>
          <Col flex={3}>{__renderStartTimeCheckinPicker()}</Col>
          <Col flex={3}>{__renderEndTimeCheckinPicker()}</Col>
        </Row>
        <Row>
          {__renderNotesInput()}
        </Row>

        {null && [__renderIsChargedCheckbox(),
          __renderSeatsInput(),
          __renderPriceInput(),
          __renderDepositInput(),
          __renderDiscountInput(),
          __renderNotesInput(),
          __renderStartTimeRegisterPicker(),
          __renderEndTimeCheckinPicker(),
          __renderStartTimeCheckinPicker(),
          __renderEndTimeCheckinPicker(),
        ]}
      </div>

      <div className="actions">
        {actions}
      </div>

      <Dialog
        title={strings.form_create_events_dialog_desc}
        actions={[<FlatButton
          label="Retry"
          secondary
          keyboardFocused
          onClick={() => {
            this.closeDialog();
          }}
        />, <FlatButton
          label="Done"
          primary
          keyboardFocused
          onClick={() => {
            this.closeDialog();
            return this.props.callback ?
              this.props.callback() : mode === 'edit' ?
                props.history.push(`/hotspot/${this.state.formData.event_id.value}`) : props.history.push('/events');
          }}
        />]}
        modal={false}
        open={this.state.submitResults.show}
        onRequestClose={this.closeDialog}
        autoScrollBodyContent
      >
        <List>
          {this.state.submitResults.data.map(r => (<ListItem
            key={r.submitAction}
            primaryText={r.submitAction}
            leftIcon={r.submitting ? <CircularProgress size={24} /> : r.error ?
              <IconFail color={constants.colorRed} title={strings.form_general_fail} />
              : <IconSuccess
                color={constants.colorSuccess}
                title={strings.form_general_success}
              />}
            secondaryText={r.error && r.error}
            secondaryTextLines={1}
          />))}
        </List>
      </Dialog>
    </FormWrapper>);
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  // display: state.app.formCreateEvent.show,
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
  dataSourceMatches: state.app.matchesCompact.data.matches.map((o) => {
    const matchTime = toDateTimeString(o.date * 1000);
    return {
      text: `${Clubs[o.home.club_id] && Clubs[o.home.club_id].name} vs ${Clubs[o.away.club_id] && Clubs[o.away.club_id].name} - ${matchTime}`,
      value: o.id,
      date: o.date,
      home: o.home,
      away: o.away,
    };
  }),
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  defaultCreateFunction: params => dispatch(defaultCreateEvent(params)),
  defaultEditFunction: (eventId, params) => dispatch(defaultEditEvent(eventId, params)),
  dispatchHotspotDs: () => dispatch(getHotspots()),
  dispatchGroupDs: () => dispatch(getGroups()),
  dispatchMatchDs: params => dispatch(getMatchesCompact(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEventForm));
