/* eslint-disable no-plusplus */
import React from 'react';
import { connect } from 'react-redux';
import { Dialog, TextField, FlatButton, List, ListItem, AutoComplete } from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import IconProgress from 'material-ui/CircularProgress';
import styled from 'styled-components';
import Checkbox from 'material-ui/Checkbox';
import strings from 'lang';
import { toNumber } from 'utils';
import { closeCardIssue, returnCardToStockFromCardIssue } from 'actions';

const Styled = styled.div`
.progressBoxes {
    display: block;
}

.progressBox_o {
    display: block;
    float: left;
    //padding: 5px;
}

.progressBox_i {
    display: block;
    height: 5px;
    background: #888;
    cursor: pointer;
}

.progressBox_i.active {
    background: #4FECF9;
}

.progressBox_i:hover {
    background: #EFEFEF;
}

.progressBox_i:active {
    background: white;
}
`;

const initialState = (props) => ({
  amount: {},
  isClosed: props.issue.is_closed,
});

class IssueViewer extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    issue: React.PropTypes.object,
    closeIssue: React.PropTypes.func,
    returnCard: React.PropTypes.func,
  };

  static defaultProps = {
    issue: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      displayInputReturnCard: false,
      ...initialState(props),
    };
    this.renderProgress = this.renderProgress.bind(this);
    this.handleDisplayInputReturnCard = this.handleDisplayInputReturnCard.bind(this);

    this.updateCloseIssue = this.updateCloseIssue.bind(this);
    this.updateReturnCard  = this.updateReturnCard.bind(this);
  }

  updateCloseIssue() {
    this.props.closeIssue(this.props.issue.id).then((result) => {
      console.log(result);
      if (result.type.indexOf('OK') === 0) {
        console.log('update close succeed!');
        this.setState(oldState => ({
          isClosed: !oldState.isClosed,
        }));
      } else {
        console.log('update close failed!');
      }
    });
  }

  updateReturnCard() {
    this.props.returnCard(this.props.issue.id, this.state.amount.value).then((result) => {
      console.log(result);
      if (result.type.indexOf('OK') === 0) {
        console.log('update close succeed!');
        // this.setState(oldState => ({
        //   isClosed: !oldState.isClosed,
        // }));
      } else {
        console.log('update close failed!');
      }
    });
  }

  handleDisplayInputReturnCard() {
    this.setState(oldState => ({
      displayInputReturnCard: !oldState.displayInputReturnCard,
    }));
  }

  changeValue(e, key, transform) {
    const value = e.target.value;
    const nextState = {};
    nextState[key] = {
      value: transform ? transform(value) : value,
    };
    this.setState(nextState);
  }

  renderProgress() {
    let { issue } = this.props;
    const withProgress = true;
    issue = {
      archived: false,
      complete: false,
      due: null,
      id: 123,
      milestones: [],
      progress: 6,
      progress_ts: [],
      started: true,
      ts_archived: 1517539089905,
      ts_completed: 1517487683776,
      ts_created: 1516037843285,
    };
    if (!withProgress || issue.progress === -1) return null;
    const items = this.props.issue.total_card;

    const widthPct = (parseInt(100 / items)).toString() + '%';
    const boxes = [];
    for (let i = 0; i < items; i++) {
      const active = issue.progress >= (i + 1);
      const boxPercent = parseInt(100 / items) * (i + 1);
      boxes.push(<span key={i} className="progressBox_o" style={{ width: widthPct }} title={`Set progress to ${boxPercent}%`}>
        <span className={'progressBox_i ' + (active ? 'active' : '')} />
      </span>);
    }
    return (
      <Styled>{ boxes }</Styled>
    );
  }

  render() {
    const Ul = styled.ul`
      font-size: 1.1em;
      //font-family: 'Roboto', 'Helvetica', 'sans-serif';
      font-weight: 300;
      line-height: 1.4;
      & li {
        list-style-type: square;
        transition: .4s linear color;
      }
      & li:hover {
        color: white;
      }
    `;

    const { issue } = this.props;

    return (
      <div style={{ textAlign: 'left' }}>
        <Ul>
          <li>Created at: {issue.created_at}</li>
          <li>Requester: {issue.user_id} - {issue.user_type}</li>
          <li>Requested cards: <b><code>{issue.card_label_id}</code></b> <small>x{issue.total_card}</small></li>
        </Ul>
        <div style={{ padding: 20 }}>
          {this.renderProgress()}
        </div>
        <div style={{ padding: 20 }}>
          <Checkbox
            label="Closed"
            checked={this.state.isClosed}
            disabled={this.state.isClosed}
            onCheck={this.updateCloseIssue}
          />
          <Checkbox
            disabled={this.state.isClosed}
            label="Send cards back"
            checked={this.state.displayInputReturnCard}
            onCheck={this.handleDisplayInputReturnCard}
          />
          {this.state.displayInputReturnCard && <div>
            <TextField
              hintText={strings.hint_card_label_number_of_cards}
              floatingLabelText={strings.filter_number_of_cards}
              type="number"
              errorText={this.state.amount.errorText}
              onChange={e => this.changeValue(e, 'amount', toNumber)}
              fullWidth
            />
            <FlatButton
              disabled={this.state.isClosed}
              label="Submit"
              onClick={this.updateReturnCard}
              primary
            />
          </div>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  closeIssue: issueId => dispatch(closeCardIssue(issueId)),
  returnCard: (issueId, number) => dispatch(returnCardToStockFromCardIssue(issueId, number))
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueViewer);;
