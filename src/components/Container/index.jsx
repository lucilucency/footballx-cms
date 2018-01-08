import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'components/Heading';
import Spinner from 'components/Spinner';
import Error from 'components/Error';

export const AsyncContainer = ({ loading, error, children }) => {
  if (error) {
    return <Error />;
  }
  if (loading) {
    return <Spinner />;
  }
  return children;
};

AsyncContainer.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  children: PropTypes.node,
};

const Container = ({ title, subtitle, style, className, children, error, loading, hide, titleTo }) => (!hide ? (
  <div className={className} style={{ ...style }}>
    {title && <Heading title={title} subtitle={subtitle} titleTo={titleTo} />}
    <AsyncContainer error={error} loading={loading}>
      {children}
    </AsyncContainer>
  </div>
) : null);

Container.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  style: PropTypes.shape({}),
  className: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  children: PropTypes.node,
  hide: PropTypes.bool,
  titleTo: PropTypes.string,
};

export default Container;
