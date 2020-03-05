"use strict";

exports.__esModule = true;
exports.default = transformProps;

var _processColumns = _interopRequireDefault(require("./processColumns"));

var _processMetrics = _interopRequireDefault(require("./processMetrics"));

var _processData = _interopRequireDefault(require("./processData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const processColumns = (0, _processColumns.default)();
const processMetrics = (0, _processMetrics.default)();
const processData = (0, _processData.default)();
const DTTM_ALIAS = '__timestamp';

function transformData(data, formData) {
  const {
    groupby = [],
    metrics = [],
    allColumns = []
  } = formData;
  const columns = new Set([...groupby, ...metrics, ...allColumns].map(column => column.label || column));
  let records = data; // handle timestamp columns

  if (formData.includeTime) {
    columns.add(DTTM_ALIAS);
  } // handle percentage columns.


  const percentMetrics = (formData.percentMetrics || []).map(metric => {
    var _label;

    return (_label = metric.label) != null ? _label : metric;
  });

  if (percentMetrics.length > 0) {
    const sumPercentMetrics = data.reduce((sumMetrics, item) => {
      const newSumMetrics = _extends({}, sumMetrics);

      percentMetrics.forEach(metric => {
        newSumMetrics[metric] = (sumMetrics[metric] || 0) + (item[metric] || 0);
      });
      return newSumMetrics;
    }, {});
    records = data.map(item => {
      const newItem = _extends({}, item);

      percentMetrics.forEach(metric => {
        newItem["%" + metric] = sumPercentMetrics[metric] === 0 ? null : newItem[metric] / sumPercentMetrics[metric];
      });
      return newItem;
    });
    percentMetrics.forEach(metric => {
      columns.add("%" + metric);
    });
  } // handle sortedby column


  if (formData.timeseriesLimitMetric) {
    const metric = formData.timeseriesLimitMetric.label || formData.timeseriesLimitMetric;
    columns.add(metric);
  }

  return {
    columns: [...columns],
    records
  };
}

const NOOP = () => {};

function transformProps(chartProps) {
  const {
    height,
    width,
    datasource,
    initialValues,
    formData,
    hooks,
    queryData
  } = chartProps;
  const {
    onAddFilter = NOOP
  } = hooks;
  const {
    alignPn,
    colorPn,
    includeSearch,
    metrics: rawMetrics,
    orderDesc,
    pageLength,
    percentMetrics,
    tableFilter,
    tableTimestampFormat,
    timeseriesLimitMetric
  } = formData;
  const {
    records,
    columns
  } = transformData(queryData.data, formData);
  const metrics = processMetrics({
    metrics: rawMetrics,
    percentMetrics,
    records
  });
  const processedData = processData({
    metrics,
    orderDesc,
    records,
    timeseriesLimitMetric
  });
  const processedColumns = processColumns({
    columns,
    datasource,
    metrics,
    records,
    tableTimestampFormat
  });
  return {
    alignPositiveNegative: alignPn,
    colorPositiveNegative: colorPn,
    columns: processedColumns,
    data: processedData,
    filters: initialValues,
    height,
    includeSearch,
    onAddFilter,
    orderDesc,
    pageLength: pageLength && parseInt(pageLength, 10),
    tableFilter,
    width
  };
}