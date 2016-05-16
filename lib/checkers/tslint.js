'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tslint = require('tslint');

var _tslint2 = _interopRequireDefault(_tslint);

var _configuration = require('tslint/lib/configuration');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TslintChecker = function () {
  function TslintChecker(option) {
    _classCallCheck(this, TslintChecker);

    this.init(option);
  }

  _createClass(TslintChecker, [{
    key: 'init',
    value: function init(option) {
      this._option = Object.assign({
        formatter: 'json',
        configuration: (0, _configuration.findConfiguration)(null, process.cwd()), // TODO
        rulesDirectory: []
      }, option);
    }
  }, {
    key: 'check',
    value: function check(_ref) {
      var file = _ref.file;
      var contents = _ref.contents;

      console.error(file, contents);
      var ll = new _tslint2.default(file, contents, this._option);
      return JSON.parse(ll.lint().output);
    }
  }]);

  return TslintChecker;
}();

module.exports = function (option) {
  return new TslintChecker(option);
};