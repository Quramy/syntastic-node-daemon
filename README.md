# syntatstic node daemon
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
```

### Available checkers

* `tslintd`: [tslint](http://palantir.github.io/tslint/)
