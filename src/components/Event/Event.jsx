import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import TabBar from 'components/TabBar';
import {
  getEvent, getEventXUsers,
} from 'actions';
import EventHeader from './EventHeader';
import pages from './Pages/index';
import EditEventForm from './Forms/EditEvent2';
import SendNotificationForm from './Forms/SendNotification';

class RequestLayer extends React.Component {
  static propTypes = {
    getEventXUsers: PropTypes.func,
    getEvent: PropTypes.func,
    user: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }),
    event: PropTypes.shape({
      data: PropTypes.shape({}),
    }),
  };
  componentDidMount() {
    const eventId = this.props.match.params.eventId;
    this.props.getEvent(eventId);
    this.props.getEventXUsers(eventId);
  }

  render() {
    const { event, user, match } = this.props;
    const userData = user.user;
    if (!userData) {
      this.props.history.push('/login');
      return false;
    }

    const eventId = match.params.eventId || event.data.event_id;
    const info = match.params.info || 'overview';
    const page = pages(eventId).find(el => el.key.toLowerCase() === info);
    const pageTitle = page ? `${eventId} - ${page.name}` : eventId;

    if (this.props.user) {
      return (<div>
        <Helmet title={pageTitle} />
        <EventHeader
          event={this.props.event}
        />
        <EditEventForm event={this.props.event.data} />
        <SendNotificationForm event={this.props.event.data} />
        <TabBar
          info={info}
          tabs={pages(eventId, this.props)}
        />
        {/* pass page data here */}
        {page && page.content(this.props, event.loading)}
      </div>);
    }

    this.props.history.push('/');
    return <span>NOT PERMISSION</span>;
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data,
  event: state.app.event,
});

const mapDispatchToProps = dispatch => ({
  getEvent: eventId => dispatch(getEvent(eventId)),
  getEventXUsers: eventId => dispatch(getEventXUsers(eventId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
