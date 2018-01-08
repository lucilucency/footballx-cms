import React from 'react';
import {
  connect,
} from 'react-redux';
import {
// getGroupEvents,
} from 'actions';
import Table from 'components/Table/index';
import Container from 'components/Container/index';
import strings from 'lang';
import groupEventsColumns from './GroupEventsColumns';

const Events = (propsVar) => {
  const {
    data,
    // error = false,
    loading = false,
    browser,
  } = propsVar;
  return (
    <Container title={strings.title_events_all} error={false} loading={loading}>
      <Table paginated columns={groupEventsColumns(browser)} data={data} error={false} loading={loading} />
    </Container>
  );
};

class RequestLayer extends React.Component {
  componentDidMount() {

  }

  render() {
    return <Events {...this.props} />;
  }
}

const mapStateToProps = state => ({
  data: state.app.groupEvents.data,
  loading: state.app.groupEvents.loading,
  error: state.app.groupEvents.error,
  browser: state.browser,
});

// const mapDispatchToProps = dispatch => ({
  // getGroupEvents: (groupId, params) => dispatch(getGroupEvents(groupId, params)),
// });

export default connect(mapStateToProps, null)(RequestLayer);
