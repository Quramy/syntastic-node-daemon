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
    return checkerFactory(option);
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
      body,
    };
  }

  dispatch(command) {
    let result;
    this._system.log('input cmd: ' + command);
    if(command.command && command.command === 'ping') {
      this._system.write(this.createResponse({message: 'pong'}));
      return;
    }
    if(command.checker) {
      switch(command.command) {
        case 'check': 
          this._system.log(command.args.contents)
          result = this.lookupChecker(command.checker).check(command.args);
          this._system.write(this.createResponse(result));
          return;
        default:
          break;
      }
    }else{
    }

    this._system.write({type: 'error', message: 'unknown command: ' + command.command});
  }
}

