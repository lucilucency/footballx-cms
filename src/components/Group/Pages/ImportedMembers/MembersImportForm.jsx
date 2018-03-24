/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,camelcase,react/forbid-prop-types,no-lonely-if */
import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import {
  ListItem,
  List,
  AutoComplete,
  RaisedButton,
  RadioButton, RadioButtonGroup,
} from 'material-ui';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
/* data & component */
import strings from 'lang';
import { importGroupMembers, getGroupMembershipPackages } from 'actions';
import { Row, toDateString } from 'utils';
import constants from 'components/constants';
import SheetReader from './SheetReader';

const initialState = () => ({
  payload: {},
  isNew: false,
  formData: {
    group_membership_id: {},
    expired_date: {},
    is_valid: false,
  },
  willUploadData: [],
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
      ...initialState(),
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
      submitResults: initialState().submitResults,
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

  submit() {
    const that = this;
    const props = this.props;

    let { willUploadData } = this.state;
    willUploadData = willUploadData.filter(o => o.is_valid);

    this.handleCloseDialog();
    const submitData = {
      data: JSON.stringify(willUploadData),
    };

    const groupMembershipId = this.state.formData.group_membership_id.value;
    const doSubmit = () => {
      if (this.state.formData.is_valid) {
        this.setState({
          submitResults: update(that.state.submitResults, {
            show: { $set: true },
            data: {
              $push: [{
                actionName: <div>{`Importing ${willUploadData.length} new members`}</div>,
                submitting: true,
              }],
            },
          }),
        }, () => {
          this.props.submitFn(props.groupId, submitData, willUploadData).then((results) => {
            const actionName = <div>{`Imported ${willUploadData.length} new members`}</div>;
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
    };

    if (this.state.isNew) {
      if (!this.state.formData.expired_date.value) {
        this.setState({
          formData: update(this.state.formData, {
            expired_date: {
              error: { $set: 'Required!' },
            },
          }),
        });
      } else {
        submitData.expire_date = this.state.formData.expired_date.value;
        this.setState({
          formData: update(this.state.formData, {
            is_valid: { $set: true },
          }),
        }, () => {
          doSubmit();
        });
      }
    } else {
      if (!groupMembershipId) {
        this.setState({
          formData: update(this.state.formData, {
            group_membership_id: {
              error: { $set: 'Required!' },
            },
          }),
        });
      } else {
        submitData.group_membership_id = groupMembershipId;
        this.setState({
          formData: update(this.state.formData, {
            is_valid: { $set: true },
          }),
        }, () => {
          doSubmit();
        });
      }
    }
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
      errorText={this.state.formData.group_membership_id.error}
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
      errorText={this.state.formData.expired_date.error}
    />);

    return (
      <div onKeyPress={e => this.__handleKeyPressOnForm(e)} role="form" style={{ textAlign: 'right' }}>
        {!this.state.submitResults.show && <div>

          <SheetReader
            onUpload={willUploadData => this.setState({ willUploadData })}
            groupMembers={this.props.groupMembers}
          />

          {(this.state.willUploadData.length) && <div>
            <RadioButtonGroup
              name="isNew"
              defaultSelected={this.state.isNew ? 1 : 0}
              onChange={(e, value) => {
                this.setState({ isNew: Boolean(value) });
              }}
              style={{ display: 'flex', justifyContent: 'row' }}
            >
              <RadioButton
                value={1}
                label={'Add new'}
                checkedIcon={<ActionFavorite style={{ color: '#F44336' }} />}
                uncheckedIcon={<ActionFavoriteBorder />}
                style={{ width: 200, float: 'left' }}
              />
              <RadioButton
                value={0}
                label={'Add to existed'}
                checkedIcon={<ActionFavorite style={{ color: '#F44336' }} />}
                uncheckedIcon={<ActionFavoriteBorder />}
                style={{ width: 200, float: 'left' }}
              />
            </RadioButtonGroup>

            <div>
              {this.state.isNew ? __renderGroupMembershipExpiredDate() : __renderGroupMembershipSelector()}
            </div>

            <div style={{ flexDirection: 'flex-reverse' }}>
              <RaisedButton
                onClick={this.submit}
                label={'Upload'}
                style={{ float: 'left' }}
              />
            </div>
          </div>}
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
  return {
    dataSourceGroupMemberhipPackages,
  };
};

const mapDispatchToProps = dispatch => ({
  submitFn: (groupId, params, payload) => dispatch(importGroupMembers(groupId, params, payload)),
  getGroupMembershipPackages: groupId => dispatch(getGroupMembershipPackages(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(XUsersImportForm);
