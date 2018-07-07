import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import PropTypes from 'prop-types';
import Container from 'components/Container';
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

const Overview = () => (<OverviewWrapper>
  <Container
    title={strings.heading_overview}
    loading={false}
    error={false}
  >
    <div />
  </Container>
</OverviewWrapper>);

class RequestLayer extends React.Component {
  componentDidMount() {
    //
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
  metadata: PropTypes.shape({}),
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  loading: state.app.hotspotEvents.loading,
  error: state.app.hotspotEvents.error,
  browser: state.browser,
  metadata: state.app.metadata.data.user || {},
});


export default connect(mapStateToProps, null)(RequestLayer);
