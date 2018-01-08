import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { getGroup, getGroupEvents } from 'actions';
import strings from 'lang';
import TabBar from 'components/TabBar';
import Spinner from 'components/Spinner';
import CreateGroupEventForm from './Forms/CreateGroupEvent';
import EditGroupForm from './Forms/EditGroup';
import GroupHeader from './Header/index';
import pages from './Pages/index';

const getEvents = (props) => {
  const groupId = props.groupId || props.match.params.groupId;
  props.getGroupEvents(groupId);
};

class RequestLayer extends React.Component {
  static propTypes = {
    groupId: PropTypes.number,
    match: PropTypes.shape({
      params: PropTypes.shape({
        groupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    }),
    location: PropTypes.shape({
      key: PropTypes.string,
    }),
    group: PropTypes.shape({}),
    metadata: PropTypes.shape({}),
  };

  componentDidMount() {
    const that = this;
    const groupId = this.props.groupId || this.props.match.params.groupId;
    getEvents(this.props);
    that.props.getGroup(groupId);
  }

  componentWillUpdate(nextProps) {
    if (this.props.groupId !== nextProps.groupId || this.props.location.key !== nextProps.location.key) {
      getEvents(nextProps);
    }
  }

  render() {
    const { location, match, group, metadata } = this.props;
    const route = this.props.match.params.groupId;
    const user = metadata.user;
    if (!user) {
      history.push('/login');
      return false;
    }

    if (user.user_type === 2 && user.type === 'group') {
      history.push('/');
      return false;
    }

    if (Number.isInteger(Number(route))) {
      const groupId = match.params.groupId || group.id;

      const isOwner = () => {
        if (metadata.user.user_type !== 2 || metadata.user.type !== 'group') {
          return false;
        }
        if (!metadata.group || !metadata.group.id) {
          return false;
        }
        return parseInt(metadata.group.id) === parseInt(groupId);
      };

      const info = match.params.info || 'overview';
      const page = pages(groupId).find(page => page.key === info);
      const groupName = group.name || strings.general_anonymous;
      const title = page ? `${groupName} - ${page.name}` : groupName;
      return (
        <div>
          <Helmet title={title} />
          <div>
            <GroupHeader {...this.props} groupId={Number(groupId)} isOwner={isOwner()} />
            <CreateGroupEventForm groupId={Number(groupId)} />
            <EditGroupForm group={group} />
            <TabBar info={info} tabs={pages(Number(groupId))} />
          </div>
          <div style={{ marginTop: -15 }}>
            {page ? page.content(groupId, match.params, location) : <Spinner />}
          </div>
        </div>
      );
    }
    history.push('/');
    return false;
  }
}

const mapStateToProps = state => ({
  loading: state.app.group.loading,
  group: state.app.group.data || {},
  metadata: state.app.metadata.data,
});

const mapDispatchToProps = dispatch => ({
  getGroup: groupId => dispatch(getGroup(groupId)),
  getGroupEvents: groupId => dispatch(getGroupEvents(groupId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestLayer));
