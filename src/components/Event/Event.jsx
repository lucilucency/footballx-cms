/* eslint-disable no-eval,react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
// import socket from 'socketClient';
import TabBar from 'components/TabBar';
import {
  getEvent, getEventXUsers, addEventXUser, dispatchNewXUserCheckin, toggleShowForm,
} from 'actions';
import EventHeader from './EventHeader';
import pages from './Pages/index';
import EditEventForm from './Forms/CreateEditEventForm';
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
    eventXUsers: PropTypes.array,
  };
  componentDidMount() {
    const eventId = this.props.match.params.eventId;
    this.props.getEvent(eventId);
    this.props.getEventXUsers(eventId);
    // const props = this.props;

    // socket.on('event', (data) => {
    //   if (data) {
    //     try {
    //       const parsedData = JSON.parse(data);
    //       window.abc = parsedData;
    //       if (typeof parsedData === 'object') {
    //         const json = JSON.stringify(eval(`(${parsedData.qr_data})`));
    //         const qrData = JSON.parse(json);
    //
    //         if (qrData.notification.toString() === props.user.user.user_id.toString()) {
    //           let xuserGroup = {};
    //           if (parsedData.xuser_groups && parsedData.xuser_groups.length) {
    //             xuserGroup = parsedData.xuser_groups[0];
    //           }
    //
    //           const payload = {
    //             ...parsedData.xuser,
    //             ...xuserGroup,
    //             ...parsedData.xuser_group,
    //             event_updated_at: Date.now(),
    //             event_status: 'checkin',
    //             xcoin: parsedData.xuser_balance.xcoin,
    //           };
    //
    //           props.addEventXUser(payload);
    //           props.dispatchNewXUserCheckin(payload);
    //         }
    //       }
    //     } catch (e) {
    //       console.log('Error occur!', e);
    //     }
    //   }
    // });
  }

  render() {
    const props = this.props;
    const { event, user, match, showEditEventForm, toggleShowForm } = props;
    let { eventXUsers } = this.props;
    const userData = user.user;
    if (!userData) {
      this.props.history.push('/login');
      return false;
    }

    eventXUsers = eventXUsers.map((row) => {
      const eventData = event.data;
      const priceCheckin = !row.is_subscriber && row.price;
      let priceRegister;
      if (eventData.is_only_disc_gmem) {
        if (eventData.group_id && eventData.group_id === row.group_id) {
          priceRegister = eventData.deposit / 100 * eventData.price_after_discount;
        } else {
          priceRegister = eventData.deposit / 100 * eventData.price;
        }
      } else {
        priceRegister = eventData.deposit / 100 * eventData.price_after_discount;
      }

      const paidSubscription = row.is_subscriber ? 1 : 0;
      const paidXCoin = paidSubscription ? 0 : (row.event_status === 'checkin' ? priceCheckin : priceRegister);
      // const paidXCoinTimes = paidSubscription ? 0 : 1;
      return {
        ...row,
        paidXCoin,
        paidSubscription,
      };
    });

    /* cancel by fking sheeet MUSVN */
    eventXUsers = eventXUsers.reduce((__prev, cur) => {
      const prev = __prev;
      const ids = prev.map(o => o.id);
      const pos = ids.indexOf(cur.id);
      if (pos === -1) {
        prev.push(cur);
      } else {
        prev[pos].paidSubscription += cur.paidSubscription;
        prev[pos].paidXCoin += cur.paidXCoin;
        prev[pos].paidXCoinTimes += cur.paidXCoinTimes;
        prev[pos].event_status = (prev[pos].event_status === 'checkin' || cur.event_status === 'checkin') ? 'checkin' : 'registered';
      }
      return prev;
    }, []);

    const eventId = match.params.eventId || event.data.event_id;
    const info = match.params.info || 'overview';
    const page = pages(eventId).find(el => el.key.toLowerCase() === info);
    const pageTitle = page ? `${eventId} - ${page.name}` : eventId;

    if (this.props.user) {
      return (<div>
        <Helmet title={pageTitle} />
        <EventHeader
          event={this.props.event}
          hotspot={this.props.hotspot}
        />
        <EditEventForm
          mode="edit"
          toggle
          display={showEditEventForm}
          event={this.props.event.data}
          callback={toggleShowForm}
        />
        <SendNotificationForm event={this.props.event.data} />
        <TabBar
          info={info}
          tabs={pages(eventId, { event, user, match, eventXUsers })}
        />
        {/* pass page data here */}
        {page && page.content({ event, user, match, eventXUsers }, event.loading)}
      </div>);
    }

    this.props.history.push('/');
    return <span>NOT PERMISSION</span>;
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data,
  event: state.app.event,
  eventXUsers: state.app.eventXUsers.data,
  showEditEventForm: state.app.formEditEvent.show,
});

const mapDispatchToProps = dispatch => ({
  getEvent: eventId => dispatch(getEvent(eventId)),
  getEventXUsers: eventId => dispatch(getEventXUsers(eventId)),
  addEventXUser: payload => dispatch(addEventXUser(payload)),
  dispatchNewXUserCheckin: payload => dispatch(dispatchNewXUserCheckin(payload)),
  toggleShowForm: () => dispatch(toggleShowForm('editEvent')),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
