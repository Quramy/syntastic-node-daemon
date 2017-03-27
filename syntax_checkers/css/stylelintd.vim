"============================================================================
" FILE: syntax_checkers/css/stylelintd.vim
" AUTHOR: Quramy <yosuke.kurami@gmail.com>
"============================================================================

" Preprocessing {{{
scriptencoding utf-8
if exists('g:loaded_syntastic_stylelintd_syntax_checker')
  finish
endif

let g:loaded_syntastic_stylelintd_syntax_checker = 1
let s:save_cpo = &cpo
set cpo&vim
" Preprocessing }}}

let s:is_available = 1
function! SyntaxCheckers_css_stylelintd_IsAvailable() dict abort
  return s:is_available
endfunction

function! SyntaxCheckers_css_stylelintd_GetLocList() dict abort
  call syntastic_node_daemon#startServer()
  let req = {
        \ 'command': 'check',
        \ 'checker': 'stylelint',
        \ 'args': {
        \   'file': expand('%:p'),
        \   'contents': join(getline(0, '$'), "\n")."\n"
        \   }
        \ }
  let [result, has_error, reason] = syntastic_node_daemon#sendRequest(req)
  if has_error || !has_key(result, 'body')
    let s:is_available = 0
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
      \ 'filetype': 'css',
      \ 'name': 'stylelintd'
      \ })

let &cpo = s:save_cpo
unlet s:save_cpo
