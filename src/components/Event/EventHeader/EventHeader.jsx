import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
/* actions - helpers */
import { toggleShowForm } from 'actions';
import { renderDialog, bindAll } from 'utils';
import strings from 'lang';
import Groups from 'fxconstants/build/groupsObj.json';
/* components */
import { FlatButton } from 'material-ui';
// import IconFingerprint from 'material-ui/svg-icons/action/fingerprint';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconSendNotification from 'material-ui/svg-icons/alert/add-alert';
import IconCheckin from 'material-ui/svg-icons/maps/beenhere';
import IconMinigameLottery from 'material-ui/svg-icons/editor/insert-emoticon';
import IconMinigameScanQR from 'material-ui/svg-icons/action/card-giftcard';
import Spinner from 'components/Spinner';
import ShowFormToggle from 'components/Form/ShowFormToggle';
import GenerateQRForm from 'components/Event/Forms/MinigameLottery';
import CheckinQRView from 'components/Event/Forms/CheckinQR';
import MinigameScanQRView from 'components/Event/Forms/MinigameScanQR';
import Match from 'components/Visualizations/Match/EventView';
import styled from 'styled-components';
import constants from 'components/constants';
import { colors } from 'material-ui/styles';

const MatchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  
  @media only screen and (max-width: 1023px) {
    //flex-direction: column-reverse;
  }
`;

const HostedGroup = styled.div`
  text-align: center;
  box-sizing: border-box;
  flex-basis: 33.33%;
  max-width: 33.33%;

  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  //padding: 20px 0 10px;
  font-size: 28px;
  filter: drop-shadow(0 0 20px ${constants.colorYelor});

  @media only screen and (max-width: 1023px) {
      text-align: center;
      margin: 10px 0;
  }
  
  & small {
    font-size: 0.3em;
  }

  & img {
    width: 64px;
    height: 64px;
    margin: 2px 15px;
    vertical-align: sub;

    @media only screen and (max-width: 1023px) {
      //display: block;
      display: none;
      margin: 5px auto;
      width: 48px;
      height: 48px;
    }
  }
`;

const EventInfo = styled.div`
  box-sizing: border-box;
  flex-basis: 33.33%;
  max-width: 33.33%;

  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  text-align: right;
  //padding-top: 20px;

  @media only screen and (max-width: 1023px) {
    text-align: center;
    & span {
        margin-bottom: 5px;
    }
  }

  & ul {
    padding: 0;
    margin: 0;

    & li {
      display: inline-grid;
      margin-left: 20px;

      & > span {
        display: block;
        text-transform: uppercase;
        font-size: ${constants.fontSizeSmall};
        color: ${constants.colorMutedLight};
      }
    }

    & li:first-child {
      margin-left: 0;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  font-size: 14px;
  justify-content: center;
  
  @media only screen and (max-width: 660px) {
    justify-content: center;

    & a {
      min-width: 50px !important;
    }

    & button {
      min-width: 50px !important;
    }

    & * {
      font-size: 0 !important;
      padding: 0 !important;
      margin: auto !important;
    }

    & span {
      margin: 0 !important;
    }
  }
`;

class EventHeader extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    event: PropTypes.shape({
      data: PropTypes.shape({
        event_id: PropTypes.number,
      }),
    }),
    user: PropTypes.shape({}),
    showFormEditEvent: PropTypes.bool,
    toggleShowFormEditEvent: PropTypes.func,
    showFormGenerateQR: PropTypes.bool,
    showFormSendNotification: PropTypes.bool,
    toggleShowFormSendNotification: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };

    bindAll([
      'openCheckinQRView',
      'openMinigameLottery',
      'openMinigameScanView',
      'handleOpenDialog',
      'handleCloseDialog',
    ], this);
  }

  componentDidMount() {

  }

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    // this.togglePlay();
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  openMinigameLottery() {
    this.setState({
      dialogConstruct: {
        view: <GenerateQRForm
          toggle={false}
          eventId={this.props.event.data.event_id}
        />,
        onRequestClose: this.handleCloseDialog,
        modal: true,
        contentStyle: {
          width: '100%',
          maxWidth: 'none',
          overflow: 'hidden',
        },
        actions: [
          <FlatButton
            label="OK"
            primary
            keyboardFocused
            onClick={this.handleCloseDialog}
          />,
        ],
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  openCheckinQRView() {
    this.setState({
      dialogConstruct: {
        view: <CheckinQRView
          toggle={false}
          eventId={this.props.event.data.event_id}
        />,
        onRequestClose: this.handleCloseDialog,
        modal: true,
        contentStyle: {
          width: '100%',
          maxWidth: 'none',
          overflow: 'hidden',
        },
        actions: [
          <FlatButton
            label="OK"
            primary
            keyboardFocused
            onClick={this.handleCloseDialog}
          />,
        ],
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  openMinigameScanView() {
    this.setState({
      dialogConstruct: {
        view: <MinigameScanQRView
          toggle={false}
          eventId={this.props.event.data.event_id}
        />,
        onRequestClose: this.handleCloseDialog,
        modal: true,
        contentStyle: {
          width: '100%',
          maxWidth: 'none',
          overflow: 'hidden',
        },
        actions: [
          <FlatButton
            label="OK"
            primary
            keyboardFocused
            onClick={this.handleCloseDialog}
          />,
        ],
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  render() {
    const {
      loading = false,
      event,
      user,
      showFormEditEvent,
      toggleShowFormEditEvent,
      showFormGenerateQR,
      showFormSendNotification,
      toggleShowFormSendNotification,
    } = this.props;

    const eventData = event.data;
    const userData = user.user;

    let isOwner = false;
    if (Number(userData.user_type) === Number(event.created_user_type) && Number(user.user_id) === Number(event.created_user_id)) {
      isOwner = true;
    }

    if (!loading) {
      return (
        <div>
          <MatchWrapper>
            <HostedGroup>
              {eventData.group_id && <div>
                <div>
                  <small>HOSTED BY</small>
                  <span> {Groups[eventData.group_id] && Groups[eventData.group_id].short_name} </span>
                </div>
                <div>
                  <img src={Groups[eventData.group_id] && Groups[eventData.group_id].icon} alt="" />
                </div>
                {eventData.is_only_disc_gmem && <small>
                  {`Only discount for Members of ${Groups[eventData.group_id] && Groups[eventData.group_id].short_name}!`}
                </small>}
              </div>}
            </HostedGroup>
            <Match
              home={Number(eventData.home)}
              away={Number(eventData.away)}
              date={Number(eventData.match_date)}
            />
            <EventInfo>
              <ul>
                <li>
                  <span>{strings.event_heading_seats}</span>
                  {eventData.seats}
                </li>
                <li>
                  <span>{strings.event_heading_price}</span>
                  {eventData.price} {eventData.discount && <span style={{ display: 'block', color: colors.green600 }}>-{eventData.discount}%</span>}
                </li>
                <li>
                  <span>{strings.event_heading_deposit}</span>
                  {`${eventData.deposit}%`}
                </li>
                {false && <div>
                  <li>
                    <span>{strings.event_heading_register_total}</span>
                    <div>{eventData.register_total + eventData.checkin_total}</div>
                    {/* <div>{eventXUsers.length}</div> */}
                  </li>
                  <li>
                    <span>{strings.event_heading_checkin_total}</span>
                    <div>{eventData.checkin_total}</div>
                    {/* <div>{eventXUsers.filter(o => o.status === "checkin").length}</div> */}
                  </li>
                </div>}
              </ul>
            </EventInfo>
          </MatchWrapper>
          <ButtonContainer>
            <FlatButton
              onClick={this.openCheckinQRView}
              icon={<IconCheckin />}
              label={strings.event_checkin}
            />
            <FlatButton
              onClick={this.openMinigameScanView}
              icon={<IconMinigameScanQR />}
              label={strings.form_mini_game_scan_qr}
            />
            <ShowFormToggle
              name={'generateQR'}
              show={showFormGenerateQR}
              onClick={this.openMinigameLottery}
              icon={<IconMinigameLottery />}
              text={strings.form_mini_game}
              textToggle={strings.form_mini_game_close}
            />
            {user && (userData.user_type === 1 || isOwner) &&
            <ShowFormToggle
              name={'editEvent'}
              show={showFormEditEvent}
              onClick={toggleShowFormEditEvent}
              icon={<IconEdit />}
              text={strings.form_edit_event_open}
              textToggle={strings.form_edit_event_cancel}
            />}
            {user && userData.user_type === 1 && <ShowFormToggle
              name={'sendNotification'}
              show={showFormSendNotification}
              onClick={toggleShowFormSendNotification}
              icon={<IconSendNotification />}
              text={strings.form_send_notification}
              textToggle={strings.form_send_notification_close}
            />}
          </ButtonContainer>

          {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
        </div>
      );
    }
    return <Spinner />;
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data,
  showFormEditEvent: state.app.formEditEvent.show,
  showFormSendNotification: state.app.formSendNotification.show,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormEditEvent: () => dispatch(toggleShowForm('editEvent')),
  toggleShowFormSendNotification: () => dispatch(toggleShowForm('sendNotification')),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventHeader);

