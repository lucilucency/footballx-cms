/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,camelcase */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import { IconButton, FlatButton, Dialog, ListItem, List } from 'material-ui';
import IconPrint from 'material-ui/svg-icons/action/print';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import strings from 'lang/index';
import { approveGroupMember } from 'actions/index';
import constants from 'components/constants';

// eslint-disable-next-line no-unused-vars
const initialState = {
  submitResults: {
    data: [],
    show: false,
  },
};

class ConfirmBeMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      openDialog: false,
      dialog: {},
    };
  }

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  submit = (e) => {
    const that = this;
    e.preventDefault();

    this.handleCloseDialog();

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            actionName: <div>{`Confirming package ${that.props.processID}`}</div>,
            submitting: true,
          }],
        },
      }),
    }, () => {
      this.props.submitFn(this.props.membershipID, this.props.processID).then((results) => {
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
      <div style={{ textAlign: 'right' }}>
        {!this.state.submitResults.show && <IconButton tooltip="Confirm" onClick={this.handleOpenDialog}>
          <IconPrint color={constants.blue500} />
        </IconButton>}

        {this.state.submitResults.show && (
          <div>
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
          </div>
        )}

        {/* {renderDialogV2(this.state.dialog, this.state.openDialog, this.handleCloseDialog)} */}
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
          Bạn có chắc chắn <b>{this.props.userName}</b> đã thanh toán và trở thành thành viên?
        </Dialog>
      </div>
    );
  }
}

ConfirmBeMember.propTypes = {
  processID: React.PropTypes.number,
  membershipID: React.PropTypes.number,
  userName: React.PropTypes.string,
  submitFn: React.PropTypes.func,
  // callback: React.PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  submitFn: (membershipID, processID) => dispatch(approveGroupMember(membershipID, processID)),
});

export default connect(null, mapDispatchToProps)(ConfirmBeMember);
