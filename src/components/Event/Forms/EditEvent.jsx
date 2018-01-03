import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import update from 'immutability-helper';
/* actions & helpers */
import { editEvent, deleteEvent, toggleShowForm } from 'actions';
/* data */
import strings from 'lang';
import * as data from '../Event.config';
/* components */
import {
  AutoComplete,
  TextField,
  RaisedButton,
  SelectField,
  MenuItem,
  FlatButton,
  Dialog,
  List,
  ListItem,
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
import { TextValidator, SelectValidator, AutoCompleteValidator } from 'react-material-ui-form-validator';
/* css */
import styled from 'styled-components';
import { css } from 'styled-components';
import constants from 'components/constants';

const moment = require('moment');

const FormWrapper = styled.div`
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.4s;
    
    ${props => props.show && css`
        max-height: 2000px    
    `}
`;

const FormContainer = styled.div`
    padding: 15px;
    box-sizing: border-box;
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

/* export */
export const FORM_NAME_EDIT_EVENT = 'editEvent';

/* support functions */
const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm('editEvent');
  }
};


class EditEventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {
        start_time_register: {},
        end_time_register: {},
        start_time_checkin: {},
        end_time_checkin: {},
        seats: {},
        price: {},
        discount: {},
        created_user_id: {},
        created_user_type: {},
        status: {},
        notes: {},
        checkin_total: {},
        register_total: {},
        home_color: {},
        away_color: {},
        free_folk_color: {},
      },
      match: {},
      matches: [],
      openConfirm: false,
    };
    this.submitEditEvent = this.submitEditEvent.bind(this);
    this.submitDeleteEvent = this.submitDeleteEvent.bind(this);
  }

  // componentDidMount() {
  // setShowFormState(this.props);
  // }

  // componentWillUpdate(nextProps) {
  //     if (nextProps.event.id !== this.props.event.id) {
  //         setShowFormState(nextProps);
  //     }
  // }

  componentWillReceiveProps(newProps) {
    this.setState({
      event: {
        start_time_register: {
          value: newProps.event.start_time_register,
          text: moment(newProps.event.start_time_register * 1000),
        },
        end_time_register: {
          value: newProps.event.end_time_register,
          text: moment(newProps.event.end_time_register * 1000),
        },
        start_time_checkin: {
          value: newProps.event.start_time_checkin,
          text: moment(newProps.event.start_time_checkin * 1000),
        },
        end_time_checkin: {
          value: newProps.event.end_time_checkin,
          text: moment(newProps.event.end_time_checkin * 1000),
        },
        seats: { value: newProps.event.seats, text: newProps.event.seats && newProps.event.seats.toString() },
        price: { value: newProps.event.price, text: newProps.event.price && newProps.event.price.toString() },
        discount: { value: newProps.event.discount, text: newProps.event.discount && newProps.event.discount.toString() },
        created_user_id: { value: newProps.event.created_user_id },
        created_user_type: { value: newProps.event.created_user_type },
        status: { value: newProps.event.status },
        notes: { value: newProps.event.notes },
        checkin_total: { value: newProps.event.checkin_total },
        register_total: { value: newProps.event.register_total },
        home_color: { value: newProps.event.home_color },
        away_color: { value: newProps.event.away_color },
        free_folk_color: { value: newProps.event.free_folk_color },
      },
    });

    this.setState({
      match: {
        home: newProps.event.home,
        away: newProps.event.away,
      },
    });
  }

  submitDeleteEvent(e) {
    const that = this;
    that.props.deleteEvent(that.props.event.event_id).then((dispatch) => {
      if (dispatch.type.indexOf('OK') === 0) {
        that.props.history.push('/events');
      }
    });
  }

  submitEditEvent(e) {
    const that = this;

    const editedEvent = {
      start_time_register: that.state.event.start_time_register.value,
      end_time_register: that.state.event.end_time_register.value,
      start_time_checkin: that.state.event.start_time_checkin.value,
      end_time_checkin: that.state.event.end_time_checkin.value,
      seats: that.state.event.seats.value,
      price: that.state.event.price.value,
      discount: that.state.event.discount.value,
      notes: that.state.event.notes.value,
      checkin_total: that.state.event.checkin_total.value,
      register_total: that.state.event.register_total.value,
      home_color: that.state.event.home_color.value,
      away_color: that.state.event.away_color.value,
      free_folk_color: that.state.event.free_folk_color.value,
    };

    that.props.putEvent(that.props.event.event_id, editedEvent).then((dispatch) => {
      if (dispatch.type.indexOf('OK') === 0) {
        console.log('success');
        that.props.toggleShowForm(FORM_NAME_EDIT_EVENT);
      } else {
        console.log('fail');
      }
    });
  }

  onDragHomeColor(color, c) {
    this.setState({
      event: update(this.state.event, {
        home_color: { $set: { value: color.hex } },
      }),
    });
  }

  onDragAwayColor(color, c) {
    this.setState({
      event: update(this.state.event, {
        away_color: { $set: { value: color.hex } },
      }),
    });
  }

  onDragFreeFolkColor(color, c) {
    this.setState({
      event: update(this.state.event, {
        free_folk_color: { $set: { value: color.hex } },
      }),
    });
  }

    handleOpen = () => {
      this.setState({ openConfirm: true });
    };

    handleClose = () => {
      this.setState({ openConfirm: false });
    };

    render() {
      const {
        showForm,
        error,
      } = this.props;

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
            boxShadow: 0 0 0 1px rgba(0,0,0,.1);
            display: inline-block;
            cursor: pointer;
        `;

      const PopOver = styled.div`
            position: absolute;
            zIndex: 2;
        `;

      const Cover = styled.div`
            position: fixed;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
        `;


      return (
        <ValidatorForm
          ref="form"
          onSubmit={this.submitEditEvent}
          onError={errors => console.log(errors)}
        >
          <FormWrapper show={showForm}>
            {error && <Error text={error} />}
            <FormContainer>
              <ClubImageContainer>
                <ClubColorPicker>
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

                    { this.state.event.home_color.displayColorPicker ? <PopOver>
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
                      <SketchPicker color={this.state.event.home_color.value} onChange={this.onDragHomeColor.bind(this)} />
                    </PopOver> : null }
                  </div>
                </ClubColorPicker>

                <ClubColorPicker>
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

                    { this.state.event.free_folk_color.displayColorPicker ? <PopOver>
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
                      <SketchPicker color={this.state.event.free_folk_color.value} onChangeComplete={this.onDragFreeFolkColor.bind(this)} />
                    </PopOver> : null }
                  </div>
                </ClubColorPicker>

                <ClubColorPicker>
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

                    { this.state.event.away_color.displayColorPicker ? <PopOver>
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
                      <SketchPicker color={this.state.event.away_color.value} onChangeComplete={this.onDragAwayColor.bind(this)} />
                    </PopOver> : null }
                  </div>
                </ClubColorPicker>
              </ClubImageContainer>

              {/* select price */}
              <AutoCompleteValidator
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
              />

              {/* select discount */}
              <AutoCompleteValidator
                name="discount"
                type="number"
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
              />

              {/* input seats */}
              <AutoCompleteValidator
                name="seats"
                type="number"
                hintText={strings.filter_seats}
                floatingLabelText={strings.filter_seats}
                searchText={this.state.event.seats.text}
                value={this.state.event.seats.value}
                dataSource={data.seatsArr}
                onUpdateInput={(text) => {
                  this.setState({
                    event: update(this.state.event, {
                      seats: { $set: { value: text, text } },
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
                validators={['required']}
                errorMessages={['this field is required']}
              />

              {/* select start_time_register */}
              <DateTimePicker
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
              />
              {/* select end_time_register */}
              <DateTimePicker
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
              />
              {/* select start_time_check_in */}
              <DateTimePicker
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
              />
              {/* select end_time_check_in */}
              <DateTimePicker
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
              />
              {/* input notes */}
              <TextField
                type="text"
                hintText={strings.tooltip_note}
                floatingLabelText={strings.tooltip_note}
                multiLine
                rows={2}
                rowsMax={4}
                onChange={(event, notes) => this.setState({
                  event: update(this.state.event, {
                    notes: { $set: { text: notes, value: notes } },
                  }),
                })}
                fullWidth
                errorText={this.state.event.notes.error}
              />
            </FormContainer>
            <RaisedButton
              style={{ float: 'right' }}
              label={strings.form_edit_event_submit}
              primary
              onClick={event => this.submitEditEvent(event)}
            />
            <RaisedButton
              style={{ float: 'left' }}
              label={strings.form_edit_event_delete}
              secondary
              onClick={this.handleOpen}
            />
          </FormWrapper>

          <Dialog
            title={strings.form_confirm_delete}
            actions={[
              <FlatButton
                label="Cancel"
                primary
                onClick={this.handleClose}
              />,
              <FlatButton
                label="Submit"
                primary
                keyboardFocused
                onClick={(event) => {
                  this.handleClose();
                  this.submitDeleteEvent(event);
                }}
              />,
            ]}
            modal={false}
            open={this.state.openConfirm}
            onRequestClose={this.handleClose}
          >
            {strings.form_confirm_question_delete}
          </Dialog>
        </ValidatorForm>
      );
    }
}

const mapStateToProps = state => ({
  showForm: state.app.formEditEvent.show,
  currentQueryString: window.location.search,
  error: state.app.event.error,
  loading: state.app.event.loading,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: formName => dispatch(toggleShowForm(formName)),
  putEvent: (hotspotId, params) => dispatch(editEvent(hotspotId, params)),
  deleteEvent: hotspotId => dispatch(deleteEvent(hotspotId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditEventForm));
