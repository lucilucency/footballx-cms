import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Spinner from 'components/Spinner';
import TabBar from 'components/TabBar';
import {
  getEvent, getEventXUsers,
} from 'actions';
import EventHeader from './EventHeader';
import pages from './Pages/EventPages';
import EditEventForm from './Forms/EditEvent';
import GenerateQRForm from './Forms/GenerateQR';
import SendNotificationForm from './Forms/SendNotification';

class RequestLayer extends React.Component {
  componentDidMount() {
    const eventId = this.props.match.params.eventId;
    this.props.getEvent(eventId);
    this.props.getEventXUsers(eventId);
  }

  render() {
    if (!this.props.user) {
      this.props.history.push('/login');
      return false;
    }

    const { location, match, event } = this.props;

    const eventId = match.params.eventId || event.data.event_id;

    const info = match.params.info || 'overview';
    const page = pages(eventId).find(page => page.key.toLowerCase() === info);
    const pageTitle = page ? `${eventId} - ${page.name}` : eventId;

    if (this.props.user) {
      return (<div>
        <Helmet title={pageTitle} />
        <EventHeader
          event={this.props.event}
        />
        <GenerateQRForm />
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
