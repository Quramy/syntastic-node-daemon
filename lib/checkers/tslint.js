'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _resolve = require('../resolve');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TslintChecker = function () {
  function TslintChecker(_ref, option) {
    var basedir = _ref.basedir;

    _classCallCheck(this, TslintChecker);

    this._basedir = basedir;
    this.init(option);
  }

  _createClass(TslintChecker, [{
    key: 'init',
    value: function init(option) {
      var _this = this;

      var tslintPath = (0, _resolve.resolve)('tslint', { basedir: this._basedir });
      var tslintConfigrationPath = (0, _resolve.resolve)('tslint/lib/configuration', { basedir: this._basedir });
      if (!tslintPath || !tslintConfigrationPath) {
        this.isEnabled = false;
        return;
      }
      this.isEnabled = true;

      var _require = require(tslintConfigrationPath);

      var findConfiguration = _require.findConfiguration;

      var _require2 = require(tslintPath);

      var Linter = _require2.Linter;

      this._configuration = findConfiguration(null, this._basedir).results;
      this._option = Object.assign({
        formatter: 'json',
        fix: false
      }, option);
      this._factory = function () {
        return new Linter(_this._option);
      };
    }
  }, {
    key: 'check',
    value: function check(_ref2) {
      var file = _ref2.file;
      var contents = _ref2.contents;

      var linter = this._factory();
      linter.lint(file, contents, this._configuration);
      return JSON.parse(linter.getResult().output);
    }
  }]);

  return TslintChecker;
}();

module.exports = function (_ref3, option) {
  var basedir = _ref3.basedir;

  return new TslintChecker({ basedir: basedir }, option);
};