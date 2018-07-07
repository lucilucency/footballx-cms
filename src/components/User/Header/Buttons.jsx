import React from 'react';
import { connect } from 'react-redux';
import { toggleShowForm } from 'actions';
import { bindAll, renderDialog } from 'utils';
import PropTypes from 'prop-types';
import {
  FlatButton,
} from 'material-ui';
import IconChangePassword from 'material-ui/svg-icons/action/fingerprint';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import EditUserAccountSettings from 'components/User/Forms/EditUserAccount';
import ChangePassword from 'components/User/Forms/ChangePassword';
import ResetPassword from 'components/User/Forms/ResetPassword';
import strings from 'lang';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  font-size: 14px;

  @media only screen and (max-width: 660px) {
    justify-content: center;

    & a {
      min-width: 50px !important;
    }

    & button {
      min-width: 50px !important;
    }

    & * {
      font-size: 0 !important;
      padding: 0 !important;
      margin: auto !important;
    }

    & span {
      margin: 0 !important;
    }
  }
`;

class Buttons extends React.Component {
  static initialState = {
    openDialog: false,
    dialogConstruct: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      ...Buttons.initialState,
    };

    bindAll([
      'handleOpenDialog',
      'handleCloseDialog',
      'handleOpenEditUserForm',
      'handleOpenChangePasswordForm',
      'handleOpenResetPasswordForm',
    ], this);
  }

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  handleOpenEditUserForm() {
    this.setState({
      dialogConstruct: {
        title: strings.form_user_account_settings,
        view: <EditUserAccountSettings
          popup
          user={this.props.user.data}
          callback={this.handleCloseDialog}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  handleOpenChangePasswordForm() {
    this.setState({
      dialogConstruct: {
        title: strings.form_user_change_password,
        view: <ChangePassword
          popup
          user={this.props.user.data}
          callback={this.handleCloseDialog}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  handleOpenResetPasswordForm() {
    this.setState({
      dialogConstruct: {
        title: strings.form_user_reset_password,
        view: <ResetPassword
          popup
          user={this.props.user.data}
          callback={this.handleCloseDialog}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  render() {
    const isAvailable = this.props.metadata.user_type === 1;
    return (<ButtonContainer>
      {isAvailable && <FlatButton
        icon={<IconEdit />}
        disabled={this.state.disableRefresh}
        onClick={this.handleOpenEditUserForm}
        label={strings.form_user_account_settings}
      />}
      <FlatButton
        icon={<IconChangePassword />}
        onClick={this.handleOpenChangePasswordForm}
        label={strings.form_user_change_password}
      />
      {isAvailable && <FlatButton
        icon={<IconChangePassword />}
        onClick={this.handleOpenResetPasswordForm}
        label={strings.form_user_reset_password}
      />}
      {renderDialog(this.state.dialogConstruct, this.state.openDialog)}
    </ButtonContainer>);
  }
}

Buttons.propTypes = {
  user: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  showFormCreateEvent: state.app.formCreateEvent.show,
  user: state.app.user,
  metadata: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormCreateEvent: () => dispatch(toggleShowForm('createEvent')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
