/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ChipList = ({
  chipList, deleteChip, name, history,
}) => (
  <StyledDiv>
    {chipList && chipList.map((chip, index) => (
      <Chip
        style={{ margin: '0 5px 5px 0' }}
        key={index}
        onRequestDelete={() => deleteChip(name, index, history)}
      >
        {chip.text}
      </Chip>
    ))}
  </StyledDiv>
);

ChipList.propTypes = {
  chipList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  deleteChip: PropTypes.func,
  name: PropTypes.string,
  history: PropTypes.shape({}),
};

export default ChipList;
