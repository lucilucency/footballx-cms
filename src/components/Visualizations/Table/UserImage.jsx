import React from 'react';
import PropTypes from 'prop-types';
import strings from 'lang';
import { TableLink } from 'components/Table';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import { subTextStyle } from 'utils';
import styled from 'styled-components';
import constants from 'components/constants';

const Styled = styled.div`
.subTextContainer {
  position: relative;

  & svg {
    color: currentcolor !important;
    height: 13px !important;
    width: 13px !important;
    vertical-align: top;
    padding: 1px 0;
  }

  & section {
    margin-left: -2px;
    margin-right: 4px;
    display: inline-block;
  }
}

.textContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
  width: 125px;
  text-align: left;

  & > span {
    position: relative;
    white-space: nowrap;

    & a {
      display: inline-block;
      width: 88%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: sub;
    }
  }
}

.image {
  margin-right: 7px;
  position: relative;
  height: 29px;
  box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
}

.abandoned {
  position: absolute;
  right: 7px;
  bottom: 8px;
  height: 15px;

  &[data-hint] {
    &::before,
    &::after {
      left: 40%;
    }
  }
}

.abandoned img {
  width: 51px;
}

.parsed {
  position: relative;
  left: -14px;
  width: 2px;
  height: 29px;
  background-color: ${constants.primaryLinkColor};

  /* Material-ui icon */
  & svg {
    position: relative !important;
    left: -10px !important;
    fill: ${constants.primaryLinkColor} !important;
  }
}

.unparsed {
  position: relative;
  left: -24px;
  width: 2px;
  height: 29px;
  background-color: ${constants.colorMuted};

  /* Material-ui icon */
  & svg {
    position: relative !important;
    left: -10px !important;
    fill: transparent !important;
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

.registered {
  display: inline-block;

  & svg {
    width: 10px !important;
    height: 10px !important;
    margin-right: 5px;
  }
  width: 10px;
  height: 10px;
  margin-right: 5px;
  background-color: ${constants.colorSuccess};
  border-radius: 50%;
  margin-top: 1px;
}

.imageContainer {
  position: relative;
  display: flex;
  justify-content: center;
}

.hotspotSlot {
  width: 2px;
  height: 29px;
  position: absolute;
  right: 7px;
}

.golden {
  fill: ${constants.colorGolden} !important;
}

.party {
  position: absolute;
  top: 0;
  width: 8px;
  height: 100%;
  left: -13px;


  & > div {
    position: absolute;
    width: 100%;
    height: 104%;
    border-left: 2px solid;

    &::after {
      content: "";
      border-top: 2px solid;
      position: absolute;
      width: 132%;
      top: 50%;
      box-shadow: 0 0 5px rgba(0,0,0,0.4);
      border-color: inherit
    }

    &.group0 {
      border-color: #4C5900;
    }      
    &.group1 {
      border-color: ${constants.blue};
    }
    &.group2 {
      border-color: #D7E874;
    }    
    &.group3 {
      border-color: #740D00;
    }

  }
}

.hoverIcon {
  margin-left: 4px;
}

.hoverIcon:first-child {
  margin-left: 8px;
}

.pvgnaGuideContainer {
  margin: auto;
}

.pvgnaGuideIcon {
  max-width: 24px;
  max-height: 24px;
}
`;

const UserImageContainer = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  align-items: center;
`;


const expand = {
  display: 'flex',
  position: 'relative',
  height: '107%',
  marginTop: '-1px',
  left: '-10px',
};

const TableUserImage = ({
  image,
  checkedIn,
  title,
  subtitle,
  accountId,
  hotspotSlot,
  confirmed,
  party,
  leaverStatus,
}) => (
  <Styled style={expand}>
    <UserImageContainer>
      {party &&
      <div className="party">
        {party}
      </div>
      }
      {image &&
      <div className="imageContainer">
        <img
          src={image}
          className="image"
          alt=""
        />
        {leaverStatus !== undefined && leaverStatus > 1 &&
        <span
          className="abandoned"
          data-hint={strings[`leaver_status_${leaverStatus}`]}
          data-hint-position="top"
        >
          <img
            src="/assets/images/dota2/disconnect_icon.png"
            alt=""
          />
        </span>}
        {hotspotSlot !== undefined &&
        <div
          className="hotspotSlot"
        />}
      </div>
      }

      <div className="textContainer" style={{ marginLeft: !image && 59 }}>
        <span>
          {checkedIn &&
          <div
            className="checkedIn"
            data-hint={strings.tooltip_checkedIn_user}
            data-hint-position="top"
          />
          }
          {confirmed &&
          <div
            className="confirmed"
            data-hint={`${strings.app_confirmed_as} ${title}`}
            data-hint-position="top"
          >
            <CheckCircle className="golden" />
          </div>
          }
          {accountId ?
            <TableLink to={`/players/${accountId}`}>
              {title}
            </TableLink>
            : title}
        </span>
        {subtitle &&
        <span style={{ ...subTextStyle }}>
          {subtitle}
        </span>
        }
      </div>
    </UserImageContainer>
  </Styled>

);

const { number, string, oneOfType, bool, node } = PropTypes;

TableUserImage.propTypes = {
  image: string,
  title: node,
  subtitle: oneOfType([
    string,
    node,
  ]),
  checkedIn: bool,
  accountId: number,
  hotspotSlot: number,
  party: node,
  confirmed: bool,
  leaverStatus: number,
};

export default TableUserImage;
