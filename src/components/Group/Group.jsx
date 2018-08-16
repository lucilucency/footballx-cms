import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { getGroup, getGroupEvents, createGroupEvent } from 'actions';
import strings from 'lang';
import TabBar from 'components/TabBar';
import Spinner from 'components/Spinner';
import CreateGroupEventForm from 'components/Event/Forms/CreateEditEventForm';
import EditGroupForm from './Forms/EditGroup';
import GroupHeader from './Header/index';
import pages from './Pages/index';

const getEvents = (props) => {
  const groupId = props.groupId || props.match.params.groupId;
  props.getGroupEvents(groupId);
};

class GroupHomePage extends React.Component {
  componentDidMount() {
    const that = this;
    const groupId = this.props.groupId || this.props.match.params.groupId;
    getEvents(this.props);
    that.props.getGroup(groupId);
  }

  componentWillUpdate(nextProps) {
    if (this.props.groupId !== nextProps.groupId) {
      getEvents(nextProps);
    }
  }

  render() {
    const { location, match, group, user, guser } = this.props;

    const route = this.props.match.params.groupId;
    if (!user || !user.user_id) {
      this.props.history.push('/login');
      return false;
    }

    if (user.type !== 3 || !guser || !guser.id) {
      this.props.history.push('/');
      return false;
    }

    if (!Number.isInteger(Number(route))) {
      this.props.history.push('/');
      return false;
    }

    const groupId = match.params.groupId || group.id;

    const isOwner = () => {
      if (user.type !== 3) { return false; }
      if (guser.group_id) { return false; }
      return parseInt(guser.group_id) === parseInt(groupId);
    };

    const info = match.params.info || 'overview';
    const page = pages(groupId).find(page => page.key === info);
    const groupName = group.name || strings.general_anonymous;
    const title = page ? `${groupName} - ${page.name}` : groupName;
    return (
      <div>
        <Helmet title={title} />
        <div>
          {!match.params.subInfo && <GroupHeader {...this.props} groupId={Number(groupId)} isOwner={isOwner()} />}
          <CreateGroupEventForm
            mode="create"
            toggle
            display={this.props.showFormCreateGroupEvent}
            dispatch={this.props.createGroupEvent}
            groupId={Number(groupId)}
          />
          {false && <EditGroupForm group={group} />}
          <TabBar info={info} tabs={pages(Number(groupId))} />
        </div>
        <div style={{ marginTop: -15 }}>
          {page ? page.content(groupId, match.params, location) : <Spinner />}
        </div>
      </div>
    );
  }
}

GroupHomePage.propTypes = {
  groupId: PropTypes.number,
  match: PropTypes.object,
  location: PropTypes.object,
  group: PropTypes.object,
  user: PropTypes.object,
  guser: PropTypes.object,
};

const mapStateToProps = state => ({
  loading: state.app.group.loading,
  group: state.app.group.data || {},
  user: state.app.metadata.data.user,
  guser: state.app.metadata.data.guser,
  showFormCreateGroupEvent: state.app.formCreateEvent.show,
});

const mapDispatchToProps = dispatch => ({
  getGroup: groupId => dispatch(getGroup(groupId)),
  getGroupEvents: groupId => dispatch(getGroupEvents(groupId)),
  createGroupEvent: (params, payload) => dispatch(createGroupEvent(params, payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupHomePage));
