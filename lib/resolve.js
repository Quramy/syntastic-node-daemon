"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = resolve;

var _resolve2 = require("resolve");

var _resolve3 = _interopRequireDefault(_resolve2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolve(id, opt) {
  try {
    return _resolve3.default.sync(id, opt);
  } catch (e) {
    return null;
  }
}