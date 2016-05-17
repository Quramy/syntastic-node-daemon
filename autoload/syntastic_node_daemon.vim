"============================================================================
" FILE: autoload/syntastic_node_daemon.vim
" AUTHOR: Quramy <yosuke.kurami@gmail.com>
"============================================================================
"
scriptencoding utf-8

let s:save_cpo = &cpo
set cpo&vim

let s:V = vital#of('syntastic_node_daemon')
function! syntastic_node_daemon#vital()
  return s:V
endfunction

let s:P = s:V.import('ProcessManager')
let s:Prelude = s:V.import('Prelude')
let s:Path = s:V.import('System.Filepath')
let s:Json = s:V.import('Web.JSON')
let s:plugin_dir = s:Path.join(expand('<sfile>:p:h'), '../')
let s:snd = 'syntastic_node_daemon'

function! syntastic_node_daemon#plugin_dir()
  return s:plugin_dir
endfunction

" If not exsiting process of daemon, create it.
function! syntastic_node_daemon#startServer()
  if s:P.state(s:snd) == 'existing'
    return 'existing'
  endif
  let l:cmd = 'node '.s:Path.join(s:plugin_dir, 'lib/daemon.js')
  let l:args = ' --basedir "'.s:Prelude.path2project_directory(expand('%')).'"'
  let l:is_new = s:P.touch(s:snd, l:cmd.l:args)
  return l:is_new
endfunction

"Terminate daemon process if it exsits.
function! syntastic_node_daemon#stopServer()
  if syntastic_node_daemon#statusServer() != 'undefined'
    let l:res = s:P.term(s:snd)
    return l:res
  endif
endfunction

function! syntastic_node_daemon#statusServer()
  return s:P.state(s:snd)
endfunction

function! syntastic_node_daemon#sendRequest(req)
  let msg = s:Json.encode(a:req)
  call s:P.writeln(s:snd, msg)
  let [l:count, l:has_out] = [0, 0]
  while l:count < 30 && !l:has_out
    let [out, err, type] = s:P.read_wait(s:snd, 0.01, ['Content:\s\+'])
    if type ==# 'matched'
      let l:has_out = 1
      return [s:Json.decode(out), 0, '']
    else
      let l:count = l:count + 1
    endif
  endwhile
  return [{}, 1, 'timedout']
endfunction

let &cpo = s:save_cpo
unlet s:save_cpo
