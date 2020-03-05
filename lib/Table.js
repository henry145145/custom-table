"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _DataTable = _interopRequireDefault(require("@airbnb/lunar/lib/components/DataTable"));

var _Text = _interopRequireDefault(require("@airbnb/lunar/lib/components/Text"));

var _Input = _interopRequireDefault(require("@airbnb/lunar/lib/components/Input"));

var _withStyles = _interopRequireDefault(require("@airbnb/lunar/lib/composers/withStyles"));

var _reselect = require("reselect");

var _getRenderer = _interopRequireDefault(require("./getRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

class TableVis extends _react.default.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "columnWidthSelector", (0, _reselect.createSelector)(data => data, data => {
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
      renderers[column.key] = (0, _getRenderer.default)({
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
        renderers[key] = (0, _getRenderer.default)({
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
    return _react.default.createElement(_react.default.Fragment, null, includeSearch && _react.default.createElement("div", {
      className: cx(styles.searchBar)
    }, _react.default.createElement("div", {
      className: cx(styles.searchBox)
    }, _react.default.createElement(_Input.default, {
      compact: true,
      name: "search",
      label: "",
      placeholder: "Search",
      value: searchKeyword,
      onChange: this.handleSearch
    })), _react.default.createElement(_Text.default, {
      small: true
    }, "Showing ", dataToRender.length, "/", data.length, " rows")), _react.default.createElement("div", {
      className: cx(styles.container)
    }, _react.default.createElement(_DataTable.default, {
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
  data: _propTypes.default.array.isRequired,
  height: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired,
  alignPositiveNegative: _propTypes.default.bool,
  colorPositiveNegative: _propTypes.default.bool,
  columns: _propTypes.default.array.isRequired,
  filters: _propTypes.default.objectOf(_propTypes.default.arrayOf(_propTypes.default.any)),
  includeSearch: _propTypes.default.bool,
  onAddFilter: _propTypes.default.func,
  onRemoveFilter: _propTypes.default.func,
  tableFilter: _propTypes.default.bool.isRequired
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

var _default = (0, _withStyles.default)(({
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

exports.default = _default;