import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'material-ui/Card';
import strings from 'lang';
import styled, { css } from 'styled-components';
import constants from '../../constants';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 14px;
    
    ${props => props.compact && css`
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
        font-size: 12px;
        
        & div {
            margin-right: 5px;
            text-align: center;
        }
    `}
    
`;

const CardTitleStyled = styled(CardTitle)`
    display: inline-block;
    padding: 0 !important;
    margin-right: 25px;
    margin-top: 15px;

    & span:first-child {
        font-size: 1em !important;
        color: rgba(255, 255, 255, 0.54) !important;
        white-space: nowrap;
        line-height: 1 !important;
        text-transform: uppercase;
    }
    
    & span:last-child {
        font-size: 2em !important;
        color: rgba(255, 255, 255, 0.87) !important;
        line-height: 1.5em !important;
    }
`;

export const GroupHeaderStats = ({
  events,
  registeredXUsers,
  checkedInXUsers,
  compact,
}) => (
  <Container compact={compact}>
    {!compact && <CardTitleStyled
      subtitle={events}
      title={strings.th_events}
    />}
    <CardTitleStyled
      subtitle={<div>{checkedInXUsers + registeredXUsers}</div>}
      title={strings.th_registered}
    />
    <CardTitleStyled
      subtitle={<div>{checkedInXUsers}</div>}
      title={strings.th_checked_in}
    />
    <CardTitleStyled
      subtitle={<div style={{ color: constants.colorDanger }}>
        {registeredXUsers + checkedInXUsers ? `${((checkedInXUsers / (checkedInXUsers + registeredXUsers)) * 100).toFixed(2)}%` : strings.abbr_not_available}
      </div>}
      title={strings.th_checked_in_ratio}
    />
  </Container>
);

const { number, bool } = PropTypes;

GroupHeaderStats.propTypes = {
  // loading: bool,
  // error: bool,
  compact: bool,
  events: number,
  registeredXUsers: number,
  checkedInXUsers: number,
};

export default GroupHeaderStats;
