import React from 'react';
import { toDateTimeString } from 'utils';
import styled from 'styled-components';
import constants from 'components/constants';
import strings from 'lang';
// import { colors } from 'material-ui/styles';
import Clubs from 'fxconstants/clubsObj.json';

const MatchInfo = styled.div`
  box-sizing: border-box;
  flex-basis: 33.33%;
  max-width: 33.33%;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
  
  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  
  .club-image {
    width: 128px;
    height: 128px;
    padding: 2px;
    box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
    background-color: rgba(255,255,255,0.1);
    
    img {
      height: 100%;
    }
  }
    
  .info {
    margin: 0 20px;
  
    @media only screen and (max-width: 400px) {
      margin: 0 10px;
    }
  
    & span {
      text-transform: uppercase;
      display: block;
    }
  
    & .duration {
      font-size: 28px;
  
      @media only screen and (max-width: 400px) {
        font-size: 24px;
      }
    }
  
    & .ended {
      font-size: ${constants.fontSizeSmall};
      color: ${constants.colorMutedLight};
      margin-top: 3px;
  
      & > div {
        display: inline-block;
      }
    }
  }
`;

const EventMatch = ({
  home,
  away,
  date,
}) => (<MatchInfo>
  <div className="club-image">
    <img src={Clubs[home] && Clubs[home].icon} alt="" />
  </div>
  <div className="info">
    <span style={{ fontSize: constants.fontSizeMedium }}>
      {date * 1000 < Date.now() ? strings.match_ended : strings.match_ongoing}
    </span>
    <span className={'duration'}>
      {'90:00'}
    </span>
    <span className={'ended'}>
      {toDateTimeString(date * 1000)}
    </span>
  </div>
  <div className="club-image">
    <img src={Clubs[away] && Clubs[away].icon} alt="" />
  </div>
</MatchInfo>);

EventMatch.propTypes = {
  home: React.PropTypes.number.isRequired,
  away: React.PropTypes.number.isRequired,
  date: React.PropTypes.number.isRequired,
};

export default EventMatch;
