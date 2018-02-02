import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions - helpers */
import { toggleShowForm } from 'actions/dispatchForm';
import util from 'util';
import update from 'react-addons-update';
/* components */
import { RaisedButton, FlatButton, Dialog, List, ListItem } from 'material-ui';
import { TextValidator } from 'react-material-ui-form-validator';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import FormField from 'components/Form/FormField';
import { ValidatorForm } from 'react-form-validator-core';
/* data */
import strings from 'lang';
import { topics } from 'components/topics';
import Clubs from 'fxconstants/build/clubsObj.json';
import { sendNotificationTopic } from 'actions';
/* css */
import styled, { css } from 'styled-components';
import constants from '../../constants';

/* export */
export const FORM_NAME_SEND_NOTIFICATION = 'sendNotification';

/* support functions */
const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm();
  }
};

const FormGroup = styled.div`
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const FormGroupWrapper = styled.div`
    text-align: center;
    overflow: hidden;
    transition: max-height 0.2s;
    ${props => (props.show ? css`
        max-height: 1000px;
    ` : css`
        max-height: 0px;
    `)}
`;

const FormFieldStyled = styled(FormField)`
    width: 100%;
`;

class EventSendNotification extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    eventXUsers: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    event: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    toggleShowForm: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      userSegment: [],
      topics: [],
      message: '',
      submitResults: {
        data: [],
        show: false,
      },
    };

    this.sendNotification = this.sendNotification.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    setShowFormState(this.props);
  }

  closeDialog() {
    const that = this;

    that.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: false },
      }),
    });
  }

  handleBlur(event) {
    this[event.target.name] && this[event.target.name].validate(event.target.value);
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

  render() {
    const {
      showForm,
      eventXUsers,
      event,
    } = this.props;
    const topicsDataSource = [{
      text: util.format(topics.event_x_register.description, event.event_id),
      value: util.format(topics.event_x_register.code, event.event_id),
    }, {
      text: util.format(topics.event_x_checkin.description, event.event_id),
      value: util.format(topics.event_x_checkin.code, event.event_id),
    }, {
      text: util.format(topics.club_x.description, Clubs[event.home] && Clubs[event.home].name),
      value: util.format(topics.club_x.code, event.home),
    }, {
      text: util.format(topics.club_x.description, Clubs[event.away] && Clubs[event.away].name),
      value: util.format(topics.club_x.code, event.away),
    }];
    return (
      <ValidatorForm
        onSubmit={this.sendNotification}
        onError={errors => console.log(errors)}
      >

        <FormGroupWrapper show={showForm}>
          <FormGroup>
            <FormFieldStyled
              name="xuser"
              label={strings.filter_notification_user}
              dataSource={eventXUsers.map(peer => ({ text: `${peer.nickname}`, value: peer.id }))}
              fullWidth
              onChange={(returnData) => {
                this.setState({
                  userSegment: returnData.selectedElements,
                });
              }}
              listStyle={{ maxHeight: 300, overflow: 'auto' }}
            />
            <FormFieldStyled
              name="topic"
              label={strings.filter_notification_topic}
              dataSource={topicsDataSource}
              fullWidth
              onChange={(returnData) => {
                this.setState({
                  topics: returnData.selectedElements,
                });
              }}
            />
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
        </FormGroupWrapper>
        <Dialog
          title={strings.form_send_notification}
          actions={<FlatButton
            label="Ok"
            primary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
              this.props.toggleShowForm();
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
  showForm: state.app.formSendNotification.show,
  currentQueryString: window.location.search,
  eventXUsers: state.app.eventXUsers.data,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm(FORM_NAME_SEND_NOTIFICATION)),
  sendNotificationTopic: params => dispatch(sendNotificationTopic(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EventSendNotification));
