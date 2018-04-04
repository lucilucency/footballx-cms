import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
// import { createHotspotHUser } from 'actions';
import { createUser as defaultCreateFn, editUser as defaultEditFn } from 'actions';
import util from 'util';
import strings from 'lang';
import constants from 'components/constants';
import { TextField, FlatButton, Dialog, List, ListItem } from 'material-ui';
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

class CreateUserForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    display: PropTypes.bool,
    toggle: PropTypes.bool,
    popup: PropTypes.bool,
    loading: PropTypes.bool,
    callback: PropTypes.func,

    hotspotId: PropTypes.number,
  };
  static defaultProps = {
    mode: 'create',
    display: true,
    toggle: false,
    popup: false,
    loading: false,
  };
  static initialState = {
    formData: {
      username: {},
      fullname: {},
      password: {},
      repeat_password: {},
      email: {},
      phone: {},
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
      ...CreateUserForm.initialState,
    };

    bindAll([
      'submit',
      'getFormData',
      'clearState',
      'closeDialog',
    ], this);
  }

  componentDidMount() {
    //
  }

  getFormData() {
    const formData = this.state.formData;

    return {
      username: formData.username.value,
      password: formData.password.value,
      fullname: formData.fullname.value,
      phone: formData.phone.value,
      email: formData.email.value,
      hotspot_ids: JSON.stringify([this.props.hotspotId]),
    };
  }

  clearState() {
    this.setState(CreateUserForm.initialState);
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
    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }),
    }, () => {
      const createFn = that.props.dispatch ? that.props.dispatch : that.props.defaultCreateFunction;
      const editFn = that.props.dispatch ? that.props.dispatch : that.props.defaultEditFunction;

      const doSubmit = new Promise((resolve) => {
        that.setState({
          submitResults: update(that.state.submitResults, {
            data: {
              $push: [{
                submitAction: that.props.mode === 'edit' ? 'Updating hotspot' : 'Creating hotspot',
                submitting: true,
              }],
            },
          }),
        });
        const submitData = this.getFormData();
        if (that.props.mode === 'edit') {
          resolve(editFn(that.props.hotspot.id, submitData));
        } else {
          resolve(createFn(submitData, submitData));
        }
      });

      Promise.all([doSubmit]).then((results) => {
        const resultsReport = [];
        if (results[0].type.indexOf('OK') === 0) {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update user successfully' : 'Create user successfully',
            submitting: false,
          });

          that.setState({
            formData: update(that.state.formData, {
              hotspot_id: {
                $set: {
                  value: results[0].payload.id,
                },
              },
            }),
          });
        } else {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update user failed' : 'Create user failed',
            submitting: false,
            error: results[0].error,
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
    const props = this.props;
    const {
      mode,
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
        onClick={() => (this.props.callback ? this.props.callback() : props.history.push('/users'))}
      />,
      <FlatButton
        key="submit"
        type="submit"
        label={strings.form_create_hotspot_huser}
        primary
      />,
    ];

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
          <TextField
            name="huser_username"
            fullWidth
            style={{ display: 'none' }}
            value=""
          />
          <TextValidator
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
            value={this.state.formData.username.value}
            validators={['minStringLength:3', 'maxStringLength:16', 'required']}
            errorMessages={[util.format(strings.validate_minimum, 3), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
          />

          <TextValidator
            name="huser_password"
            type="password"
            hintText={strings.tooltip_password}
            floatingLabelText={strings.tooltip_password}
            onChange={(event, value) => this.setState({
              formData: update(this.state.formData, {
                password: { $set: { value } },
              }),
            })}
            fullWidth
            value={this.state.formData.password && this.state.formData.password.value}
            validators={['minStringLength:3', 'maxStringLength:16', 'required']}
            errorMessages={[util.format(strings.validate_minimum, 3), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
          />

          <TextValidator
            name="huser_fullname"
            type="text"
            hintText={strings.tooltip_full_name}
            floatingLabelText={strings.tooltip_full_name}
            onChange={(event, value) => this.setState({
              formData: update(this.state.formData, {
                fullname: { $set: { value } },
              }),
            })}
            fullWidth
            value={this.state.formData.fullname && this.state.formData.fullname.value}
            validators={['required']}
            errorMessages={[strings.validate_is_required]}
          />

          <TextValidator
            name="phone"
            type="tel"
            hintText={strings.tooltip_phone}
            floatingLabelText={strings.tooltip_phone}
            onChange={(event, value) => this.setState({
              formData: update(this.state.formData, {
                phone: { $set: { value } },
              }),
            })}
            fullWidth
            value={this.state.formData.phone && this.state.formData.phone.value}
            validators={['matchRegexp:^(1[ \\-\\+]{0,3}|\\+1[ -\\+]{0,3}|\\+1|\\+)?((\\(\\+?1-[2-9][0-9]{1,2}\\))|(\\(\\+?[2-8][0-9][0-9]\\))|(\\(\\+?[1-9][0-9]\\))|(\\(\\+?[17]\\))|(\\([2-9][2-9]\\))|([ \\-\\.]{0,3}[0-9]{2,4}))?([ \\-\\.][0-9])?([ \\-\\.]{0,3}[0-9]{2,4}){2,3}$']}
            errorMessages={[util.format(strings.validate_invalid_format, strings.general_phone)]}
          />

          <TextValidator
            name="email"
            hintText={strings.tooltip_email}
            floatingLabelText={strings.tooltip_email}
            onChange={(event, text) => this.setState({
              formData: update(this.state.formData, {
                email: { $set: { value: text } },
              }),
            })}
            value={this.state.formData.email && this.state.formData.email.value}
            validators={['isEmail']}
            errorMessages={[util.format(strings.validate_invalid_format, strings.general_email)]}
            fullWidth
          />
        </div>

        <div className="actions">
          {actions}
        </div>

        <Dialog
          title={strings.form_create_events_dialog_desc}
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
              return this.props.callback ?
                this.props.callback() : mode === 'edit' ?
                  props.history.push(`/user/${this.state.formData.event_id.value}`) : props.history.push('/users');
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

// const mapStateToProps = state => ({
//   currentQueryString: window.location.search,
// });

const mapDispatchToProps = dispatch => ({
  // toggleShowForm: () => dispatch(toggleShowForm('createHotspotHUser')),
  // postHotspotHUser: (params, payload) => dispatch(createHotspotHUser(params, payload)),
  defaultCreateFunction: params => dispatch(defaultCreateFn(params)),
  defaultEditFunction: (hotspotId, params) => dispatch(defaultEditFn(hotspotId, params)),
});

export default withRouter(connect(null, mapDispatchToProps)(CreateUserForm));
