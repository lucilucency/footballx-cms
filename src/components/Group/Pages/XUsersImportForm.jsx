/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,camelcase,react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import { ListItem, List, AutoComplete } from 'material-ui';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
/* data & component */
import strings from 'lang';
import { importGroupMembers, getGroupMembershipPackages } from 'actions';
import { Row, toDateString } from 'utils';
import constants from 'components/constants';
import SheetReader from './SheetReader';

const initialState = (props) => ({
  payload: {},
  formData: {
    group_membership_id: {},
    expired_date: {},
  },
  submitResults: {
    data: [],
    show: false,
  },
});

class XUsersImportForm extends React.Component {
  static propTypes = {
    submitFn: React.PropTypes.func,
    groupMembers: React.PropTypes.array,
    getGroupMembershipPackages: React.PropTypes.func,
    groupId: React.PropTypes.number,
    dataSourceGroupMemberhipPackages: React.PropTypes.array,
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

  componentDidMount() {
    this.props.getGroupMembershipPackages(this.props.groupId);
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

  submit(data) {
    const that = this;
    const props = this.props;

    this.handleCloseDialog();

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: {
          $push: [{
            actionName: <div>{`Importing ${data.length} new members`}</div>,
            submitting: true,
          }],
        },
      }),
    }, () => {
      const groupMembershipId = this.state.formData.group_membership_id.value;
      const submitData = {
        data: JSON.stringify(data),
      };
      if (groupMembershipId && groupMembershipId > 0) {
        submitData.group_membership_id = groupMembershipId;
      } else {
        submitData.expire_date = this.state.formData.expired_date.value;
      }
      this.props.submitFn(props.groupId, submitData, data).then((results) => {
        const actionName = <div>{`Imported ${data.length} new members`}</div>;
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
    const __renderGroupMembershipSelector = () => (<AutoComplete
      name="group"
      hintText={strings.filter_select_group_membership}
      floatingLabelText={strings.filter_select_group_membership}
      searchText={this.state.formData.group_membership_id.text}
      value={this.state.formData.group_membership_id.value}
      dataSource={this.props.dataSourceGroupMemberhipPackages}
      onNewRequest={(o) => {
        this.setState({
          formData: update(this.state.formData, {
            group_membership_id: { $set: o },
          }),
        });
      }}
      onUpdateInput={(searchText) => {
        this.setState({
          formData: update(this.state.formData, {
            group_membership_id: { $set: { value: searchText } },
          }),
        });
      }}
      filter={AutoComplete.caseInsensitiveFilter}
      openOnFocus
      maxSearchResults={100}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
    />);

    const __renderGroupMembershipExpiredDate = () => (<DateTimePicker
      format="HH:mm, MM/DD/YYYY"
      hintText={strings.filter_date_start_register}
      floatingLabelText={strings.filter_date_start_register}
      onChange={(dateTime) => {
        this.setState({
          formData: update(this.state.formData, {
            expired_date: {
              $set: {
                text: dateTime || '',
                value: dateTime ? dateTime.getTime() / 1000 : null,
              },
            },
          }),
        });
      }}
      DatePicker={DatePickerDialog}
      TimePicker={TimePickerDialog}
      value={this.state.formData.expired_date.text}
      fullWidth
    />);

    return (
      <div onKeyPress={e => this.__handleKeyPressOnForm(e)} role="form" style={{ textAlign: 'right' }}>
        {!this.state.submitResults.show && <div>
          <Row>
            <SheetReader onUpload={this.submit} groupMembers={this.props.groupMembers} />
          </Row>
          {__renderGroupMembershipSelector()}
          {this.state.formData.group_membership_id.value === -1 && __renderGroupMembershipExpiredDate()}
        </div>}

        {this.state.submitResults.show && <div>
          <Row onClick={this.handleCloseForm}>
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
          </Row>
        </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const dataSourceGroupMemberhipPackages = state.app.groupMembershipPackages.data.map((o) => {
    const expiredDate = toDateString(o.expire_date * 1000);
    return {
      text: `Group ${o.id} - Expired date: ${expiredDate}`,
      value: o.id,
    };
  });
  dataSourceGroupMemberhipPackages.push({
    text: strings.filter_create_new_group_membership,
    value: -1,
  });
  return {
    dataSourceGroupMemberhipPackages,
  }
};

const mapDispatchToProps = dispatch => ({
  submitFn: (groupId, params, payload) => dispatch(importGroupMembers(groupId, params, payload)),
  getGroupMembershipPackages: groupId => dispatch(getGroupMembershipPackages(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(XUsersImportForm);
