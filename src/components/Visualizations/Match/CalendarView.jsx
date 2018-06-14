import React from 'react';
import styled from 'styled-components';
import constants from 'components/constants';
import Clubs from 'fxconstants/clubsObj.json';

const Styled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  margin-top: -1px;
  height: 1.5em;
  align-items: center;
  font-size: 80%;
  //min-width: 80px;
  //max-width: 140px;
  transition: transform .2s;
  :hover {
    transform: scale(1.1);
  }
  span {
    @media only screen and (max-width: 660px) {
      display: none;
    }
    @media only screen and (max-width: 900px) {
      font-size: 0.8em;
    }
  }
  > div {
    flex: 1;
    justify-content: left;
  }
  > div:first-child * {
    float: right;
  }
  > div:last-child * {
    float: left;
  }
  img {
    margin-right: 7px;
    margin-left: 7px;
    margin-top: 2px;
    position: relative;
    height: 1em;
    box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
    vertical-align: middle;
    
    @media only screen and (max-width: 660px) {
      margin-right: 3px;
      height: 1.1em;
    }
  }
`;

const CalendarMatch = ({
  home,
  away,
}) => (<Styled>
  <div>
    <img
      src={Clubs[home] && Clubs[home].icon}
      alt=""
    />
    <span>{Clubs[home] && Clubs[home].short_name}</span>
  </div>
  <div>
    <img
      src={Clubs[away] && Clubs[away].icon}
      alt=""
    />
    <span>{Clubs[away] && Clubs[away].short_name}</span>
  </div>
</Styled>);

CalendarMatch.propTypes = {
  home: React.PropTypes.shape({}),
  away: React.PropTypes.shape({}),
};

export default CalendarMatch;

