function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import getProcessColumnsFunction from './processColumns';
import getProcessMetricsFunction from './processMetrics';
import getProcessDataFunction from './processData';
const processColumns = getProcessColumnsFunction();
const processMetrics = getProcessMetricsFunction();
const processData = getProcessDataFunction();
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

export default function transformProps(chartProps) {
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