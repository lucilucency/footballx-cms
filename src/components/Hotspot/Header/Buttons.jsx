import React from 'react';
import { connect } from 'react-redux';
import { toggleShowForm } from 'actions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import IconUpdate from 'material-ui/svg-icons/action/update';
import IconAdd from 'material-ui/svg-icons/av/playlist-add';
import IconAddUser from 'material-ui/svg-icons/social/group-add';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import ShowFormToggle from 'components/Form/ShowFormToggle';
import strings from 'lang';
import styled from 'styled-components';

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
      hotspotId,
    } = this.props;

    const ButtonContainer = styled.div`
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

    return (<ButtonContainer>
      <FlatButton
        icon={<IconUpdate />}
        disabled={this.state.disableRefresh}
        onClick={() => {
          // fetch(`${API_HOST}/api/players/${hotspotId}/refresh`, {method: 'POST'});
          this.setState({ disableRefresh: true });
        }}
        label={strings.app_refresh_label}
      />
      {this.props.user && <ShowFormToggle
        show={showFormEditHotspot}
        onClick={toggleShowFormEditHotspot}
        icon={<IconEdit />}
        text={strings.form_edit_hotspot_open}
        textToggle={strings.form_edit_hotspot_close}
      />}
      {this.props.user && <ShowFormToggle
        show={showFormCreateEvent}
        onClick={toggleShowFormCreateEvent}
        icon={<IconAdd />}
        text={strings.form_create_event}
        textToggle={strings.form_create_event_cancel}
      />}
      {this.props.user && <FlatButton
        icon={<IconAddUser />}
        label={strings.form_create_hotspot_huser}
        containerElement={<Link to={`/hotspot/${hotspotId}/husers/add`}>{strings.home_parse}</Link>}
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
  hotspotId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
