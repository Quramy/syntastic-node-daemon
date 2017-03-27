'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dispatcher = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dispatcher = exports.Dispatcher = function () {
  function Dispatcher(system) {
    _classCallCheck(this, Dispatcher);

    this._system = system;
    this._checkers = {};
  }

  _createClass(Dispatcher, [{
    key: 'validateCommand',
    value: function validateCommand(command) {}
  }, {
    key: 'createChecker',
    value: function createChecker(checkerName, option) {
      var checkerFactory = null;
      try {
        checkerFactory = require('./checkers/' + checkerName);
      } catch (e) {
        console.error('cannot find checker: ', checkerName);
        this._system.log('cannot find checker: ' + checkerName);
      }
      return checkerFactory({
        basedir: this._system.basedir
      }, option);
    }
  }, {
    key: 'lookupChecker',
    value: function lookupChecker(checkerName, option) {
      if (!this._checkers[checkerName]) {
        this._checkers[checkerName] = this.createChecker(checkerName, option);
      }
      return this._checkers[checkerName];
    }
  }, {
    key: 'createResponse',
    value: function createResponse(body) {
      return {
        type: 'response',
        success: true,
        body: body
      };
    }
  }, {
    key: 'createError',
    value: function createError(msg) {
      return {
        type: 'error',
        success: false,
        message: msg
      };
    }
  }, {
    key: 'dispatch',
    value: function dispatch(command) {
      var _this = this;

      var checker = void 0,
          result = void 0;
      if (command.command && command.command === 'ping') {
        this._system.write(this.createResponse({ message: 'pong' }));
        return;
      }
      if (command.checker) {
        switch (command.command) {
          case 'check':
            this._system.log(command.args.contents);
            checker = this.lookupChecker(command.checker);
            if (!checker.isEnabled) {
              this._system.write(this.createError('checker ' + command.checker + ' is not available'));
            } else {
              var p = void 0;
              result = checker.check(command.args);
              if (!result.then) {
                p = Promise.resolve(result);
              } else {
                p = result;
              }
              p.then(function (r) {
                return _this._system.write(_this.createResponse(r));
              });
            }
            return;
          default:
            break;
        }
      } else {}

      this._system.write(this.createError('unknown command: ' + command.command));
    }
  }]);

  return Dispatcher;
}();