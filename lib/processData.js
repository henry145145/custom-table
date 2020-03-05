"use strict";

exports.__esModule = true;
exports.default = void 0;

var _reselect = require("reselect");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function processData(timeseriesLimitMetric, orderDesc, records, metrics) {
  const sortByKey = timeseriesLimitMetric && (timeseriesLimitMetric.label || timeseriesLimitMetric);
  let processedRecords = records;

  if (sortByKey) {
    processedRecords = records.slice().sort(orderDesc ? (a, b) => b[sortByKey] - a[sortByKey] : (a, b) => a[sortByKey] - b[sortByKey]);
  }

  return processedRecords.map(sortByKey && !metrics.includes(sortByKey) ? row => {
    const data = _extends({}, row);

    delete data[sortByKey];
    return {
      data
    };
  } : row => ({
    data: row
  }));
}

const getCreateSelectorFunction = () => (0, _reselect.createSelector)(data => data.timeseriesLimitMetric, data => data.orderDesc, data => data.records, data => data.metrics, (timeseriesLimitMetric, orderDesc, records, metrics) => processData(timeseriesLimitMetric, orderDesc, records, metrics));

var _default = getCreateSelectorFunction;
exports.default = _default;