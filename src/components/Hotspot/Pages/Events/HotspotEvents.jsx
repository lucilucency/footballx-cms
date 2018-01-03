import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  getHotspotEvents,
} from 'actions';
import Table from 'components/Table';
import Container from 'components/Container';
import strings from 'lang';
import { hotspotEventsColumns } from './HotspotEventsColumns';

const Events = ({
  data,
  error = false,
  loading = false,
  browser,
}) => (
  <Container title={strings.hotspot_all_events} error={false} loading={loading}>
    <Table paginated columns={hotspotEventsColumns(browser)} data={data} error={false} loading={loading} />
  </Container>
);

const getData = (props) => {
  const now = Date.now();
  props.getHotspotEvents(props.hotspotId, {
    start_time: parseInt(now / 1000) - 31622400,
    end_time: parseInt(now / 1000) + 31622400,
    status: -1,
  });
};

class RequestLayer extends React.Component {
  // componentDidMount() {
  //     getData(this.props);
  // }
  //
  // componentWillUpdate(nextProps) {
  //     if (this.props.hotspotId !== nextProps.hotspotId || this.props.location.key !== nextProps.location.key) {
  //         getData(nextProps);
  //     }
  // }

  render() {
    return <Events {...this.props} />;
  }
}

const defaultOptions = {
  limit: null,
};

const mapStateToProps = state => ({
  data: state.app.hotspotEvents.data,
  loading: state.app.hotspotEvents.loading,
  error: state.app.hotspotEvents.error,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  getHotspotEvents: (hotspotId, params) => dispatch(getHotspotEvents(hotspotId, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
