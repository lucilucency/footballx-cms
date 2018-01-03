import React from 'react';
import PropTypes from 'prop-types';
import { TableRow as MaterialTableRow } from 'material-ui/Table';
import TableHeaderColumn from './TableHeaderColumn';

const TableHeader = ({ columns, sortState, sortField, sortClick, totalWidth }) => (
  <MaterialTableRow>
    {columns.length && columns.map((column, index) => (
      <TableHeaderColumn
        key={column.displayName || index}
        column={column}
        sortClick={sortClick}
        sortField={sortField}
        sortState={sortState}
        totalWidth={totalWidth}
      />
    ))}
  </MaterialTableRow>
);

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  sortState: PropTypes.string,
  sortField: PropTypes.string,
  sortClick: PropTypes.func,
  totalWidth: PropTypes.number,
};

export default TableHeader;
