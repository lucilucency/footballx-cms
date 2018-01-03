import React from 'react';
import Clear from 'material-ui/svg-icons/content/clear';
import Filter from 'material-ui/svg-icons/content/filter-list';
import strings from 'lang';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import constants from 'components/constants';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;

  & svg {
    width: 24px;
    height: 24px;
    margin: 0 5px;
    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    user-select: none;
  }
`;

const ShowFormToggle = ({
  show,
  icon = <Filter />,
  toggleIcon = <Clear style={{ fill: constants.colorDanger }} />,
  text = strings.filter_button_text_open,
  textToggle = strings.filter_button_text_close,
  ...rest
}) => (
  <FlatButton
    {...rest}
    icon={show ? toggleIcon : icon}
    label={show ? textToggle : text}
  />
);

ShowFormToggle.propTypes = {
  toggleShowForm: PropTypes.func,
  showForm: PropTypes.bool,
  icon: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default ShowFormToggle;
