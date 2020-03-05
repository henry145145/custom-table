import { createSelector } from 'reselect';

function processMetrics(metrics, percentMetrics, records) {
  const processedMetrics = (metrics || []).map(m => {
    var _label;

    return (_label = m.label) != null ? _label : m;
  });
  const processedPercentMetrics = (percentMetrics || []).map(m => {
    var _label2;

    return (_label2 = m.label) != null ? _label2 : m;
  }).map(m => "%" + m);
  return processedMetrics.concat(processedPercentMetrics).filter(m => typeof records[0][m] === 'number');
}

const getCreateSelectorFunction = () => createSelector(data => data.metrics, data => data.percentMetrics, data => data.records, (metrics, percentMetrics, records) => processMetrics(metrics, percentMetrics, records));

export default getCreateSelectorFunction;