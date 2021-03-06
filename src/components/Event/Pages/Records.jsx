/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getOrdinal, transformations, sum } from 'utils';
import { toDateTimeString } from 'utils/time';
import strings from 'lang';
/* components */
import Container from 'components/Container';
import { IconFacebook } from 'components/Icons';
import Table from 'components/Table';
import { List, ListItem } from 'material-ui/List';
/* css */
import styled, { css } from 'styled-components';
import constants from 'components/constants';

const OverviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    @media only screen and (max-width: 1080px) {
      flex-direction: column-reverse;
    }
`;

const XUsersContainer = styled.div`
  width: calc(75% - 15px);
  margin-right: 15px;

  @media only screen and (max-width: 1080px) {
    width: 100%;
    margin-right: 0;
  }
`;

const HotspotContainer = styled.div`
  width: 25%;

  @media only screen and (max-width: 1080px) {
    width: 100%;
  }
`;

const eventXUsersColumns = (user, event) => [{
  displayName: strings.th_no,
  displayFn: (row, col, field, index) => row.event_status === 'checkin' && getOrdinal(index + 1),
}, {
  displayName: strings.th_xuser,
  tooltip: strings.tooltip_hero_id,
  field: 'nickname',
  displayFn: transformations.th_xuser_image,
  sortFn: true,
}, null && user.type === 1 && {
  displayName: '',
  field: 'facebook_id',
  displayFn: (row, col, field) => (<div>
    <a href={`https://www.facebook.com/${field}`} rel="noopener noreferrer" target="_blank"><IconFacebook width={24} height={24} /></a>
  </div>),
}, {
  displayName: strings.th_status,
  tooltip: strings.tooltip_status,
  field: 'event_status',
  displayFn: (row) => {
    let color = event.free_folk_color;
    if (row.favorite_club) {
      if (parseInt(row.favorite_club) === parseInt(event.home)) color = event.home_color;
      else if (parseInt(row.favorite_club) === parseInt(event.away)) color = event.away_color;
    }
    const Status = styled.div`
          ${props => props.status === 'checkin' && css`
              filter: drop-shadow(0 0 5px ${color});
          `}
          ${props => props.status === 'registered' && css`
              color: ${constants.colorMuted}
          `}
        `;
    Status.propTypes = { status: PropTypes.string };
    return (<div>
      <Status status={row.event_status}>{row.event_status}</Status>
      <span style={{ display: 'block', color: constants.colorMutedLight }}>{toDateTimeString(new Date(row.event_updated_at))}</span>
    </div>);
  },
  sortFn: true,
}, {
  displayName: strings.th_paid_subs,
  field: 'paidSubscription',
  displayFn: (row, col, field) => (<div>
    {field > 0 && field}
  </div>),
  sortFn: true,
}, {
  displayName: strings.th_paid_xcoin,
  field: 'paidXCoin',
  displayFn: (row, col, field) => (<div>
    {field > 0 && field}
  </div>),
  sortFn: true,
}, user.type === 1 && {
  displayName: 'Remaining Subs',
  field: 'subscription',
  sortFn: true,
}, user.type === 1 && {
  displayName: 'Remaining XCoin',
  field: 'xcoin',
  sortFn: true,
}];

class Overview extends React.Component {
  static propTypes = {
    event: PropTypes.shape({}),
    eventXUsers: PropTypes.shape([]),
    user: PropTypes.shape({}),
  };

  componentDidMount() {

  }

  render() {
    const { event, eventXUsers, user } = this.props;
    const eventData = event.data;
    const eventId = eventData.event_id;
    let xusers = eventXUsers;

    xusers = xusers.sort((a, b) => {
      const aDate = new Date(a.event_updated_at);
      const bDate = new Date(b.event_updated_at);

      if (b.event_status === 'checkin') {
        if (a.event_status === 'checkin') {
          return (aDate - bDate);
        }
        return 1;
      }
      return -1;
    });

    const computed = {};
    const data = {
      subscription: [],
      paidXCoin: [],
      paidSubscription: [],
      xcoin: [],
    };
    const dataKeys = Object.keys(data);
    xusers.forEach((xuser) => {
      dataKeys.forEach((key) => {
        data[key].push(xuser[key]);
      });
    });

    dataKeys.forEach((key) => {
      const amount = data[key].filter(o => o).length;
      const total = data[key].reduce(sum, 0);
      const max = Math.max(...data[key]);
      const maxXUser = xusers.find(o => o[key] === max) || {};

      computed[key] = {
        amount,
        total,
        max,
        maxXUser,
      };
    });

    const subscription = computed.subscription.total;
    const paidSubscription = computed.paidSubscription.total;

    return (<div>
      <div><i>*{strings.event_notes}: {eventData.notes}</i></div>
      <OverviewContainer>
        <XUsersContainer>
          <Container
            title={`${strings.heading_xmember} (${xusers.filter(o => o.event_status === 'checkin').length} | ${xusers.length})`}
            titleTo={`/events/${eventId}/xusers`}
            loading={eventXUsers.loading}
            error={false}
          >
            <Table
              columns={eventXUsersColumns(user.user, event.data)}
              data={xusers}
              loading={eventXUsers.loading}
              error={false}
              paginated={false}
              pageLength={30}
            />
          </Container>
        </XUsersContainer>
        <HotspotContainer>
          <Container
            title="Records"
            loading={eventXUsers.loading}
            error={eventXUsers.loading}
          >
            <div>
              <List>
                <ListItem
                  primaryText={'Total Paid XCoin'}
                  secondaryText={`${computed.paidXCoin.total.toLocaleString()} (${computed.paidXCoin.amount} users)`}
                />
                <ListItem
                  primaryText={'Total Paid Subscription'}
                  secondaryText={`${(paidSubscription).toLocaleString()}`}
                />
                {user.user.type === 1 && <ListItem
                  primaryText={'Total Remaining X-Coin'}
                  secondaryText={computed.xcoin.total.toLocaleString()}
                />}
                {user.user.type === 1 && <ListItem
                  primaryText={'Total Remaining Subscription'}
                  secondaryText={subscription.toLocaleString()}
                />}
              </List>
            </div>
          </Container>
        </HotspotContainer>
      </OverviewContainer>
    </div>);
  }
}

// const mapDispatchToProps = dispatch => ({
// getEventXUsers: (eventId) => dispatch(getEventXUsers(eventId)),
// });

// const mapStateToProps = state => ({
// user: state.app.metadata.data.user,
// });

export default connect(null, null)(Overview);

