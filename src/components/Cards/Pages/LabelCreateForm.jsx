/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import strings from 'lang';
import { toNumber, toUpperCase, Row } from 'utils';
import { ajaxGet, createCardLabel } from 'actions';

import { Dialog, TextField, FlatButton, List, ListItem } from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import IconProgress from 'material-ui/CircularProgress';
import constants from 'components/constants';

const getCardLabels = (props, context) => ajaxGet('card/labels')
  .then((res, err) => {
    if (!err) {
      const data = res.body.data;
      const dataSourceCardLabels = data.map(o => ({
        text: o.name,
        value: o.id,
      }));
      context.setState({ dataSourceCardLabels });
    } else {
      console.error(err);
    }
  });

const initialState = {
  cardLabelName: {},
  cardLabelValue: {},
  cardLabelCost: {},
  cardLabelXPoint: {},
  cardLabelPrefix: {},
  cardLabelAmount: {},

  payload: {},
  submitResults: {
    data: [],
    show: false,
  },

  redirectTo: '/login',
  disabled: true,
  open: false,
};

class LabelCreateForm extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    callback: React.PropTypes.func,
    submitFn: React.PropTypes.func,
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
    const name = this.state.cardLabelName.value;
    const value = this.state.cardLabelValue.value;
    const cost = this.state.cardLabelCost.value;
    const subscription = this.state.cardLabelXPoint.value;
    const prefix = this.state.cardLabelPrefix.value;
    const number_card = this.state.cardLabelAmount.value;

    return { name, value, cost, subscription, prefix, number_card };
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
    next_state[type] = o;
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
    if (!this.state.cardLabelName.value) {
      this.setState({ cardLabelName: { value: null, errorText: null } });
    } else {
      this.setState({ cardLabelName: { value: this.state.cardLabelName.value, isValid: true } });
    }

    if (this.state.cardLabelName.isValid) {
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
            action: <div>{`Creating ${that.state.cardLabelAmount.value} card(s) with label: `} <code>[{that.state.cardLabelName.value}]</code></div>,
            submitting: true,
          }],
        },
      }),
      disabled: true,
    }, () => {
      this.props.submitFn(formData, payload).then((results) => {
        const action = <div>{`Created ${that.state.cardLabelAmount.value} card(s) with label: `} <code>[{that.state.cardLabelName.value}]</code></div>;
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
    const __renderCardLabelName = () => (<TextField
      hintText={strings.hint_card_label_name}
      floatingLabelText={strings.filter_card_label_name}
      type="text"
      errorText={this.state.cardLabelName.errorText}
      onChange={e => this.changeValue(e, 'cardLabelName', toUpperCase)}
      fullWidth
    />);

    const __renderCardLabelAmount = () => (<TextField
      hintText={strings.hint_card_label_number_of_cards}
      floatingLabelText={strings.filter_number_of_cards}
      type="number"
      errorText={this.state.cardLabelAmount.errorText}
      onChange={e => this.changeValue(e, 'cardLabelAmount', toNumber)}
      fullWidth
    />);

    const __renderCardLabelValue = () => (<TextField
      hintText={strings.hint_card_label_value}
      floatingLabelText={strings.filter_card_label_value}
      type="number"
      errorText={this.state.cardLabelValue.errorText}
      onChange={e => this.changeValue(e, 'cardLabelValue', toNumber)}
      fullWidth
    />);

    const __renderCardLabelCost = () => (<TextField
      hintText={strings.hint_card_label_cost}
      floatingLabelText={strings.filter_card_label_cost}
      type="number"
      errorText={this.state.cardLabelCost.errorText}
      onChange={e => this.changeValue(e, 'cardLabelCost', toNumber)}
      fullWidth
    />);

    const __renderCardLabelXPoint = () => (<TextField
      hintText={strings.hint_card_label_xpoint}
      floatingLabelText={strings.filter_card_label_xpoint}
      type="number"
      errorText={this.state.cardLabelXPoint.errorText}
      onChange={e => this.changeValue(e, 'cardLabelXPoint', toNumber)}
      fullWidth
    />);

    const __renderCardLabelPrefix = () => (<TextField
      hintText={strings.hint_card_label_prefix}
      floatingLabelText={strings.filter_card_label_prefix}
      type="text"
      errorText={this.state.cardLabelPrefix.errorText}
      onChange={e => this.changeValue(e, 'cardLabelPrefix', input => input.toUpperCase())}
      fullWidth
    />);

    return (
      <div onKeyPress={e => this.__handleKeyPressOnForm(e)} role="form">
        <Row>
          {__renderCardLabelName()}
          {__renderCardLabelXPoint()}
        </Row>
        <Row>
          {__renderCardLabelValue()}
          {__renderCardLabelCost()}
        </Row>
        <Row>
          {__renderCardLabelPrefix()}
          {__renderCardLabelAmount()}
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
          Do you want to create a Package {this.state.cardNumber} card(s) with label <code>{this.state.cardLabelId && this.state.cardLabelId.text}</code>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  submitFn: (params, payload) => dispatch(createCardLabel(params, payload)),
});

export default connect(null, mapDispatchToProps)(LabelCreateForm);
