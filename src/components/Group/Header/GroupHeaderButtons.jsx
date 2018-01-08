import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleShowForm } from 'actions';
/* components */
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import IconUpdate from 'material-ui/svg-icons/action/update';
import IconAdd from 'material-ui/svg-icons/av/playlist-add';
import IconAddUser from 'material-ui/svg-icons/social/group-add';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import ShowFormToggle from 'components/Form/ShowFormToggle';
/* data */
import strings from 'lang';
import styled from 'styled-components';

class GroupHeaderButtons extends React.Component {
  static propTypes = {
    showFormCreateEvent: PropTypes.bool,
    showFormEditGroup: PropTypes.bool,
    toggleShowFormCreateEvent: PropTypes.func,
    toggleShowFormEditGroup: PropTypes.func,
    groupId: PropTypes.number,
    user: PropTypes.shape({}),
  };
  componentWillMount() {
    this.setState({
      disableRefresh: false,
      disableEdit: false,
    });
  }

  render() {
    const {
      showFormCreateEvent,
      showFormEditGroup,
      toggleShowFormCreateEvent,
      toggleShowFormEditGroup,
      groupId,
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
          // fetch(`${API_HOST}/api/players/${groupId}/refresh`, {method: 'POST'});
          this.setState({ disableRefresh: true });
        }}
        label={strings.app_refresh_label}
      />
      <ShowFormToggle
        show={showFormEditGroup}
        onClick={toggleShowFormEditGroup}
        icon={<IconEdit />}
        text={strings.form_edit_group_open}
        textToggle={strings.form_edit_group_cancel}
      />
      {this.props.user && <ShowFormToggle
        show={showFormCreateEvent}
        onClick={toggleShowFormCreateEvent}
        icon={<IconAdd />}
        text={strings.form_create_event}
        textToggle={strings.form_create_event_cancel}
      />}
      {null && <FlatButton
        icon={<IconAddUser />}
        label={strings.form_create_group_huser}
        containerElement={<Link to={`/groups/${groupId}/husers/add`}>{strings.home_parse}</Link>}
      />}
    </ButtonContainer>);
  }
}

const mapStateToProps = state => ({
  showFormCreateEvent: state.app.formCreateEvent.show,
  showFormEditGroup: state.app.formEditGroup.show,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormCreateEvent: () => dispatch(toggleShowForm('createEvent')),
  toggleShowFormEditGroup: () => dispatch(toggleShowForm('editGroup')),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupHeaderButtons);
