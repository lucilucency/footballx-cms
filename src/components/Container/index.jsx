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

const { bool, node, string, object, oneOfType } = PropTypes;

AsyncContainer.propTypes = {
  loading: bool,
  error: bool,
  children: node,
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
  title: string,
  subtitle: string,
  style: object,
  className: string,
  loading: bool,
  error: oneOfType([bool, string]),
  children: node,
};

export default Container;
