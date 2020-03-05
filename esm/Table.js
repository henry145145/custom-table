import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import DataTable from '@airbnb/lunar/lib/components/DataTable';
import Text from '@airbnb/lunar/lib/components/Text';
import Input from '@airbnb/lunar/lib/components/Input';
import withStyles from '@airbnb/lunar/lib/composers/withStyles';
import { createSelector } from 'reselect';
import getRenderer from './getRenderer';

const NOOP = () => {};

const defaultProps = {
  alignPositiveNegative: false,
  colorPositiveNegative: false,
  filters: {},
  includeSearch: false,
  onAddFilter: NOOP,
  onRemoveFilter: NOOP
};
const SEARCH_BAR_HEIGHT = 40;
const CHAR_WIDTH = 10;
const CELL_PADDING = 32;
const MAX_COLUMN_WIDTH = 300;
const htmlTagRegex = /(<([^>]+)>)/gi;

function getCellHash(cell) {
  return cell.key + "#" + cell.value;
}

function getText(value, format) {
  if (format) {
    return format.format(value);
  }

  if (typeof value === 'string') {
    return value.replace(htmlTagRegex, '');
  }

  return String(value);
}

class TableVis extends React.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "columnWidthSelector", createSelector(data => data, data => {
      const {
        rows,
        columns
      } = data;
      const keys = rows && rows.length > 0 ? Object.keys(rows[0].data) : [];
      let totalWidth = 0;
      const columnWidthMetaData = {};
      const columnsMap = {};
      columns.forEach(column => {
        columnsMap[column.key] = column;
      });
      keys.forEach(key => {
        const column = columnsMap[key];
        const format = column == null ? void 0 : column.format;
        const maxLength = Math.max(...rows.map(d => getText(d.data[key], format).length), key.length);
        const stringWidth = maxLength * CHAR_WIDTH + CELL_PADDING;
        columnWidthMetaData[key] = {
          maxWidth: MAX_COLUMN_WIDTH,
          width: stringWidth
        };
        totalWidth += Math.min(stringWidth, MAX_COLUMN_WIDTH);
      });
      return {
        columnWidthMetaData,
        totalWidth
      };
    }));

    _defineProperty(this, "handleCellSelected", cell => () => {
      const {
        selectedCells
      } = this.state;
      const {
        tableFilter,
        onRemoveFilter,
        onAddFilter
      } = this.props;

      if (!tableFilter) {
        return;
      }

      const newSelectedCells = new Set(Array.from(selectedCells));
      const cellHash = getCellHash(cell);

      if (newSelectedCells.has(cellHash)) {
        newSelectedCells.delete(cellHash);
        onRemoveFilter(cell.key, [cell.value]);
      } else {
        newSelectedCells.add(cellHash);
        onAddFilter(cell.key, [cell.value]);
      }

      this.setState({
        selectedCells: newSelectedCells
      });
    });

    _defineProperty(this, "isSelected", cell => {
      const {
        selectedCells
      } = this.state;
      return selectedCells.has(getCellHash(cell));
    });

    _defineProperty(this, "handleSearch", value => {
      const {
        searchKeyword
      } = this.state;
      const {
        data
      } = this.props;

      if (searchKeyword !== value) {
        const filteredRows = data.filter(row => {
          const content = Object.keys(row.data).map(key => row.data[key]).join('|').toLowerCase();
          return content.includes(value.toLowerCase());
        });
        this.setState({
          filteredRows,
          searchKeyword: value
        });
      }
    });

    this.state = {
      filteredRows: [],
      // eslint-disable-next-line react/no-unused-state
      filters: props.filters,
      searchKeyword: '',
      selectedCells: new Set()
    };
  }

  render() {
    const {
      cx,
      data,
      columns,
      alignPositiveNegative,
      colorPositiveNegative,
      height,
      width,
      tableFilter,
      styles,
      includeSearch
    } = this.props;
    const {
      filteredRows,
      searchKeyword
    } = this.state;
    const dataToRender = searchKeyword === '' ? data : filteredRows;
    const renderers = {};
    const columnMetadata = {};

    const convertToLowerCase = ({
      data: d
    }, key) => typeof d[key] === 'string' ? d[key].toLowerCase() : d[key];

    columns.forEach(column => {
      renderers[column.key] = getRenderer({
        alignPositiveNegative,
        colorPositiveNegative,
        column,
        enableFilter: tableFilter,
        handleCellSelected: this.handleCellSelected,
        isSelected: this.isSelected
      });

      if (column.type === 'metric') {
        columnMetadata[column.key] = {
          rightAlign: 1
        };
      }
    });
    const keys = dataToRender && dataToRender.length > 0 ? Object.keys(dataToRender[0].data) : [];
    const columnWidthInfo = this.columnWidthSelector({
      columns,
      rows: data
    });
    keys.forEach(key => {
      columnMetadata[key] = _extends({}, columnWidthInfo.columnWidthMetaData[key], {}, columnMetadata[key]);

      if (!renderers[key]) {
        renderers[key] = getRenderer({
          alignPositiveNegative,
          colorPositiveNegative,
          column: {
            key,
            label: key,
            type: 'string'
          },
          enableFilter: tableFilter,
          handleCellSelected: this.handleCellSelected,
          isSelected: this.isSelected
        });
      }
    });
    const tableHeight = includeSearch ? height - SEARCH_BAR_HEIGHT : height;
    return React.createElement(React.Fragment, null, includeSearch && React.createElement("div", {
      className: cx(styles.searchBar)
    }, React.createElement("div", {
      className: cx(styles.searchBox)
    }, React.createElement(Input, {
      compact: true,
      name: "search",
      label: "",
      placeholder: "Search",
      value: searchKeyword,
      onChange: this.handleSearch
    })), React.createElement(Text, {
      small: true
    }, "Showing ", dataToRender.length, "/", data.length, " rows")), React.createElement("div", {
      className: cx(styles.container)
    }, React.createElement(DataTable, {
      zebra: true,
      dynamicRowHeight: true,
      data: dataToRender,
      keys: keys,
      columnMetadata: columnMetadata,
      rowHeight: "micro",
      renderers: renderers,
      height: tableHeight,
      width: Math.max(columnWidthInfo.totalWidth, width),
      sortByValue: convertToLowerCase
    })));
  }

}

_defineProperty(TableVis, "propTypes", {
  data: _pt.array.isRequired,
  height: _pt.number.isRequired,
  width: _pt.number.isRequired,
  alignPositiveNegative: _pt.bool,
  colorPositiveNegative: _pt.bool,
  columns: _pt.array.isRequired,
  filters: _pt.objectOf(_pt.arrayOf(_pt.any)),
  includeSearch: _pt.bool,
  onAddFilter: _pt.func,
  onRemoveFilter: _pt.func,
  tableFilter: _pt.bool.isRequired
});

_defineProperty(TableVis, "defaultProps", defaultProps);

_defineProperty(TableVis, "getDerivedStateFromProps", (props, state) => {
  const {
    filters
  } = props;
  const {
    selectedCells,
    filters: prevFilters
  } = state;

  if (prevFilters !== filters) {
    const newSelectedCells = new Set(Array.from(selectedCells));
    Object.keys(filters).forEach(key => {
      filters[key].forEach(value => {
        newSelectedCells.add(getCellHash({
          key,
          value
        }));
      });
    });
    return _extends({}, state, {
      filters,
      selectedCells: newSelectedCells
    });
  }

  return state;
});

export default withStyles(({
  unit
}) => ({
  container: {
    display: 'grid',
    overflowX: 'scroll'
  },
  searchBar: {
    alignItems: 'baseline',
    display: 'flex',
    flexDirection: 'row-reverse',
    flexGrow: 0,
    marginBottom: unit
  },
  searchBox: {
    marginLeft: unit,
    width: 25 * unit
  }
}))(TableVis);