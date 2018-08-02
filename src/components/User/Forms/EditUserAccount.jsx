import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { editUser as defaultEditFn } from 'actions';
import util from 'util';
import strings from 'lang';
import constants from 'components/constants';
import { FlatButton, Dialog, List, ListItem, SelectField, MenuItem } from 'material-ui';
import { IconProgressing } from 'components/Icons';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import Spinner from 'components/Spinner';
import Error from 'components/Error/index';
import {
  bindAll,
  FormWrapper,
} from 'utils';
import { TextValidator } from 'react-material-ui-form-validator';

class EditUserAccount extends React.Component {
  static initialState = {
    formData: {
      username: {},
      type: {},
      role: {},
    },
    payload: {},
    submitResults: {
      data: [],
      show: false,
    },
  };
  static propTypes = {
    display: PropTypes.bool,
    toggle: PropTypes.bool,
    popup: PropTypes.bool,
    loading: PropTypes.bool,
    callback: PropTypes.func,
  };
  static defaultProps = {
    display: true,
    toggle: false,
    popup: false,
    loading: false,
  };

  constructor() {
    super();
    this.state = {
      ...EditUserAccount.initialState,
    };

    bindAll([
      'submit',
      'getFormData',
      'clearState',
      'closeDialog',
    ], this);
  }

  componentWillMount() {
    const newProps = this.props;
    const type = (typeID) => {
      const __find = newProps.dsUserType.find(o => o.value === Number(typeID));
      return __find && __find.text;
    };
    const role = (roleID) => {
      const __find = newProps.dsUserRole.find(o => o.value === Number(roleID));
      return __find && __find.text;
    };
    this.setState({
      formData: {
        user_id: { value: newProps.user.id },
        username: { value: newProps.user.username, text: newProps.user.username && newProps.user.username.toString() },
        type: { value: newProps.user.type, text: type(newProps.user.type) },
        role: { value: newProps.user.role, text: role(newProps.user.role) },
      },
    });
  }

  getFormData() {
    const formData = this.state.formData;

    return {
      username: formData.username.value,
      type: formData.type.value,
      // role: formData.role.value,
    };
  }

  clearState() {
    this.setState(EditUserAccount.initialState);
  }

  closeDialog() {
    this.setState({
      submitResults: update(this.state.submitResults, {
        show: { $set: false },
      }),
    });
  }

  submit() {
    const that = this;
    const submitResultData = [];
    submitResultData.push({
      submitAction: 'Updating user account setting',
      submitting: true,
    });


    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: { $set: submitResultData },
      }),
    }, () => {
      const editFn = that.props.dispatch ? that.props.dispatch : that.props.defaultEditFunction;

      const doSubmit = new Promise((resolve) => {
        const submitData = this.getFormData();
        resolve(editFn(that.props.user.user_id, submitData));
      });

      Promise.all([doSubmit]).then((results) => {
        const resultsReport = [];
        if (results[0].type.indexOf('OK') === 0) {
          resultsReport.push({
            submitAction: 'Update user successfully',
            submitting: false,
          });
        } else {
          resultsReport.push({
            submitAction: 'Update user failed',
            submitting: false,
            error: results[0].error,
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

  render() {
    const {
      display,
      toggle,
      popup,
      loading,
    } = this.props;
    const actions = [
      null && <FlatButton
        type="reset"
        key="reset"
        label="Reset"
        secondary
        style={{ float: 'left' }}
      />,
      <FlatButton
        label={strings.form_general_close}
        key="cancel"
        primary
        onClick={() => (this.props.callback ? this.props.callback() : this.props.history.push('/users'))}
      />,
      <FlatButton
        key="submit"
        type="submit"
        label={strings.form_general_submit}
        primary
      />,
    ];

    const __renderUserAccountSettings = [<TextValidator
      name="huser_username"
      type="text"
      hintText={strings.tooltip_username}
      floatingLabelText={strings.tooltip_username}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          username: { $set: { value } },
        }),
      })}
      fullWidth
      disabled
      value={this.state.formData.username.value}
      validators={['minStringLength:3', 'maxStringLength:16', 'required']}
      errorMessages={[util.format(strings.validate_minimum, 3), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
    />, <SelectField
      disabled
      floatingLabelText={strings.filter_user_type}
      value={this.state.formData.type.value}
      onChange={(event, index, value) => {
        this.setState({
          formData: update(this.state.formData, {
            type: { $set: { value } },
          }),
        });
      }}
    >
      {this.props.dsUserType.map(o => <MenuItem value={o.value} primaryText={o.text} />)}
    </SelectField>, <SelectField
      floatingLabelText={strings.filter_user_role}
      value={this.state.formData.role.value}
      onChange={(event, index, value) => {
        this.setState({
          formData: update(this.state.formData, {
            role: { $set: { value } },
          }),
        });
      }}
    >
      {this.props.dsUserRole.map(o => <MenuItem value={o.value} primaryText={o.text} />)}
    </SelectField>];

    return (
      <FormWrapper
        data-display={display}
        data-toggle={toggle}
        data-popup={popup}
        onSubmit={this.submit}
        // onError={errors => console.log(errors)}
      >
        {loading && <Spinner />}
        {this.state.error && <Error text={this.state.error} />}
        <div>
          {__renderUserAccountSettings}
        </div>

        <div className="actions">
          {actions}
        </div>

        <Dialog
          actions={[<FlatButton
            label="Retry"
            secondary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
            }}
          />, <FlatButton
            label="Done"
            primary
            keyboardFocused
            onClick={() => {
              this.closeDialog();
              // return this.props.callback ? this.props.callback() : props.history.push(`/user/${this.state.formData.user_id.value}`);
            }}
          />]}
          modal={false}
          open={this.state.submitResults.show}
          onRequestClose={this.closeDialog}
          autoScrollBodyContent
        >
          <List>
            {this.state.submitResults.data.map(r => (<ListItem
              key={r.submitAction}
              primaryText={r.submitAction}
              leftIcon={r.submitting ? <IconProgressing size={24} /> : r.error ?
                <IconFail color={constants.colorRed} title={strings.form_general_fail} />
                : <IconSuccess
                  color={constants.colorSuccess}
                  title={strings.form_general_success}
                />}
              secondaryText={r.error && r.error}
              secondaryTextLines={1}
            />))}
          </List>
        </Dialog>
      </FormWrapper>
    );
  }
}

const mapStateToProps = () => ({
  dsUserType: [{
    text: strings.enum_user_type_1,
    value: 1,
  }, {
    text: strings.enum_user_type_2,
    value: 2,
  }, {
    text: strings.enum_user_type_3,
    value: 3,
  }],
  dsUserRole: [],
});

const mapDispatchToProps = dispatch => ({
  defaultEditFunction: (hotspotID, params) => dispatch(defaultEditFn(hotspotID, params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditUserAccount));
