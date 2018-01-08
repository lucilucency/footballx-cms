import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import Table from 'components/Table';
import Container from 'components/Container';
import groupEventsColumns from 'components/Group/Pages/GroupEventsColumns';
import styled from 'styled-components';

const OverviewWrapper = styled.div``;

export const MAX_MATCHES_ROWS = 20;

const Overview = (propsVar) => {
  const {
    groupEvents,
    groupId,
    loading,
    // error,
    browser,
  } = propsVar;
  return (
    <OverviewWrapper>
      <Container
        title={strings.group_upcoming_events}
        titleTo={`/group/${groupId}/events`}
        loading={loading}
        error={false}
      >
        <Table
          columns={groupEventsColumns(browser)}
          data={groupEvents}
          maxRows={MAX_MATCHES_ROWS}
          loading={loading}
          error={false}
        />
      </Container>
    </OverviewWrapper>
  );
};

class RequestLayer extends React.Component {
  componentDidMount() {
    // getData(this.props);
  }

  // componentWillUpdate(nextProps) {
  // if (this.props.groupId !== nextProps.groupId || this.props.location.key !== nextProps.location.key) {
  //     getData(nextProps);
  // }
  // }

  render() {
    return <Overview {...this.props} />;
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user || {},
  groupEvents: state.app.groupEvents && state.app.groupEvents.data.filter(o => o.status === 1),
  loading: state.app.groupEvents.loading,
  error: state.app.groupEvents.error,
  browser: state.browser,
});


// const mapDispatchToProps = dispatch => ({
// });

export default connect(mapStateToProps, null)(RequestLayer);
