/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Heading from 'components/Heading';
import Spinner from 'components/Spinner';
import Error from 'components/Error';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { IconMenu, MenuItem, IconButton } from 'material-ui';

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

const Container = ({ title, subtitle, style, className, children, error, loading, hide, titleTo, actions }) => (!hide ? (
  <div className={className} style={{ ...style }}>
    {title && <Heading title={title} subtitle={subtitle} titleTo={titleTo} actions={Boolean(actions)} />}
    {actions && <div style={{ float: 'right' }}>
      <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
        {actions.map(action => {
          if (action.link) {
            return (<MenuItem
              containerElement={<Link to={action.link} />}
              key={action.key}
              primaryText={action.title}
              leftIcon={action.icon && action.icon}
            />);
          } else {
            return (<MenuItem
              key={action.key}
              primaryText={action.title}
              leftIcon={action.icon && action.icon}
              onClick={action.onClick}
            />);
          }
        })}
      </IconMenu>
    </div>}
    <AsyncContainer error={error} loading={loading}>
      {children}
    </AsyncContainer>
  </div>
) : null);

Container.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  style: PropTypes.shape({}),
  actions: PropTypes.array,
  className: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  children: PropTypes.node,
  hide: PropTypes.bool,
  titleTo: PropTypes.string,
};

export default Container;
