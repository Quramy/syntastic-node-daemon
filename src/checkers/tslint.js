import { resolve } from '../resolve';

class TslintChecker {
  constructor({ basedir }, option) {
    this._basedir = basedir;
    this.init(option);
  }

  init(option) {
    const tslintPath = resolve('tslint', { basedir: this._basedir });
    const tslintConfigrationPath = resolve('tslint/lib/configuration', { basedir: this._basedir });
    if(!tslintPath || !tslintConfigrationPath) {
      this.isEnabled = false;
      return;
    }
    this.isEnabled = true;
    const { findConfiguration } = require(tslintConfigrationPath);
    var { Linter } = require(tslintPath);
    this._configuration = findConfiguration(null, this._basedir).results;
    this._option = Object.assign({
      formatter: 'json',
      fix: false,
    }, option);
    this._linter = new Linter(this._option);
  }

  check({ file, contents }) {
    this._linter.lint(file, contents, this._configuration);
    return JSON.parse(this._linter.getResult().output);
  }
}

module.exports = function({ basedir }, option) {
  return new TslintChecker({ basedir }, option);
};
