import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import PropTypes from 'prop-types';
import Table from 'components/Table';
import Container from 'components/Container';
import hotspotEventsColumns from 'components/Hotspot/Pages/Events/HotspotEventsColumns';
import styled from 'styled-components';

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

const Overview = (propsVar) => {
  const {
    hotspotEvents,
    hotspotId,
    loading,
    browser,
  } = propsVar;
  return (<OverviewWrapper>
    <Container
      title={strings.hotspot_upcoming_events}
      titleTo={`/hotspots/${hotspotId}/events`}
      loading={loading}
      error={false}
    >
      <div>
        {hotspotEvents ? <Table
          columns={hotspotEventsColumns(browser)}
          data={hotspotEvents}
          maxRows={MAX_MATCHES_ROWS}
          loading={loading}
          error={false}
        /> : strings.td_no_result}
      </div>
    </Container>
  </OverviewWrapper>);
};

class RequestLayer extends React.Component {
  componentDidMount() {
    // getData(this.props);
  }

  // componentWillUpdate(nextProps) {
  // if (this.props.hotspotId !== nextProps.hotspotId || this.props.location.key !== nextProps.location.key) {
  //     getData(nextProps);
  // }
  // }

  render() {
    if (this.props.user) {
      return <Overview {...this.props} />;
    }
    return false;
  }
}

RequestLayer.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
  user: PropTypes.shape({}),
  loading: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      info: PropTypes.string,
    }),
  }),
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user || {},
  hotspotEvents: state.app.hotspotEvents.data && state.app.hotspotEvents.data.length && state.app.hotspotEvents.data.filter(o => o.status === 1),
  loading: state.app.hotspotEvents.loading,
  error: state.app.hotspotEvents.error,
  browser: state.browser,
});


export default connect(mapStateToProps, null)(RequestLayer);
