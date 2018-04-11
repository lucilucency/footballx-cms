import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { changePassword } from 'actions';
import strings from 'lang';
import util from 'util';
import constants from 'components/constants';
import { FlatButton, Dialog, List, ListItem } from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import Spinner from 'components/Spinner';
import Error from 'components/Error/index';
import {
  bindAll,
  FormWrapper,
} from 'utils';
import { TextValidator } from 'react-material-ui-form-validator';

class ChangePassword extends React.Component {
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
  static initialState = {
    formData: {
      password: {},
      new_password: {},
      retype_password: {},
    },
    payload: {},
    submitResults: {
      data: [],
      show: false,
    },
  };

  constructor() {
    super();
    this.state = {
      ...ChangePassword.initialState,
    };

    bindAll([
      'submit',
      'getFormData',
      'clearState',
      'closeDialog',
    ], this);
  }

  getFormData() {
    const formData = this.state.formData;

    return {
      password: formData.password.value,
      new_password: formData.new_password.value,
      // retype_password: formData.retype_password.value,
    };
  }

  clearState() {
    this.setState(ChangePassword.initialState);
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
      submitAction: 'Updating password',
      submitting: true,
    });


    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
        data: { $set: submitResultData },
      }),
    }, () => {
      const submitFn = that.props.dispatch ? that.props.dispatch : that.props.changePassword;

      const doSubmit = new Promise((resolve, reject) => {
        const submitData = this.getFormData();
        if (submitData) resolve(submitFn(that.props.user.user_id, submitData));
        else reject('Invalid params');
      });

      Promise.all([doSubmit]).then((results) => {
        const resultsReport = [];
        if (results[0].type && results[0].type.indexOf('OK') === 0) {
          resultsReport.push({
            submitAction: 'Update password successfully',
            submitting: false,
          });
        } else {
          resultsReport.push({
            submitAction: 'Update password failed',
            submitting: false,
            error: results[0].error || 'Whoops',
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
      name="user_password"
      type="password"
      floatingLabelText={strings.tooltip_password}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          password: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.password && this.state.formData.password.value}
      validators={['minStringLength:6', 'maxStringLength:16', 'required']}
      errorMessages={[util.format(strings.validate_minimum, 6), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
    />, <TextValidator
      name="user_new_password"
      type="password"
      hintText={strings.hint_password}
      floatingLabelText={strings.tooltip_new_password}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          new_password: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.new_password && this.state.formData.new_password.value}
      validators={['minStringLength:6', 'maxStringLength:16', 'required']}
      errorMessages={[util.format(strings.validate_minimum, 6), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
    />, <TextValidator
      name="user_new_password_retype"
      type="password"
      floatingLabelText={strings.tooltip_retype_password}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          retype_password: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.retype_password && this.state.formData.retype_password.value}
      validators={['minStringLength:6', 'maxStringLength:16', 'required']}
      errorMessages={[util.format(strings.validate_minimum, 6), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
    />];

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
              leftIcon={r.submitting ? <CircularProgress size={24} /> : r.error ?
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

const mapDispatchToProps = dispatch => ({
  changePassword: (userID, params) => dispatch(changePassword(userID, params)),
});

export default withRouter(connect(null, mapDispatchToProps)(ChangePassword));
