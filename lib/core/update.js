"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = update;

var _observeJs = require("observe-js");

var _observeJs2 = _interopRequireDefault(_observeJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function update() {
  Platform.performMicrotaskCheckpoint();
};
