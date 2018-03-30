import React from 'react';
import PropTypes from 'prop-types';
import strings from 'lang';
import { TableLink } from 'components/Table';
import { IconCheckCircle } from 'components/Icons';
import styled from 'styled-components';
import { subTextStyle } from 'utils';
import constants from 'components/constants';

const Styled = styled.div`
  display: flex;
  position: relative;
  margin-top: -1px;
  left: -10px;
  height: 100%;
  align-items: center;
  min-width: 80px;
  
  @media only screen and (max-width: 660px) {
    min-width: 60px;
  }
  
  .subTextContainer {
    position: relative;
  
    & svg {
      color: currentcolor !important;
      height: 13px !important;
      width: 13px !important;
      vertical-align: top;
      padding: 1px 0;
    }
    
    @media only screen and (max-width: 660px) {
      display: none !important;
    }
  }
  
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
  
  .badge {
    display: inline-block;
  
    & svg {
      width: 10px !important;
      height: 10px !important;
      margin-right: 5px;
    }
  }
  
  .imageContainer {
    position: relative;
    display: flex;
    justify-content: center;
    
    .image {
      margin-right: 7px;
      position: relative;
      height: 29px;
      box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
      background-color: rgba(255,255,255,0.1);
      
      @media only screen and (max-width: 660px) {
        margin-right: 3px;
      }
    }
  }
  
  .playerSlot {
    width: 2px;
    height: 29px;
    position: absolute;
    right: 7px;
  }
  
  .golden {
    fill: ${constants.colorGolden} !important;
  }
`;

const TableClubImage = ({
  image,
  title,
  subtitle,
  accountId,
  hideText,
  confirmed,
}) => (
  <Styled>
    {image &&
    <div className="imageContainer">
      <img
        src={image}
        alt=""
        className="image"
      />
    </div>
    }
    {!hideText &&
    <div className="textContainer" style={{ marginLeft: !image && 59 }}>
      <span>
        {confirmed &&
        <div
          className="badge"
          data-hint={`${strings.app_confirmed_as} ${title}`}
          data-hint-position="top"
        >
          <IconCheckCircle className="golden" />
        </div>
        }
        {accountId ?
          <TableLink to={`/players/${accountId}`}>
            {title}
          </TableLink>
          : title}
      </span>
      {subtitle &&
      <span style={subTextStyle} className="subTextContainer">
        {subtitle}
      </span>
      }
    </div>
    }
  </Styled>
);

const {
  string, oneOfType, bool, node, object,
} = PropTypes;

TableClubImage.propTypes = {
  image: string,
  title: oneOfType([string, object]),
  subtitle: oneOfType([string, node]),
  accountId: PropTypes.number,
  hideText: bool,
  confirmed: bool,
};

export default TableClubImage;
