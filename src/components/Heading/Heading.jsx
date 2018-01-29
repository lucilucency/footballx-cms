import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ActionLabelOutline from 'material-ui/svg-icons/action/label-outline';
import { StyledDiv, TwoLineDiv } from './Styled';

const Heading = ({
  title = '', titleTo, icon = <ActionLabelOutline />, subtitle, twoLine, actions,
}) => {
  const DivToUse = twoLine ? TwoLineDiv : StyledDiv;
  return (
    <DivToUse style={actions ? { float: 'left' } : {}}>
      {icon}
      <span className="title">
        {titleTo ?
          <Link to={titleTo}>
            {title.trim()}
          </Link>
          : title.trim()}
      </span>
      <span className="subtitle">
        {subtitle}
      </span>
    </DivToUse>);
};

const {
  string, element, oneOfType, bool, shape,
} = PropTypes;

Heading.propTypes = {
  title: string,
  titleTo: string,
  icon: oneOfType([
    string,
    element,
  ]),
  subtitle: oneOfType([
    shape({}),
    string,
  ]),
  twoLine: bool,
  actions: bool,
};

export default Heading;
