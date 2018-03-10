import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions - helpers */
import { toggleShowForm } from 'actions/dispatchForm';
import { Row, Col } from 'utils';
/* components */
import QRCode from 'qrcode.react'
// import { FIREBASE_MESSAGING } from 'firebaseNotification';
/* css */
import styled, { css } from 'styled-components';


// const socket = require('socket.io-client')('http://dev.ttab.me:51170/');


const FORM_NAME = 'generateQR';

/* support functions */
const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm(FORM_NAME);
  }
};

const FormGroup = styled.div`
  //background-color: whitesmoke;
  padding: 0 15px;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  transition: max-height 0.4s;
  height: 75vh;
  
  ${props => ((!props.toggle || props.show) ? css`
      display: flex;
      flex-direction: column;
  ` : css`
      display: none;
  `)}
`;

const H2 = styled.h1`
  text-align: center;
  
  ${props => (props.show ? css`
    opacity: 1;
    transform: scale(1);
    transition: all 0.3s ease-in-out 0.1s;
` : css`
    opacity: 0;
    transform: scale(10);
    transition: all 0.3s ease-in-out 0.2s;
`)}
`;

const ListWinner = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 50px;
  height: 180px;
  justify-content: flex-start;
`;

const Winner = styled(Col)`
  text-align: center;
  display: flex;
  flex-direction: column-reverse;
`;

const initialState = {
  newUsers: [],
  newUser: null,
};

class CheckinQR extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    callback: PropTypes.func,
    toggle: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };

  }

  componentDidMount() {
    setShowFormState(this.props);

    // FIREBASE_MESSAGING.onMessage((payload) => {
    //   const payloadData = payload.data;
    //   console.log('Message received. ', payloadData);
    //   this.setState({
    //     newUser: {
    //       facebook_id: payloadData['gcm.notification.facebook_id'],
    //       nickname: payloadData['gcm.notification.nickname'],
    //       xuser_id: payloadData['gcm.notification.xuser_id'],
    //     },
    //   });
    // });
  }

  componentWillUpdate(nextProps) {
    if (this.props.eventId !== nextProps.eventId) {
      this.clearState();
    }
  }

  clearState() {
    this.setState(initialState);
  }

  render() {
    const {
      toggle = true,
      showForm,
      browser,
    } = this.props;

    const largeSize = browser.height / 3;
    const smallSize = ((browser.width - 80) / 10) - 20;

    // const { newXUser } = this.props;
    const newXUser = {
      "avatar": "https://graph.facebook.com/584041131957299/picture?type=large",
      "birthday": "10/12/1991",
      "email": "khucanhminhluong@gmail.com",
      "facebook_id": "584041131957299",
      "fullname": "",
      "gender": "male",
      "id": 2161,
      "instagram_id": "",
      "is_chat_available": true,
      "nickname": "Gnoul Cuhk",
      "phone": "",
      "subscription": 0
    };

    console.log(JSON.stringify({
      object: 'event',
      data: {
        event_id: this.props.eventId,
        notification: '1234556',
      },
    }));

    return (
      <FormGroup toggle={toggle} showForm={showForm}>
        <Row>
          <Col flex={3} style={{ textAlign: 'center' }}>
            <H2 show>
              <a target="_blank">Scan me to checkin!</a>
            </H2>
            <div
              style={{ margin: 'auto' }}
            >
              <QRCode
                size={largeSize}
                value={JSON.stringify({
                  object: 'event',
                  data: {
                    event_id: this.props.eventId,
                    notification: null,
                  },
                })}
              />
            </div>
          </Col>
          <Col flex={3} style={{ textAlign: 'center' }}>
            <div>
              <div>
                {newXUser && newXUser.avatar && <img src={newXUser.avatar} alt="" width={largeSize} height={largeSize} />}
              </div>
              <div>
                {newXUser && <h2>
                  <a href={`https://www.facebook.com/${newXUser.facebook_id}`} target="_blank">{newXUser.nickname}</a>
                </h2>}
                <h2>{JSON.stringify(newXUser)}</h2>
              </div>
            </div>
          </Col>
        </Row>

        <ListWinner>
          {this.state.newUsers.filter(o => o).map(o => (
            <Winner flex={1} >
              <div style={{ textAlign: 'center', margin: 10 }}>
                {browser.greaterThan.medium && <h4 style={{ textAlign: 'center' }}>{o.nickname}</h4>}
                <img src={o.avatar} alt="" width={smallSize} height={smallSize} />
              </div>
            </Winner>
          ))}
        </ListWinner>
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  showForm: state.app.formGenerateQR.show,
  currentQueryString: window.location.search,
  loading: state.app.event.loading,
  newXUser: state.app.eventXUser.data,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: formName => dispatch(toggleShowForm(formName)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CheckinQR));
