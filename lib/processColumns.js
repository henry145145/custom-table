"use strict";

exports.__esModule = true;
exports.default = void 0;

var _numberFormat = require("@superset-ui/number-format");

var _timeFormat = require("@superset-ui/time-format");

var _reselect = require("reselect");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const DTTM_ALIAS = '__timestamp';

function processColumns(columns, metrics, records, tableTimestampFormat, datasource) {
  const {
    columnFormats,
    verboseMap
  } = datasource;
  const dataArray = {};
  metrics.forEach(metric => {
    const arr = [];
    records.forEach(record => {
      arr.push(record[metric]);
    });
    dataArray[metric] = arr;
  });
  const maxes = {};
  const mins = {};
  metrics.forEach(metric => {
    maxes[metric] = Math.max(...dataArray[metric]);
    mins[metric] = Math.min(...dataArray[metric]);
  });
  const formatPercent = (0, _numberFormat.getNumberFormatter)(_numberFormat.NumberFormats.PERCENT_3_POINT);
  const tsFormatter = (0, _timeFormat.getTimeFormatter)(tableTimestampFormat);
  const processedColumns = columns.map(key => {
    let label = verboseMap[key];
    const formatString = columnFormats == null ? void 0 : columnFormats[key];
    let formatFunction;
    let type = 'string';

    if (key === DTTM_ALIAS) {
      formatFunction = tsFormatter;
    }

    const extraField = {};

    if (metrics.includes(key)) {
      formatFunction = (0, _numberFormat.getNumberFormatter)(formatString);
      type = 'metric';
      extraField.maxValue = maxes[key];
      extraField.minValue = mins[key];
    } // Handle verbose names for percents


    if (!label) {
      if (key.length > 0 && key[0] === '%') {
        const cleanedKey = key.slice(1);
        label = "% " + (verboseMap[cleanedKey] || cleanedKey);
        formatFunction = formatPercent;
      } else {
        label = key;
      }
    }

    return _extends({
      format: formatFunction,
      key,
      label,
      type
    }, extraField);
  });
  return processedColumns;
}

const getCreateSelectorFunction = () => (0, _reselect.createSelector)(data => data.columns, data => data.metrics, data => data.records, data => data.tableTimestampFormat, data => data.datasource, (columns, metrics, records, tableTimestampFormat, datasource) => processColumns(columns, metrics, records, tableTimestampFormat, datasource));

var _default = getCreateSelectorFunction;
exports.default = _default;