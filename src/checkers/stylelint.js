import { resolve } from '../resolve';

class StylelintChecker {

  constructor({ basedir }) {
    this._basedir = basedir;
    const path = resolve('stylelint', { basedir });
    this.linter = require(path);
    if (this.linter && this.linter.lint) {
      this.isEnabled = true;
    }
  }

  check({ contents }) {
    return this.linter.lint({
      code: contents,
      configFile: this._basedir + '/.stylelintrc',
    }).then(data => {
      if (data.errored) {
        const output = JSON.parse(data.output);
        return output[0].warnings.map(w => ({
          failure: w.text,
          startPosition: { line: w.line - 1,  position: w.column - 1, character: w.column - 1 },
          endPosition: { line: w.line - 1,  position: w.column - 1, character: w.column - 1 },
        }));
      } else {
        return [];
      }
    }).catch(e => console.error(e))
    ;
  }
}

module.exports = function({ basedir }, option) {
  return new StylelintChecker({ basedir }, option);
};
