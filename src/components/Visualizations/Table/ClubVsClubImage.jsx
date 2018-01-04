import React from 'react';
import PropTypes from 'prop-types';
import playerColors from 'dotaconstants/build/player_colors.json';
import styles from './ClubImage.css';

const TableClubVsClubImage = ({
  image,
  title,
  subtitle,
  hotspotSlot,
  party,
  displayText = true,
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
          className={styles.image}
          title={subtitle}
          alt=""
        />

        {hotspotSlot !== undefined &&
          <div
            className={styles.hotspotSlot}
            style={{ backgroundColor: playerColors[hotspotSlot] }}
          />
        }
      </div>}
    {displayText && <div className={styles.textContainerCompact} style={{ marginLeft: !image && 59 }}>
      <span>{title}</span>
      {subtitle &&
      <span className={styles.subText}>
        {subtitle}
      </span>
      }
    </div>}
  </div>
);

const { number, string, oneOfType, bool, node } = PropTypes;

TableClubVsClubImage.propTypes = {
  image: string,
  title: node,
  subtitle: oneOfType([
    string,
    node,
  ]),
  hotspotSlot: number,
  party: node,
  displayText: bool,
};

export default TableClubVsClubImage;
