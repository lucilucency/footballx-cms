/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,camelcase */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import { IconButton, TextField, FlatButton, Dialog, ListItem, List } from 'material-ui';
import IconAddBox from 'material-ui/svg-icons/content/add-box';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
/* data */
import strings from 'lang';
import { createCards } from 'actions';
import { Row } from 'utils';
/* css */
import constants from 'components/constants';

const initialState = props => ({
  cardNumber: props.cardNumber && props.cardNumber,
  cardLabelId: props.cardLabelId && props.cardLabelId,
  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
});

class CardLabelAddQuantity extends React.Component {
  static propTypes = {
    cardLabelId: React.PropTypes.number,
    cardLabelName: React.PropTypes.string,
    submitFn: React.PropTypes.func,
    // callback: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...initialState(props),
      openDialog: false,
      openForm: false,
    };

    this.handleOpenForm = this.handleOpenForm.bind(this);
    this.handleCloseForm = this.handleCloseForm.bind(this);
    this.submit = this.submit.bind(this);
  }

  getFormData() {
    const { cardNumber: number_card } = this.state;
    const { cardLabelId: card_label_id } = this.props;
    return { card_label_id, number_card };
  }

  handleOpenForm() {
    this.setState({
      openForm: true,
    }, () => {
      // this.cardNumberInput.focus();
    });
  }

  handleCloseForm() {
    this.setState({
      openForm: false,
      submitResults: initialState(this.props).submitResults,
    });
  }

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ openForm: false, openDialog: false });
  };

  __handleKeyPressOnForm(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.handleOpenDialog();
      }
    }
  }

  changeValue(e, key) {
    const value = e.target.value;
    const nextState = {};
    nextState[key] = isNaN(value) ? value : Number(value);
    this.setState(nextState);
  }

  submit(e) {
    const that = this;
    e.preventDefault();

    this.handleCloseDialog();
    const formData = that.getFormData();
    const payload = {
      total_card: formData.number_card,
    };

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            actionName: <div>{`Create ${that.state.cardNumber} card(s) with label: `} <code>[{that.props.cardLabelName}]</code></div>,
            submitting: true,
          }],
        },
      }),
    }, () => {
      this.props.submitFn(formData, payload).then((results) => {
        const actionName = <div>{`Create ${that.state.cardNumber} card(s) with label: `} <code>[{that.props.cardLabelName}]</code></div>;
        const resultsReport = [];
        if (results.type.indexOf('OK') === 0) {
          resultsReport.push({
            actionName,
            submitting: false,
          });
        } else {
          resultsReport.push({
            actionName,
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

  render() {
    return (
      <div onKeyPress={e => this.__handleKeyPressOnForm(e)} role="form" style={{ textAlign: 'right' }}>
        {!this.state.submitResults.show && <Row>
          {!this.state.openForm && <IconButton tooltip="Add" onClick={this.handleOpenForm}>
            <IconAddBox color={constants.blue500} />
          </IconButton>}
          {this.state.openForm && <div>
            <TextField
              ref={(elem) => { this.cardNumberInput = elem; }}
              type="number"
              hintText={strings.hint_number}
              // floatingLabelText={strings.tooltip_card_label_add_card}
              style={{ width: 150 }}
              inputStyle={{ width: 150 }}
              errorText={this.state.cardNumberErrorText}
              onChange={e => this.changeValue(e, 'cardNumber')}
            />
            <FlatButton
              label={'Submit'}
              primary
              style={{ height: '1.5em', lineHeight: '0.1em', minWidth: 60 }}
              labelStyle={{ fontSize: '0.8em', lineHeight: '0.8em', paddingLeft: 5, paddingRight: 5 }}
              onClick={this.handleOpenDialog}
            />
            <FlatButton
              label={'Cancel'}
              secondary
              style={{ height: '1.5em', lineHeight: '0.1em', minWidth: 60 }}
              labelStyle={{ fontSize: '0.8em', lineHeight: '0.8em', paddingLeft: 5, paddingRight: 5 }}
              onClick={this.handleCloseForm}
            />
          </div>}
        </Row>}

        {this.state.submitResults.show && <Row onClick={this.handleCloseForm}>
          <List>
            {this.state.submitResults.data.map(r => (<ListItem
              primaryText={r.actionName}
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
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
          Do you want to add {this.state.cardNumber} card(s) with label: <code>{this.props.cardLabelName}</code>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  submitFn: (params, payload) => dispatch(createCards(params, payload)),
});

export default connect(null, mapDispatchToProps)(CardLabelAddQuantity);
