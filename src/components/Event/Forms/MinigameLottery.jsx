import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
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
  height: 75vh;
  
  ${props => ((!props.toggle || props.show) ? css`
      display: flex;
      flex-direction: column;
  ` : css`
      display: none;
  `)}
`;

const GuestName = styled.span`
  position: absolute;
  bottom: 50%;
  left: calc(50% - 100px);
  width: 200px;
  text-align: center;
  font-size: 2em;
  filter: drop-shadow(0 0 5px red);
`;

const H2 = styled.h1`
  text-align: center;
  margin-bottom: 0;
  
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
  
  & i {
    position: absolute;
    font-size: 2em;
    margin-top: -0.85em;
    margin-left: -0.1em;
    color: rgb(245, 245, 245);
  }
`;

const initialState = {
  prevWinner: null,
  nextWinner: null,
  duration: 3700,
  step: 200,
  margin: 50,
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
      winners: [],
      blackList: [],
      tries: 10,
      ...initialState,
      isFlipping: false,
      play: false,
    };

    this.doRandomXUser = this.doRandomXUser.bind(this);
    this.newGame = this.newGame.bind(this);

    this.url = '/assets/audio/Drum Roll - Gaming Sound Effect (HD).mp3';
    this.audio = new Audio(this.url);
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentDidMount() {
    setShowFormState(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.eventId !== nextProps.eventId) {
      this.clearState();
    }
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

  clearState() {
    this.setState(initialState);
  }

  newGame() {
    this.setState({
      blackList: this.state.winners,
      winners: [],
      ...initialState,
    });
  }

  doRandomXUser() {
    const that = this;
    const winnerIds = this.state.winners.length ? this.state.winners.filter(o => o).map(o => o.id) : [];
    const blackListIds = this.state.blackList.length ? this.state.blackList.filter(o => o).map(o => o.id) : [];
    const dataSource = that.props.xusers.filter(o => winnerIds.indexOf(o.id) === -1 && blackListIds.indexOf(o.id) === -1);

    const addingNumber = Number(localStorage.getItem('guest_number')) || 500;
    for (let i = 1; i < addingNumber; i++) {
      const tmp = {
        id: i + 10000,
        is_guest: true,
        nickname: `MUSVN-${(`000${i}`).slice(-3)}`,
        avatar: '/assets/images/mu_frame.png',
      };
      if (winnerIds.indexOf(tmp.id) === -1 && blackListIds.indexOf(tmp.id) === -1) {
        dataSource.push(tmp);
      }
    }

    if (dataSource.length && that.state.tries > 0) {
      this.setState({ ...initialState, isFlipping: true }, () => {
        this.togglePlay();

        const bound = dataSource.length;
        const duration = that.state.duration;
        const started = new Date().getTime();
        const timerRandom = () => {
          setTimeout(() => {
            const onGameTime = new Date().getTime() - started;
            if (onGameTime < duration) {
              const winner = dataSource[Math.floor(Math.random() * bound)];
              const nextState = {
                isFlipped: !that.state.isFlipped,
                // step: onGameTime < 0.9 * duration ? Math.max(that.state.step - that.state.margin, 100) : Math.max(that.state.step + (that.state.margin * 2), 100),
                step: Math.max(that.state.step - that.state.margin, 100),
              };
              if (that.state.isFlipped) {
                nextState.nextWinner = winner;
              } else {
                nextState.prevWinner = winner;
              }
              that.setState(nextState, timerRandom());
            } else {
              this.setState({ isFlipped: !this.state.isFlipped }, setTimeout(() => {
                that.setState({ isFlipping: false }, () => {
                  this.togglePlay();

                  // const winners = Object.assign([], this.state.winners);
                  // console.log(winners);
                  // console.log('11111111');

                  if (this.state.winners.map(o => o.id).indexOf(this.state.nextWinner.id) === -1 && blackListIds.indexOf(this.state.nextWinner.id) === -1) {
                    setTimeout(() => {
                      // winners.push(this.state.nextWinner);
                      this.setState({
                        winners: update(this.state.winners, {
                          $push: [this.state.nextWinner],
                        }),
                        tries: that.state.tries - 1,
                      });
                    }, 1200);
                  }
                });
              }, 1200));
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
              <img src={prevWinner && prevWinner.avatar} alt="" width={largeSize} height={largeSize} />
              {prevWinner && prevWinner.is_guest && <GuestName>{prevWinner.nickname}</GuestName>}
            </div>
            <div key="front">
              <img src={nextWinner && nextWinner.avatar} alt="" width={largeSize} height={largeSize} />
              {nextWinner && nextWinner.is_guest && <GuestName>{nextWinner.nickname}</GuestName>}
            </div>
          </ReactCardFlip>
        </div>

        <div>
          {nextWinner && <H2 show={!this.state.isFlipping}>
            {!nextWinner.is_guest && <a href={`https://www.facebook.com/${nextWinner.facebook_id}`} target="_blank">{nextWinner.nickname}</a>}
          </H2>}
        </div>

        <Row>
          <div style={{ margin: 'auto' }}>
            {!this.state.isFlipping && <RaisedButton
              style={{ margin: 'auto', marginBottom: 20, marginTop: 20, marginRight: 20 }}
              label={strings.form_mini_game_lucky_guy}
              primary
              onClick={event => this.doRandomXUser(event)}
              disabled={Boolean(this.state.tries <= 0)}
            />}
            {!this.state.isFlipping && <RaisedButton
              style={{ margin: 'auto', marginBottom: 20, marginTop: 20 }}
              label={'New Game'}
              primary
              onClick={event => this.newGame(event)}
              disabled={Boolean(this.state.tries <= 0)}
            />}
          </div>
        </Row>

        <ListWinner>
          {this.state.winners.filter(o => o).map((o, index) => (
            <Winner flex={1} >
              <div style={{ textAlign: 'center', margin: 10 }}>
                {browser.greaterThan.medium && <h5 style={{ textAlign: 'center' }}>{o.nickname}</h5>}
                <i>{index + 1}</i>
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
