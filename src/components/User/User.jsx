import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getUser,
} from 'actions';
import strings from 'lang';
import TabBar from 'components/TabBar';
import Spinner from 'components/Spinner';
import EditHotspotForm from 'components/Hotspot/Forms/CreateEditHotspotForm';
import CreateEventForm from 'components/Event/Forms/CreateEditEventForm';
import Header from './Header/index';
import pages from './Pages';

class UserModule extends React.Component {
  static propTypes = {
    hotspotId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    user: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.arrayOf(PropTypes.shape({})),
    ]),
    metadata: PropTypes.shape({}),
    match: PropTypes.shape({
      params: PropTypes.shape({
        hotspotId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    }),
    location: PropTypes.shape({
      key: PropTypes.string,
    }),
    history: PropTypes.shape({}),
  };

  componentDidMount() {
    const that = this;
    const userID = that.props.userID || that.props.match.params.id;
    this.props.getUser(userID);
  }

  componentWillUpdate(nextProps) {
    if (this.props.hotspotId !== nextProps.hotspotId || this.props.location.key !== nextProps.location.key) {
      getUser(nextProps);
    }
  }

  render() {
    const props = this.props;
    const { location, match, user, metadata, history, showFormEditHotspot, showFormCreateEvent, toggleShowFormEditHotspot, toggleShowFormCreateEvent } = this.props;
    const route = this.props.match.params.id;

    console.log('metadata', metadata);
    if (!metadata.user) {
      history.push('/login');
      return false;
    }

    if (metadata.user.user_type === 2 && metadata.user.type === 'hotspot') {
      history.push('/');
      return false;
    }

    if (Number.isInteger(Number(route))) {
      const userID = Number(match.params.id || user.id);
      console.log(userID);

      let isOwner = false;
      if (metadata.user.user_type === 2 && Number(metadata.user.id) === Number(userID)) {
        isOwner = true;
      }

      const info = match.params.info || 'overview';
      const page = pages(userID).find(page => page.key === info);
      const title = page ? `${user.username} - ${page.name}` : user.username;
      return (
        <div>
          <Helmet title={title} />
          <div>
            <Header {...this.props} hotspotId={userID} isOwner={isOwner} />
            <TabBar info={info} tabs={pages(userID)} />
          </div>
          <div style={{ marginTop: -15 }}>
            {page ? page.content(userID, match.params, location) : <Spinner />}
          </div>
        </div>
      );
    }
    history.push('/');
    return false;
  }
}

const mapStateToProps = state => ({
  loading: state.app.user.loading,
  user: state.app.user.data || {},
  metadata: state.app.metadata.data,
});

const mapDispatchToProps = dispatch => ({
  getUser: userID => dispatch(getUser(userID)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserModule));
