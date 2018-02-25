import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions - helpers */
import { toggleShowForm } from 'actions/dispatchForm';
import strings from 'lang';
import { Row, Col } from 'utils';
/* components */
import { RaisedButton } from 'material-ui';
import ReactCardFlip from 'react-card-flip';
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
  padding: 0 15px;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  transition: max-height 0.4s;
  height: 100vh;
  
  ${props => ((!props.toggle || props.show) ? css`
      display: flex;
      flex-direction: column;
  ` : css`
      display: none;
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
  winner: null,
  prevWinner: null,
  nextWinner: null,
  duration: 4000,
  step: 300,
  margin: 60,
  isFlipped: false,
};

class GenerateQR extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    callback: PropTypes.func,
    toggle: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      tries: 10,
      ...initialState,
      isFlipping: false,
    };
    this.doRandomXUser = this.doRandomXUser.bind(this);
  }

  componentDidMount() {
    setShowFormState(this.props);
  }

  doRandomXUser() {
    const that = this;

    if (that.props.xusers.length && that.state.tries > 0) {
      this.setState({ ...initialState, isFlipping: true, tries: that.state.tries - 1 }, () => {
        const bound = that.props.xusers.length;
        const duration = that.state.duration;
        const started = new Date().getTime();
        const timerRandom = () => {
          setTimeout(() => {
            const onGameTime = new Date().getTime() - started;
            if (onGameTime < duration) {
              const winner = that.props.xusers[Math.floor(Math.random() * bound)];
              const nextState = {
                isFlipped: !that.state.isFlipped,
                step: onGameTime < 0.9 * duration ? Math.max(that.state.step - that.state.margin, 100) : Math.max(that.state.step + (that.state.margin * 2), 100),
              };
              if (that.state.isFlipped) {
                nextState.nextWinner = winner;
              } else {
                nextState.prevWinner = winner;
              }
              that.setState(nextState, timerRandom());
            } else {
              const winners = this.state.winners;
              winners.push(this.state.nextWinner);
              that.setState({ isFlipping: false });
            }
          }, that.state.step);
        };

        that.setState({ isFlipped: true });
        const winner = that.props.xusers[Math.floor(Math.random() * bound)];
        that.setState({ prevWinner: winner }, timerRandom());
      });
    }
  }

  render() {
    const {
      toggle = true,
      showForm,
      browser,
    } = this.props;

    const largeSize = browser.height / 3;
    const smallSize = ((browser.width - 80) / 10) - 20;

    let { step } = this.state;
    step /= 500;

    // let winner = xusers.find(o => o.id === this.state.winner);
    const { prevWinner, nextWinner } = this.state;

    return (
      <FormGroup toggle={toggle} showForm={showForm}>
        <div style={{ height: largeSize, marginTop: 20 }}>
          <ReactCardFlip
            flipSpeedBackToFront={step}
            flipSpeedFrontToBack={step}
            isFlipped={this.state.isFlipped}
            infinite
          >
            <div key="back">
              <img src={nextWinner && nextWinner.avatar} alt="" width={largeSize} height={largeSize} />
            </div>
            <div key="front">
              <img src={prevWinner && prevWinner.avatar} alt="" width={largeSize} height={largeSize} />
            </div>
          </ReactCardFlip>
        </div>

        <div>
          {/* {winner && <QRCode size={512} value={winner.toString()}/>} */}
          {nextWinner && !this.state.isFlipping && <h1 style={{ textAlign: 'center' }}>
            <a href={`https://www.facebook.com/${nextWinner.facebook_id}`} target="_blank">{nextWinner.nickname}</a>
          </h1>}
        </div>

        <Row>
          {!this.state.isFlipping && <RaisedButton
            style={{ margin: 'auto', marginBottom: 20, marginTop: 20 }}
            label={strings.form_mini_game_lucky_guy}
            primary
            onClick={event => this.doRandomXUser(event)}
            disabled={Boolean(this.state.tries <= 0)}
          />}
        </Row>

        <ListWinner>
          {this.state.winners.map(o => (
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GenerateQR));
