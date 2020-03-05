"use strict";

exports.__esModule = true;
exports.default = getRenderer;

var _react = _interopRequireWildcard(require("react"));

var _constants = require("@airbnb/lunar/lib/components/DataTable/constants");

var _HTMLRenderer = _interopRequireDefault(require("./components/HTMLRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const NEGATIVE_COLOR = '#FFA8A8';
const POSITIVE_COLOR = '#ced4da';
const SELECTION_COLOR = '#EBEBEB';

const NOOP = () => {};

const HEIGHT = _constants.HEIGHT_TO_PX.micro;
const NUMBER_STYLE = {
  marginLeft: 'auto',
  marginRight: '4px',
  zIndex: 10
};

function getRenderer(_ref) {
  let {
    column,
    alignPositiveNegative,
    colorPositiveNegative,
    enableFilter,
    isSelected,
    handleCellSelected
  } = _ref;
  const {
    format,
    type
  } = column;
  const isMetric = type === 'metric';
  const cursorStyle = enableFilter && !isMetric ? 'pointer' : 'default';
  const boxContainerStyle = {
    alignItems: 'center',
    display: 'flex',
    margin: '0px 16px',
    position: 'relative',
    textAlign: isMetric ? 'right' : 'left'
  };
  const baseBoxStyle = {
    cursor: cursorStyle,
    margin: '4px -16px',
    wordBreak: 'break-all'
  };

  const selectedBoxStyle = _extends({}, baseBoxStyle, {
    backgroundColor: SELECTION_COLOR
  });

  const getBoxStyle = enableFilter ? selected => selected ? selectedBoxStyle : baseBoxStyle : () => baseBoxStyle;
  const posExtent = Math.abs(Math.max(column.maxValue, 0));
  const negExtent = Math.abs(Math.min(column.minValue, 0));
  const total = posExtent + negExtent;
  return ({
    keyName,
    row
  }) => {
    const value = row.rowData.data[keyName];
    const cell = {
      key: keyName,
      value
    };
    const handleClick = isMetric ? NOOP : (0, _react.useMemo)(() => handleCellSelected(cell), [cell]);
    let Parent;

    if (isMetric) {
      let left = 0;
      let width = 0;
      const numericValue = value;

      if (alignPositiveNegative) {
        width = Math.abs(Math.round(numericValue / Math.max(column.maxValue, Math.abs(column.minValue)) * 100));
      } else {
        left = Math.round(Math.min(negExtent + numericValue, negExtent) / total * 100);
        width = Math.round(Math.abs(numericValue) / total * 100);
      }

      const color = colorPositiveNegative && numericValue < 0 ? NEGATIVE_COLOR : POSITIVE_COLOR;

      Parent = ({
        children
      }) => {
        const barStyle = {
          background: color,
          borderRadius: 3,
          height: HEIGHT / 2 + 4,
          left: left + "%",
          position: 'absolute',
          width: width + "%"
        };
        return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
          style: barStyle
        }), _react.default.createElement("div", {
          style: NUMBER_STYLE
        }, children));
      };
    } else {
      Parent = _react.default.Fragment;
    }

    return _react.default.createElement("div", {
      onClick: handleClick
    }, _react.default.createElement("div", {
      style: getBoxStyle(isSelected(cell))
    }, _react.default.createElement("div", {
      style: boxContainerStyle
    }, _react.default.createElement(Parent, null, format ? format.format(value) : _react.default.createElement(_HTMLRenderer.default, {
      value: String(value)
    })))));
  };
}