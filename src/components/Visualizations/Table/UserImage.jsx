import React from 'react';
import styled from 'styled-components';
import constants from 'components/constants';

const Styled = styled.div`
  display: flex;
  position: relative;
  //height: 100%;
  align-items: center;
  height: 107%;
  margin-top: -1px;
  left: -10px;
  

  .textContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
    text-align: left;
  
    & > span {
      position: relative;
      white-space: nowrap;
  
      & a {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: sub;
      }
    }
  }

  .imageContainer {
    position: relative;
    display: flex;
    justify-content: center;
    
    & img {
      margin-right: 7px;
      position: relative;
      height: 29px;
      box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
    }
  }
`;

const SubTextStyle = styled.div`
  font-size: 12px;
  color: ${constants.colorMutedLight};
  display: block;
  margin-top: 1px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 200px;
`;

const TableUserImage = ({
  image,
  title,
  subtitle,
}) => (
  <Styled>
    {image &&
    <div className="imageContainer">
      <img
        src={image}
        alt=""
      />
    </div>
    }

    <div className="textContainer" style={{ marginLeft: !image && 59 }}>
      <span>{title}</span>
      {subtitle &&
      <SubTextStyle>
        {subtitle}
      </SubTextStyle>
      }
    </div>
  </Styled>
);

TableUserImage.propTypes = {
  image: React.PropTypes.string,
  title: React.PropTypes.node,
  subtitle: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node,
  ]),
  // checkedIn: bool,
  // hotspotSlot: number,
  // party: node,
  // confirmed: bool,
  // leaverStatus: number,
};

export default TableUserImage;
