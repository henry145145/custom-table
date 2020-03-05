"use strict";

exports.__esModule = true;
exports.default = transformProps;

var _processColumns = _interopRequireDefault(require("../processColumns"));

var _processMetrics = _interopRequireDefault(require("../processMetrics"));

var _processData = _interopRequireDefault(require("../processData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const processColumns = (0, _processColumns.default)();
const processMetrics = (0, _processMetrics.default)();
const processData = (0, _processData.default)();

const NOOP = () => {};

function transformProps(chartProps) {
  const {
    height,
    datasource,
    initialValues,
    formData,
    hooks,
    queryData,
    width
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
  } = queryData.data;
  const metrics = processMetrics({
    metrics: rawMetrics,
    percentMetrics,
    records
  });
  const processedData = processData({
    timeseriesLimitMetric,
    orderDesc,
    records,
    metrics
  });
  const processedColumns = processColumns({
    columns,
    metrics,
    records,
    tableTimestampFormat,
    datasource
  });
  return {
    height,
    width,
    data: processedData,
    alignPositiveNegative: alignPn,
    colorPositiveNegative: colorPn,
    columns: processedColumns,
    filters: initialValues,
    includeSearch,
    onAddFilter,
    orderDesc,
    pageLength: pageLength && parseInt(pageLength, 10),
    tableFilter
  };
}