/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import strings from 'lang';
import { toNumber, Row } from 'utils';
import { ajaxGet, createCardIssue } from 'actions';

import { Dialog, TextField, FlatButton, List, ListItem, AutoComplete } from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import IconProgress from 'material-ui/CircularProgress';
import constants from 'components/constants';

const getCardLabels = (props, context) => ajaxGet('card/labels')
  .then((res, err) => {
    if (!err) {
      const data = res.body.data;
      const dataSourceCardLabels = data.map(o => ({
        text: `${o.name} (MAX: ${o.total_card_in_stock})`,
        value: o.id,
        textShort: o.name,
      }));
      context.setState({ dataSourceCardLabels });
    } else {
      console.error(err);
    }
  });

const initialState = {
  /* form data */
  cardLabelId: {},
  price: {},
  notes: {},
  amount: {},
  /* misc */
  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
  redirectTo: '/login',
  disabled: true,
  open: false,
};

class IssueCreateForm extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    callback: React.PropTypes.func,
    submitFn: React.PropTypes.func,
    // eslint-disable-next-line no-trailing-spaces
    user: React.PropTypes.shape({
      id: React.PropTypes.number,
    }),
    cardLabelId: React.PropTypes.number,
  };

  static defaultProps = {
    onChange: () => {},
    callback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      dataSourceCardLabels: [],
    };

    this.isDisabled = this.isDisabled.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    if (!this.props.cardLabelId) getCardLabels(this.props, this);
  }

  getFormData() {
    const { cardLabelId: card_label_id, amount: number_card, price, notes } = this.state;
    const user_id = this.props.user.id;

    return { card_label_id: card_label_id.value, number_card: number_card.value, user_id, price: price.value, notes: notes.value };
  }

  changeValue(e, key, transform) {
    const value = e.target.value;
    const next_state = {};
    next_state[key] = {
      value: transform ? transform(value) : value,
    };
    this.setState(next_state, () => {
      this.isDisabled();
    });
  }

  handleOnNewRequest(o, type) {
    const next_state = {};

    next_state[type] = {
      text: o.textShort || o.text,
      value: o.value,
    };
    this.setState(next_state, () => {
      this.isDisabled();
    });
  }

  __handleKeyPressOnForm(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.handleOpenDialog();
      }
    }
  }

  isDisabled() {
    if (!this.state.cardLabelId.value) {
      this.setState({ cardLabelId: { value: null, errorText: null } });
    } else {
      this.setState({
        cardLabelId: update(this.state.cardLabelId, {
          isValid: { $set: true },
        }),
      });
    }

    if (this.state.cardLabelId.isValid) {
      this.setState({
        disabled: false,
      }, function () {
        this.props.onChange(this.getFormData());
      });
    }
  }

  submit(e) {
    const that = this;
    e.preventDefault();

    const formData = that.getFormData();
    const payload = {
      total_card: formData.number_card,
    };

    this.handleCloseDialog();

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            action: <div>{`Creating ${that.state.amount.value} card(s) with label: `} <code>[{that.state.cardLabelId.value}]</code></div>,
            submitting: true,
          }],
        },
      }),
      disabled: true,
    }, () => {
      this.props.submitFn(formData, payload).then((results) => {
        const action = <div>{`Created ${that.state.amount.value} card(s) with label: `} <code>[{that.state.cardLabelId.value}]</code></div>;
        const resultsReport = [];
        if (results.type.indexOf('OK') === 0) {
          resultsReport.push({
            action,
            submitting: false,
          });
        } else {
          resultsReport.push({
            action,
            submitting: false,
            error: results.error,
          });
        }

        that.setState({
          submitResults: update(that.state.submitResults, {
            data: { $set: resultsReport },
          }),
        });
      });
    });
  }

  handleOpenDialog = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  render() {
    const __renderCardLabelSelector = () => (<AutoComplete
      floatingLabelText={strings.filter_card_label}
      // searchText={this.state.event.cardLabel && this.state.event.cardLabel.text}
      // value={this.state.event.cardLabel.value}
      dataSource={this.state.dataSourceCardLabels || []}
      onNewRequest={selectedObj => this.handleOnNewRequest(selectedObj, 'cardLabelId')}
      filter={AutoComplete.fuzzyFilter}
      openOnFocus
      maxSearchResults={100}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
    />);

    const __renderCardLabelAmount = () => (<TextField
      hintText={strings.hint_card_label_number_of_cards}
      floatingLabelText={strings.filter_number_of_cards}
      type="number"
      errorText={this.state.amount.errorText}
      onChange={e => this.changeValue(e, 'amount', toNumber)}
      fullWidth
    />);

    const __renderPrice = () => (<TextField
      hintText={strings.hint_card_label_value}
      floatingLabelText={strings.filter_card_label_value}
      type="number"
      errorText={this.state.price.errorText}
      onChange={e => this.changeValue(e, 'price', toNumber)}
      fullWidth
    />);

    const __renderNotes = () => (<TextField
      hintText={strings.hint_issue_notes}
      floatingLabelText={strings.filter_issue_notes}
      type="text"
      errorText={this.state.notes.errorText}
      onChange={e => this.changeValue(e, 'notes')}
      fullWidth
    />);

    return (
      <div onKeyPress={e => this.__handleKeyPressOnForm(e)} role="form">
        <Row>
          {__renderCardLabelSelector()}
        </Row>
        <Row>
          {__renderPrice()}
          {__renderCardLabelAmount()}
        </Row>
        <Row>
          {__renderNotes()}
        </Row>

        {this.state.submitResults.show && <Row>
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

        <Row right>
          <FlatButton
            label="Close"
            onClick={this.props.callback}
            secondary
          />
          <FlatButton
            disabled={this.state.disabled}
            label="Submit"
            onClick={this.handleOpenDialog}
            primary
          />
        </Row>

        <Dialog
          title={strings.form_confirm_general}
          actions={[
            <FlatButton
              label="Cancel"
              secondary
              onClick={this.handleCloseDialog}
            />,
            <FlatButton
              label="OK"
              primary
              onClick={this.submit}
            />,
          ]}
          modal={false}
          open={this.state.open || false}
          onRequestClose={this.handleCloseDialog}
        >
          Do you want to create an issue: <code>{this.state.cardLabelId && this.state.cardLabelId.text}</code> <small>x{this.state.amount.value}</small>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  submitFn: (params, payload) => dispatch(createCardIssue(params, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueCreateForm);
