(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ejs=f()}})(function(){var define,module,exports;return function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e}()({1:[function(require,module,exports){"use strict";var fs=require("fs");var path=require("path");var utils=require("./utils");var scopeOptionWarned=false;var _VERSION_STRING=require("../package.json").version;var _DEFAULT_OPEN_DELIMITER="<";var _DEFAULT_CLOSE_DELIMITER=">";var _DEFAULT_DELIMITER="%";var _DEFAULT_LOCALS_NAME="locals";var _NAME="ejs";var _REGEX_STRING="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";var _OPTS_PASSABLE_WITH_DATA=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"];var _OPTS_PASSABLE_WITH_DATA_EXPRESS=_OPTS_PASSABLE_WITH_DATA.concat("cache");var _BOM=/^\uFEFF/;exports.cache=utils.cache;exports.fileLoader=fs.readFileSync;exports.localsName=_DEFAULT_LOCALS_NAME;exports.promiseImpl=new Function("return this;")().Promise;exports.resolveInclude=function(name,filename,isDir){var dirname=path.dirname;var extname=path.extname;var resolve=path.resolve;var includePath=resolve(isDir?filename:dirname(filename),name);var ext=extname(name);if(!ext){includePath+=".ejs"}return includePath};function getIncludePath(path,options){var includePath;var filePath;var views=options.views;var match=/^[A-Za-z]+:\\|^\//.exec(path);if(match&&match.length){includePath=exports.resolveInclude(path.replace(/^\/*/,""),options.root||"/",true)}else{if(options.filename){filePath=exports.resolveInclude(path,options.filename);if(fs.existsSync(filePath)){includePath=filePath}}if(!includePath){if(Array.isArray(views)&&views.some(function(v){filePath=exports.resolveInclude(path,v,true);return fs.existsSync(filePath)})){includePath=filePath}}if(!includePath){throw new Error('Could not find the include file "'+options.escapeFunction(path)+'"')}}return includePath}function handleCache(options,template){var func;var filename=options.filename;var hasTemplate=arguments.length>1;if(options.cache){if(!filename){throw new Error("cache option requires a filename")}func=exports.cache.get(filename);if(func){return func}if(!hasTemplate){template=fileLoader(filename).toString().replace(_BOM,"")}}else if(!hasTemplate){if(!filename){throw new Error("Internal EJS error: no file name or template "+"provided")}template=fileLoader(filename).toString().replace(_BOM,"")}func=exports.compile(template,options);if(options.cache){exports.cache.set(filename,func)}return func}function tryHandleCache(options,data,cb){var result;if(!cb){if(typeof exports.promiseImpl=="function"){return new exports.promiseImpl(function(resolve,reject){try{result=handleCache(options)(data);resolve(result)}catch(err){reject(err)}})}else{throw new Error("Please provide a callback function")}}else{try{result=handleCache(options)(data)}catch(err){return cb(err)}cb(null,result)}}function fileLoader(filePath){return exports.fileLoader(filePath)}function includeFile(path,options){var opts=utils.shallowCopy({},options);opts.filename=getIncludePath(path,opts);return handleCache(opts)}function includeSource(path,options){var opts=utils.shallowCopy({},options);var includePath;var template;includePath=getIncludePath(path,opts);template=fileLoader(includePath).toString().replace(_BOM,"");opts.filename=includePath;var templ=new Template(template,opts);templ.generateSource();return{source:templ.source,filename:includePath,template:template}}function rethrow(err,str,flnm,lineno,esc){var lines=str.split("\n");var start=Math.max(lineno-3,0);var end=Math.min(lines.length,lineno+3);var filename=esc(flnm);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?" >> ":"    ")+curr+"| "+line}).join("\n");err.path=filename;err.message=(filename||"ejs")+":"+lineno+"\n"+context+"\n\n"+err.message;throw err}function stripSemi(str){return str.replace(/;(\s*$)/,"$1")}exports.compile=function compile(template,opts){var templ;if(opts&&opts.scope){if(!scopeOptionWarned){console.warn("`scope` option is deprecated and will be removed in EJS 3");scopeOptionWarned=true}if(!opts.context){opts.context=opts.scope}delete opts.scope}templ=new Template(template,opts);return templ.compile()};exports.render=function(template,d,o){var data=d||{};var opts=o||{};if(arguments.length==2){utils.shallowCopyFromList(opts,data,_OPTS_PASSABLE_WITH_DATA)}return handleCache(opts,template)(data)};exports.renderFile=function(){var args=Array.prototype.slice.call(arguments);var filename=args.shift();var cb;var opts={filename:filename};var data;var viewOpts;if(typeof arguments[arguments.length-1]=="function"){cb=args.pop()}if(args.length){data=args.shift();if(args.length){utils.shallowCopy(opts,args.pop())}else{if(data.settings){if(data.settings.views){opts.views=data.settings.views}if(data.settings["view cache"]){opts.cache=true}viewOpts=data.settings["view options"];if(viewOpts){utils.shallowCopy(opts,viewOpts)}}utils.shallowCopyFromList(opts,data,_OPTS_PASSABLE_WITH_DATA_EXPRESS)}opts.filename=filename}else{data={}}return tryHandleCache(opts,data,cb)};exports.Template=Template;exports.clearCache=function(){exports.cache.reset()};function Template(text,opts){opts=opts||{};var options={};this.templateText=text;this.mode=null;this.truncate=false;this.currentLine=1;this.source="";this.dependencies=[];options.client=opts.client||false;options.escapeFunction=opts.escape||opts.escapeFunction||utils.escapeXML;options.compileDebug=opts.compileDebug!==false;options.debug=!!opts.debug;options.filename=opts.filename;options.openDelimiter=opts.openDelimiter||exports.openDelimiter||_DEFAULT_OPEN_DELIMITER;options.closeDelimiter=opts.closeDelimiter||exports.closeDelimiter||_DEFAULT_CLOSE_DELIMITER;options.delimiter=opts.delimiter||exports.delimiter||_DEFAULT_DELIMITER;options.strict=opts.strict||false;options.context=opts.context;options.cache=opts.cache||false;options.rmWhitespace=opts.rmWhitespace;options.root=opts.root;options.outputFunctionName=opts.outputFunctionName;options.localsName=opts.localsName||exports.localsName||_DEFAULT_LOCALS_NAME;options.views=opts.views;options.async=opts.async;if(options.strict){options._with=false}else{options._with=typeof opts._with!="undefined"?opts._with:true}this.opts=options;this.regex=this.createRegex()}Template.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};Template.prototype={createRegex:function(){var str=_REGEX_STRING;var delim=utils.escapeRegExpChars(this.opts.delimiter);var open=utils.escapeRegExpChars(this.opts.openDelimiter);var close=utils.escapeRegExpChars(this.opts.closeDelimiter);str=str.replace(/%/g,delim).replace(/</g,open).replace(/>/g,close);return new RegExp(str)},compile:function(){var src;var fn;var opts=this.opts;var prepended="";var appended="";var escapeFn=opts.escapeFunction;var ctor;if(!this.source){this.generateSource();prepended+="  var __output = [], __append = __output.push.bind(__output);"+"\n";if(opts.outputFunctionName){prepended+="  var "+opts.outputFunctionName+" = __append;"+"\n"}if(opts._with!==false){prepended+="  with ("+opts.localsName+" || {}) {"+"\n";appended+="  }"+"\n"}appended+='  return __output.join("");'+"\n";this.source=prepended+this.source+appended}if(opts.compileDebug){src="var __line = 1"+"\n"+"  , __lines = "+JSON.stringify(this.templateText)+"\n"+"  , __filename = "+(opts.filename?JSON.stringify(opts.filename):"undefined")+";"+"\n"+"try {"+"\n"+this.source+"} catch (e) {"+"\n"+"  rethrow(e, __lines, __filename, __line, escapeFn);"+"\n"+"}"+"\n"}else{src=this.source}if(opts.client){src="escapeFn = escapeFn || "+escapeFn.toString()+";"+"\n"+src;if(opts.compileDebug){src="rethrow = rethrow || "+rethrow.toString()+";"+"\n"+src}}if(opts.strict){src='"use strict";\n'+src}if(opts.debug){console.log(src)}try{if(opts.async){try{ctor=new Function("return (async function(){}).constructor;")()}catch(e){if(e instanceof SyntaxError){throw new Error("This environment does not support async/await")}else{throw e}}}else{ctor=Function}fn=new ctor(opts.localsName+", escapeFn, include, rethrow",src)}catch(e){if(e instanceof SyntaxError){if(opts.filename){e.message+=" in "+opts.filename}e.message+=" while compiling ejs\n\n";e.message+="If the above error is not helpful, you may want to try EJS-Lint:\n";e.message+="https://github.com/RyanZim/EJS-Lint";if(!e.async){e.message+="\n";e.message+="Or, if you meant to create an async function, pass async: true as an option."}}throw e}if(opts.client){fn.dependencies=this.dependencies;return fn}var returnedFn=function(data){var include=function(path,includeData){var d=utils.shallowCopy({},data);if(includeData){d=utils.shallowCopy(d,includeData)}return includeFile(path,opts)(d)};return fn.apply(opts.context,[data||{},escapeFn,include,rethrow])};returnedFn.dependencies=this.dependencies;return returnedFn},generateSource:function(){var opts=this.opts;if(opts.rmWhitespace){this.templateText=this.templateText.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")}this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var self=this;var matches=this.parseTemplateText();var d=this.opts.delimiter;var o=this.opts.openDelimiter;var c=this.opts.closeDelimiter;if(matches&&matches.length){matches.forEach(function(line,index){var opening;var closing;var include;var includeOpts;var includeObj;var includeSrc;if(line.indexOf(o+d)===0&&line.indexOf(o+d+d)!==0){closing=matches[index+2];if(!(closing==d+c||closing=="-"+d+c||closing=="_"+d+c)){throw new Error('Could not find matching close tag for "'+line+'".')}}if(include=line.match(/^\s*include\s+(\S+)/)){opening=matches[index-1];if(opening&&(opening==o+d||opening==o+d+"-"||opening==o+d+"_")){includeOpts=utils.shallowCopy({},self.opts);includeObj=includeSource(include[1],includeOpts);if(self.opts.compileDebug){includeSrc="    ; (function(){"+"\n"+"      var __line = 1"+"\n"+"      , __lines = "+JSON.stringify(includeObj.template)+"\n"+"      , __filename = "+JSON.stringify(includeObj.filename)+";"+"\n"+"      try {"+"\n"+includeObj.source+"      } catch (e) {"+"\n"+"        rethrow(e, __lines, __filename, __line, escapeFn);"+"\n"+"      }"+"\n"+"    ; }).call(this)"+"\n"}else{includeSrc="    ; (function(){"+"\n"+includeObj.source+"    ; }).call(this)"+"\n"}self.source+=includeSrc;self.dependencies.push(exports.resolveInclude(include[1],includeOpts.filename));return}}self.scanLine(line)})}},parseTemplateText:function(){var str=this.templateText;var pat=this.regex;var result=pat.exec(str);var arr=[];var firstPos;while(result){firstPos=result.index;if(firstPos!==0){arr.push(str.substring(0,firstPos));str=str.slice(firstPos)}arr.push(result[0]);str=str.slice(result[0].length);result=pat.exec(str)}if(str){arr.push(str)}return arr},_addOutput:function(line){if(this.truncate){line=line.replace(/^(?:\r\n|\r|\n)/,"");this.truncate=false}if(!line){return line}line=line.replace(/\\/g,"\\\\");line=line.replace(/\n/g,"\\n");line=line.replace(/\r/g,"\\r");line=line.replace(/"/g,'\\"');this.source+='    ; __append("'+line+'")'+"\n"},scanLine:function(line){var self=this;var d=this.opts.delimiter;var o=this.opts.openDelimiter;var c=this.opts.closeDelimiter;var newLineCount=0;newLineCount=line.split("\n").length-1;switch(line){case o+d:case o+d+"_":this.mode=Template.modes.EVAL;break;case o+d+"=":this.mode=Template.modes.ESCAPED;break;case o+d+"-":this.mode=Template.modes.RAW;break;case o+d+"#":this.mode=Template.modes.COMMENT;break;case o+d+d:this.mode=Template.modes.LITERAL;this.source+='    ; __append("'+line.replace(o+d+d,o+d)+'")'+"\n";break;case d+d+c:this.mode=Template.modes.LITERAL;this.source+='    ; __append("'+line.replace(d+d+c,d+c)+'")'+"\n";break;case d+c:case"-"+d+c:case"_"+d+c:if(this.mode==Template.modes.LITERAL){this._addOutput(line)}this.mode=null;this.truncate=line.indexOf("-")===0||line.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case Template.modes.EVAL:case Template.modes.ESCAPED:case Template.modes.RAW:if(line.lastIndexOf("//")>line.lastIndexOf("\n")){line+="\n"}}switch(this.mode){case Template.modes.EVAL:this.source+="    ; "+line+"\n";break;case Template.modes.ESCAPED:this.source+="    ; __append(escapeFn("+stripSemi(line)+"))"+"\n";break;case Template.modes.RAW:this.source+="    ; __append("+stripSemi(line)+")"+"\n";break;case Template.modes.COMMENT:break;case Template.modes.LITERAL:this._addOutput(line);break}}else{this._addOutput(line)}}if(self.opts.compileDebug&&newLineCount){this.currentLine+=newLineCount;this.source+="    ; __line = "+this.currentLine+"\n"}}};exports.escapeXML=utils.escapeXML;exports.__express=exports.renderFile;if(require.extensions){require.extensions[".ejs"]=function(module,flnm){var filename=flnm||module.filename;var options={filename:filename,client:true};var template=fileLoader(filename).toString();var fn=exports.compile(template,options);module._compile("module.exports = "+fn.toString()+";",filename)}}exports.VERSION=_VERSION_STRING;exports.name=_NAME;if(typeof window!="undefined"){window.ejs=exports}},{"../package.json":6,"./utils":2,fs:3,path:4}],2:[function(require,module,exports){"use strict";var regExpChars=/[|\\{}()[\]^$+*?.]/g;exports.escapeRegExpChars=function(string){if(!string){return""}return String(string).replace(regExpChars,"\\$&")};var _ENCODE_HTML_RULES={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"};var _MATCH_HTML=/[&<>'"]/g;function encode_char(c){return _ENCODE_HTML_RULES[c]||c}var escapeFuncStr="var _ENCODE_HTML_RULES = {\n"+'      "&": "&amp;"\n'+'    , "<": "&lt;"\n'+'    , ">": "&gt;"\n'+'    , \'"\': "&#34;"\n'+'    , "\'": "&#39;"\n'+"    }\n"+"  , _MATCH_HTML = /[&<>'\"]/g;\n"+"function encode_char(c) {\n"+"  return _ENCODE_HTML_RULES[c] || c;\n"+"};\n";exports.escapeXML=function(markup){return markup==undefined?"":String(markup).replace(_MATCH_HTML,encode_char)};exports.escapeXML.toString=function(){return Function.prototype.toString.call(this)+";\n"+escapeFuncStr};exports.shallowCopy=function(to,from){from=from||{};for(var p in from){to[p]=from[p]}return to};exports.shallowCopyFromList=function(to,from,list){for(var i=0;i<list.length;i++){var p=list[i];if(typeof from[p]!="undefined"){to[p]=from[p]}}return to};exports.cache={_data:{},set:function(key,val){this._data[key]=val},get:function(key){return this._data[key]},remove:function(key){delete this._data[key]},reset:function(){this._data={}}}},{}],3:[function(require,module,exports){},{}],4:[function(require,module,exports){(function(process){function normalizeArray(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up--;up){parts.unshift("..")}}return parts}var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;var splitPath=function(filename){return splitPathRe.exec(filename).slice(1)};exports.resolve=function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:process.cwd();if(typeof path!=="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){continue}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=path.charAt(0)==="/"}resolvedPath=normalizeArray(filter(resolvedPath.split("/"),function(p){return!!p}),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."};exports.normalize=function(path){var isAbsolute=exports.isAbsolute(path),trailingSlash=substr(path,-1)==="/";path=normalizeArray(filter(path.split("/"),function(p){return!!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path};exports.isAbsolute=function(path){return path.charAt(0)==="/"};exports.join=function(){var paths=Array.prototype.slice.call(arguments,0);return exports.normalize(filter(paths,function(p,index){if(typeof p!=="string"){throw new TypeError("Arguments to path.join must be strings")}return p}).join("/"))};exports.relative=function(from,to){from=exports.resolve(from).substr(1);to=exports.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")};exports.sep="/";exports.delimiter=":";exports.dirname=function(path){var result=splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir};exports.basename=function(path,ext){var f=splitPath(path)[2];if(ext&&f.substr(-1*ext.length)===ext){f=f.substr(0,f.length-ext.length)}return f};exports.extname=function(path){return splitPath(path)[3]};function filter(xs,f){if(xs.filter)return xs.filter(f);var res=[];for(var i=0;i<xs.length;i++){if(f(xs[i],i,xs))res.push(xs[i])}return res}var substr="ab".substr(-1)==="b"?function(str,start,len){return str.substr(start,len)}:function(str,start,len){if(start<0)start=str.length+start;return str.substr(start,len)}}).call(this,require("_process"))},{_process:5}],5:[function(require,module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){cachedSetTimeout=setTimeout}else{cachedSetTimeout=defaultSetTimout}}catch(e){cachedSetTimeout=defaultSetTimout}try{if(typeof clearTimeout==="function"){cachedClearTimeout=clearTimeout}else{cachedClearTimeout=defaultClearTimeout}}catch(e){cachedClearTimeout=defaultClearTimeout}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0)}if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0)}try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker)}if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker)}try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue)}else{queueIndex=-1}if(queue.length){drainQueue()}}function drainQueue(){if(draining){return}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run()}}queueIndex=-1;len=queue.length}currentQueue=null;draining=false;runClearTimeout(timeout)}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i]}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue)}};function Item(fun,array){this.fun=fun;this.array=array}Item.prototype.run=function(){this.fun.apply(null,this.array)};process.title="browser";process.browser=true;process.env={};process.argv=[];process.version="";process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return[]};process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return"/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")};process.umask=function(){return 0}},{}],6:[function(require,module,exports){module.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"2.6.1",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",contributors:["Timothy Gu <timothygu99@gmail.com> (https://timothygu.github.io)"],license:"Apache-2.0",main:"./lib/ejs.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{},devDependencies:{browserify:"^13.1.1",eslint:"^4.14.0","git-directory-deploy":"^1.5.1",istanbul:"~0.4.3",jake:"^8.0.16",jsdoc:"^3.4.0","lru-cache":"^4.0.1",mocha:"^5.0.5","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"jake test",lint:'eslint "**/*.js" Jakefile',coverage:"istanbul cover node_modules/mocha/bin/_mocha",doc:"jake doc",devdoc:"jake doc[dev]"}}},{}]},{},[1])(1)});


function FormFacade(data)
{
    this.data = data;
    this.draft = null;
    this.result = null;
    this.template = {};
    this.pageHistory = [];
    this.activePage = 'root';

    this.prefill = function()
    {
        if(!this.draft) this.draft = {};
        if(!this.draft.entry) this.draft.entry = {};
        var items = this.data.scraped?this.data.scraped.items:{};
        var qprefill = this.data.request.query.prefill;
        if(qprefill && window[qprefill])
        {
            var rslt = window[qprefill](this);
            for(var itemId in items)
            {
                var item = items[itemId];
                var preval = rslt['entry.'+item.entry];
                if(preval) this.draft.entry[item.entry] = preval;
            }
        }
        else
        {
            var urlparams = new URLSearchParams(window.location.search);
            var eml = urlparams.get('emailAddress');
            if(eml) this.draft.emailAddress = eml;
            for(var itemId in items)
            {
                var item = items[itemId];
                var urlval = urlparams.get('entry.'+item.entry);
                if(urlval) this.draft.entry[item.entry] = urlval;
            }
        }
        return this.draft;
    }

    this.computeField = function(tmpl)
    {
        var params = {};
        var items = this.data.scraped?this.data.scraped.items:{};
        for(var itemId in items)
        {
            var pitem = items[itemId];
            var pval = this.draft.entry[pitem.entry];
            //if(pval && !isNaN(pval)) pval = Number(pval);
            if(pitem.entry) params['entry'+pitem.entry] = pval?pval:'';
        }
        params.num = function(val)
        {
            if(val)
            {
                if(isNaN(val)==false)
                    return Number(val);
            }
            return 0;
        }
        params.ifs = function(...args)
        {
            var lst;
            if(args.length%2==1)
                lst = args.pop();
            for(var i=0; i <args.length; i+=2) 
            {
                if(args[i]) return args[i+1];
            }
            return lst?lst:'';
        }
        const names = Object.keys(params);
        const vals = Object.values(params);
        try
        {
            return new Function(...names, `return \`${tmpl}\`;`)(...vals);
        }
        catch(err)
        {
            return 'Computation failed for '+tmpl+' due to '+err;
        }
    }

    this.compute = function()
    {
        var curr = this;
        var items = this.data.scraped?this.data.scraped.items:{};
        var sitems = [];
        for(var sid in items)
        {
            var sitm = items[sid];
            sitm.id = sid;
            sitems.push(sitm);
        }
        sitems.sort(function(a,b){ return a.index-b.index; });
        var oitems = this.data.facade.items?this.data.facade.items:{};
        sitems.forEach(function(item, i){
            var itemId = item.id;
            var oitem = oitems[itemId];
            if(oitem && (oitem.prefill||oitem.calculated))
            {
                if(oitem.calculated)
                {
                    var preval = curr.computeField(oitem.calculated);
                    curr.draft.entry[item.entry] = preval;
                    var widg = document.getElementById('Widget'+itemId);
                    if(widg) widg.value = preval;
                }
                else if(oitem.prefill && !curr.draft.entry[item.entry])
                {
                    var preval = curr.computeField(oitem.prefill);
                    if(preval)
                    {
                        curr.draft.entry[item.entry] = preval;
                        var widg = document.getElementById('Widget'+itemId);
                        if(widg) widg.value = preval;
                    }
                }
            }
        });
    }

    this.toRGB = function(hex, opacity) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(result)
        {
            var rgb = [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ];
            if(opacity) rgb.push(opacity);
            return 'rgb('+rgb.join(', ')+')';
        }
        return hex;

    }

    this.getEnhancement = function()
    {
        var enhance = this.data.request.query.enhance;
        if(enhance == 'yes')
        {
            return {
                layout:'1column', color:'theme', font:'space',
                input:'flat', button:'flat'
            };
        }
        return null;
    }

    this.shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    this.polyfill = function(callback)
    {
        this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js", callback)
    }

    this.loadScript = function(jssrc, callback)
    {
        var script = document.createElement("script")
        script.type = "text/javascript";
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function(){
                callback();
            };
        }
        script.src = jssrc;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    this.init = function(savedId)
    {
        this.result = null;
        var publishId = this.data.request.params.publishId;
        if(!savedId) savedId = this.readCookie('ff-'+publishId);
        var savedprm = Promise.resolve();
        if(savedId && !this.data.request.query.flush)
        {
            var curr = this;
            savedprm = new Promise(function(resolve, reject){
                var baseurl = 'https://formfacade.com';
                if(curr.data.devEnv)
                    baseurl = 'http://localhost:5001/formfacade/us-central1/all';
                var xhr = new XMLHttpRequest();
                xhr.open('GET', baseurl+'/draft/'+publishId+'/read/'+savedId, true);
                xhr.responseType = 'json';
                xhr.onload = function()
                {
                    if(xhr.status === 200)
                    {
                        if(xhr.response && xhr.response.entry)
                            resolve(xhr.response);
                    }
                };
                xhr.send();
            });
        }
        var curr = this;
        return savedprm.then(function(drft){
            if(drft && drft.entry)
                curr.draft = drft;
            else
                curr.draft = curr.prefill();
        });
    }

    this.load = function(divId)
    {
        var curr = this;
        if(!window.Promise) 
            return this.polyfill(function(){ curr.load(divId) });
        if(this.data.request.params.target=='classic')
        {
            if(window.wp)
                this.data.request.params.target = 'wordpress';
        }
        this.init().then(function(){
            curr.divId = divId;
            curr.render();
            var callback = curr.data.request.query.callback;
            if(callback && window[callback])
                window[callback](curr);
            curr.scrapeSection();
        });
    }

    this.popup = function(qry)
    {
        var curr = this;
        if(!window.Promise) 
            return this.polyfill(function(){ curr.popup(qry); });
        if(!window.jQuery && qry.onexit)
        {
            var jqsrc = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js';
            return this.loadScript(jqsrc, function(){ curr.popup(qry); });
        }
        this.init().then(function(){
            var signinSuppress = curr.readCookie('FormfacadeSuppress');
            if(signinSuppress && (qry.delay||qry.onexit)) return;
            if(curr.config.themecss && false)
            {
                var qhead = document.querySelector('h1, h2, h3, h4, h5, h6');
                var qbody = document.querySelector('body');
                if(qry.div)
                {
                    var qdiv = document.getElementById(qry.div);
                    if(qdiv) qbody = qdiv;
                }
                if(qhead && qbody)
                {
                    var hfont = window.getComputedStyle(qhead, null).getPropertyValue('font-family');
                    var bfont = window.getComputedStyle(qbody, null).getPropertyValue('font-family');
                    const urlParams = new URLSearchParams(curr.config.themecss);
                    urlParams.set('heading', hfont);
                    urlParams.set('font', bfont);
                    curr.config.themecss = urlParams.toString();
                }
            }
            var wrp = document.getElementById('ffwrap');
            if(!wrp)
            {
                if(qry.div)
                {
                    var child = document.getElementById(qry.div);
                    child.innerHTML = ejs.render(curr.iframe.frame, curr);
                }
                else
                {
                    var child = document.createElement('div');
                    child.innerHTML = ejs.render(curr.iframe.frame, curr);
                    document.querySelector('body').appendChild(child);
                    wrp = document.getElementById('ffwrap');
                }
            }
            var ifr = document.getElementById('ffcontent');
            ifr.contentWindow.document.open();
            var chtm = ejs.render(curr.iframe.content, curr);
            ifr.contentWindow.document.write(chtm);
            ifr.contentWindow.document.close();
            curr.render();
            if(qry.delay)
            {
                var sec = qry.delay;
                var isec = parseInt(sec.split('sec')[0]);
                setTimeout(function(){ curr.showPopup(); }, isec*1000);
            }
            else if(qry.onclick || qry.selector)
            {
                var lbtns;
                if(qry.onclick)
                    lbtns = document.querySelectorAll('#'+qry.onclick);
                else
                    lbtns = document.querySelectorAll(qry.selector);
                lbtns.forEach(function(lbtn){
                    lbtn.addEventListener('click', function(){ curr.showPopup(); });
                });
                if(lbtns.length==0)
                    console.warn('No button found to launch the formfacade popup');
            }
            else if(qry.onexit)
            {
                var mobl = curr.isMobile();
                var cback = function(){ curr.showPopup(); }
                var dt;
                if(mobl)
                    dt = new DialogTrigger(cback, {trigger:'scrollUp', percentUp:10});
                else
                    dt = new DialogTrigger(cback, {trigger:'exitIntent'});
            }
            var callback = curr.data.request.query.callback;
            if(callback && window[callback])
                ifr.onload = function(){ window[callback](curr); }
        });
    }

    this.showPopup = function()
    {
        var curr = this;
        var wrp = document.getElementById('ffwrap');
        wrp.style.display = 'block';
        var ifr = document.getElementById('ffcontent');
        if(ifr.contentWindow.showModal)
            ifr.contentWindow.showModal();
        else
            setTimeout(function(){ curr.showPopup(); }, 500);
    }

    this.close = function()
    {
        var wrp = document.getElementById('ffwrap');
        wrp.style.display = 'none';
        if(this.data.request.query.delay)
        {
            var delaydays = 1/24;
            this.createCookie('FormfacadeSuppress', true, delaydays);
        }
        else if(this.data.request.query.onexit)
        {
            var dystr = this.data.request.query.onexit.split('days')[0];
            delaydays = parseInt(dystr);
            this.createCookie('FormfacadeSuppress', true, delaydays);
        }
    }

    this.createCookie = function(name, value, days) 
    {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    this.readCookie = function(k)
    {
        var val = (document.cookie.match('(^|; )'+k+'=([^;]*)')||0)[2];
        return val&&val.trim()==""?null:val;
    }

    this.isEditMode = function()
    {
        return window.editFacade&&editFacade.editform?true:false;
    }

    this.isPreviewMode = function()
    {
        if(window.editFacade)
            return true;
        else if(location.href.indexOf('https://formfacade.com/edit/')==0)
            return true;
        else if(location.href.indexOf('https://formfacade.com/embed/')==0)
            return true;
        else if(location.href.indexOf('https://formfacade.com/share/')==0)
            return true;
        return false
    }

    this.html = function(txt)
    {
        if(txt)
        {
            txt = txt.trim().replace(/(?:\r\n|\r|\n)/g, '<br>');

            replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            txt = txt.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            txt = txt.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

            replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
            txt = txt.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
        }
        return txt;
    }

    this.val = function(title)
    {
        var items = this.data.scraped?this.data.scraped.items:{};
        for(var i in items)
        {
            var item = items[i];
            if(this.draft && item.title==title)
                return this.draft.entry[item.entry];
        }
    }

    this.entry = function(entryId)
    {
        if(this.draft && this.draft.entry)
        {
            var entryval = this.draft.entry[entryId];
            if(entryval)
                return entryval;
            else
                this.draft.entry[entryId.toString()];
        }
    }

    this.evalBlock = function(editor)
    {
        var htmls = [];
        editor.blocks.forEach(function(block){
            if(!block.data)
            {
                // deleted
            }
            else if(block.type=='header')
            {
                var htm;
                if(block.data.level<=4)
                {
                    var tag = 'h'+block.data.level;
                    htm = '<'+tag+' class="'+tag+' ff-title">'+block.data.text
                    +'<i class="ff-edit material-icons float-right" onclick="editFacade.showSetting()">edit</i>'
                    +'</'+tag+'>';
                }
                else if(block.data.level==5)
                {
                    htm = block.data.text+'<br/>';
                }
                else if(block.data.level==6)
                {
                    htm = '<small class="ff-help form-text text-muted">'+block.data.text+'</small>';
                }
                htmls.push(htm);
            }
            else if(block.type=='paragraph')
            {
                var txt = block.data.text
                var htm = '<div class="ff-description"><p>'+txt+'</p></div>';
                htmls.push(htm);
            }
            else if(block.type=='paragraph')
            {
                var txt = block.data.text
                var htm = '<div class="ff-description"><p>'+txt+'</p></div>';
                htmls.push(htm);
            }
            else if(block.type=='table')
            {
                var trs = block.data.content.map(function(row){
                    var tds = row.map(function(col){ return '<td>'+col+'</td>'; });
                    return '<tr>'+tds.join('')+'</tr>';
                });
                var htm = '<table>'+trs.join('')+'</table>';
                htmls.push(htm);
            }
            else if(block.type=='list')
            {
                var tag = block.data.style=='ordered'?'ol':'ul';
                var lis = block.data.items.map(function(itm){
                    return '<li>'+itm+'</li>';
                });
                var htm = '<'+tag+'>'+lis.join('')+'</'+tag+'>';
                htmls.push(htm);
            }
            else if(block.type=='image')
            {
                var htm = '<figure><img src="'+block.data.url+'">';
                if(block.data.caption)
                    htm = htm + '<figcaption>'+block.data.caption+'</figcaption>';
                htm = htm + '</figure>';
                htmls.push(htm);
            }
        });
        return htmls.join('\n');
    }

    this.insideIframe = function()
    {
        return this.data.request.params.target=='popup'||this.data.request.params.target=='iframe'?true:false;
    }

    this.iframeHeight = null;

    this.resizeIframe = function()
    {
        if(this.data.request.params.target=='iframe')
        {
            var obj = document.getElementById('ffcontent');
            var hgh = obj.contentWindow.document.getElementById('ffContent').scrollHeight;
            if(this.iframeHeight==null || hgh>this.iframeHeight)
            {
                var modhgh = hgh<200?(hgh*1.15):(hgh+30);
                obj.style.height = modhgh + 'px';
                this.iframeHeight = hgh;
            }
        }
    }

    this.getContentElement = function()
    {
        var elm;
        if(this.data.request.params.target=='popup')
        {
            var ifr = document.getElementById('ffcontent');
            elm = ifr.contentWindow.document.getElementById('ffModalBody');
        }
        else if(this.data.request.params.target=='iframe')
        {
            var ifr = document.getElementById('ffcontent');
            elm = ifr.contentWindow.document.getElementById('ffContent');
        }
        else
           elm = document.querySelector(this.divId);
        return elm;
    }

    this.showMessage = function(msg)
    {
        var doc = this.getDocument();
        var elms = doc.querySelectorAll('.ff-form .ff-submit');
        elms.forEach(function(elm){ elm.innerHTML = msg; });
    }

    this.render = function()
    {
        var curr = this;
        var elm = this.getContentElement();
    	if(elm) elm.innerHTML = ejs.render(this.template.text, this);
        var frm = elm.querySelector('form');
        if(frm)
        {
            frm.addEventListener('change', function(evt){
                var formData = new FormData(frm);
                if(!formData.entries) return;
                var entries = formData.entries();
                var pairs = {};
                var next, entry;
                while ((next = entries.next()) && next.done === false) 
                {
                    entry = next.value;
                    if(entry[0]=='emailAddress' && entry[1])
                    {
                        if(!formFacade.draft) formFacade.draft = {};
                        formFacade.draft.emailAddress = entry[1];
                    }
                    else if(entry[0].indexOf('entry.')==0)
                    {
                        var nms = entry[0].split('entry.');
                        var nm = nms.pop();
                        nm = nm.replace('.','-');
                        var val = pairs[nm];
                        if(val)
                        {
                            var valarr = Array.isArray(val)?val:[val];
                            valarr.push(entry[1]);
                            pairs[nm] = valarr;
                        }
                        else
                            pairs[nm] = entry[1];
                    }
                }
                formFacade.draft.entry = pairs;
                var http = new XMLHttpRequest();
                var baseurl = 'https://formfacade.com';
                if(curr.data.devEnv)
                    baseurl = 'http://localhost:5001/formfacade/us-central1/all';
                var publishId = curr.data.request.params.publishId;
                var httpurl = baseurl+'/draft/'+publishId+'/save';
                var userId = curr.data.request.params.userId;
                if(userId)
                    httpurl = baseurl+'/draft/'+userId+'/form/'+publishId+'/save';
                http.open('POST', httpurl, true);
                http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
                http.responseType = 'json';
                http.onload = function()
                {
                    var jso = http.response;
                    if(jso.savedId)
                    {
                        curr.draft.savedId = jso.savedId;
                        curr.createCookie('ff-'+publishId, jso.savedId, 7);
                        var evtname = evt.target.name?evt.target.name:'visit';
                        curr.stat(evtname);
                    }
                }
                http.send(JSON.stringify(formFacade.draft));
                curr.compute();
            });
        }
        curr.compute();
        var onload = curr.data.request.query.onload;
        if(onload && window[onload])
        {
            window[onload](curr);
        }
    }

    this.stat = function(evtname)
    {
        var curr = this;
        var userId = curr.data.request.params.userId;
        var publishId = curr.data.request.params.publishId;
        if(userId && publishId && curr.draft)
        {
            var mrhttp = new XMLHttpRequest();
            var mrurl = 'https://mailrecipe.com/stat/'+userId+'/ff/'+publishId+'/'+evtname+'.json';
            mrurl = mrurl+'?sessionId='+encodeURIComponent(curr.draft.savedId);
            var eml = curr.draft.emailAddress;
            if(evtname=='goal' && eml)
                mrurl = mrurl+'&email='+encodeURIComponent(curr.draft.emailAddress);
            mrhttp.open('GET', mrurl, true);
            mrhttp.responseType = 'json';
            mrhttp.send();
        }
    }

    this.showAll = function()
    {
        var doc = this.getDocument();
        doc.querySelectorAll('.ff-section').forEach(function(sec){ sec.style.display = 'block'; });
    }
    
    this.submit = function(frm, secid)
    {
        var invalids = secid=='-3'?0:this.validate(frm, secid);
        if(invalids > 0) return;
        var curr = this;
        var pairs = {};
        var formData = new FormData(frm);
        var next, entry;
        var entries = formData.entries();
        while ((next = entries.next()) && next.done === false) 
        {
            entry = next.value;
            var val = pairs[entry[0]];
            if(val)
                val.push(entry[1]);
            else
                pairs[entry[0]] = [entry[1]];
        }
        pairs.pageHistory = this.getPageHistory();
        this.stat('submitting');
        this.showMessage('Submitting...');
        if('gtag' in window) 
        {
            gtag('event', 'submit', {
                event_category:'formfacade',
                event_label:this.data.request.params.publishId,
                value:this.pageHistory.length
            });
        }
        this.sendData(pairs).then(function(rs){
            var publishId = formFacade.data.request.params.publishId;
            formFacade.stat('goal');
            formFacade.result = rs;
            if(rs && rs.code==200)
            {
                formFacade.createCookie('ff-'+publishId, '', -1);
                formFacade.render();
            }
            else if(rs && rs.code==400)
            {
                frm.submit();
            }
            else if(rs && rs.code)
            {
                frm.action = 'https://docs.google.com/forms/d/e/'+publishId+'/viewform';
                frm.method = 'GET';
                frm.submit();
            }
            else
            {
                formFacade.render();
            }
            var onsubmit = curr.data.request.query.onsubmit;
            if(onsubmit && window[onsubmit])
            {
                window[onsubmit](curr);
            }
        }).catch(function(err){
            console.error(err);
            alert(err);
        });
        return false;
    }

    this.submitData = function(nmval)
    {
        var pairs = {id:this.data.request.params.publishId};
        var frm = this.data.scraped;
        var items = frm.items;
        for(var itemId in items)
        {
            var item = items[itemId];
            var val = nmval[item.title];
            if(val && item.entry) 
                pairs['entry.'+item.entry] = val;
        }
        return this.sendData(pairs);
    }

    this.sendData = function(pairs, trgurl)
    {
        var curr = this;
        return new Promise(function(resolve, reject){
            var baseurl = 'https://formfacade.com';
            if(curr.data.devEnv)
                baseurl = 'http://localhost:5001/formfacade/us-central1/all';
            var url = baseurl+(trgurl?trgurl:'/submitForm');
            var params = curr.data.request.params;
            var savedId = curr.readCookie('ff-'+params.publishId);
            if(!trgurl && params.userId && params.publishId)
            {
                if(savedId)
                    url = url+'/'+params.userId+'/form/'+params.publishId+'/draft/'+savedId;
                else
                    url = url+'/'+params.userId+'/form/'+params.publishId+'/draft';
            }
            var params = 'callback=callbackFormFacade';
            for(var nm in pairs)
            {
                var val = pairs[nm];
                if(val && Array.isArray(val))
                {
                    val.forEach(function(ival){
                        params += '&'+nm+'='+encodeURIComponent(ival);
                    });
                }
                else if(val)
                    params += '&'+nm+'='+encodeURIComponent(val);
            }
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onload = function()
            {
                var jso = JSON.parse(http.response);
                if(http.status==200)
                    resolve(jso);
                if(http.status==201)
                    resolve(jso);
                else if(http.status>=400)
                    reject(jso);
            }
            http.send(params);
        });
    }

    this.validate = function(frm, secid)
    {
        var doc = this.getDocument();
        var frmdata = new FormData(frm);
        var invalids = 0;
        var secdiv = doc.getElementById('ff-sec-'+secid);
        var wids = ['input:not([type="hidden"])', 'textarea', 'select', '.ff-check-required'];
        var gridval = {};
        secdiv.querySelectorAll(wids.join(', ')).forEach(function(wid,w){
            var valid = wid.checkValidity();
            if(valid && wid.className && wid.className.indexOf('ff-grid-radio')>=0)
            {
                var cls = wid.className.split(' ');
                var fcl = cls.shift();
                var gridId = cls.shift().split('-').pop();
                if(wid.checked)
                {
                    var widval = gridId+'-'+wid.value;
                    if(gridval[widval] && cls.indexOf('ff-grid-onepercol')>=0)
                    {
                        alert('Please don\'t select more than one response per column');
                        valid = false;
                    }
                    else
                        gridval[widval] = wid.name;
                }
            }
            else if(valid && wid.name && wid.className=='ff-check-required')
            {
                var entrynm = wid.name.split('_sentinel')[0];
                if(!frmdata.get(entrynm))
                {
                    alert(wid.title+' - is a required question');
                    valid = false;
                }
            }
            else if(wid.name && wid.className=='ff-file-upload')
            {
                if(!frmdata.get(wid.name))
                {
                    alert(wid.title+' - is required');
                    valid = false;
                }
            }
            if(!valid && invalids==0)
            {
                wid.focus();
                invalids = invalids + 1;
                if(wid.reportValidity)
                    wid.reportValidity();
            }
        });
        return invalids;
    }

    this.getPairs = function(frm)
    {
        var pairs = {};
        var formData = new FormData(frm);
        var next, entry;
        var entries = formData.entries();
        while ((next = entries.next()) && next.done === false) 
        {
            entry = next.value;
            var val = pairs[entry[0]];
            if(val)
                val.push(entry[1]);
            else
                pairs[entry[0]] = [entry[1]];
        }
        return pairs;
    }

    this.getNextSectionId = function(secid)
    {
        var doc = this.getDocument();
        var secids = [];
        var secs = doc.querySelectorAll('.ff-section');
        secs.forEach(function(sec){ secids.push(sec.id.split('-').pop()); });
        var idx = secids.indexOf(secid);
        return secids[idx+1];
    }

    this.gotoSection = function(frm, secid, deftrg)
    {
        var doc = this.getDocument();
        var trg;
        if(deftrg == 'back')
        {
            trg = this.pageHistory.pop();
        }
        else
        {
            var invalids = this.validate(frm, secid);
            if(invalids > 0) return;
            if(deftrg)
            {
                trg = deftrg;
            }
            else
            {
                trg = this.getNextSectionId(secid);
            }
            var items = this.data.scraped?this.data.scraped.items:{};
            doc.querySelectorAll('#ff-sec-'+secid+' .ff-nav-dyn').forEach(function(wid,w){
                if(wid.id)
                {
                    var fid = wid.id.split('-').pop();
                    var itm = items[fid];
                    if(itm)
                    {
                        var frmval = frm['entry.'+itm.entry];
                        if(frmval && frmval.value)
                        {
                            itm.choices.forEach(function(ch){
                                if(ch.value==frmval.value)
                                {
                                    trg = ch.navigateTo;
                                }
                            });
                        }
                    }
                }
            });
            if(trg == -1)
                trg = secid;
            else if(trg == -2)
                trg = this.getNextSectionId(secid);
            else if(trg == -3)
                trg = 'ending';
        }
        this.scrapeSection(this.getPageHistory());
        this.activePage = trg;
        this.render();
        if(deftrg != 'back')
        {
            this.pageHistory.push(secid);
            if('gtag' in window)
            {
                gtag('event', 'goto', {
                    event_category:'formfacade',
                    event_label:this.data.request.params.publishId+'-'+secid,
                    value:this.pageHistory.length
                });
            }
        }
        this.resizeIframe();
    }

    this.scrapeSection = function(pghistory)
    {
        var curr = this;
        //if(!curr.data.devEnv) return false;
        var elm = this.getContentElement();
        if(!elm || !window.FacadeSignin) return;
        var frm = elm.querySelector('form');
        var pairs = curr.getPairs(frm);
        var publishId = this.data.request.params.publishId;
        if(pghistory)
        {
            pairs.pageHistory = pghistory;
            pairs.continue = 1;
        }
        else
        {
            pairs.pageHistory = 0;
            pairs.back = 1;
        }
        this.sendData(pairs, '/nextSection/'+publishId).then(function(rs){
            if(rs && rs.blobs && curr.data.form)
            {
                var exblobs = curr.data.form.blobs;
                curr.data.form.blobs = Object.assign(exblobs?exblobs:{}, rs.blobs);
                //curr.render();
            }
        }).catch(function(err){
            console.warn('nextSection failed with '+err);
        });
    }

    this.getPageHistory = function()
    {
        var curr = this;
        var secarr = [];
        var doc = this.getDocument();
        var secs = doc.querySelectorAll('.ff-section');
        secs.forEach(function(sec, s){
            var secid = sec.id.split('-').pop();
            var secjso = curr.data.scraped.items[secid];
            if(curr.pageHistory.indexOf(secid)>=0 || curr.activePage==secid)
                 secarr.push(secid=='ending'?'-3':s);
        });
        return secarr.join(',');
    }

    this.getDocument = function()
    {
        var doc = document;
        if(this.data.request.params.target=='popup' || this.data.request.params.target=='iframe')
        {
            var ifr = document.getElementById('ffcontent');
            doc = ifr.contentWindow.document;
        }
        return doc;
    }

    this.lang = function(txt, opt)
    {
        if(this.langtext && this.langtext[txt])
        {
            var translated = this.langtext[txt];
            return translated;
        }
        return txt;
    }

    this.isMobile = function()
    {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    this.uploadFile = function(fld, entry, widg)
    {
        var curr = this;
        var doc = curr.getDocument();
        var stf = doc.getElementById('Status'+fld);
        if(stf) stf.innerHTML = 'Uploading...';
        return new Promise(function(resolve, reject){
            var publishId = curr.data.request.params.publishId;
            var savedId = curr.draft&&curr.draft.savedId?curr.draft.savedId:'none';
            var url = 'https://formfacade.com/upload/'+publishId+'/'+savedId+'/'+entry;
            var formData = new FormData();
            formData.append('file', widg.files[0]);
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.onload = function()
            {
                var jso = JSON.parse(http.response);
                if(http.status==200)
                    resolve(jso);
                if(http.status==201)
                    resolve(jso);
                else if(http.status>=400)
                    reject(jso);
            }
            http.send(formData);
        }).then(function(jso){
            curr.draft.savedId = jso.savedId;
            var hdn = doc.getElementById('Widget'+fld);
            if(hdn) hdn.value = jso.file;
            if(stf) stf.innerHTML = jso.file.split('/').pop();
        });
    }
    
    this.slugify = function(string) 
    {
        if(!string) return '';
        return string.toString().trim().toLowerCase()
        .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    }
}



window.formFacade = new FormFacade({"form":{"at":1587354631716,"description":"","id":"17IGfsBL5U97kPENT9xTXvosZvNtfjAkFc5IzLb2SVZ0","items":{"366990283":{"index":0,"required":true,"title":"Name","type":"TEXT"},"773651004":{"index":3,"required":true,"title":"City","type":"TEXT"},"1058152648":{"index":5,"required":true,"title":"Message","type":"PARAGRAPH_TEXT"},"1127813920":{"index":2,"required":true,"title":"Phone no.","type":"TEXT"},"1535783485":{"index":4,"required":true,"title":"Subject","type":"TEXT"},"1775148053":{"index":1,"required":true,"title":"Email","type":"TEXT"}},"title":"SMB Surgical Inquiry","url":"https://docs.google.com/macros/s/AKfycbzK8bQpDCcU68BPtlaezQ5Smws-NE-N_jA6LQyFIxEz_Mywqq_-/exec"},"facade":{},"scraped":{"at":1587354870836,"emailAddress":2,"form":"SMB Surgical Inquiry","items":{"366990283":{"entry":433138137,"index":0,"required":true,"title":"Name","type":"TEXT"},"773651004":{"entry":1864360386,"index":3,"required":true,"title":"City","type":"TEXT"},"1058152648":{"entry":300854793,"index":5,"required":true,"title":"Message","type":"PARAGRAPH_TEXT"},"1127813920":{"entry":1749732814,"index":2,"required":true,"title":"Phone no.","type":"TEXT","validType":"Number"},"1535783485":{"entry":495406608,"index":4,"required":true,"title":"Subject","type":"TEXT"},"1775148053":{"entry":1073591000,"index":1,"required":true,"title":"Email","type":"TEXT"}},"message":"","title":"SMB Surgical Inquiry"},"util":{"product":{"domain":1,"url":1,"title":1,"brand":1,"price":1,"listPrice":1,"image":1,"category":1,"availability":1},"version":"v01","codeTemplate":{"default":["<div class=\"container\" id=\"ff-compose\"></div>","<script async defer src=\"https://formfacade.com/forms/d/e/{id}/viewform.js?div=ff-compose\"></script>"],"bootstrap":["<div class=\"container\" id=\"ff-compose\"></div>","<script async defer src=\"https://formfacade.com/forms/d/e/{id}/bootstrap.js?div=ff-compose\"></script>"],"wordpress":["[formfacade id={id}]"],"squarespace":["<div class=\"container\" id=\"ff-compose\"></div>","<script async defer src=\"https://formfacade.com/forms/d/e/{id}/squarespace.js?div=ff-compose\"></script>"],"popup":["<script async defer src=\"https://formfacade.com/forms/d/e/{id}/popup.js?delay=1sec\"></script>"],"poponclick":["<button id=\"ff-launch-popup\" style=\"/* change button style */\">Your button</button>","<script async defer src=\"https://formfacade.com/forms/d/e/{id}/popup.js?onclick=ff-launch-popup\"></script>"]},"Departments":{"marketing":"Marketing","finance":"Finance","operations":"Operations","hr":"Human Resource","it":"IT","rnd":"R&D","procurement":"Procurement"},"Industries":{"agriculture":"Agriculture, Forestry & Fishing","energy":"Energy, Chemicals, & Utilities","financial":"Financial Services","food":"Food & Beverage","government":"Government","health":"Health & Social Care","manufacturing":"Manufacturing","media":"Media & Entertainment","mining":"Mining & Construction","services":"Professional Services","realestate":"Real Estate","restaurant":"Restaurants","retail":"Retail & Wholesale Trade","tech":"Technology","travel":"Travel & Transportation","education":"Education"},"Templates":{"11s_aI346DuxjDlX1r6jM-6W7KPQItVod3splfK-rc_k":{"name":"Registration form","publishId":"1FAIpQLSdE7U4WU5mgXWUdwg_btumi__qXsX8EfCCmpvRB2yB0-Ut72g","description":"Signup attendees for your event with the registration form","dashboard":"2PACX-1vQENZZwJdaEXMVFwUxJ8pkkY-artvLzkaYjTNN0oJnxPlbU_ltSEmtXcJ5kCYmpCaOSX-c-BieFRqx2"},"1FSdOEoOrFd3COUi6LILlWQx3lA6BvjqDBv1jewzMk30":{"name":"Order form","publishId":"1FAIpQLSff02m5k4-kSjU-OgmM5qNxxo2lxlKZgRq30ACGdOLikuVGNA","description":"Collect orders for your products with this order form","dashboard":"2PACX-1vQAkdyoRXIB2PqI8n-MqwAUQpfJUbm6YTNQQfqI7ges0L7QTq8QCNfeXUXjTp9CLJBMZlN_3SNuqgXK"},"1lx-uW_2pO-LtLwankk-L1rjMTOM4GiA68rCJPxTkTgs":{"name":"Leave request form","publishId":"1FAIpQLSdmHPbOU07-jGh_AEbQc5iydvRZm7otJB2T8ObWjvJdNcYs-A","description":"Manage employee leave requests with this leave request form","dashboard":"2PACX-1vQTSL94wiO2c8yIywntwalZ9kWmYr4yHHxPnCNSvaq57CbQR_iBy2KJaUNndsoKJDOjEG8KG5C3qdbe"},"1ihoDhrDlT_rad3POOluU_RvvHzck3Jy54l4gIioma-I":{"name":"Feedback form","publishId":"1FAIpQLSe5YRO8LhjEl8YQqNDKcRkRFFwin-cbty4ZliZUVehegZWBaw","description":"Get feedback about the ordering experience from your users with this feedback form","dashboard":"2PACX-1vQENZZwJdaEXMVFwUxJ8pkkY-artvLzkaYjTNN0oJnxPlbU_ltSEmtXcJ5kCYmpCaOSX-c-BieFRqx2"},"1okN7LMlXD2lwjxTkPbEzqDcMymEncjVDVAi8XsbxsU8":{"name":"Contact form","publishId":"1FAIpQLSeXTbNm2FaDWVeJ_86fTue0MaQScTpRwJE0-CQGomgjOgwQRw","description":"A simple contact form template to capture leads","dashboard":"2PACX-1vQ9tWvOxeMQ9ryZLPtaBllYW-16cTujfiDTE6OXtyjqUPnMaNc4_RsNZQaOJ2Cam4hT7PoywYNujZnw"},"1rvKwg_PUVGEh9MSM2OYubtSWqIRZWd11vCz7WKGSXhQ":{"name":"Blank form","publishId":"1FAIpQLSchUxyAWL9PsNvF6yL1N4rBl7N-utpNBYxcyj12MONIwnDQsA","description":"A blank form template with the recommended settings to use Formfacade"}},"faqs":{"1FAIpQLSei5hj5tKb5RhKwnUYaYOoO3Ua_5Q-ja0bnF3evk9qSptr44Q":"Can I customize the thank you message shown after form submission?","1FAIpQLSdE7NT6JzjGs95E5xSX1Hm5cOV5l5_KALUC0W-V4fyM9nNE2Q":"Can I change the language for the button text in Formfacade?","1FAIpQLSe5CMdIn8rh34-7MGOTAxXGYw_dO-unFX1l517KcgQLis83Ew":"Is there a way to change the button color or font styles in the form?","1FAIpQLSfGvg22V7Lzyw_5AEbKBSpklS_TMw6tKxcQiDqlC9KvfBVTgQ":"Does Formfacade support pre-filled survey links like native Google Forms?","1FAIpQLSf-QvZdKITPWh2bFKLurcc2UlMEzZR1cAgClCltyQKpY6uz_w":"Getting \"Form requires sign-in\" error message","1FAIpQLSdRM0Mf6lRhJnwsIB5iS5XwbY02LRlhwZ7WygW67uxHuMOQsA":"Redirects to Google Form on submit, shows an error message","1FAIpQLSdph4zqqMX35jab06ZDBsT3zathdcatHn_bqgo4PbJ_wD3-Og":"How to organize and manage form responses?","1FAIpQLSfFWtpI3dY6ootFcM4w3KNjxfrFa98D6fPhzIdn4ncR4gW5NQ":"How to change the placeholder text in Google Forms?","1FAIpQLScsQxfv3qbfi-qzk7Xty7IIq8ifoGih3d-LAN5EBIPJXgUaDA":"Is it possible to hide fields in Google Forms?","1FAIpQLSdsOMlrcCn5Q1T_flqI6XAjBKd9jY-da9awzBJLyvoKksdjDA":"Can I add a file upload option in my forms?","1FAIpQLSfyhpvJmKw3qsS_JcsEmZqMWBbbWHCSkS2e4dTABPtJc5b4Cg":"How can I transfer ownership of the form?","1FAIpQLSeooiyPfimYtFV-LlN3uiXUNu3QbPzVxCa33BCSGrPR2AqwcA":"How to add a calculated field in Google Form?"},"faqslug":{"customize-thank-you-message":"1FAIpQLSei5hj5tKb5RhKwnUYaYOoO3Ua_5Q-ja0bnF3evk9qSptr44Q"},"paid":["106562640896077409923","103035429268472736353","117025644207735429235","104951976458623252931","103139092767592738742","117404790123818520387","108539250703100582879","109871848110379814860","116726145860011181529","102174788568626953401","112390932842225524671","115838340203454328973","103060768793271002536","117607568578654866325","106369147526416463296","102783377159500204753","116374076704682468134","110825628153483398189","113415303342754916783","117780956667207983482","104416910406745232840","105406797656242780603","118072050622885292690","105242287939464144485","100346974933055186208","108501825478818400409","107870735454189233937"],"warned":["117286938286319180732","105925741395796620521","116089346103608674243"],"blocked":["108850108991157602986","102689789065446473820","108671534328667933178","117402393743386075821","117522479448611613376","104809234324266850030","102603499279084578584","107810942555344101481","112334250667158698219","107866052644851006308","118072088318591257000","111045421501054835580","104141395229590358558","113239234620458768547","103228058283134885615","105931539075667801352","100179101893592656163","116506754827270429348","101022414382305081205","106800933712001214281","106339925407449534697","106961864884757189460","116564932480417711472","114954407903021190865","105243818915915840501","117879770688136236363","116912257312448702030","112322559097344885129"],"gsuiteurl":"https://gsuite.google.com/marketplace/app/formfacade/743872305260"},"request":{"query":{"div":"ff-compose"},"params":{"publishId":"1FAIpQLSdTiXuavIcMsr1VGPKpSZ3qkv5li4137FrkC2QLKQ08yaTXKw","target":"bootstrap","userId":"104228328212503156379"}}});

formFacade.template = {"text":"<%\r\n  var params = data.request.params;\r\n  var id = params.publishId;\r\n  var pubfrm = data.form;\r\n  var frm = data.scraped;\r\n  var fac = data.facade;\r\n  if(!fac) fac = {};\r\n  if(!fac.info) fac.info = {};\r\n  var backcss = 'btn btn-lg btn-secondary';\r\n  if(params.target=='squarespace')\r\n    backcss = 'button sqs-system-button sqs-editable-button';\r\n  else if(params.target=='wordpress')\r\n    backcss = 'btn btn-secondary button button-secondary';\r\n  else if(params.target=='classic')\r\n    backcss = 'btn btn-secondary';\r\n  var submitcss = 'btn btn-lg btn-primary';\r\n  if(params.target=='squarespace')\r\n    submitcss = 'button sqs-system-button sqs-editable-button';\r\n  else if(params.target=='wordpress')\r\n    submitcss = 'btn btn-primary button button-primary';\r\n  else if(params.target=='classic')\r\n    submitcss = 'btn btn-primary';\r\n  var btncls = data.request.query.button;\r\n  if(btncls)\r\n  {\r\n    backcss = [backcss,btncls].join(' ');\r\n    submitcss = [submitcss,btncls].join(' ');\r\n  }\r\n%>\r\n<style>\r\n  .ff-copy{ padding-top:20px; }\r\n  .ff-form{ text-align:left; }\r\n  .ff-form .ff-edit{ display:none; }\r\n  .ff-form .ff-editwidget{ display:none; }\r\n  .ff-form .ff-help{ font-weight:400; }\r\n  .ff-form .form-check-label{ display:inline; }\r\n  .ff-form .ff-required{ color:red; }\r\n  .ff-form table{ width:100%; }\r\n  .ff-form table tr{ height:32px; }\r\n  .ff-form table tr td{ vertical-align:middle; text-align:center; padding: 6px 2px; }\r\n  .ff-form table tr .ff-grid-label{ text-align:left; }\r\n  .ff-form .form-check{ min-width:50px; }\r\n  .ff-form .ff-file-upload{ display:none; }\r\n  .ff-form .ff-image{ display:block; max-width:100%; }\r\n  .ff-form .ff-video{ display:block; max-width:100%; }\r\n  .ff-form .ff-button-bar{ padding-top:10px; padding-bottom:10px; }\r\n  .ff-form [type='date']::-webkit-inner-spin-button { display: none; }\r\n  .ff-form [type='time']::-webkit-inner-spin-button { display: none; }\r\n  .ff-form .form-check-other input[type=text]{ display:inline-block; width:auto; }\r\n  .ff-alert{ padding:.75rem 1.25rem; margin-bottom:1rem; border:1px solid transparent;\r\n    border-radius: .25rem; color:#721c24; background-color:#f8d7da; border-color:#f5c6cb; }\r\n  .ff-form .ff-button-bar{}\r\n  .ff-form input::placeholder, .ff-form textarea::placeholder{ color:rgba(0,0,0,0.54); font-size:smaller; }\r\n  .ff-check-table{ display:table; width:100%; }\r\n  .ff-check-cell{ display:inline-block; margin-right:20px; margin-top:10px; margin-bottom:10px; }\r\n  .ff-check-cell .ff-check-cell-image{ display:block; margin-bottom:10px; vertical-align:bottom; max-height:250px; }\r\n  .ff-check-cell .form-check-input{ margin-left:0px; }\r\n  .ff-check-cell .form-check-label{ margin-left:20px; }\r\n  .ff-form .ff-powered{ \r\n    float:right; text-align:center; text-decoration:none;\r\n    padding-bottom:0px; padding-top:12px; margin-left:12px;\r\n  }\r\n  .ff-form .ff-powered:hover{ color:#001f3f !important; border-bottom:1px solid #001f3f !important; }\r\n  .ff-form .ff-warned{ \r\n    float:right; text-align:center; text-decoration:none; border-radius:2px;\r\n    color:#000!important; background-color:#ffdddd!important; padding:10px; border:0px solid #001f3f !important; \r\n  }\r\n  .ff-form .ff-warned b{ font-size:17px; }\r\n  .ff-form .ff-blocked{ \r\n    float:right; text-align:center; text-decoration:none; border-radius:2px;\r\n    color:#fff!important; background-color:#f44336!important; padding:10px; border:0px solid #001f3f !important; \r\n  }\r\n  .ff-form .ff-blocked b{ font-size:17px; }\r\n  .ff-number{ display:none; }\r\n  \r\n  <%  if(fac.enhance){ %>\r\n    <% if(fac.enhance.heading){ %>\r\n      .ff-form .ff-title{ font-family:<%-fac.enhance.heading%> !important; }\r\n    <% } %>\r\n    <% if(fac.enhance.paragraph){ %>\r\n      .ff-form{ font-family:<%-fac.enhance.paragraph%> !important; }\r\n    <% } %> \r\n    <% if(fac.enhance.css){ %>\r\n      <%-fac.enhance.css%>\r\n    <% } %>\r\n  <% } %>\r\n</style>\r\n  \r\n  <% \r\n    if(fac.enhance && fac.enhance.layout!='default'){\r\n      var primary = '#1abc9c';\r\n      if(fac.enhance.primary)\r\n        primary = fac.enhance.primary;\r\n      var bgcolor = '#f4f7f8';\r\n      if(fac.enhance.background)\r\n        bgcolor = fac.enhance.background;\r\n      var field = '#e8eeef';\r\n      if(fac.enhance.field)\r\n        field = fac.enhance.field;\r\n  %>\r\n  <style>\r\n    .ff-form{ \r\n      background:<%-bgcolor%>; border-radius:8px; \r\n      margin:0; padding:0; border:0;\r\n      font:inherit; vertical-align:baseline;\r\n      line-height:1.4; letter-spacing:.2px; color:#202124; \r\n      margin-left:auto; margin-right:auto;\r\n    }\r\n    <% if(fac.enhance.layout=='2column'){ %> \r\n\r\n      .ff-form .ff-help{ display:none; }\r\n      .ff-form .ff-item{ margin-top:4px; margin-bottom:8px; }\r\n\r\n      @media (max-width: 650px) {\r\n        .ff-form{ max-width:90%; padding:10px 20px; }\r\n      }\r\n\r\n      @media (min-width: 650px) {\r\n        .ff-form{ max-width:800px; padding:15px 30px; }\r\n\r\n        .ff-secfields {\r\n          display:grid; grid-template-columns:1fr 1fr;\r\n          column-gap:20px; margin-top:2px;\r\n        }\r\n\r\n        .ff-secfields .form-group.ff-section_header,\r\n        .ff-secfields .form-group.ff-paragraph_text,\r\n        .ff-secfields .form-group.ff-multiple_choice,\r\n        .ff-secfields .form-group.ff-checkbox,\r\n        .ff-secfields .form-group.ff-grid,\r\n        .ff-secfields .form-group.ff-scale {\r\n          grid-column-start:1; grid-column-end:3;\r\n        }\r\n      }\r\n\r\n    <% } else if(fac.enhance.layout=='1column') { %>\r\n\r\n      .ff-form{ max-width:640px; padding:15px 30px; }\r\n      .ff-form .ff-item{ margin-top:8px; margin-bottom:16px; }\r\n\r\n      @media only screen and (max-width: 768px) {\r\n        .ff-form{ max-width:90%; padding:10px 20px; }\r\n      }\r\n    <% } %>\r\n\r\n      .ff-form h3{ font-size:28px; }\r\n      .ff-form h4{ font-size:24px;}\r\n      .ff-form h3, .ff-form h4{ font-weight:500; letter-spacing:.6px; margin-top:4px; margin-bottom:4px; }\r\n      .ff-form .ff-item label{ font-size:16px; font-weight:500; line-height:22px; }\r\n      .ff-form .ff-item .text-muted{ color:#70757a; }\r\n      .ff-form .form-control{ display:block; padding:2px 6px 2px 6px; width:100%; height:36px; line-height:1.4; }\r\n      .ff-form .form-check-label { display:inline; padding-left:4px; }\r\n      .ff-form button{ min-width:80px; min-height:40px; line-height:2; }\r\n      .ff-form .ff-item textarea{ min-height:80px; }\r\n\r\n      .ff-form fieldset{\r\n        border: none;\r\n      }\r\n      .ff-form legend {\r\n        font-size: 1.4em;\r\n        margin-bottom: 10px;\r\n      }\r\n      .ff-form label {\r\n        display: block;\r\n        margin-bottom: 8px;\r\n      }\r\n      .ff-form input[type=\"text\"],\r\n      .ff-form input[type=\"date\"],\r\n      .ff-form input[type=\"datetime\"],\r\n      .ff-form input[type=\"email\"],\r\n      .ff-form input[type=\"number\"],\r\n      .ff-form input[type=\"search\"],\r\n      .ff-form input[type=\"time\"],\r\n      .ff-form input[type=\"file\"],\r\n      .ff-form input[type=\"url\"],\r\n      .ff-form textarea,\r\n      .ff-form select {\r\n        background: rgba(255,255,255,.1);\r\n        border: none;\r\n        border-radius: 4px;\r\n        font-size: 15px;\r\n        margin: 0;\r\n        outline: 0;\r\n        padding: 10px;\r\n        width: 100%;\r\n        box-sizing: border-box; \r\n        -webkit-box-sizing: border-box;\r\n        -moz-box-sizing: border-box; \r\n        background-color: <%-field%>;\r\n        color:#333;\r\n        -webkit-box-shadow: 0 1px 0 rgba(0,0,0,0.03) inset;\r\n        box-shadow: 0 1px 0 rgba(0,0,0,0.03) inset;\r\n        margin-bottom: 10px;\r\n      }\r\n      .ff-form input[type=\"text\"]:focus,\r\n      .ff-form input[type=\"date\"]:focus,\r\n      .ff-form input[type=\"datetime\"]:focus,\r\n      .ff-form input[type=\"email\"]:focus,\r\n      .ff-form input[type=\"number\"]:focus,\r\n      .ff-form input[type=\"search\"]:focus,\r\n      .ff-form input[type=\"time\"]:focus,\r\n      .ff-form input[type=\"file\"]:focus,\r\n      .ff-form input[type=\"url\"]:focus,\r\n      .ff-form textarea:focus,\r\n      .ff-form select:focus{\r\n        background: <%-field%>;\r\n        filter: brightness(95%);\r\n      }\r\n      .ff-form select{\r\n        -webkit-appearance: menulist-button;\r\n        height:35px;\r\n      }\r\n      .ff-form .ff-number {\r\n        background: <%-primary%>;\r\n        color: #fff;\r\n        height: 30px;\r\n        width: 30px;\r\n        display: inline-block;\r\n        font-size: 14px;\r\n        font-weight: 550;\r\n        margin-right: 4px;\r\n        line-height: 30px;\r\n        text-align: center;\r\n        text-shadow: 0 1px 0 rgba(255,255,255,0.2);\r\n        border-radius: 15px 15px 15px 0px;\r\n      }\r\n\r\n      .ff-form button{ \r\n        border:0px; border-radius:4px; padding:10px 12px; min-width:100px; cursor:pointer;\r\n        font-size:12px; font-weight:500; letter-spacing:.6px; text-transform:uppercase;\r\n      }\r\n      .ff-form .ff-back{ background-color:#ccc; color:#333; }\r\n      .ff-form .ff-next, .ff-form .ff-submit{ background-color:<%-primary%>; color:#fff; }\r\n      .ff-form .ff-next:hover, .ff-form .ff-submit:hover {\r\n        background-color:<%-primary%>; filter:brightness(95%); color:#fff; \r\n        box-shadow: 0px 0px 20px <%-toRGB(primary, 0.4)%>;\r\n      }\r\n\r\n</style>\r\n<% } %>\r\n<% if(params.target=='viewform'){ %>\r\n<style>\r\n  <%-divId%>{ padding-top:10px; padding-bottom:10px; padding-left:20px; padding-right:20px; }\r\n  <%-divId%> .text-center{ text-align:center; }\r\n  <%-divId%> h2,h3,h4{ font-weight:600; letter-spacing:.5; line-height:32px; }\r\n  <%-divId%> p{ font-weight:400; line-height:24px; }\r\n  <%\r\n    var elm = document.querySelector(divId);\r\n    if(elm && !elm.style.fontFamily){\r\n  %>\r\n  <%-divId%> * { font-family:arial; }\r\n  <% } %>\r\n  .ff-form .ff-description{ padding-bottom:18px; }\r\n  .ff-form label{ line-height:20px; }\r\n  .ff-form .form-group{ padding-bottom:20px; }\r\n  .ff-form .form-control{ \r\n    display:block; margin-top:10px; width:100%; min-height:24px;\r\n    line-height:1.5; font-size:14px; padding:10px;\r\n    border:2px solid #ededed; border-radius:2px;\r\n  }\r\n  .ff-form select.form-control{ }\r\n  .ff-form select.form-control option{ }\r\n  .ff-form textarea.form-control{ height:auto; padding:12px; }\r\n  .ff-form table{ width:100%; line-height:18px; border-collapse:collapse; }\r\n  .ff-form table tbody{ width:100%; }\r\n  .ff-form tr{ border:none; }\r\n  .ff-form td{ padding:12px; border:none; }\r\n  .ff-form .btn{\r\n    padding:14px 24px 14px 24px; cursor:pointer; border:1px solid transparent; border-radius:5px;\r\n    color:rgba(0,0,0,.87); text-align:center; vertical-align:middle; \r\n    text-decoration: none; font-size:17px; font-weight:500; letter-spacing:1.1;\r\n  }\r\n  .ff-form .btn-primary{ background-color:#00488a; color:#fff; }\r\n  .ff-form .btn-secondary{ background-color:#ededed; }\r\n</style>\r\n<% } else if(params.target=='wordpress' || params.target=='classic'){ %>\r\n<style>\r\n.ff-form .ff-item{ margin-top:8px; margin-bottom:16px; }\r\n.ff-form .form-control{ display:block; padding:7px; width:100%; min-height:28px; line-height:1.4; }\r\n.ff-form .form-check-label { display:inline; padding-left:4px; }\r\n.ff-form button{ min-width:80px; min-height:40px; line-height:2; }\r\n.ff-form .ff-item textarea{ min-height:80px; }\r\n</style>\r\n<% } else if(params.target=='squarespace'){ %>\r\n<style>\r\n.ff-item{ margin-top:8px; margin-bottom:16px; }\r\n.form-control{ display:block; margin-top:4px; margin-bottom:8px; width:100%; padding:12px; line-height:14px; font-size:14px; }\r\n.ff-form .form-check-label { display:inline; padding-left:4px; }\r\n.ff-form .sqs-editable-button{ margin-top:8px; font-size:14px; }\r\n</style>\r\n<% } else if(params.target=='popup'){ %>\r\n<style>\r\n.ff-secfields{\r\n  overflow-x:hidden; overflow-y:auto; \r\n}\r\n.ff-title { margin-bottom:8px; }\r\n.ff-description p{ margin-bottom:16px; }\r\n.ff-item{ margin-top:8px; margin-bottom:16px; }\r\n.ff-form select{ -webkit-appearance: menulist; appearance:menulist; }\r\n</style>\r\n<% } else if(params.target=='themed'){ %>\r\n  <% if(config.themecolor.split('-')[0]=='minimal'){ %>\r\n    <link href=\"//formfacade.com/mstore-header2/css/vendor/bootstrap.min.css\" rel=\"stylesheet\" media=\"screen\">\r\n    <link href=\"//formfacade.com/theme/mstore-header2/theme.css?<%-config.themecss%>\" rel=\"stylesheet\" media=\"screen\">\r\n  <% } else if(config.themecolor.split('-')[0]=='colorful'){ %>\r\n    <link rel=\"stylesheet\" href=\"//formfacade.com/dosis/assets/dist/css/plugins.css\">\r\n    <link rel=\"stylesheet\" href=\"//formfacade.com/theme/dosis/style.css?<%-config.themecss%>\">\r\n  <% } %>\r\n<% } %>\r\n\r\n<% \r\n  if(!frm || !frm.items){ \r\n    frm = frm&&frm.items?frm:{items:[]};\r\n%>\r\n<div class=\"ff-alert\">\r\n  This form is not publicly visible. It requires Google signin to submit form (or to upload files).\r\n  <a href=\"https://formfacade.com/faq/getting-form-requires-sign-in-error-message-on-1FAIpQLSf-QvZdKITPWh2bFKLurcc2UlMEzZR1cAgClCltyQKpY6uz_w.html\" target=\"_blank\">\r\n  Learn how to disable login to get it working</a>.\r\n  Or, write to formfacade@guesswork.co if you need help.\r\n</div>\r\n<br/>\r\n<% } else if(data.scraped.needsLogin==1 && isPreviewMode()){ %>\r\n<div class=\"ff-alert\">\r\n  This form requires Google signin to submit form. So, it will show Google Form's page on submission.\r\n  Disable login for seamless user experience. Write to formfacade@guesswork.co if you need help.\r\n</div>\r\n<br/>\r\n<% } else if(data.scraped.emailAddress && data.scraped.emailAddress!=2 && isPreviewMode()){ %>\r\n<div class=\"ff-alert\">\r\n  You have enabled <b>Response receipts</b>. Go to <b>Settings</b> > <b>General</b> > <b>Collect email addresses</b> > Disable <b>Response receipts</b> for seamless user experience. Write to formfacade@guesswork.co if you need help.\r\n</div>\r\n<br/>\r\n<% } else if(result && result.code==200){ %>\r\n<br/>\r\n<h3 class=\"h3 text-center ff-success\">\r\n    <%-html(data.scraped.message?computeField(data.scraped.message):'Thanks for your interest! We will get back to you shortly.')%>\r\n</h3>\r\n<br/>\r\n<% } else if(result){ %>\r\n<div class=\"ff-alert\">\r\n  <%\r\n    var msg;\r\n    if(result.code==401)\r\n        msg = result.message+'. This form requires Google login. Please make it available to anonymous users.';\r\n    else\r\n        msg = result.message+'. Please fill the details correctly.';\r\n  %>\r\n  <%-msg%>\r\n</div>\r\n<br/>\r\n<% } %>\r\n\r\n<% if(!result || result.code>200){ %>\r\n<form id=\"Publish<%-params.publishId%>\" class=\"ff-form\" method=\"POST\"\r\naction=\"https://docs.google.com/forms/u/1/d/e/<%-data.request.params.publishId%>/formResponse\">\r\n<%\r\n  var sitems = [];\r\n  for(var sid in frm.items)\r\n  {\r\n    var sitm = frm.items[sid];\r\n    sitm.id = sid;\r\n    sitems.push(sitm);\r\n  }\r\n  sitems.sort(function(a,b){ return a.index-b.index; });\r\n  var section = {title:frm.title, id:'root', description:frm.description, items:[], editor:fac.editor};\r\n  var sections = [section];\r\n  sitems.forEach(function(sitem){\r\n    if(sitem.type=='PAGE_BREAK')\r\n    {\r\n      sections[sections.length-1].next = sitem.navigateTo;\r\n      section = {title:sitem.title, id:sitem.id, items:[]};\r\n      if(sitem.help) section.description = sitem.help;\r\n      sections.push(section);\r\n    }\r\n    else\r\n    {\r\n      section.items.push(sitem);\r\n    }\r\n  });\r\n%>\r\n<input type=\"hidden\" name=\"id\" value=\"<%-id%>\">\r\n<input type=\"hidden\" name=\"pageHistory\" value=\"\">\r\n<% sections.forEach(function(sec,s){ %>\r\n<div class=\"ff-section\" id=\"ff-sec-<%=sec.id%>\" \r\n  style=\"<%-isEditMode()?'display:block':(sec.id==activePage?'display:block':'display:none')%>;\">\r\n<% if(sec.editor && sec.editor.blocks){ %>\r\n  <%-evalBlock(sec.editor)%>\r\n<% } else{ %>\r\n  <h3 class=\"h3 ff-title\">\r\n    <%-html(sec.title)%>\r\n    <% if(isEditMode() && s==0){ %>\r\n      <i class=\"ff-customize material-icons\" onclick=\"editFacade.showCustomize()\">settings</i>\r\n    <% } %>\r\n    <i class=\"ff-edit material-icons float-right\" onclick=\"editFacade.showSetting()\">edit</i>\r\n  </h3>\r\n  <% if(sec.description){%>\r\n  <div class=\"ff-description\">\r\n    <p><%-html(sec.description)%></p>\r\n  </div>\r\n  <% } %>\r\n<% } %>\r\n<div class=\"ff-secfields\">\r\n<% if(s==0 && data.scraped.appendEmail==1){%>\r\n  <div class=\"form-group ff-item ff-emailAddress\">\r\n      <label for=\"WidgetemailAddress\"><%-lang('Email address')%> <span class=\"ff-required\">*</span></label>\r\n      <input type=\"email\" pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,63}$\"\r\n        class=\"form-control\" id=\"WidgetemailAddress\" name=\"emailAddress\" \r\n        value=\"<%=draft.emailAddress%>\" required>\r\n  </div>\r\n<% } %>\r\n<% \r\n  if(frm.shuffle && isEditMode()==false)\r\n  {\r\n    var shufitms = [];\r\n    var subshuf = [];\r\n    sec.items.forEach(function(shufitm){\r\n      if(shufitm.type=='SECTION_HEADER')\r\n      {\r\n        subshuf = shuffle(subshuf);\r\n        shufitms = shufitms.concat(subshuf);\r\n        shufitms.push(shufitm);\r\n        subshuf = [];\r\n      }\r\n      else\r\n        subshuf.push(shufitm);\r\n    });\r\n    subshuf = shuffle(subshuf);\r\n    sec.items = shufitms.concat(subshuf);\r\n  }\r\n  var filter = function(chs)\r\n  {\r\n    var valids = [];\r\n    chs.forEach(function(ch){\r\n      if(ch.value!='__other_option__')\r\n        valids.push(ch);\r\n    });\r\n    return valids;\r\n  }\r\n  var oitems = data.facade.items?data.facade.items:{};\r\n  sec.items.forEach(function(item, itmi){\r\n    var oitem = oitems[item.id]?oitems[item.id]:{};\r\n    var itmval = draft.entry[item.entry];\r\n    var fftype = item.type?item.type.toLowerCase():'unknown';\r\n    var pattern;\r\n    if(item.validType)\r\n    {\r\n      if(item.validOperator=='Email')\r\n        pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\\\.[a-z]{2,63}$';\r\n    }\r\n%>\r\n  <div class=\"form-group ff-item ff-<%-fftype%> <%-item.hasNavigation?('ff-nav-dyn'):''%>\" id=\"ff-id-<%-item.id%>\">\r\n    <% if(item.type=='SECTION_HEADER'){ %>\r\n      <h4 class=\"ff-section-header\">\r\n        <%-oitem.title?oitem.title:item.title%>\r\n      </h4>\r\n      <% if(item.help){ %>\r\n        <p><%-html(item.help)%></p>\r\n      <% } %>\r\n    <% } else if(!oitem.mode || oitem.mode=='edit' || oitem.mode=='read' || isEditMode()){ %>\r\n      <label for=\"Widget<%-item.id%>\">\r\n        <% if(oitem && oitem.editor && oitem.editor.blocks){ %>\r\n          <%-evalBlock(oitem.editor)%>\r\n          <i class=\"ff-edit material-icons float-right\" onclick=\"editFacade.showItem('<%-item.id%>')\">edit</i>\r\n          <i class=\"ff-editwidget material-icons\" onclick=\"editFacade.showWidget('<%-item.id%>')\">settings</i>\r\n        <% } else{ %>\r\n          <%-oitem.title?oitem.title:html(item.title)%>\r\n          <% if(item.required){ %><span class=\"ff-required\">*</span> <% } %>\r\n          <i class=\"ff-edit material-icons float-right\" onclick=\"editFacade.showItem('<%-item.id%>')\">edit</i>\r\n          <i class=\"ff-editwidget material-icons\" onclick=\"editFacade.showWidget('<%-item.id%>')\">settings</i>\r\n          <% if(item.help){ %>\r\n            <br/>\r\n            <small id=\"Help<%-item.id%>\" class=\"ff-help form-text text-muted\"><%-oitem.help?oitem.help:item.help%></small>\r\n          <% } %>\r\n          <% if(item.titleImage){ %>\r\n            <% \r\n              var timg = item.titleImage.image;\r\n              if(!timg)\r\n              {\r\n                var itmblob = pubfrm&&pubfrm.blobs?pubfrm.blobs[item.id+'-titleImage']:null;\r\n                if(itmblob) timg = itmblob.url;\r\n              }\r\n            %>\r\n            <img src=\"<%=timg%>\" class=\"ff-image\"/>\r\n          <% } %>\r\n        <% } %>\r\n      </label>\r\n    <% } %>\r\n    <% if(oitem.mode=='hide'){ %>\r\n      <input type=\"hidden\" id=\"Widget<%-item.id%>\" name=\"entry.<%-item.entry%>\" value=\"<%=itmval%>\">\r\n    <% } else if(oitem.mode=='read' || oitem.calculated){ %>\r\n      <% if(item.type=='PARAGRAPH_TEXT'){ %>\r\n        <textarea class=\"form-control\" id=\"Widget<%-item.id%>\" name=\"entry.<%-item.entry%>\"\r\n          rows=\"3\" readonly><%-itmval%></textarea>\r\n      <% } else{ %>\r\n        <input type=\"label\" class=\"form-control\" id=\"Widget<%-item.id%>\" name=\"entry.<%-item.entry%>\"\r\n          value=\"<%=itmval%>\" readonly>\r\n      <% } %>\r\n    <% } else if(oitem.type=='FILE_UPLOAD'){ %>\r\n      <div>\r\n        <span id=\"Status<%-item.id%>\"><%-itmval?itmval.split('/').pop():''%></span>\r\n        <input type=\"text\" id=\"Widget<%-item.id%>\" name=\"entry.<%-item.entry%>\" value=\"<%=itmval%>\" \r\n          title=\"<%=item.title%>\" <%-item.required?'required':''%> class=\"ff-file-upload\">\r\n        <input type=\"file\" onchange=\"formFacade.uploadFile('<%-item.id%>', '<%-item.entry%>', this)\">\r\n      </div>\r\n    <% } else if(item.type=='TEXT'){ %>\r\n      <input type=\"text\" class=\"form-control\" id=\"Widget<%-item.id%>\" name=\"entry.<%-item.entry%>\"\r\n        value=\"<%=itmval%>\" placeholder=\"<%=oitem.placeholder%>\" \r\n        <%-item.required?'required':''%> <%-pattern?'pattern=\"'+pattern+'\"':''%>>\r\n    <% } else if(item.type=='PARAGRAPH_TEXT'){ %>\r\n      <textarea class=\"form-control\" id=\"Widget<%-item.id%>\" name=\"entry.<%-item.entry%>\"\r\n         placeholder=\"<%=oitem.placeholder%>\" <%-item.required?'required':''%> rows=\"3\"><%-itmval%></textarea>\r\n    <% } else if(item.type=='LIST'){ %>\r\n      <% var chs = item.choices?item.choices:[] %>\r\n      <% if(chs.length<=1000){ %>\r\n        <select class=\"form-control\" id=\"Widget<%-item.id%>\" \r\n          name=\"entry.<%-item.entry%>\" <%-item.required?'required':''%>>\r\n        <option value=\"\">- <%-lang('Choose')%> -</option>\r\n        <% chs.forEach(function(ch){ %>\r\n          <option <%-itmval==ch.value?'selected':''%> value=\"<%=ch.value%>\"><%-ch.value%></option>\r\n        <% }) %>\r\n        </select>\r\n      <% } else { %>\r\n        <input type=\"text\" class=\"form-control\" id=\"Widget<%-item.id%>\" name=\"entry.<%-item.entry%>\"\r\n          value=\"<%=itmval%>\" <%-item.required?'required':''%> list=\"List<%-item.id%>\" autocomplete=\"off\">\r\n        <datalist id=\"List<%-item.id%>\">\r\n        <% chs.forEach(function(ch){ %>\r\n          <option><%-ch.value%></option>\r\n        <% }) %>\r\n        </datalist>\r\n      <% } %>\r\n    <% } else if(item.type=='CHECKBOX'){ %>\r\n      <input type=\"hidden\" name=\"entry.<%-item.entry%>_sentinel\" title=\"<%=item.title%>\" class=\"<%-item.required?'ff-check-required':''%>\"/>\r\n      <% \r\n        var chs = filter(item.choices);\r\n        if(item.shuffle)\r\n        {\r\n          var lst = chs[chs.length-1].value?null:chs.pop();\r\n          chs = shuffle(chs);\r\n          if(lst) chs.push(lst);\r\n        }\r\n        var chsels = itmval?(Array.isArray(itmval)?itmval:[itmval]):[];        \r\n        var chimgs;\r\n        if(pubfrm && pubfrm.blobs && pubfrm.blobs[item.id+'-optionImage'])\r\n          chimgs = pubfrm.blobs[item.id+'-optionImage'].url;\r\n      %>\r\n      <% if(chimgs){ %> \r\n        <div class=\"ff-check-table\">\r\n          <% chs.forEach(function(ch, chi){ %>\r\n            <% if(ch.value){ %>\r\n              <div class=\"form-check ff-check-cell\">\r\n                <img src=\"<%-chimgs[chi]%>\" class=\"ff-check-cell-image\"/>\r\n                <input class=\"form-check-input\" type=\"checkbox\" name=\"entry.<%-item.entry%>\" id=\"<%-item.entry%>.<%=ch.value%>\" \r\n                  <%-chsels.indexOf(ch.value)>=0?'checked':''%> value=\"<%=ch.value%>\" <%-item.required?'required':''%>>\r\n                <label class=\"form-check-label\" for=\"<%-item.entry%>.<%=ch.value%>\">\r\n                  <%-ch.value%>\r\n                </label>\r\n              </div>\r\n            <% } else{ %>\r\n              <div class=\"form-check form-check-other\">\r\n                <input class=\"form-check-input\" type=\"checkbox\" <%=draft.entry[item.entry+'-other_option_response']?'checked':''%>\r\n                  name=\"entry.<%-item.entry%>\" id=\"entry.<%-item.entry%>.other_option_response\" value=\"__other_option__\">\r\n                <input class=\"form-control\" type=\"text\" name=\"entry.<%-item.entry%>.other_option_response\"\r\n                  value=\"<%=draft.entry[item.entry+'-other_option_response']%>\" \r\n                  onchange=\"document.getElementById(this.name).checked=true\"/>\r\n              </div>\r\n            <% } %>\r\n        <% }) %>\r\n        </div>\r\n      <% } else{ %>\r\n        <% chs.forEach(function(ch){ %>\r\n          <% if(ch.value){ %>\r\n          <div class=\"form-check\">\r\n            <input class=\"form-check-input\" type=\"checkbox\" name=\"entry.<%-item.entry%>\" id=\"<%-item.entry%>.<%=ch.value%>\" \r\n              <%-chsels.indexOf(ch.value)>=0?'checked':''%> value=\"<%=ch.value%>\">\r\n            <label class=\"form-check-label\" for=\"<%-item.entry%>.<%=ch.value%>\">\r\n              <%-ch.value%>\r\n            </label>\r\n          </div>\r\n          <% } else{ %>\r\n            <div class=\"form-check form-check-other\">\r\n              <input class=\"form-check-input\" type=\"checkbox\" <%=draft.entry[item.entry+'-other_option_response']?'checked':''%>\r\n                name=\"entry.<%-item.entry%>\" id=\"entry.<%-item.entry%>.other_option_response\" value=\"__other_option__\">\r\n              <input class=\"form-control\" type=\"text\" name=\"entry.<%-item.entry%>.other_option_response\"\r\n                value=\"<%=draft.entry[item.entry+'-other_option_response']%>\" \r\n                onchange=\"document.getElementById(this.name).checked=true\"/>\r\n            </div>\r\n          <% } %>\r\n        <% }) %>\r\n      <% } %>\r\n    <% } else if(item.type=='MULTIPLE_CHOICE'){ %>\r\n      <% \r\n        var chs = filter(item.choices);\r\n        if(item.shuffle)\r\n        {\r\n          var lst = chs[chs.length-1].value?null:chs.pop();\r\n          chs = shuffle(chs);\r\n          if(lst) chs.push(lst);\r\n        }\r\n        var chsels = itmval?(Array.isArray(itmval)?itmval:[itmval]):[];\r\n        var chimgs;\r\n        if(pubfrm && pubfrm.blobs && pubfrm.blobs[item.id+'-optionImage'])\r\n          chimgs = pubfrm.blobs[item.id+'-optionImage'].url;\r\n      %>\r\n      <% if(chimgs){ %> \r\n        <div class=\"ff-check-table\">\r\n          <% chs.forEach(function(ch, chi){ %>\r\n            <% if(ch.value){ %>\r\n              <div class=\"form-check ff-check-cell\">\r\n                <img src=\"<%-chimgs[chi]%>\" class=\"ff-check-cell-image\"/>\r\n                <input class=\"form-check-input\" type=\"radio\" name=\"entry.<%-item.entry%>\" id=\"<%-item.entry%>.<%=ch.value%>\" \r\n                  <%-chsels.indexOf(ch.value)>=0?'checked':''%> value=\"<%=ch.value%>\" <%-item.required?'required':''%>>\r\n                <label class=\"form-check-label\" for=\"<%-item.entry%>.<%=ch.value%>\">\r\n                  <%-ch.value%>\r\n                </label>\r\n              </div>\r\n            <% } else{ %>\r\n              <div class=\"form-check form-check-other\">\r\n                <input class=\"form-check-input\" type=\"radio\" <%=draft.entry[item.entry+'-other_option_response']?'checked':''%>\r\n                  name=\"entry.<%-item.entry%>\" id=\"entry.<%-item.entry%>.other_option_response\" value=\"__other_option__\">\r\n                <input class=\"form-control\" type=\"text\" name=\"entry.<%-item.entry%>.other_option_response\"\r\n                  value=\"<%=draft.entry[item.entry+'-other_option_response']%>\" \r\n                  onchange=\"document.getElementById(this.name).checked=true\"/>\r\n              </div>\r\n            <% } %>\r\n        <% }) %>\r\n        </div>\r\n      <% } else{ %>\r\n        <% chs.forEach(function(ch){ %>\r\n          <% if(ch.value){ %>\r\n            <div class=\"form-check\">\r\n              <input class=\"form-check-input\" type=\"radio\" name=\"entry.<%-item.entry%>\" id=\"<%-item.entry%>.<%=ch.value%>\" \r\n                <%-chsels.indexOf(ch.value)>=0?'checked':''%> value=\"<%=ch.value%>\" <%-item.required?'required':''%>>\r\n              <label class=\"form-check-label\" for=\"<%-item.entry%>.<%=ch.value%>\">\r\n                <%-ch.value%>\r\n              </label>\r\n            </div>\r\n          <% } else{ %>\r\n            <div class=\"form-check form-check-other\">\r\n              <input class=\"form-check-input\" type=\"radio\" <%=draft.entry[item.entry+'-other_option_response']?'checked':''%>\r\n                name=\"entry.<%-item.entry%>\" id=\"entry.<%-item.entry%>.other_option_response\" value=\"__other_option__\">\r\n              <input class=\"form-control\" type=\"text\" name=\"entry.<%-item.entry%>.other_option_response\"\r\n                value=\"<%=draft.entry[item.entry+'-other_option_response']%>\" \r\n                onchange=\"document.getElementById(this.name).checked=true\"/>\r\n            </div>\r\n          <% } %>\r\n        <% }) %>\r\n      <% } %>\r\n    <% } else if(item.type=='SCALE'){ %>\r\n      <% var chs = filter(item.choices) %>\r\n      <table>\r\n        <col width=\"<%-Math.round(100/(chs.length+2))%>%\">\r\n        <% chs.forEach(function(ch){ %>\r\n          <col width=\"<%-Math.round(100/(chs.length+2))%>%\">\r\n        <% }) %>\r\n        <col width=\"*\">\r\n      <tr>\r\n        <td></td>\r\n        <% chs.forEach(function(ch){ %>\r\n          <td class=\"text-center\"><%-ch.value%></td>\r\n        <% }) %>\r\n        <td></td>\r\n      </tr>\r\n      <tr>\r\n        <td class=\"text-center\">\r\n          <%-item.scaleMin?item.scaleMin:''%>\r\n        </td>\r\n        <% chs.forEach(function(ch){ %>\r\n          <td class=\"text-center\">\r\n            <input class=\"ff-scale\" type=\"radio\" name=\"entry.<%-item.entry%>\" \r\n              <%-item.required?'required':''%> <%-itmval==ch.value?'checked':''%> id=\"<%=ch.value%>\" value=\"<%=ch.value%>\">\r\n          </td>\r\n        <% }) %>\r\n        <td class=\"text-center\">\r\n          <%-item.scaleMax?item.scaleMax:''%>\r\n        </td>\r\n      </tr>\r\n      </table>\r\n    <% } else if(item.type=='GRID'){ %>\r\n      <% var chs = filter(item.choices) %>\r\n      <table>\r\n        <col width=\"*\">\r\n      <% chs.forEach(function(ch){ %>\r\n        <col width=\"<%-Math.round(70/chs.length)%>%\">\r\n      <% }) %>\r\n      <tr>\r\n      <td></td>\r\n      <% chs.forEach(function(ch){ %>\r\n        <td class=\"text-center\"><%-ch.value%></td>\r\n      <% }) %>\r\n      </tr>\r\n      <% item.rows.forEach(function(rw){ if(rw.multiple==1){ %>\r\n        <input type=\"hidden\" name=\"entry.<%-rw.entry%>_sentinel\"/>\r\n      <% } }) %>\r\n      <% item.rows.forEach(function(rw, rwi){ %>\r\n        <tr>\r\n        <td class=\"ff-grid-label\"><%-rw.value%></td>\r\n        <% chs.forEach(function(ch, chi){ %>\r\n        <td class=\"text-center\"><input class=\"ff-grid-<%-rw.multiple==1?'checkbox':'radio'%> ff-grid-<%-item.entry%> ff-grid-<%-item.entry%>-row-<%-rwi%> ff-grid-<%-item.entry%>-col-<%-chi%> <%-item.onepercol?'ff-grid-onepercol':''%>\" type=\"<%-rw.multiple==1?'checkbox':'radio'%>\" name=\"entry.<%-rw.entry%>\" \r\n              <%=draft.entry[rw.entry]==ch.value?'checked':''%> id=\"<%=ch.value%>\" value=\"<%=ch.value%>\" <%-rw.multiple==0&&item.required?'required':''%>></td>\r\n        <% }) %>\r\n        </tr>\r\n      <% }) %>\r\n      </table>\r\n    <% } else if(item.type=='IMAGE'){ %>\r\n      <img src=\"<%=oitem.image?oitem.image:(item.image?item.image:(item.blob?('https://storage.googleapis.com/formfacade-imageitem/'+item.blob):'https://formfacade.com/img/image-not-found.png'))%>\" class=\"ff-image\" id=\"Widget<%-item.id%>\"/>\r\n    <% } else if(item.type=='VIDEO'){ %>\r\n      <%\r\n        var vidurl = item.video;\r\n        if(!vidurl)\r\n        {\r\n          var itmblob = pubfrm&&pubfrm.blobs?pubfrm.blobs[item.id+'-video']:null;\r\n          if(itmblob) vidurl = itmblob.url;\r\n        }\r\n      %>\r\n      <% if(vidurl){ %>\r\n        <div class=\"embed-responsive embed-responsive-16by9\">\r\n          <iframe class=\"embed-responsive-item\" src=\"<%-vidurl%>\" class=\"ff-video\" allowfullscreen></iframe>\r\n        </div>\r\n      <% } else{ %>\r\n        <img src=\"https://formfacade.com/img/video-not-found.png\" class=\"ff-video\" id=\"Widget<%-item.id%>\"/>\r\n      <% } %>\r\n    <% } else if(item.type=='DATE'){ %>\r\n      <input type=\"date\" class=\"form-control\" id=\"Widget<%-item.id%>\" \r\n        name=\"entry.<%-item.entry%>\" <%-item.required?'required':''%> value=\"<%=itmval%>\"\r\n        placeholder=\"yyyy-mm-dd\" pattern=\"\\d{4}-\\d{1,2}-\\d{1,2}\">\r\n    <% } else if(item.type=='TIME'){ %>\r\n      <input type=\"time\" class=\"form-control\" id=\"Widget<%-item.id%>\" \r\n        name=\"entry.<%-item.entry%>\" <%-item.required?'required':''%> value=\"<%=itmval%>\">\r\n    <% } else if(item.type=='SECTION_HEADER'){ %>\r\n    <% } else { %>\r\n      <input type=\"text\" class=\"form-control\" id=\"Widget<%-item.id%>\" \r\n        name=\"entry.<%-item.entry%>\" <%-item.required?'required':''%> value=\"<%=itmval%>\">\r\n    <% } %>\r\n  </div>\r\n<% }) %>\r\n</div>\r\n<div class=\"ff-button-bar\">\r\n<% if(s>=1){ %>\r\n  <button type=\"button\" class=\"<%-backcss%> ff-back\" id=\"ff-back-<%-sec.id%>\"\r\n    onclick=\"<%-insideIframe()?'parent.':''%>formFacade.gotoSection(this.form, '<%-sec.id%>', 'back')\">\r\n    <%-lang('Back')%>\r\n  </button>\r\n<% } %>\r\n<% \r\n  if(s+1==sections.length || sec.next==-3){ \r\n    data.ending = sec.id;\r\n%>\r\n  <button type=\"button\" class=\"<%-submitcss%> ff-submit\" id=\"ff-submit-<%-sec.id%>\"\r\n    onclick=\"<%-insideIframe()?'parent.':''%>formFacade.submit(this.form, '<%-sec.id%>')\">\r\n    <%-lang('Submit')%>\r\n  </button>\r\n<% } else { %>\r\n  <button type=\"button\" class=\"<%-submitcss%> ff-next\" id=\"ff-next-<%-sec.id%>\"\r\n    onclick=\"<%-insideIframe()?'parent.':''%>formFacade.gotoSection(this.form, '<%-sec.id%>', '<%-sec.next%>')\">\r\n    <%-lang('Next')%>\r\n  </button>\r\n<% } %>\r\n\r\n<% \r\n  var inlinecss = {display:'inline-block', position:'relative', opacity:1, visibility:'visible',\r\n    'font-size':'13px', 'font-weight':600, 'line-height':'22px', 'letter-spacing':'.8px', 'text-indent':'0em', 'z-index':1};\r\n  var inlinestyle = Object.keys(inlinecss).map(function(ky){ return ky+':'+inlinecss[ky]+' !important'; }).join('; ');\r\n%>\r\n<% if(!params.userId){ %>\r\n  <a href=\"https://formfacade.com/verify/<%-slugify(frm.title)?slugify(frm.title):'google-forms'%>-on-<%-params.publishId%>.html\" target=\"_blank\"\r\n  class=\"ff-powered\" style=\"color:#0074D9 !important; border-bottom:1px solid #0074D9 !important; <%-inlinestyle%>\">\r\n    Ownership not verified\r\n  </a>\r\n<% } else{ %>\r\n  <% var reurl = 'https://formfacade.com/create/'+location.hostname.split('www.').pop()+'-created-'+slugify(frm.title?frm.title:'google-forms')+'-on-'+params.publishId+'-for-'+params.userId+'.html'; %>\r\n  <% if(!config.plan){ %>\r\n    <a href=\"<%-reurl%>\" target=\"_blank\" \r\n      class=\"ff-powered\" style=\"color:#0074D9 !important; border-bottom:1px solid #0074D9 !important; <%-inlinestyle%>\">\r\n      Made with Formfacade\r\n    </a>\r\n  <% } else if(config.plan=='paid'){ %>\r\n  <% } else if(config.plan=='warned'){ %>\r\n    <a href=\"<%-reurl%>\" target=\"_blank\" \r\n      class=\"ff-warned\" style=\"color:#000 !important; border:1px solid #f5c6cb !important; <%-inlinestyle%>\">\r\n      <b>⚡</b> Form responses limit reaching soon\r\n    </a>\r\n  <% } else if(config.plan=='blocked'){ %>\r\n    <a href=\"<%-reurl%>\" target=\"_blank\" \r\n      class=\"ff-blocked\" style=\"color:#fff !important; <%-inlinestyle%>\">\r\n      <b>⚠</b> Form responses limit reached. Upgrade now.\r\n    </a>\r\n  <% } %>\r\n<% } %>\r\n</div>\r\n</div>\r\n<% }) %>\r\n\r\n<div class=\"ff-section\" id=\"ff-sec-ending\" style=\"<%-activePage=='ending'?'display:block':'display:none'%>\">\r\n<div class=\"ff-secfields\">\r\n  <h3 class=\"h3 ff-title\"><%-html(sections[0].title)%></h3>\r\n  <p style=\"padding-bottom:80px;\">Click <%-lang('Submit')%> to finish.</p>\r\n</div>\r\n<div class=\"ff-button-bar\">\r\n  <button type=\"button\" class=\"<%-backcss%> ff-back\" \r\n    onclick=\"<%-insideIframe()?'parent.':''%>formFacade.gotoSection(this.form, '<%-data.ending%>', 'back')\">\r\n    <%-lang('Back')%>\r\n  </button>\r\n  <button type=\"button\" class=\"<%-submitcss%> ff-submit\"\r\n    onclick=\"<%-insideIframe()?'parent.':''%>formFacade.submit(this.form, '-3')\">\r\n    <%-lang('Submit')%>\r\n  </button>\r\n</div>\r\n</div>\r\n\r\n</form>\r\n<% } %>\r\n"}

formFacade.config = {"themecolor":"colorful-5d33fb","themecss":"font=%22Work%20Sans%22%2CHelvetica%2CArial%2Csans-serif&heading=%22Poppins%22%2C%20sans-serif&primary=%235d33fb&primaryActive=%23492bbb&secondary=%23b161fc"}

formFacade.load("#ff-compose");