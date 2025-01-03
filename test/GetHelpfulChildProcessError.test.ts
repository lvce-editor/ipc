import { expect, test } from '@jest/globals'
import * as GetHelpfulChildProcessError from '../src/parts/GetHelpfulChildProcessError/GetHelpfulChildProcessError.js'

test('getHelpfulChildProcessError - incompatible native module', () => {
  const stderr = `innerError Error: Cannot find module '../build/Debug/pty.node'
Require stack:
- /test/packages/pty-host/node_modules/node-pty/lib/unixTerminal.js
- /test/packages/pty-host/node_modules/node-pty/lib/index.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1002:15)
    at Module._load (node:internal/modules/cjs/loader:848:27)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at Module.require (node:internal/modules/cjs/loader:1068:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/test/packages/pty-host/node_modules/node-pty/src/unixTerminal.ts:17:11)
    at Module._compile (node:internal/modules/cjs/loader:1174:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/test/packages/pty-host/node_modules/node-pty/lib/unixTerminal.js',
    '/test/packages/pty-host/node_modules/node-pty/lib/index.js'
  ]
}
node:electron/js2c/asar_bundle:2
(()=>{"use strict";var t={"./lib/asar/fs-wrapper.ts":(t,e,s)=>{var r=s("./lib/common/webpack-provider.ts").process,n=s("./lib/common/webpack-provider.ts")._global;Object.defineProperty(e,"__esModule",{value:!0}),e.wrapFsWithAsar=void 0;const i=s("buffer"),a=s("path"),o=s("util"),c=r._linkedBinding("electron_common_asar"),f=s("module"),l=n.Promise,u=r.env.ELECTRON_NO_ASAR&&"browser"!==r.type&&"renderer"!==r.type,h=r.internalBinding;delete r.internalBinding;const nextTick=(t,e=[])=>{r.nextTick((()=>t(...e)))},p=new Map,getOrCreateArchive=t=>{if(p.has(t))return p.get(t);try{const e=new c.Archive(t);return p.set(t,e),e}catch{return null}},d=/.asar/i,splitPath=t=>{if(r.noAsar||u)return{isAsar:!1};let e=t;return i.Buffer.isBuffer(t)&&(e=t.toString()),"string"!=typeof e?{isAsar:!1}:d.test(e)?c.splitPath(a.normalize(e)):{isAsar:!1}};let y=0;const _=r.getuid?.()??0,P=r.getgid?.()??0,A=new Date,asarStatsToFsStats=function(t){const{Stats:e,constants:r}=s("fs");let n=r.S_IROTH^r.S_IRGRP^r.S_IRUSR^r.S_IWUSR;return t.isFile?n^=r.S_IFREG:t.isDirectory?n^=r.S_IFDIR:t.isLink&&(n^=r.S_IFLNK),new e(1,n,1,_,P,0,void 0,++y,t.size,void 0,A.getTime(),A.getTime(),A.getTime(),A.getTime())},createError=(t,{asarPath:e,filePath:s}={})=>{let r;switch(t){case"NOT_FOUND":r=new Error(\`ENOENT, \${s} not found in \${e}\`),r.code="ENOENT",r.errno=-2;break;case"NOT_DIR":r=new Error("ENOTDIR, not a directory"),r.code="ENOTDIR",r.errno=-20;break;case"NO_ACCESS":r=new Error(\`EACCES: permission denied, access '\${s}'\`),r.code="EACCES",r.errno=-13;break;case"INVALID_ARCHIVE":r=new Error(\`Invalid package \${e}\`);break;default:throw new Error(\`Invalid error type "\${t}" passed to createError.\`)}return r},overrideAPISync=function(t,e,s,r=!1){null==s&&(s=0);const n=t[e],func=function(...t){const e=t[s],r=splitPath(e);if(!r.isAsar)return n.apply(this,t);const{asarPath:i,filePath:a}=r,o=getOrCreateArchive(i);if(!o)throw createError("INVALID_ARCHIVE",{asarPath:i});const c=o.copyFileOut(a);if(!c)throw createError("NOT_FOUND",{asarPath:i,filePath:a});return t[s]=c,n.apply(this,t)};if(r)return func;t[e]=func},overrideAPI=function(t,e,s){null==s&&(s=0);const r=t[e];t[e]=function(...n){const i=n[s],a=splitPath(i);if(!a.isAsar)return r.apply(this,n);const{asarPath:o,filePath:c}=a,f=n[n.length-1];if("function"!=typeof f)return overrideAPISync(t,e,s,!0).apply(this,n);const l=getOrCreateArchive(o);if(!l){const t=createError("INVALID_ARCHIVE",{asarPath:o});return void nextTick(f,[t])}const u=l.copyFileOut(c);if(u)return n[s]=u,r.apply(this,n);{const t=createError("NOT_FOUND",{asarPath:o,filePath:c});nextTick(f,[t])}},r[o.promisify.custom]&&(t[e][o.promisify.custom]=makePromiseFunction(r[o.promisify.custom],s)),t.promises&&t.promises[e]&&(t.promises[e]=makePromiseFunction(t.promises[e],s))};let I;function validateBufferIntegrity(t,e){if(!e)return;I=I||s("crypto");const n=I.createHash(e.algorithm).update(t).digest("hex");n!==e.hash&&(console.error(\`ASAR Integrity Violation: got a hash mismatch (\${n} vs \${e.hash})\`),r.exit(1))}const makePromiseFunction=function(t,e){return function(...s){const r=s[e],n=splitPath(r);if(!n.isAsar)return t.apply(this,s);const{asarPath:i,filePath:a}=n,o=getOrCreateArchive(i);if(!o)return l.reject(createError("INVALID_ARCHIVE",{asarPath:i}));const c=o.copyFileOut(a);return c?(s[e]=c,t.apply(this,s)):l.reject(createError("NOT_FOUND",{asarPath:i,filePath:a}))}};e.wrapFsWithAsar=t=>{const e=new Map,logASARAccess=(n,i,a)=>{if(r.env.ELECTRON_LOG_ASAR_READS){if(!e.has(n)){const r=s("path"),i=\`\${r.basename(n,".asar")}-access-log.txt\`,a=r.join(s("os").tmpdir(),i);e.set(n,t.openSync(a,"a"))}t.writeSync(e.get(n),\`\${a}: \${i}\n\`)}},{lstatSync:n}=t;t.lstatSync=(t,e)=>{const s=splitPath(t);if(!s.isAsar)return n(t,e);const{asarPath:r,filePath:i}=s,a=getOrCreateArchive(r);if(!a)throw createError("INVALID_ARCHIVE",{asarPath:r});const o=a.stat(i);if(!o)throw createError("NOT_FOUND",{asarPath:r,filePath:i});return asarStatsToFsStats(o)};const{lstat:c}=t;t.lstat=(t,e,s)=>{const r=splitPath(t);if("function"==typeof e&&(s=e,e={}),!r.isAsar)return c(t,e,s);const{asarPath:n,filePath:i}=r,a=getOrCreateArchive(n);if(!a){const t=createError("INVALID_ARCHIVE",{asarPath:n});return void nextTick(s,[t])}const o=a.stat(i);if(!o){const t=createError("NOT_FOUND",{asarPath:n,filePath:i});return void nextTick(s,[t])}const f=asarStatsToFsStats(o);nextTick(s,[null,f])},t.promises.lstat=o.promisify(t.lstat);const{statSync:u}=t;t.statSync=(e,s)=>{const{isAsar:r}=splitPath(e);return r?t.lstatSync(e,s):u(e,s)};const{stat:p}=t;t.stat=(e,s,n)=>{const{isAsar:i}=splitPath(e);if("function"==typeof s&&(n=s,s={}),!i)return p(e,s,n);r.nextTick((()=>t.lstat(e,s,n)))},t.promises.stat=o.promisify(t.stat);const wrapRealpathSync=function(t){return function(e,s){const r=splitPath(e);if(!r.isAsar)return t.apply(this,arguments);const{asarPath:n,filePath:i}=r,o=getOrCreateArchive(n);if(!o)throw createError("INVALID_ARCHIVE",{asarPath:n});const c=o.realpath(i);if(!1===c)throw createError("NOT_FOUND",{asarPath:n,filePath:i});return a.join(t(n,s),c)}},{realpathSync:d}=t;t.realpathSync=wrapRealpathSync(d),t.realpathSync.native=wrapRealpathSync(d.native);const wrapRealpath=function(t){return function(e,s,r){const n=splitPath(e);if(!n.isAsar)return t.apply(this,arguments);const{asarPath:i,filePath:o}=n;arguments.length<3&&(r=s,s={});const c=getOrCreateArchive(i);if(!c){const t=createError("INVALID_ARCHIVE",{asarPath:i});return void nextTick(r,[t])}const f=c.realpath(o);if(!1!==f)t(i,s,((t,e)=>{if(null===t){const t=a.join(e,f);r(null,t)}else r(t)}));else{const t=createError("NOT_FOUND",{asarPath:i,filePath:o});nextTick(r,[t])}}},{realpath:y}=t;t.realpath=wrapRealpath(y),t.realpath.native=wrapRealpath(y.native),t.promises.realpath=o.promisify(t.realpath.native);const{exists:_}=t;t.exists=function exists(t,e){const s=splitPath(t);if(!s.isAsar)return _(t,e);const{asarPath:r,filePath:n}=s,i=getOrCreateArchive(r);if(!i){const t=createError("INVALID_ARCHIVE",{asarPath:r});return void nextTick(e,[t])}const a=!1!==i.stat(n);nextTick(e,[a])},t.exists[o.promisify.custom]=function exists(t){const e=splitPath(t);if(!e.isAsar)return _[o.promisify.custom](t);const{asarPath:s,filePath:r}=e,n=getOrCreateArchive(s);if(!n){const t=createError("INVALID_ARCHIVE",{asarPath:s});return l.reject(t)}return l.resolve(!1!==n.stat(r))};const{existsSync:P}=t;t.existsSync=t=>{const e=splitPath(t);if(!e.isAsar)return P(t);const{asarPath:s,filePath:r}=e,n=getOrCreateArchive(s);return!!n&&!1!==n.stat(r)};const{access:A}=t;t.access=function(e,s,r){const n=splitPath(e);if(!n.isAsar)return A.apply(this,arguments);const{asarPath:i,filePath:a}=n;"function"==typeof s&&(r=s,s=t.constants.F_OK);const o=getOrCreateArchive(i);if(!o){const t=createError("INVALID_ARCHIVE",{asarPath:i});return void nextTick(r,[t])}const c=o.getFileInfo(a);if(!c){const t=createError("NOT_FOUND",{asarPath:i,filePath:a});return void nextTick(r,[t])}if(c.unpacked){const e=o.copyFileOut(a);return t.access(e,s,r)}const f=o.stat(a);if(f)if(s&t.constants.W_OK){const t=createError("NO_ACCESS",{asarPath:i,filePath:a});nextTick(r,[t])}else nextTick(r);else{const t=createError("NOT_FOUND",{asarPath:i,filePath:a});nextTick(r,[t])}},t.promises.access=o.promisify(t.access);const{accessSync:I}=t;function fsReadFileAsar(e,s,r){const n=splitPath(e);if(n.isAsar){const{asarPath:e,filePath:a}=n;if("function"==typeof s)r=s,s={encoding:null};else if("string"==typeof s)s={encoding:s};else if(null==s)s={encoding:null};else if("object"!=typeof s)throw new TypeError("Bad arguments");const{encoding:o}=s,c=getOrCreateArchive(e);if(!c){const t=createError("INVALID_ARCHIVE",{asarPath:e});return void nextTick(r,[t])}const f=c.getFileInfo(a);if(!f){const t=createError("NOT_FOUND",{asarPath:e,filePath:a});return void nextTick(r,[t])}if(0===f.size)return void nextTick(r,[null,o?"":i.Buffer.alloc(0)]);if(f.unpacked){const e=c.copyFileOut(a);return t.readFile(e,s,r)}const l=i.Buffer.alloc(f.size),u=c.getFdAndValidateIntegrityLater();if(!(u>=0)){const t=createError("NOT_FOUND",{asarPath:e,filePath:a});return void nextTick(r,[t])}logASARAccess(e,a,f.offset),t.read(u,l,0,f.size,f.offset,(t=>{validateBufferIntegrity(l,f.integrity),r(t,o?l.toString(o):l)}))}}t.accessSync=function(e,s){const r=splitPath(e);if(!r.isAsar)return I.apply(this,arguments);const{asarPath:n,filePath:i}=r;null==s&&(s=t.constants.F_OK);const a=getOrCreateArchive(n);if(!a)throw createError("INVALID_ARCHIVE",{asarPath:n});const o=a.getFileInfo(i);if(!o)throw createError("NOT_FOUND",{asarPath:n,filePath:i});if(o.unpacked){const e=a.copyFileOut(i);return t.accessSync(e,s)}const c=a.stat(i);if(!c)throw createError("NOT_FOUND",{asarPath:n,filePath:i});if(s&t.constants.W_OK)throw createError("NO_ACCESS",{asarPath:n,filePath:i})};const{readFile:N}=t;t.readFile=function(t,e,s){const r=splitPath(t);return r.isAsar?fsReadFileAsar(t,e,s):N.apply(this,arguments)};const{readFile:O}=t.promises;t.promises.readFile=function(t,e){const s=splitPath(t);if(!s.isAsar)return O.apply(this,arguments);const r=o.promisify(fsReadFileAsar);return r(t,e)};const{readFileSync:F}=t;t.readFileSync=function(e,s){const r=splitPath(e);if(!r.isAsar)return F.apply(this,arguments);const{asarPath:n,filePath:a}=r,o=getOrCreateArchive(n);if(!o)throw createError("INVALID_ARCHIVE",{asarPath:n});const c=o.getFileInfo(a);if(!c)throw createError("NOT_FOUND",{asarPath:n,filePath:a});if(0===c.size)return s?"":i.Buffer.alloc(0);if(c.unpacked){const e=o.copyFileOut(a);return t.readFileSync(e,s)}if(s){if("string"==typeof s)s={encoding:s};else if("object"!=typeof s)throw new TypeError("Bad arguments")}else s={encoding:null};const{encoding:f}=s,l=i.Buffer.alloc(c.size),u=o.getFdAndValidateIntegrityLater();if(!(u>=0))throw createError("NOT_FOUND",{asarPath:n,filePath:a});return logASARAccess(n,a,c.offset),t.readSync(u,l,0,c.size,c.offset),validateBufferIntegrity(l,c.integrity),f?l.toString(f):l};const{readdir:g}=t;t.readdir=function(e,s,r){const n=splitPath(e);if("function"==typeof s&&(r=s,s=void 0),!n.isAsar)return g.apply(this,arguments);const{asarPath:i,filePath:o}=n,c=getOrCreateArchive(i);if(!c){const t=createError("INVALID_ARCHIVE",{asarPath:i});return void nextTick(r,[t])}const f=c.readdir(o);if(f)if(s?.withFileTypes){const e=[];for(const s of f){const n=a.join(o,s),f=c.stat(n);if(!f){const t=createError("NOT_FOUND",{asarPath:i,filePath:n});return void nextTick(r,[t])}f.isFile?e.push(new t.Dirent(s,t.constants.UV_DIRENT_FILE)):f.isDirectory?e.push(new t.Dirent(s,t.constants.UV_DIRENT_DIR)):f.isLink&&e.push(new t.Dirent(s,t.constants.UV_DIRENT_LINK))}nextTick(r,[null,e])}else nextTick(r,[null,f]);else{const t=createError("NOT_FOUND",{asarPath:i,filePath:o});nextTick(r,[t])}},t.promises.readdir=o.promisify(t.readdir);const{readdirSync:m}=t;t.readdirSync=function(e,s){const r=splitPath(e);if(!r.isAsar)return m.apply(this,arguments);const{asarPath:n,filePath:i}=r,o=getOrCreateArchive(n);if(!o)throw createError("INVALID_ARCHIVE",{asarPath:n});const c=o.readdir(i);if(!c)throw createError("NOT_FOUND",{asarPath:n,filePath:i});if(s&&s.withFileTypes){const e=[];for(const s of c){const r=a.join(i,s),c=o.stat(r);if(!c)throw createError("NOT_FOUND",{asarPath:n,filePath:r});c.isFile?e.push(new t.Dirent(s,t.constants.UV_DIRENT_FILE)):c.isDirectory?e.push(new t.Dirent(s,t.constants.UV_DIRENT_DIR)):c.isLink&&e.push(new t.Dirent(s,t.constants.UV_DIRENT_LINK))}return e}return c};const{internalModuleReadJSON:S}=h("fs");h("fs").internalModuleReadJSON=e=>{const s=splitPath(e);if(!s.isAsar)return S(e);const{asarPath:r,filePath:n}=s,a=getOrCreateArchive(r);if(!a)return[];const o=a.getFileInfo(n);if(!o)return[];if(0===o.size)return["",!1];if(o.unpacked){const e=a.copyFileOut(n),s=t.readFileSync(e,{encoding:"utf8"});return[s,s.length>0]}const c=i.Buffer.alloc(o.size),f=a.getFdAndValidateIntegrityLater();if(!(f>=0))return[];logASARAccess(r,n,o.offset),t.readSync(f,c,0,o.size,o.offset),validateBufferIntegrity(c,o.integrity);const l=c.toString("utf8");return[l,l.length>0]};const{internalModuleStat:D}=h("fs");if(h("fs").internalModuleStat=t=>{const e=splitPath(t);if(!e.isAsar)return D(t);const{asarPath:s,filePath:r}=e,n=getOrCreateArchive(s);if(!n)return-34;const i=n.stat(r);return i?i.isDirectory?1:0:-34},"win32"===r.platform){const{mkdir:e}=t;t.mkdir=(t,s,r)=>{"function"==typeof s&&(r=s,s={});const n=splitPath(t);if(n.isAsar&&n.filePath.length>0){const t=createError("NOT_DIR");nextTick(r,[t])}else e(t,s,r)},t.promises.mkdir=o.promisify(t.mkdir);const{mkdirSync:s}=t;t.mkdirSync=function(t,e){const r=splitPath(t);if(r.isAsar&&r.filePath.length)throw createError("NOT_DIR");return s(t,e)}}function invokeWithNoAsar(t){return function(){const e=r.noAsar;r.noAsar=!0;try{return t.apply(this,arguments)}finally{r.noAsar=e}}}overrideAPI(t,"copyFile"),overrideAPISync(t,"copyFileSync"),overrideAPI(t,"open"),overrideAPISync(r,"dlopen",1),overrideAPISync(f._extensions,".node",1),overrideAPISync(t,"openSync");const overrideChildProcess=t=>{const{exec:e,execSync:s}=t;t.exec=invokeWithNoAsar(e),t.exec[o.promisify.custom]=invokeWithNoAsar(e[o.promisify.custom]),t.execSync=invokeWithNoAsar(s),overrideAPI(t,"execFile"),overrideAPISync(t,"execFileSync")},w=new WeakSet;if(r.env.ELECTRON_EAGER_ASAR_HOOK_FOR_TESTING)overrideChildProcess(s("child_process"));else{const t=f._load;f._load=(e,...s)=>{const r=t(e,...s);if("child_process"===e&&!w.has(r)){w.add(r);overrideChildProcess(r)}return r}}}},"./lib/common/webpack-provider.ts":(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Buffer=e.process=e._global=void 0;const s="undefined"!=typeof globalThis?globalThis.global:(self||window).global;e._global=s;const r=s.process;e.process=r;const n=s.Buffer;e.Buffer=n},buffer:t=>{t.exports=require("buffer")},child_process:t=>{t.exports=require("child_process")},crypto:t=>{t.exports=require("crypto")},fs:t=>{t.exports=require("fs")},module:t=>{t.exports=require("module")},os:t=>{t.exports=require("os")},path:t=>{t.exports=require("path")},util:t=>{t.exports=require("util")}},e={};function __webpack_require__(s){var r=e[s];if(void 0!==r)return r.exports;var n=e[s]={exports:{}};return t[s](n,n.exports,__webpack_require__),n.exports}var s={};(()=>{var t=s;Object.defineProperty(t,"__esModule",{value:!0});(0,__webpack_require__("./lib/asar/fs-wrapper.ts").wrapFsWithAsar)(__webpack_require__("fs"))})()})();


Error: The module '/test/packages/pty-host/node_modules/node-pty/build/Release/pty.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 108. This version of Node.js requires
NODE_MODULE_VERSION 113. Please try re-compiling or re-installing
the module (for instance, using \`npm rebuild\` or \`npm install\`).
    at process.func [as dlopen] (node:electron/js2c/asar_bundle:2:1822)
    at Module._extensions..node (node:internal/modules/cjs/loader:1259:18)
    at Object.func [as .node] (node:electron/js2c/asar_bundle:2:1822)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at Module.require (node:internal/modules/cjs/loader:1068:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/test/packages/pty-host/node_modules/node-pty/src/unixTerminal.ts:14:9)
    at Module._compile (node:internal/modules/cjs/loader:1174:14) {
  code: 'ERR_DLOPEN_FAILED'
}

Node.js v18.12.1
`
  const { message } = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(message).toBe(
    `Incompatible native node module: The module '/test/packages/pty-host/node_modules/node-pty/build/Release/pty.node' was compiled against a different Node.js version using NODE_MODULE_VERSION 108. This version of Node.js requires NODE_MODULE_VERSION 113. Please try re-compiling or re-installing the module (for instance, using \`npm rebuild\` or \`npm install\`).`,
  )
})

test('getHelpfulChildProcessError - modules not supported in electron', () => {
  const stderr = `import * as IpcChild from './parts/IpcChild/IpcChild.js'
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965

Node.js v18.12.1`
  const { message } = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(message).toBe(`ES Modules are not supported in electron`)
})

test('getHelpfulChildProcessError - module not found', () => {
  const stderr = `node:internal/errors:490
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ws' imported from /usr/lib/lvce-oss/esources/app/packages/pty-host/src/parts/WebSocketServer/WebSocketServer.js
    at new NodeError (node:internal/errors:399:5)
    at packageResolve (node:internal/modules/esm/resolve:895:9)
    at moduleResolve (node:internal/modules/esm/resolve:944:20)
    at defaultResolve (node:internal/modules/esm/resolve:1159:11)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:838:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
    at link (node:internal/modules/esm/module_job:76:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.15.0`

  const { message, code } = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(message).toBe(
    `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ws' imported from /usr/lib/lvce-oss/esources/app/packages/pty-host/src/parts/WebSocketServer/WebSocketServer.js`,
  )
  expect(code).toBe('ERR_MODULE_NOT_FOUND')
})

test('getHelpfulChildProcessError - ReferenceError', () => {
  const stderr = `/test/packages/pty-host/src/parts/Main/Main.js:9
  process.on('uncaughtExceptionMonitor', ProcessListeners.handleUncaughtExceptionMonitor)
                                         ^

ReferenceError: ProcessListeners is not defined
    at Module.main (/test/packages/pty-host/src/parts/Main/Main.js:9:42)
    at /test/packages/pty-host/src/ptyHostMain.js:3:6
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)

Node.js v18.16.1
`

  // @ts-ignore
  const { message, stack } = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(message).toBe(`ReferenceError: ProcessListeners is not defined`)
  expect(stack).toEqual([
    `    at Module.main (/test/packages/pty-host/src/parts/Main/Main.js:9:42)`,
    `    at /test/packages/pty-host/src/ptyHostMain.js:3:6`,
    `    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)`,
  ])
})

test.skip('getHelpfulChildProcessError - modules not supported in electron 2', () => {
  const stderr = `(node:120184) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use \`exe --trace-warnings ...\` to show where the warning was created)
/test/language-features-typescript/packages/node/src/typeScriptClient.js:1
import * as IpcChild from './parts/IpcChild/IpcChild.js'
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965

Node.js v18.12.1`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(error.message).toBe(`SyntaxError: Cannot use import statement outside a module`)
  // @ts-ignore
  expect(error.stack).toBe(`SyntaxError: Cannot use import statement outside a module
    at /test/language-features-typescript/packages/node/src/typeScriptClient.js:1
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965`)
})

test.skip('getHelpfulChildProcessError - top-level await error', () => {
  const stderr = `/test/file.js:1
await import("/test/language-features-typescript/packages/node/src/typeScriptClient.js")
^^^^^
SyntaxError: await is only valid in async functions and the top level bodies of modules
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965

Node.js v18.12.1`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(error.message).toBe(`SyntaxError: await is only valid in async functions and the top level bodies of modules`)
  // @ts-ignore
  expect(error.stack).toBe(`SyntaxError: await is only valid in async functions and the top level bodies of modules
    at /test/file.js:1
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965`)
})

test.skip('getHelpfulChildProcessError - module not found error', () => {
  const stderr = `node:internal/errors:484
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/language-features-typescript/packages/node/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js' imported from /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js
    at new NodeError (node:internal/errors:393:5)
    at finalizeResolution (node:internal/modules/esm/resolve:323:11)
    at moduleResolve (node:internal/modules/esm/resolve:922:10)
    at defaultResolve (node:internal/modules/esm/resolve:1130:11)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:841:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:40)
    at link (node:internal/modules/esm/module_job:75:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.12.1`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(error.message).toBe(
    `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/language-features-typescript/packages/node/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js' imported from /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js`,
  )
  // @ts-ignore
  expect(error.stack)
    .toBe(`Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/language-features-typescript/packages/node/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js' imported from /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js
    at /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js
    at new NodeError (node:internal/errors:393:5)
    at finalizeResolution (node:internal/modules/esm/resolve:323:11)
    at moduleResolve (node:internal/modules/esm/resolve:922:10)
    at defaultResolve (node:internal/modules/esm/resolve:1130:11)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:841:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:40)
    at link (node:internal/modules/esm/module_job:75:36) {`)
})

test.skip('getHelpfulChildProcessError - export not found', () => {
  const stderr = `file:///test/packages/pty-host/src/parts/HandleElectronMessagePort/HandleElectronMessagePort.js:5
import { MessagePortMain } from 'electron'
         ^^^^^^^^^^^^^^^
SyntaxError: Named export 'MessagePortMain' not found. The requested module 'electron' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'electron';
const { MessagePortMain } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)

Node.js v18.14.0
`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(error.message).toBe(
    `SyntaxError: Named export 'MessagePortMain' not found. The requested module 'electron' is a CommonJS module, which may not support all module.exports as named exports. CommonJS modules can always be imported via the default export, for example using:  import pkg from 'electron'; const { MessagePortMain } = pkg;`,
  )
  // @ts-ignore
  expect(error.stack).toBe(
    `SyntaxError: Named export 'MessagePortMain' not found. The requested module 'electron' is a CommonJS module, which may not support all module.exports as named exports. CommonJS modules can always be imported via the default export, for example using:  import pkg from 'electron'; const { MessagePortMain } = pkg;
    at file:///test/packages/pty-host/src/parts/HandleElectronMessagePort/HandleElectronMessagePort.js:5
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)`,
  )
})

test('getHelpfulChildProcessError - module not found 2', () => {
  const stderr = `node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/embeds-worker/src/embedsProcessMain.js' imported from /test/packages/main-process/\
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:294:11)
    at moduleResolve (node:internal/modules/esm/resolve:919:10)
    at defaultResolve (node:internal/modules/esm/resolve:1105:11)
    at nextResolve (node:internal/modules/esm/loader:166:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:840:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:429:18)
    at ESMLoader.import (node:internal/modules/esm/loader:529:22)
    at node:electron/js2c/utility_init:2:17145
    at loadESM (node:internal/process/esm_loader:73:11) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.18.2
`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(error.message).toBe(
    "Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/embeds-worker/src/embedsProcessMain.js' imported from /test/packages/main-process/    at new NodeError (node:internal/errors:405:5)",
  )
  // @ts-ignore
  expect(error.stack).toBe(undefined)
})

test('getHelpfulChildProcessError - module not found 3', () => {
  const stderr = `node:internal/modules/esm/resolve:265
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/node_modules/@lvce-editor/preview-process/dist/index.js' imported from /test/packages/main-process/
    at finalizeResolution (node:internal/modules/esm/resolve:265:11)
    at moduleResolve (node:internal/modules/esm/resolve:940:10)
    at defaultResolve (node:internal/modules/esm/resolve:1176:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:383:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:352:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:227:38)
    at ModuleLoader.import (node:internal/modules/esm/loader:315:34)
    at node:electron/js2c/utility_init:2:17513
    at asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:138:11)
    at runEntryPointWithESMLoader (node:internal/modules/run_main:162:19) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///test/packages/shared-process/node_modules/@lvce-editor/preview-process/dist/index.js'
}

Node.js v20.15.1
`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
  expect(error.message).toBe(
    "Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/node_modules/@lvce-editor/preview-process/dist/index.js' imported from /test/packages/main-process/",
  )
  // @ts-ignore
  expect(error.stack).toBe(undefined)
})
