import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import strings from 'lang';
import styled from 'styled-components';
import { ButtonsDiv } from './Styled';
import { IconGithub, IconFacebook } from 'components/Icons';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 20px;
  
    //position: absolute;
    //left: 50%;
    //bottom: 200px;
    //> * {
    //    left: -50%;
    //    position: relative;
    //}
    
    @media only screen and (max-height: 625px) {
        display: none;
    }
  
    & .headline {
        text-transform: uppercase;
        margin-bottom: 0.5em;
        
        @media only screen and (max-width: 425px) {
            font-size: 16px;
        }
    }

    & img, & svg {
        height: 48px;
        margin: 10px 20px;
        transition: var(--normalTransition);
    
        @media only screen and (max-width: 425px) {
            height: 32px;
            margin: 8px 12px;
        }

        @media only screen and (max-width: 375px) {
            height: 32px;
         }
  }

  & a {
    background-color: transparent !important;
    padding: 0 !important;
    border-width: 1px !important;
    border-radius: 0 !important;
  }
`;

export default () => (
  <StyledDiv>
    <div className="headline">
      {strings.home_sponsored_by}
    </div>
    <div className="images">
      <a href="https://www.livescore.com" target="_blank" rel="noopener noreferrer">
        <img src="https://www.enetpulse.com/wp-content/files/references/livescore.jpg" alt="" />
      </a>
      <a href="http://www.github.com/" target="_blank" rel="noopener noreferrer">
        <IconGithub />
      </a>
      <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
        <IconFacebook />
      </a>
      <a href="https://www.buffalowildwings.com/" target="_blank" rel="noopener noreferrer">
        <img src="/assets/images/bdubs.svg" alt="" />
      </a>
    </div>
    <ButtonsDiv>
      <FlatButton
        label={
          <span>
            {strings.home_become_sponsor}
          </span>
        }
        href="/register"
      />
    </ButtonsDiv>
  </StyledDiv>
);
