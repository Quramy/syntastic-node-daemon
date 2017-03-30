# syntatstic node daemon

[![Greenkeeper badge](https://badges.greenkeeper.io/Quramy/syntastic-node-daemon.svg)](https://greenkeeper.io/)
Provides fast [Syntastic](https://github.com/scrooloose/syntastic) checkers.

This plugin includes the following components:
 * checker server implemented with Node.js
 * syntastic checker(Vim plugin)

## How to install

```vim
NeoBundle 'Quramy/syntastic-node-daemon'
```

```sh
cd ~/.vim/bundle/Quramy/syntastic-node-daemon
npm i
```

## Configure

```vim
let g:syntastic_typescript_checkers = ['tslintd'] " instead of 'tslint' checker
let g:syntastic_css_checkers = ['stylelintd']
```

## Remarks

The syntastic server's checker works only if you have installed lint(e.g. tslint) package locally. If you don't have, the server returns no syntax error.

### Available checkers

* `tslintd`: [tslint](http://palantir.github.io/tslint/)
* `stylelint`: [stylelint](https://stylelint.io/)
