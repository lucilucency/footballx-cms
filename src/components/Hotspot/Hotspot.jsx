import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getHotspot,
  getHotspotEvents,
  toggleShowForm,
  createHotspotEvent,
} from 'actions';
import strings from 'lang';
import TabBar from 'components/TabBar';
import Spinner from 'components/Spinner';
import EditHotspotForm from 'components/Hotspot/Forms/CreateEditHotspotForm';
import CreateEventForm from 'components/Event/Forms/CreateEditEventForm';
import HotspotHeader from './Header/index';
import hotspotPages from './Pages';

const getEvents = (props) => {
  const now = Date.now();
  const hotspotId = props.hotspotId || props.match.params.hotspotId;
  props.getHotspotEvents(hotspotId, {
    start_time: parseInt(now / 1000) - 31622400,
    end_time: parseInt(now / 1000) + 31622400,
    status: -1,
  });
};

class RequestLayer extends React.Component {
  static propTypes = {
    hotspotId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    hotspot: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.arrayOf(PropTypes.shape({})),
    ]),
    user: PropTypes.shape({}),
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
    const hotspotId = this.props.hotspotId || this.props.match.params.hotspotId;
    getEvents(this.props);
    that.props.getHotspot(hotspotId);
  }

  componentWillUpdate(nextProps) {
    if (this.props.hotspotId !== nextProps.hotspotId || this.props.location.key !== nextProps.location.key) {
      getEvents(nextProps);
    }
  }

  render() {
    const props = this.props;
    const { location, match, hotspot, user, history, showFormEditHotspot, showFormCreateEvent, toggleShowFormEditHotspot, toggleShowFormCreateEvent } = props;
    const route = this.props.match.params.hotspotId;

    const userData = user.user;
    if (!userData) {
      history.push('/login');
      return false;
    }

    if (userData.user_type === 2 && userData.type === 'hotspot') {
      history.push('/');
      return false;
    }

    if (Number.isInteger(Number(route))) {
      const hotspotId = Number(match.params.hotspotId || hotspot.id);
      let isOwner = false;
      if (userData.user_type === 2 && Number(user.hotspot.id) === Number(hotspotId)) {
        isOwner = true;
      }

      const info = match.params.info || 'overview';
      const page = hotspotPages(hotspotId).find(page => page.key === info);
      const hotspotName = hotspot.name || strings.general_anonymous;
      const title = page ? `${hotspotName} - ${page.name}` : hotspotName;
      return (
        <div>
          <Helmet title={title} />
          <div>
            <HotspotHeader {...this.props} hotspotId={hotspotId} isOwner={isOwner} />
            <CreateEventForm
              mode="create"
              toggle
              display={showFormCreateEvent}
              callback={toggleShowFormCreateEvent}
              hotspot={hotspot}
              hotspotId={hotspotId}
              dispatch={props.createHotspotEvent}
            />
            <EditHotspotForm
              mode="edit"
              toggle
              display={showFormEditHotspot}
              hotspot={hotspot}
              callback={toggleShowFormEditHotspot}
            />
            <TabBar info={info} tabs={hotspotPages(hotspotId)} />
          </div>
          <div style={{ marginTop: -15 }}>
            {page ? page.content(hotspotId, match.params, location) : <Spinner />}
          </div>
        </div>
      );
    }
    history.push('/');
    return false;
  }
}

const mapStateToProps = state => ({
  loading: state.app.hotspot.loading,
  hotspot: state.app.hotspot.data || {},
  user: state.app.metadata.data,
  showFormEditHotspot: state.app.formEditHotspot.show,
  showFormCreateEvent: state.app.formCreateEvent.show,
});

const mapDispatchToProps = dispatch => ({
  getHotspot: hotspotId => dispatch(getHotspot(hotspotId)),
  getHotspotEvents: (hotspotId, params) => dispatch(getHotspotEvents(hotspotId, params)),
  createHotspotEvent: (params, payload) => dispatch(createHotspotEvent(params, payload)),

  toggleShowFormEditHotspot: () => dispatch(toggleShowForm('editHotspot')),
  toggleShowFormCreateEvent: () => dispatch(toggleShowForm('createEvent')),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestLayer));
