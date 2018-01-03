import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import {
// getHotspotUpcomingEvents
} from 'actions';
import Table from 'components/Table';
import Container from 'components/Container';
import { hotspotEventsColumns } from 'components/Hotspot/Pages/Events/HotspotEventsColumns';
import styled from 'styled-components';
import _ from 'lodash';

const OverviewWrapper = styled.div`
.overviewContainer {
    width: calc(100%);

    @media only screen and (max-width: 1080px) {
        width: 100%;
        margin-right: 0;
    }
}
`;

export const MAX_MATCHES_ROWS = 20;

const Overview = ({
  hotspotEvents,
  hotspotId,
  loading,
  error,
  browser,
}) => (
  <OverviewWrapper>
    <Container
      title={strings.hotspot_upcoming_events}
      titleTo={`/hotspots/${hotspotId}/events`}
      loading={loading}
      error={false}
    >
      <Table
        columns={hotspotEventsColumns(browser)}
        data={hotspotEvents}
        maxRows={MAX_MATCHES_ROWS}
        loading={loading}
        error={false}
      />
    </Container>
  </OverviewWrapper>
);

class RequestLayer extends React.Component {
  componentDidMount() {
    // getData(this.props);
  }

  componentWillUpdate(nextProps) {
    // if (this.props.hotspotId !== nextProps.hotspotId || this.props.location.key !== nextProps.location.key) {
    //     getData(nextProps);
    // }
  }

  render() {
    if (this.props.user) {
      return <Overview {...this.props} />;
    }
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user || {},
  hotspotEvents: state.app.hotspotEvents && state.app.hotspotEvents.data.filter(o => o.status === 1),
  loading: state.app.hotspotEvents.loading,
  error: state.app.hotspotEvents.error,
  browser: state.browser,
});


const mapDispatchToProps = dispatch => ({
  // getHotspotUpcomingEvents: (hotspotId, params) => dispatch(getHotspotUpcomingEvents(hotspotId, params))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
