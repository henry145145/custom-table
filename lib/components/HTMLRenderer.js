"use strict";

exports.__esModule = true;
exports.default = HTMLRenderer;

var _react = _interopRequireWildcard(require("react"));

var _dompurify = _interopRequireDefault(require("dompurify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

function HTMLRenderer({
  value
}) {
  if (isHTML(value)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const html = (0, _react.useMemo)(() => ({
      __html: _dompurify.default.sanitize(value)
    }), [value]);
    return (// eslint-disable-next-line react/no-danger
      _react.default.createElement("div", {
        dangerouslySetInnerHTML: html
      })
    );
  } // eslint-disable-next-line react/jsx-no-useless-fragment


  return _react.default.createElement(_react.default.Fragment, null, value);
}