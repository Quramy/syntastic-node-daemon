"============================================================================
" FILE: syntax_checkers/typescript/tslintd.vim
" AUTHOR: Quramy <yosuke.kurami@gmail.com>
"============================================================================

" Preprocessing {{{
scriptencoding utf-8
if exists('g:loaded_syntastic_tslintd_syntax_checker')
  finish
endif

let g:loaded_syntastic_tslintd_syntax_checker = 1
let s:save_cpo = &cpo
set cpo&vim
" Preprocessing }}}

function! SyntaxCheckers_typescript_tslintd_IsAvailable() dict abort
  return 1
endfunction

function! SyntaxCheckers_typescript_tslintd_GetLocList() dict abort
  "let quickfix_list = tslintd#createFixlist()
  call syntastic_node_daemon#startServer()
  let req = {
        \ 'command': 'check',
        \ 'checker': 'tslint',
        \ 'args': {
        \   'file': expand('%:p'),
        \   'contents': join(getline(0, '$'), "\n")
        \   }
        \ }
  let [result, has_error, reason] = syntastic_node_daemon#sendRequest(req)
  if has_error 
    return []
  endif
  let quickfix_list = []
  let bufnr = bufnr('%')
  for item in result.body
    let qf = {}
    let qf.text = item.failure
    let qf.lnum = item.startPosition.line + 1
    let qf.col = item.startPosition.character + 1
    let qf.bufnr = bufnr
    let qf.type = 'E'
    let qf.valid = 1
    call add(quickfix_list, qf)
  endfor
  return quickfix_list
endfunction

call g:SyntasticRegistry.CreateAndRegisterChecker({
      \ 'filetype': 'typescript',
      \ 'name': 'tslintd'
      \ })

let &cpo = s:save_cpo
unlet s:save_cpo