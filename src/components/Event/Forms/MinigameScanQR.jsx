import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions - helpers */
import { toggleShowForm } from 'actions/dispatchForm';
import { Col } from 'utils';
/* components */
import QRCode from 'qrcode.react';
/* css */
import styled, { css } from 'styled-components';

const FORM_NAME = 'generateQR';

/* support functions */
const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm(FORM_NAME);
  }
};

const FormGroup = styled.div`
  background-color: whitesmoke;
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
    transition: all 3s ease-in-out 1s;
` : css`
    opacity: 0;
    transform: scale(10);
    transition: all 3s ease-in-out 2s;
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
  winners: [],
  prevWinner: null,
  nextWinner: null,
  duration: 5000,
  step: 300,
  margin: 50,
  isFlipped: false,
};

class MinigameScanQR extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    toggle: PropTypes.bool,
    eventId: PropTypes.number,
    browser: PropTypes.shape({}),
  };
  constructor(props) {
    super(props);
    this.state = {
      tries: 10,
      ...initialState,
      isFlipping: false,
      play: false,
    };
  }

  componentDidMount() {
    setShowFormState(this.props);
    // FIREBASE_MESSAGING.onMessage((payload) => {
    //   console.log('Message received. ', payload);
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

    return (
      <FormGroup toggle={toggle} showForm={showForm}>
        <div>
          <H2 show>
            <a target="_blank">Scan and claim gift card rewards!</a>
          </H2>
        </div>
        <div style={{ margin: 'auto' }}>
          <QRCode
            size={largeSize}
            value={JSON.stringify({
              object: 'scan-minigame',
              data: {
                event_id: this.props.eventId,
              },
            })}
          />
        </div>
        <ListWinner>
          {this.state.winners.filter(o => o).map(o => (
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
  xusers: state.app.eventXUsers.data.filter(o => o.event_status === 'checkin'),
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: formName => dispatch(toggleShowForm(formName)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MinigameScanQR));
