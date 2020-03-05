"use strict";

exports.__esModule = true;
exports.default = createMetadata;

var _translation = require("@superset-ui/translation");

var _chart = require("@superset-ui/chart");

var _thumbnail = _interopRequireDefault(require("./images/thumbnail.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMetadata(useLegacyApi = false) {
  return new _chart.ChartMetadata({
    canBeAnnotationTypes: ['EVENT', 'INTERVAL'],
    description: '',
    name: (0, _translation.t)('Table'),
    thumbnail: _thumbnail.default,
    useLegacyApi
  });
}