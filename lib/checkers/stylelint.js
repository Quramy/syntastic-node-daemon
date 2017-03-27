'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _resolve = require('../resolve');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StylelintChecker = function () {
  function StylelintChecker(_ref) {
    var basedir = _ref.basedir;

    _classCallCheck(this, StylelintChecker);

    this._basedir = basedir;
    var path = (0, _resolve.resolve)('stylelint', { basedir: basedir });
    this.linter = require(path);
    if (this.linter && this.linter.lint) {
      this.isEnabled = true;
    }
  }

  _createClass(StylelintChecker, [{
    key: 'check',
    value: function check(_ref2) {
      var contents = _ref2.contents;

      return this.linter.lint({
        code: contents,
        configFile: this._basedir + '/.stylelintrc'
      }).then(function (data) {
        if (data.errored) {
          var output = JSON.parse(data.output);
          return output[0].warnings.map(function (w) {
            return {
              failure: w.text,
              startPosition: { line: w.line - 1, position: w.column - 1, character: w.column - 1 },
              endPosition: { line: w.line - 1, position: w.column - 1, character: w.column - 1 }
            };
          });
        } else {
          return [];
        }
      }).catch(function (e) {
        return console.error(e);
      });
    }
  }]);

  return StylelintChecker;
}();

module.exports = function (_ref3, option) {
  var basedir = _ref3.basedir;

  return new StylelintChecker({ basedir: basedir }, option);
};