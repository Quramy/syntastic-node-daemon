'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StdioServer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dispatcher = require('./dispatcher');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StdioServer = exports.StdioServer = function () {
  function StdioServer() {
    _classCallCheck(this, StdioServer);

    this._dispatcher = new _dispatcher.Dispatcher(this);
    this._enableLog = !!process.env['SYNTASTIC_NODE_DAEMON_LOG'];
    this._logFilePath = _path2.default.join(process.cwd(), 'snd-debug.log');
  }

  _createClass(StdioServer, [{
    key: 'createCommand',
    value: function createCommand(msg) {
      if (!msg || !msg.length) return null;
      try {
        return JSON.parse(msg);
      } catch (e) {
        this.log('request must be a JSON ' + msg);
        return null;
      }
    }
  }, {
    key: 'log',
    value: function log(msg) {
      var newLine = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!this._enableLog) return;
      if (newLine) {
        _fs2.default.appendFileSync(this._logFilePath, msg + '\n', 'utf-8');
      } else {
        _fs2.default.appendFileSync(this._logFilePath, msg, 'utf-8');
      }
    }
  }, {
    key: 'write',
    value: function write(msg) {
      var outMsg = JSON.stringify(msg);
      this.log(outMsg);
      process.stdout.write("Content: " + outMsg + '\n');
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      process.stdin.setEncoding('utf8');

      process.stdin.on('readable', function () {
        var chunks = process.stdin.read();
        if (!chunks) return;
        chunks.split('\n').forEach(function (chunk) {
          if (!chunk.length) return;
          _this.log('data: ' + chunk);
          var cmd = _this.createCommand(chunk);
          if (cmd) {
            _this._dispatcher.dispatch(cmd);
          } else {
            _this.write({ type: 'error', message: 'request must bu a JSON', request: chunk });
          }
        });
      });

      process.stdin.on('end', function () {
        _this.log('Bye!');
      });

      process.on('uncaughtException', function (err) {
        _this.log(err);
        console.error(err);
      });

      if (this._enableLog) {
        _fs2.default.writeFileSync(this._logFilePath, 'listening on STDIN...\n', 'utf-8');
      }
    }
  }]);

  return StdioServer;
}();

var server = new StdioServer();
server.start();