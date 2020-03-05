function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo } from 'react';
import { HEIGHT_TO_PX } from '@airbnb/lunar/lib/components/DataTable/constants';
import HTMLRenderer from './components/HTMLRenderer';
const NEGATIVE_COLOR = '#FFA8A8';
const POSITIVE_COLOR = '#ced4da';
const SELECTION_COLOR = '#EBEBEB';

const NOOP = () => {};

const HEIGHT = HEIGHT_TO_PX.micro;
const NUMBER_STYLE = {
  marginLeft: 'auto',
  marginRight: '4px',
  zIndex: 10
};
export default function getRenderer(_ref) {
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
    const handleClick = isMetric ? NOOP : useMemo(() => handleCellSelected(cell), [cell]);
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
        return React.createElement(React.Fragment, null, React.createElement("div", {
          style: barStyle
        }), React.createElement("div", {
          style: NUMBER_STYLE
        }, children));
      };
    } else {
      Parent = React.Fragment;
    }

    return React.createElement("div", {
      onClick: handleClick
    }, React.createElement("div", {
      style: getBoxStyle(isSelected(cell))
    }, React.createElement("div", {
      style: boxContainerStyle
    }, React.createElement(Parent, null, format ? format.format(value) : React.createElement(HTMLRenderer, {
      value: String(value)
    })))));
  };
}