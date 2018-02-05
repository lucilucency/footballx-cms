import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import { TextField, FlatButton, List, ListItem } from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import IconProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import strings from 'lang';
import { toNumber, Row, Col, Ul, bindAll } from 'utils';
import { closeCardIssue, returnCardToStockFromCardIssue } from 'actions';
import constants from 'components/constants';

const initialState = props => ({
  amount: {},
  isClosed: props.issue.is_closed,

  submitResults: {
    data: [],
    show: false,
  },
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

    bindAll([
      'handleDisplayInputReturnCard',
      'handleCloseSubmitResults',
      'submitCloseIssue',
      'submitReturnCard',
    ], this);
  }

  submitCloseIssue() {
    this.setState({
      submitResults: update(this.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            action: <div>{'Closing issue'}</div>,
            submitting: true,
          }],
        },
      }),
      disabled: true,
    }, () => {
      this.props.closeIssue(this.props.issue.id).then((results) => {
        const action = <div>{'Closed issue'}</div>;
        const resultsReport = [];
        if (results.type.indexOf('OK') === 0) {
          this.setState(oldState => ({
            isClosed: !oldState.isClosed,
          }), () => {
            resultsReport.push({
              action,
              submitting: false,
            });
          });
        } else {
          resultsReport.push({
            action,
            submitting: false,
            error: results.error,
          });
        }

        this.setState({
          submitResults: update(this.state.submitResults, {
            data: { $set: resultsReport },
          }),
        });
      });
    });
  }

  submitReturnCard() {
    this.setState({
      submitResults: update(this.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            action: <div>{'Returning cards'}</div>,
            submitting: true,
          }],
        },
      }),
      disabled: true,
    }, () => {
      this.props.returnCard(this.props.issue.id, this.state.amount.value).then((results) => {
        const action = <div>{'Returned cards'}</div>;
        const resultsReport = [];
        if (results.type.indexOf('OK') === 0) {
          this.setState(oldState => ({
            isClosed: !oldState.isClosed,
          }), () => {
            resultsReport.push({
              action,
              submitting: false,
            });
          });
        } else {
          resultsReport.push({
            action,
            submitting: false,
            error: results.error,
          });
        }

        this.setState({
          submitResults: update(this.state.submitResults, {
            data: { $set: resultsReport },
          }),
        });
      });
    });
  }

  handleDisplayInputReturnCard() {
    this.setState(oldState => ({
      displayInputReturnCard: !oldState.displayInputReturnCard,
    }));
  }

  handleCloseSubmitResults() {
    this.setState({
      submitResults: initialState(this.props).submitResults,
    });
  }

  changeValue(e, key, transform) {
    const value = e.target.value;
    const nextState = {};
    nextState[key] = {
      value: transform ? transform(value) : value,
    };
    this.setState(nextState);
  }

  render() {
    const { issue } = this.props;

    return (
      <div style={{ textAlign: 'left' }}>
        <Ul>
          <li>Created at: {issue.created_at}</li>
          <li>Requester: {issue.user_id} - {issue.user_type}</li>
          <li>Requested cards: <b><code>{issue.card_label_id}</code></b> <small>x{issue.total_card}</small></li>
        </Ul>
        <div style={{ paddingLeft: 20 }}>
          <Row>
            <Col flex={6}>
              <Checkbox
                label="Closed"
                checked={this.state.isClosed}
                disabled={this.state.isClosed}
                onCheck={this.submitCloseIssue}
              />
            </Col>
            <Col flex={6}>
              <Checkbox
                disabled={this.state.isClosed}
                label="Send cards back"
                checked={this.state.displayInputReturnCard}
                onCheck={this.handleDisplayInputReturnCard}
              />
            </Col>
          </Row>
        </div>
        <div style={{ paddingLeft: 20 }}>
          {this.state.displayInputReturnCard && <Row>
            <TextField
              hintText={strings.hint_card_label_number_of_cards}
              // floatingLabelText={strings.filter_number_of_cards}
              type="number"
              errorText={this.state.amount.errorText}
              onChange={e => this.changeValue(e, 'amount', toNumber)}
              fullWidth
            />

            <FlatButton
              disabled={this.state.isClosed}
              label="Submit"
              onClick={this.submitReturnCard}
              primary
            />
          </Row>}
        </div>
        <div>
          {this.state.submitResults.show && <Row onClick={this.handleCloseSubmitResults}>
            <List fullWidth >
              {this.state.submitResults.data.map(r => (<ListItem
                primaryText={r.action}
                leftIcon={r.submitting ? <IconProgress /> : (r.error ?
                  <IconFail color={constants.colorRed} title={strings.form_general_fail} />
                  : <IconSuccess
                    color={constants.colorSuccess}
                    title={strings.form_general_success}
                  />)
                }
                secondaryText={r.error && r.error}
                secondaryTextLines={1}
              />))}
            </List>
          </Row>}
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
  returnCard: (issueId, number) => dispatch(returnCardToStockFromCardIssue(issueId, number)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueViewer);
