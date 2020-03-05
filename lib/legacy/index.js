"use strict";

exports.__esModule = true;
exports.default = void 0;

var _chart = require("@superset-ui/chart");

var _lib = _interopRequireDefault(require("@airbnb/lunar/lib"));

var _transformProps = _interopRequireDefault(require("./transformProps"));

var _createMetadata = _interopRequireDefault(require("../createMetadata"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_lib.default.initialize({
  name: 'superset-datatable'
});

const {
  aesthetic
} = _lib.default; // @ts-ignore

aesthetic.globals = {};

class TableChartPlugin extends _chart.ChartPlugin {
  constructor() {
    super({
      loadChart: () => Promise.resolve().then(() => _interopRequireWildcard(require('../Table'))),
      metadata: (0, _createMetadata.default)(true),
      transformProps: _transformProps.default
    });
  }

}

exports.default = TableChartPlugin;