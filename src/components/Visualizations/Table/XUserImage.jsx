import React from 'react';
import PropTypes from 'prop-types';
import strings from 'lang';
import { TableLink } from 'components/Table';
import playerColors from 'dotaconstants/build/player_colors.json';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import styles from './XUserImage.css';

const TableXUserImage = ({
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
  <div className={styles.container}>
    {party &&
    <div className={styles.party}>
      {party}
    </div>
    }
    {image &&
    <div className={styles.imageContainer}>
      <img
        src={image}
        className={styles.image}
        alt=""
      />
      {leaverStatus !== undefined && leaverStatus > 1 &&
      <span
        className={styles.abandoned}
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
        className={styles.hotspotSlot}
        style={{ backgroundColor: playerColors[hotspotSlot] }}
      />}
    </div>
    }

    <div className={styles.textContainer} style={{ marginLeft: !image && 59 }}>
      <span>
        {checkedIn &&
          <div
            className={styles.checkedIn}
            data-hint={strings.tooltip_checkedIn_user}
            data-hint-position="top"
          />
        }
        {confirmed &&
        <div
          className={styles.confirmed}
          data-hint={`${strings.app_confirmed_as} ${title}`}
          data-hint-position="top"
        >
          <CheckCircle className={styles.golden} />
        </div>
        }
        {accountId ?
          <TableLink to={`/players/${accountId}`}>
            {title}
          </TableLink>
          : title}
      </span>
      {subtitle &&
      <span className={styles.subText}>
        {subtitle}
      </span>
      }
    </div>
  </div>
);

const { number, string, oneOfType, bool, node } = PropTypes;

TableXUserImage.propTypes = {
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

export default TableXUserImage;
