import React from 'react';
import PropTypes from 'prop-types';
import strings from 'lang';
import { KDAContainer, TitleContainer, KDAPercentContainer } from './Styled';
import constants from '../../constants';

const KDA = ({ kills, deaths, assists }) => {
  const kdaSum = kills + deaths + assists;

  return (
    <KDAContainer>
      <TitleContainer style={{ marginLeft: '10px' }}>
        {kills}
      </TitleContainer>
      <KDAPercentContainer
        data-hint={`${strings.th_kda}: ${Number(((kills + assists) / (deaths + 1)).toFixed(2))}`}
        data-hint-position="top"
      >
        <div style={{ width: `${(kills * 100) / kdaSum}%`, backgroundColor: constants.colorGreen }} />
        <div style={{ width: `${(deaths * 100) / kdaSum}%`, backgroundColor: constants.colorRed }} />
      </KDAPercentContainer>
    </KDAContainer>
  );
};

const { number } = PropTypes;

KDA.propTypes = {
  kills: number,
  deaths: number,
  assists: number,
};

export default KDA;
