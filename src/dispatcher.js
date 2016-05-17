import fs from 'fs';
import path from 'path';

export class Dispatcher {
  constructor(system) {
    this._system = system;
    this._checkers = {
    };
  }

  validateCommand(command) {
  }

  createChecker(checkerName, option) {
    let checkerFactory = null;
    try {
      checkerFactory = require('./checkers/' + checkerName);
    }catch(e){
      console.error('cannot find checker: ', checkerName);
      this._system.log('cannot find checker: ' + checkerName)
    }
    return checkerFactory({
      basedir: this._system.basedir,
    }, option);
  }

  lookupChecker(checkerName, option) {
    if(!this._checkers[checkerName]) {
      this._checkers[checkerName] = this.createChecker(checkerName, option);
    }
    return this._checkers[checkerName];
  }

  createResponse(body) {
    return {
      type: 'response',
      success: true,
      body,
    };
  }

  createError(msg) {
    return {
      type: 'error',
      success: false,
      message: msg,
    };
  }

  dispatch(command) {
    let checker, result;
    this._system.log('input cmd: ' + command);
    if(command.command && command.command === 'ping') {
      this._system.write(this.createResponse({message: 'pong'}));
      return;
    }
    if(command.checker) {
      switch(command.command) {
        case 'check': 
          this._system.log(command.args.contents)
          checker = this.lookupChecker(command.checker);
          if (!checker.isEnabled) {
            this._system.write(this.createError(`checker ${command.checker} is not available`));
          }else{
            result = checker.check(command.args);
            this._system.write(this.createResponse(result));
          }
          return;
        default:
          break;
      }
    }else{
    }

    this._system.write(this.createError('unknown command: ' + command.command));
  }
}

