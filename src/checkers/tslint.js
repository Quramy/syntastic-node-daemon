import Linter from 'tslint';
import { findConfiguration } from "tslint/lib/configuration";

class TslintChecker {
  constructor(option) {
    this.init(option);
  }

  init(option) {
    this._option = Object.assign({
      formatter: 'json',
      configuration: findConfiguration(null, process.cwd()), // TODO
      rulesDirectory: []
    }, option);
  }

  check({file, contents}) {
    console.error(file, contents);
    const ll = new Linter(file, contents, this._option);
    return JSON.parse(ll.lint().output);
  }
}

module.exports = function(option) {
  return new TslintChecker(option);
};
