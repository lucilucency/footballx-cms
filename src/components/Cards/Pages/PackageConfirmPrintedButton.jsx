/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,camelcase */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import { IconButton, FlatButton, Dialog, ListItem, List } from 'material-ui';
import IconPrint from 'material-ui/svg-icons/action/print';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
/* data */
import strings from 'lang';
import { confirmPrintedPackage } from 'actions';
import { Row } from 'utils';
/* css */
import constants from 'components/constants';

// eslint-disable-next-line no-unused-vars
const initialState = props => ({
  submitResults: {
    data: [],
    show: false,
  },
});

class PackageConfirmPrintedButton extends React.Component {
  static propTypes = {
    packageId: React.PropTypes.number,
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

  submit(e) {
    const that = this;
    e.preventDefault();

    this.handleCloseDialog();

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            actionName: <div>{`Confirming package ${that.props.packageId}`}</div>,
            submitting: true,
          }],
        },
      }),
    }, () => {
      this.props.submitFn(this.props.packageId).then((results) => {
        const actionName = <div>{'Confirmed'}</div>;
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
        {!this.state.submitResults.show && <IconButton tooltip={strings.tooltip_confirm_printed} onClick={this.handleOpenDialog}>
          <IconPrint color={constants.blue500} />
        </IconButton>}

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
          Do you want to confirm the package is printed?
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  submitFn: packageId => dispatch(confirmPrintedPackage(packageId)),
});

export default connect(null, mapDispatchToProps)(PackageConfirmPrintedButton);
