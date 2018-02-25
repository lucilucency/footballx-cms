import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
/* actions - helpers */
import { toggleShowForm } from 'actions';
import { toDateTimeString, renderDialog } from 'utils';
import strings from 'lang';
import Clubs from 'fxconstants/build/clubsObj.json';
/* components */
import { FlatButton } from 'material-ui';
import IconFingerprint from 'material-ui/svg-icons/action/fingerprint';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconSendNotification from 'material-ui/svg-icons/alert/add-alert';

import Spinner from 'components/Spinner';
import { IconTrophy } from 'components/Icons';
import ShowFormToggle from 'components/Form/ShowFormToggle';
import GenerateQRForm from 'components/Event/Forms/GenerateQR';
/* css */
import styled from 'styled-components';
import constants from 'components/constants';
import { colors } from 'material-ui/styles';

const MatchWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const Team = styled.div`
    box-sizing: border-box;
    flex-basis: 33.33%;
    max-width: 33.33%;

    @media only screen and (max-width: 1023px) {
        flex-basis: 100%;
        max-width: 100%;
    }
    padding: 20px 0 10px;
    font-size: 28px;
    filter: drop-shadow(0 0 20px ${constants.colorYelor});

    @media only screen and (max-width: 1023px) {
        text-align: center;
        margin: 10px 0;
    }

    & svg {
        width: 32px;
        height: 32px;
        margin: 0 15px;
        vertical-align: sub;

        @media only screen and (max-width: 1023px) {
            display: block;
            margin: 0 auto;
            width: 48px;
            height: 48px;
        }
    }
`;

const Match = styled.div`
    box-sizing: border-box;
    flex-basis: 33.33%;
    max-width: 33.33%;
    display: flex;
    justify-content: center;
    text-align: center;
    
    @media only screen and (max-width: 1023px) {
        flex-basis: 100%;
        max-width: 100%;
    }
    
    .matchInfo {
      margin: 0 20px;
    
      @media only screen and (max-width: 400px) {
        margin: 0 10px;
      }
    
      & span {
        text-transform: uppercase;
        display: block;
      }
    
      & .duration {
        font-size: 28px;
    
        @media only screen and (max-width: 400px) {
          font-size: 24px;
        }
      }
    
      & .ended {
        font-size: ${constants.fontSizeSmall};
        color: ${constants.colorMutedLight};
        margin-top: 3px;
    
        & > div {
          display: inline-block;
        }
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
    padding-top: 20px;

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

// const Score = styled.div`
//     font-size: 48px;
//     text-align: center;
//
//     @media only screen and (max-width: 400px) {
//         font-size: 40px;
//     }
//     ${props => props.color && css`
//         color: ${props.color}
//     `}
// `;

const ButtonWrapper = styled.div`
    display: table;
    margin: 10px auto 0;

    & a {
        float: left;
        margin: 5px !important;
        line-height: 34px !important;
    }

    @media only screen and (max-width: 620px) {
        & a {
            min-width: 24px !important;

            & span {
                font-size: 0 !important;
                padding-left: 0 !important;
                padding-right: 12px !important;
            }
        }
    }
`;

class EventHeader extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    event: PropTypes.shape({}),
    user: PropTypes.shape({}),
    showFormEditEvent: PropTypes.bool,
    toggleShowFormEditEvent: PropTypes.func,
    showFormGenerateQR: PropTypes.bool,
    toggleShowFormGenerateQR: PropTypes.func,
    showFormSendNotification: PropTypes.bool,
    toggleShowFormSendNotification: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };

    this.openRandomForm = this.openRandomForm.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);

    this.url = 'http://streaming.tdiradio.com:8000/house.mp3';
    // this.url = '/assets/audio/XoSoMienBacNhacChuong-VA-4937390.mp3';
    this.audio = new Audio(this.url);
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentDidMount() {

  }

  togglePlay() {
    this.setState({ play: !this.state.play }, () => {
      if (this.state.play) {
        const playPromise = this.audio.play();
        if (playPromise !== null) {
          playPromise.catch(() => { this.audio.play(); });
        }
      } else {
        const playPromise = this.audio.pause();
        if (playPromise !== null) {
          playPromise.catch(() => { this.audio.pause(); });
        }
      }
    });
  }

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    // this.togglePlay();
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  openRandomForm() {
    this.togglePlay();

    this.setState({
      dialogConstruct: {
        view: <GenerateQRForm
          toggle={false}
          eventId={this.props.event.event_id}
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
      toggleShowFormGenerateQR,
      showFormSendNotification,
      toggleShowFormSendNotification,
    } = this.props;

    const userData = user.user;
    let isOwner = false;
    if (Number(userData.user_type) === Number(event.created_user_type) && Number(user.user_id) === Number(event.created_user_id)) {
      isOwner = true;
    }

    if (!loading) {
      const VictorySection = () => {
        // const score = props.home && props.home.mark - props.away.mark;
        const score = 1;

        if (score === null || score === 0) { return (<span>{strings.td_draw}</span>); } else if (score > 0) {
          return (<span>
            <IconTrophy fill={'#'} />
            {/* {strings.general_team} {Clubs[event.data.home] && Clubs[event.data.home].name} {strings.general_win} */}
          </span>);
        }
        return (<span>
          <IconTrophy fill={'#'} />
          {/* {strings.general_team} {Clubs[event.data.away] && Clubs[event.data.away].name} {strings.general_win} */}
        </span>);
      };

      return (
        <div>
          <MatchWrapper>
            <Team>
              <VictorySection />
            </Team>
            <Match>
              <div>
                <p><img src={Clubs[event.data.home] && Clubs[event.data.home].icon} alt="" width={128} height={128} /></p>
                {/* <span className={"scoreHome"} style={{color: event.data.home_color}}>{"|||||||"}</span> */}
              </div>
              <div className={'matchInfo'}>
                <span style={{ fontSize: constants.fontSizeMedium }}>
                  {event.data.end_time_checkin * 1000 < Date.now() ? strings.match_ended : strings.match_ongoing}
                </span>
                <span className={'duration'}>
                  {'90:00'}
                </span>
                <span className={'ended'}>
                  {toDateTimeString(event.data.match_date * 1000)}
                </span>
              </div>
              <div>
                <p><img src={Clubs[event.data.away] && Clubs[event.data.away].icon} alt="" width={128} height={128} /></p>
                {/* <span className={"scoreAway"} style={{color: event.data.away_color}}>{"|||||||"}</span> */}
              </div>
            </Match>
            <EventInfo>
              <ul>
                <li>
                  <span>{strings.event_heading_seats}</span>
                  {event.data.seats}
                </li>
                <li>
                  <span>{strings.event_heading_price}</span>
                  {event.data.price} {event.data.discount && <span style={{ display: 'block', color: colors.green600 }}>-{event.data.discount}%</span>}
                </li>
                <li>
                  <span>{strings.event_heading_register_total}</span>
                  <div>{event.data.register_total + event.data.checkin_total}</div>
                  {/* <div>{eventXUsers.length}</div> */}
                </li>
                <li>
                  <span>{strings.event_heading_checkin_total}</span>
                  <div>{event.data.checkin_total}</div>
                  {/* <div>{eventXUsers.filter(o => o.status === "checkin").length}</div> */}
                </li>
              </ul>
            </EventInfo>
          </MatchWrapper>
          <ButtonWrapper>
            <ShowFormToggle
              name={'generateQR'}
              show={showFormGenerateQR}
              onClick={this.openRandomForm}
              icon={<IconFingerprint />}
              text={strings.form_mini_game}
              textToggle={strings.form_mini_game_close}
            />
            {/*<ShowFormToggle*/}
              {/*name={'generateQR'}*/}
              {/*show={showFormGenerateQR}*/}
              {/*onClick={toggleShowFormGenerateQR}*/}
              {/*icon={<IconFingerprint />}*/}
              {/*text={strings.form_mini_game}*/}
              {/*textToggle={strings.form_mini_game_close}*/}
            {/*/>*/}
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
          </ButtonWrapper>

          {renderDialog(this.state.dialogConstruct, this.state.openDialog)}
        </div>
      );
    }
    return <Spinner />;
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data,
  showFormEditEvent: state.app.formEditEvent.show,
  showFormGenerateQR: state.app.formGenerateQR.show,
  showFormSendNotification: state.app.formSendNotification.show,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormEditEvent: () => dispatch(toggleShowForm('editEvent')),
  toggleShowFormGenerateQR: () => dispatch(toggleShowForm('generateQR')),
  toggleShowFormSendNotification: () => dispatch(toggleShowForm('sendNotification')),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventHeader);

