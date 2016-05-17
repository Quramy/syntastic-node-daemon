import { resolve } from '../resolve';

class TslintChecker {
  constructor({basedir}, option) {
    this._basedir = basedir;
    this.init(option);
  }

  init(option) {
    const tslintPath = resolve('tslint', {basedir: this._basedir});
    const tslintConfigrationPath = resolve('tslint/lib/configuration', {basedir: this._basedir});
    if(!tslintPath || !tslintConfigrationPath) {
      this.isEnabled = false;
      return;
    }
    this.isEnabled = true;
    this._linterClazz = require(tslintPath);
    const findConfiguration = require(tslintConfigrationPath).findConfiguration;

    this._option = Object.assign({
      formatter: 'json',
      configuration: findConfiguration(null, this._basedir),
      rulesDirectory: []
    }, option);
  }

  check({file, contents}) {
    const ll = new this._linterClazz(file, contents, this._option);
    return JSON.parse(ll.lint().output);
  }
}

module.exports = function({basedir}, option) {
  return new TslintChecker({basedir}, option);
};
