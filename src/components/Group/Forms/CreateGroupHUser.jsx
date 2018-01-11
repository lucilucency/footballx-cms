import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
/* actions & helpers */
import { toggleShowForm } from 'actions/dispatchForm';
import { createHotspotHUser } from 'actions';
import util from 'util';
/* data */
import strings from 'lang';
/* components */
import { TextField, RaisedButton } from 'material-ui';
import Error from 'components/Error/index';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator } from 'react-material-ui-form-validator';

export const FORM_NAME_CREATE_EVENT = 'createHotspot';

class CreateHotspotForm extends React.Component {
  constructor() {
    super();
    this.state = {
      huser: { username: {}, fullname: {}, password: {}, repeat_password: {}, email: {}, phone: {} },
    };

    this.submitCreateHUser = this.submitCreateHUser.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    //
  }

  submitCreateHUser() {
    const that = this;
    const newHUser = {
      username: that.state.huser.username.value,
      password: that.state.huser.password.value,
      fullname: that.state.huser.fullname.value,
      phone: that.state.huser.phone && that.state.huser.phone.value,
      email: that.state.huser.email && that.state.huser.email.value,
    };

    that.props.postHotspotHUser(that.props.hotspotId, newHUser).then((dispatch) => {
      if (dispatch.type.indexOf('OK') === 0) {
        console.log('success');
      } else {
        console.log('fail');
      }
    });
  }

  handleBlur(event) {
    this[event.target.name].validate(event.target.value);
  }

  render() {
    return (
      <ValidatorForm
        onSubmit={this.submitCreateHUser}
        onError={errors => console.log(errors)}
      >
        {this.state.error && <Error text={this.state.error} />}
        <div>
          <TextField
            name="huser_username"
            fullWidth
            style={{ display: 'none' }}
          />
          <TextValidator
            name="huser_username"
            type="text"
            hintText={strings.tooltip_username}
            floatingLabelText={strings.tooltip_username}
            onBlur={this.handleBlur}
            onChange={(event, name) => this.setState({
              huser: update(this.state.huser, {
                username: { $set: { value: name } },
              }),
            })}
            fullWidth
            value={this.state.huser.username.value}
            validators={['minStringLength:3', 'maxStringLength:16', 'required']}
            errorMessages={[util.format(strings.validate_minimum, 3), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
          />

          <TextValidator
            name="huser_password"
            type="password"
            hintText={strings.tooltip_password}
            floatingLabelText={strings.tooltip_password}
            onBlur={this.handleBlur}
            onChange={(event, text) => this.setState({
              huser: update(this.state.huser, {
                password: { $set: { value: text } },
              }),
            })}
            fullWidth
            value={this.state.huser.password && this.state.huser.password.value}
            validators={['minStringLength:3', 'maxStringLength:16', 'required']}
            errorMessages={[util.format(strings.validate_minimum, 3), util.format(strings.validate_maximum, 16), strings.validate_is_required]}
          />

          <TextValidator
            name="huser_fullname"
            type="text"
            hintText={strings.tooltip_full_name}
            floatingLabelText={strings.tooltip_full_name}
            onBlur={this.handleBlur}
            onChange={(event, text) => this.setState({
              huser: update(this.state.huser, {
                fullname: { $set: { value: text } },
              }),
            })}
            fullWidth
            value={this.state.huser.fullname && this.state.huser.fullname.value}
            validators={['required']}
            errorMessages={[strings.validate_is_required]}
          />

          <TextValidator
            name="phone"
            type="tel"
            hintText={strings.tooltip_phone}
            floatingLabelText={strings.tooltip_phone}
            onChange={(event, phone) => this.setState({
              huser: update(this.state.huser, {
                phone: { $set: { value: phone } },
              }),
            })}
            fullWidth
            value={this.state.huser.phone && this.state.huser.phone.value}
            validators={['matchRegexp:^(1[ \\-\\+]{0,3}|\\+1[ -\\+]{0,3}|\\+1|\\+)?((\\(\\+?1-[2-9][0-9]{1,2}\\))|(\\(\\+?[2-8][0-9][0-9]\\))|(\\(\\+?[1-9][0-9]\\))|(\\(\\+?[17]\\))|(\\([2-9][2-9]\\))|([ \\-\\.]{0,3}[0-9]{2,4}))?([ \\-\\.][0-9])?([ \\-\\.]{0,3}[0-9]{2,4}){2,3}$']}
            errorMessages={[util.format(strings.validate_invalid_format, strings.general_phone)]}
          />

          <TextValidator
            name="email"
            hintText={strings.tooltip_email}
            floatingLabelText={strings.tooltip_email}
            onBlur={this.handleBlur}
            onChange={(event, text) => this.setState({
              huser: update(this.state.huser, {
                email: { $set: { value: text } },
              }),
            })}
            value={this.state.huser.email && this.state.huser.email.value}
            validators={['isEmail']}
            errorMessages={[util.format(strings.validate_invalid_format, strings.general_email)]}
            fullWidth
          />
        </div>
        <RaisedButton type="submit" label={strings.form_create_hotspot_huser} style={{ float: 'right' }} />
        <br />
      </ValidatorForm>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm(FORM_NAME_CREATE_EVENT)),
  postHotspotHUser: (hotspotId, params) => dispatch(createHotspotHUser(hotspotId, params)),
});

export default withRouter(connect(null, mapDispatchToProps)(CreateHotspotForm));
