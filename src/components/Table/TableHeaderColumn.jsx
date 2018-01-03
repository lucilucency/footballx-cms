import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import uuid from 'uuid';
import { TableHeaderColumn as MaterialTableHeaderColumn } from 'material-ui/Table';
import { getSortIcon } from './tableHelpers';
import { StyledHeaderCell } from './Styled';

const TableHeaderColumn = ({ column, sortClick, sortField, sortState }) => {
  const tooltipId = uuid.v4();
  const style = {};

  if (column.center) {
    style.justifyContent = 'center';
  }

  return (
    <MaterialTableHeaderColumn>
      <StyledHeaderCell
        onClick={() => column.sortFn && sortClick(column.field, sortState, column.sortFn)}
        style={style}
      >
        <div data-tip={column.tooltip && true} data-for={tooltipId} style={{ color: column.color }}>
          {column.displayName}
          {column.sortFn && getSortIcon(sortState, sortField, column.field, { height: 14, width: 14 })}
          {column.tooltip &&
          <ReactTooltip id={tooltipId} place="top" type="light" effect="solid">
            {column.tooltip}
          </ReactTooltip>
          }
        </div>
      </StyledHeaderCell>
    </MaterialTableHeaderColumn>
  );
};

TableHeaderColumn.propTypes = {
  column: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  sortClick: PropTypes.func,
  sortField: PropTypes.string,
  sortState: PropTypes.string,
};

export default TableHeaderColumn;
