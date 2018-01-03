import React from 'react';
import PropTypes from 'prop-types';
import strings from 'lang';
import { TableLink } from 'components/Table';
import playerColors from 'dotaconstants/build/player_colors.json';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import styles from './ClubImage.css';

const TableClubImage = ({
  image,
  checkedIn,
  title,
  subtitle,
  accountId,
  hotspotSlot,
  hideText,
  confirmed,
  party,
}) => (
  <div className={styles.container}>
    {party &&
    <div className={styles.party}>
      {party}
    </div>}
    {image &&
    <div className={styles.imageContainer}>
      <img
        src={image}
        alt=""
        className={styles.image}
      />

      {hotspotSlot !== undefined &&
      <div
        className={styles.hotspotSlot}
        style={{ backgroundColor: playerColors[hotspotSlot] }}
      />
      }
    </div>}
    {!hideText &&
    <div className={styles.textContainer} style={{ marginLeft: !image && 59 }}>
      <span>
        {checkedIn && <div
          className={styles.checkedIn}
          data-hint={strings.tooltip_checkedIn_user}
          data-hint-position="top"
        />}
        {confirmed && <div
          className={styles.confirmed}
          data-hint={`${strings.app_confirmed_as} ${title}`}
          data-hint-position="top"
        >
          <CheckCircle className={styles.golden} />
        </div>}
        {accountId ? <TableLink to={`/players/${accountId}`}>
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
    }
  </div>
);

const { number, string, oneOfType, bool, node } = PropTypes;

TableClubImage.propTypes = {
  image: string,
  title: node,
  subtitle: oneOfType([
    string,
    node,
  ]),
  checkedIn: bool,
  accountId: number,
  hotspotSlot: number,
  hideText: bool,
  party: node,
  confirmed: bool,
};

export default TableClubImage;
