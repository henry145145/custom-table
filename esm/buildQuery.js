function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { buildQueryContext, convertMetric } from '@superset-ui/query';
export default function buildQuery(formData) {
  // Set the single QueryObject's groupby field with series in formData
  return buildQueryContext(formData, baseQueryObject => {
    const isTimeseries = formData.include_time;
    let columns = [];
    let {
      groupby
    } = baseQueryObject;
    const orderby = [];
    const sortby = formData.timeseries_limit_metric;

    if (formData.all_columns && formData.all_columns.length > 0) {
      columns = [...formData.all_columns];
      const orderByColumns = formData.order_by_cols || [];
      orderByColumns.forEach(columnOrder => {
        const parsedColumnOrder = JSON.parse(columnOrder);
        orderby.push([convertMetric(parsedColumnOrder[0]), parsedColumnOrder[1]]);
      });
      groupby = [];
    } else if (sortby) {
      orderby.push([convertMetric(sortby), !formData.order_desc]);
    }

    return [_extends({}, baseQueryObject, {
      columns,
      groupby,
      is_timeseries: isTimeseries,
      orderby
    })];
  });
}