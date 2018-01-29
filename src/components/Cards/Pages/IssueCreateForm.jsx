/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import strings from 'lang';
// import { validateEmail } from 'utility/misc';
import { ajaxGet, createCardPackage } from 'actions';

import { Dialog, AutoComplete, TextField, FlatButton, List, ListItem } from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import styled, { css } from 'styled-components';
import constants from 'components/constants';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  ${props => props.right && css`
    flex-direction: row-reverse;
  `}
`;
const Col = styled.div`
  margin: 10px;
  text-align: center;
  ${props => props.flex && css`
    flex: ${props.flex};
  `}
`;

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

const initialState = props => ({
  cardLabelId: props.cardLabelId && props.cardLabelId,
  cardLabelName: props.cardLabelName && props.cardLabelName,
  cardLabelErrorText: null,
  cardNumber: null,
  cardNumberErrorText: null,
  redirectTo: '/login',
  disabled: true,

  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
});

class IssueCreateForm extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    callback: React.PropTypes.func,
    submitFn: React.PropTypes.func,
    cardLabelId: React.PropTypes.number,
    // cardNumber: React.PropTypes.number,
  };

  static defaultProps = {
    onChange: () => {},
    callback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      ...initialState(props),
      dataSourceCardLabels: [],
    };

    this.isDisabled = this.isDisabled.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    if (!this.props.cardLabelId) getCardLabels(this.props, this);
  }

  getFormData() {
    const { cardNumber: number_card } = this.state;
    const card_label_id = this.state.cardLabelId.value;
    return { card_label_id, number_card };
  }

  changeValue(e, key) {
    const value = e.target.value;
    const next_state = {};
    next_state[key] = isNaN(value) ? value : Number(value);
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
    let isValidCardNumber = false;
    let isValidCardLabel = false;

    if (!this.state.cardLabelId) {
      this.setState({ cardLabelErrorText: null, cardLabelId: null });
    } else {
      isValidCardLabel = true;
    }

    if (!this.state.cardNumber) {
      this.setState({
        cardNumberErrorText: null,
        cardNumber: null,
      });
    } else if (parseInt(this.state.cardNumber)) {
      isValidCardNumber = true;
      this.setState({
        cardNumberErrorText: null,
      });
    } else {
      this.setState({
        cardNumberErrorText: 'Sorry, this is not a valid number',
      });
    }

    if (isValidCardNumber && isValidCardLabel) {
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
    this.handleCloseDialog();

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            action: <div>{`Create ${that.state.cardNumber} card(s) with label: `} <code>[{that.state.cardLabelId.text}]</code></div>,
            submitting: true,
          }],
        },
      }),
      disabled: true,
    }, () => {
      this.props.submitFn(formData).then((results) => {
        const action = <div>{`Create ${that.state.cardNumber} card(s) with label: `} <code>[{that.state.cardLabelId.text}]</code></div>;
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
      name="card_label_id"
      ref={(input) => { this.inputCardLabel = input; }}
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
      // validators={['required']}
      // errorMessages={[strings.validate_is_required]}
    />);

    const __renderCardNumberInput = () => (<TextField
      hintText={strings.hint_number}
      floatingLabelText={strings.filter_number_card}
      type="number"
      errorText={this.state.cardNumberErrorText}
      onChange={e => this.changeValue(e, 'cardNumber')}
      fullWidth
    />);

    return (
      <div onKeyPress={e => this.__handleKeyPressOnForm(e)} role="form">
        <Row>
          <Col flex={5}>
            {__renderCardLabelSelector()}
          </Col>
          <Col flex={7}>
            {__renderCardNumberInput()}
          </Col>
        </Row>

        {this.state.submitResults.show && <Row>
          <List fullWidth >
            {this.state.submitResults.data.map(r => (<ListItem
              primaryText={r.action}
              leftIcon={r.error ?
                <IconFail color={constants.colorRed} title={strings.form_general_fail} />
                : <IconSuccess
                  color={constants.colorSuccess}
                  title={strings.form_general_success}
                />}
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
  submitFn: params => dispatch(createCardPackage(params)),
});

export default connect(null, mapDispatchToProps)(IssueCreateForm);
