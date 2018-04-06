import React from 'react';
import { connect } from 'react-redux';
import { toggleShowForm } from 'actions';
import PropTypes from 'prop-types';
import IconChangePassword from 'material-ui/svg-icons/action/fingerprint';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import ShowFormToggle from 'components/Form/ShowFormToggle';
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

class HotspotHeaderButtons extends React.Component {
  componentWillMount() {
    this.setState({
      disableRefresh: false,
      disableEdit: false,
    });
  }

  render() {
    const {
      showFormCreateEvent,
      showFormEditHotspot,
      toggleShowFormCreateEvent,
      toggleShowFormEditHotspot,
    } = this.props;

    return (<ButtonContainer>
      {this.props.user && <ShowFormToggle
        show={showFormEditHotspot}
        onClick={toggleShowFormEditHotspot}
        icon={<IconEdit />}
        text={strings.form_general_edit}
        textToggle={strings.form_general_close}
      />}
      {this.props.user && <ShowFormToggle
        show={showFormCreateEvent}
        onClick={toggleShowFormCreateEvent}
        icon={<IconChangePassword />}
        text={strings.form_user_change_password}
        textToggle={strings.form_user_change_password}
      />}
    </ButtonContainer>);
  }
}

HotspotHeaderButtons.propTypes = {
  user: PropTypes.shape({}),
  showFormCreateEvent: PropTypes.bool,
  showFormEditHotspot: PropTypes.bool,
  toggleShowFormCreateEvent: PropTypes.func,
  toggleShowFormEditHotspot: PropTypes.func,
};

const mapStateToProps = state => ({
  showFormCreateEvent: state.app.formCreateEvent.show,
  showFormEditHotspot: state.app.formEditHotspot.show,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormCreateEvent: () => dispatch(toggleShowForm('createEvent')),
  toggleShowFormEditHotspot: () => dispatch(toggleShowForm('editHotspot')),
});

export default connect(mapStateToProps, mapDispatchToProps)(HotspotHeaderButtons);
