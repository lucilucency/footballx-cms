import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions - helpers */
import { toggleShowForm } from 'actions/dispatchForm';
/* components */
import { RaisedButton } from 'material-ui';
/* data */
import strings from 'lang';
/* css */
import {} from 'components/palette.css';
import styled, { css } from 'styled-components';
/* export */
export const FORM_NAME_GENERATE_QR = 'generateQR';

/* support functions */
const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm(FORM_NAME_GENERATE_QR);
  }
};

const FormGroup = styled.div`
  padding: 0 15px;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  transition: max-height 0.4s;
  
  ${props => (props.show ? css`
      max-height: 1000px;
  ` : css`
      max-height: 0;
  `)}
`;

class GenerateQR extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      back: null,
      front: null,
      isFlipped: false,
    };
    this.doRandomXUser = this.doRandomXUser.bind(this);
  }

  componentDidMount() {
    setShowFormState(this.props);
  }

  doRandomXUser() {
    const that = this;

    if (that.props.xusers.length) {
      const bound = that.props.xusers.length;
      const duration = 3000;
      let step = 300;
      const started = new Date().getTime();
      const timerRandom = () => {
        setTimeout(() => {
          if (new Date().getTime() - started < duration) {
            const winner = that.props.xusers[Math.floor(Math.random() * bound)];
            that.setState({ winner });
            step -= 30;
            timerRandom();
          } else {
            that.setState({ isFlipped: false });
          }
        }, step);
      };

      that.setState({ isFlipped: true });

      timerRandom();
    }
  }

  render() {
    const {
      showForm,
    } = this.props;
    // let winner = xusers.find(o => o.id === this.state.winner);
    const winner = this.state.winner;

    const ImageRotation = styled.img`
      ${props => props.isFlipped && css`
        -webkit-animation-name: spinner; 
        -webkit-animation-timing-function: linear; 
        -webkit-animation-iteration-count: infinite; 
        -webkit-animation-duration: 0.5s; 
        animation-name: spinner; 
        animation-timing-function: linear; 
        animation-iteration-count: infinite; 
        animation-duration: 0.5s; 
        -webkit-transform-style: preserve-3d; 
        -moz-transform-style: preserve-3d; 
        -ms-transform-style: preserve-3d; 
        transform-style: preserve-3d;
        
        @-webkit-keyframes spinner { 
          from 
          { 
              -webkit-transform: rotateY(0deg); 
          } 
          to { 
              -webkit-transform: rotateY(-360deg); 
          } 
        } 
        @keyframes spinner { 
          from { 
              -moz-transform: rotateY(0deg); 
              -ms-transform: rotateY(0deg); 
              transform: rotateY(0deg); 
          } 
          to 
          { 
              -moz-transform: rotateY(-360deg); 
              -ms-transform: rotateY(-360deg); 
              transform: rotateY(-360deg); 
          } 
        }
      `}
  `;

    return (
      <FormGroup show={showForm}>
        <div style={{ margin: 'auto', paddingTop: '20px' }}>
          {/* {winner && <QRCode size={512} value={winner.toString()}/>} */}
          {winner && <ImageRotation src={winner.avatar} alt="" width={512} height={512} isFlipped={this.state.isFlipped} />}
          {winner && !this.state.isFlipped && <h1 style={{ textAlign: 'center' }}>
            <a href={`https://www.facebook.com/${winner.facebook_id}`} target="_blank">{winner.nickname}</a>
          </h1>}
        </div>

        <RaisedButton
          style={{ margin: 'auto', marginBottom: '50px' }}
          label={strings.form_mini_game_lucky_guy}
          primary
          onClick={event => this.doRandomXUser(event)}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  showForm: state.app.formGenerateQR.show,
  currentQueryString: window.location.search,
  loading: state.app.event.loading,
  xusers: state.app.eventXUsers.data.filter(o => o.event_status === 'checkin'),
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: formName => dispatch(toggleShowForm(formName)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GenerateQR));
