!function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(a,r,function(e){return t[e]}.bind(null,r));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=10)}([function(t,e){const n="projects";async function a(){return(await browser.storage.local.get(n))[n]}function r(t){const e={};return e[n]=t.map(o),browser.storage.local.set(e)}function o(t){return t.editable&&delete t.editable,t.subItems&&(t.subItems=t.subItems.map(o)),t}function i(t,e){return t.filter(({text:t})=>t===e).length>0}function c(t,e){if(!t||!t.length)return null;let n=1;for(;t.filter(({text:t})=>t===`${e}${n}`).length>0;)n++;return`${e}${n}`}function s(t,e){for(const{id:n,subItems:a}of t){if(n===e)return!0;if(a&&a.filter(({id:t})=>t===e).length>0)return!0}return!1}t.exports={load:a,saveState:r,importProjects:async function(t,e){const n=await a();let o=null;if(e)o=n.filter(({text:t})=>t===e)[0];else{const t=c(n,"group");let e=0;for(;s(n,`${t}_${++e}`););const a=`${t}_${e}`;console.log(a),o=function(t,e){return{id:e,text:t,type:"group",expanded:!1,subItems:[]}}(t,a),n.push(o)}for(const e of t){const{text:t,id:a}=e;if(i(o.subItems,t)&&(e.text=c(o.subItems,t+"_")),!a||s(n,a)){let a=0;for(;s(n,`${t}_${++a}`););e.id=`${t}_${a}`}o.subItems.push(e)}return r(n)},addAction:async function(t,e,n){const o=await a(),[i]=o.filter(({id:e})=>e===t);if(!i)return!1;const[c]=i.subItems.filter(({id:t})=>t===e);if(!c||!c.actions)return!1;const{actions:s}=c;return s.push(n),r(o)},name:n}},function(t,e){const n="customActions";t.exports={load:async function(){return(await browser.storage.local.get(n))[n]},saveState:function(t){const e={};return e[n]=t,browser.storage.local.set(e)},name:n,predefined:[{data:{type:"timer",inputs:["1000","Please enter the time in milliseconds"]},info:{description:"Stops workflow of project for mentioned period in milliseconds then continue with it."},text:"Timer"},{data:{type:"update",inputs:["this event will let the script wait for page update",""]},info:{description:"This action will let the execution flow wait for page update/load and then continue with it."},text:"Update"},{data:{type:"bg-function",inputs:["<$function=removeCookie>\n<$attr=.*>","use regular expressions to filter domains"]},info:{description:"Clear browser cookie(s) for domains matching corresponding regular expression in `<$attr=.*>`, ex.: `<$attr=google.com>`"},text:"Clear cookies"},{data:{type:"bg-function",inputs:['<$function=saveToClipboard>\n<$attr={"name": "value"}>',"Write to clipboard Object to access data later. Use Json in the attr"]},info:{description:"Write to clipboard Object to access data later. Use Json in the attr."},text:"Clipboard"}]}},function(t,e){var n=n||[];n.push(["_setAccount","UA-32260034-1"]),n.push(["_trackPageview"]),function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://ssl.google-analytics.com/ga.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}(),t.exports={_gaq:n}},,function(t,e,n){const{saveState:a}=n(0),r=n(1);function o(){return{data:JSON.parse(localStorage.getItem("data")),settings:JSON.parse(localStorage.getItem("settings")),cbaFunctions:JSON.parse(localStorage.getItem("cba-functions"))}}function i({projects:t},e){return t&&t.length?t.map(({name:t,action:n})=>{return{id:e?`${e}_${t}`:t,text:t,actions:(a=n,a&&a.length?a.map(({data:t,evType:e,newValue:n})=>{let a=e;return"copy"===e?a="copy-html":"submit-click"===e&&(a="click-update"),{type:a,inputs:"timer"===a?[n,t]:[t,n]}}):[]),type:"project"};var a}):[]}function c(t){const e=[];for(const n of Object.keys(t)){const a={text:n,id:n,expanded:!1,subItems:i(t[n],n),type:"group"};e.push(a)}return e}t.exports={migrate:async function(){const{data:t,cbaFunctions:e}=o();if(t&&await a(c(t)),e){const t=[];for(const{name:n,data:a,evType:o,newValue:i}of e){const[e]=r.predefined.filter(({text:t})=>t===n),c=i||"",s=o,u="timer"==s?[c,a]:[a,c],l=e?e.info:{description:""};t.push({data:{type:s,inputs:u},text:n,info:l})}await r.saveState(t)}},backup:async function(){const{data:t,settings:e,cbaFunctions:n}=o();if(t||e||n){const a={data:t,settings:e,cbaFunctions:n};await browser.storage.local.set({backup:a})}},migrateData:c,migrateProjects:i}},,,,,,function(t,e,n){n(2);const{migrate:a,backup:r}=n(4),{CBA:o}=n(11),{playProject:i}=n(12),c=n(0),s=n(1);function u(t){return"redirect"==t.type?c.addAction(cba.recordingGroupId,cba.recordingProjectId,t):("update"!=cba.lastEvType||"update"!=t.type)&&(cba.lastEvType=t.type,c.addAction(cba.recordingGroupId,cba.recordingProjectId,t))}window.cba=new o,window.cba.playButtonClick=async function(t,e,n){cba.paused?cba.restore():cba.setProject(t,e,n);await i()},window.cba.recordButtonClick=async function(t,e){cba.record(t,e),await async function(){const{url:t}=(await browser.tabs.query({active:!0}))[0];await u({msgType:"RecordedEvent",type:"redirect",inputs:[t,""]})}(),browser.browserAction.setBadgeText({text:"rec"})},window.cba.stopButtonClick=function(){cba.stop(),browser.browserAction.setBadgeText({text:""})},browser.runtime.onConnect.addListener(t=>{t.onMessage.addListener(async t=>{cba.allowRec&&u(t)})}),async function(){const t=localStorage.getItem("data"),e=await browser.storage.local.get(c.name);if(t)await r(),await a(),localStorage.removeItem("data");else{if(!Object.keys(e).length){const t={};t[c.name]=[{id:"group",text:"group",type:"group",expanded:!1,subItems:[{id:"project",text:"project",type:"project",actions:[]}]}],await browser.storage.local.set(t)}const t=await browser.storage.local.get(s.name);if(!Object.keys(t).length){const t={};t[s.name]=s.predefined,await browser.storage.local.set(t)}}}()},function(t,e){t.exports.CBA=class{constructor(){this.allowRec=!1,this.allowPlay=0,this.paused=0,this.playingProjectId,this.playingActionIndex=-1,this.recordingProjectId=null,this.recordingGroupId=null,this.instructArray,this.defInstructArray,this.playingTabId=null,this.instruction,this.selectedProjectId,this.lastEvType,this.currentTab,this.projectRepeat=1,this.lastSelectedProjectId,this.lastSelectedActionId,this.selectedProjObj}setProject(t,e,n){null==this.clipboard&&(this.clipboard={}),this.allowPlay=1,this.projectRepeat=e,n&&(this.playingProjectId=n),this.instructArray=t,this.defInstructArray=this.instructArray.slice(0)}stop(){this.allowRec=!1,this.allowPlay=0,this.paused=0}pause(){this.allowPlay=0,this.paused=1}record(t,e){this.recordingProjectId=e,this.recordingGroupId=t,this.allowRec=!0}setInstructionArray(t){this.instructArray=t}restore(){this.paused=0,this.allowPlay=1}async getPlayingTabId(){if(this.playingTabId)return this.playingTabId;const[t]=await browser.tabs.query({active:!0});return t.id}}},function(module,exports,__webpack_require__){const readyFunctions=__webpack_require__(13);async function playProject(){if(0!=cba.allowPlay)if(cba.instructArray.length){browser.browserAction.setBadgeText({text:"play"});const[t]=cba.instructArray.splice(0,1);cba.playingActionIndex=cba.defInstructArray.length-cba.instructArray.length-1;try{await actionExecution(t)}catch(t){}await playProject()}else cba.projectRepeat>1?(cba.projectRepeat--,cba.setProject(cba.defInstructArray,cba.projectRepeat,cba.playingProjectId),playProject()):(cba.playingActionIndex=-1,cba.playingProjectId=null,cba.allowPlay=0,browser.browserAction.setBadgeText({text:""}))}async function actionExecution(instruction){const{type:type,inputs:inputs}=instruction,[input1]=inputs;switch(type){case"redirect":case"click-update":messageContentScript(instruction,cba.clipboard),await waitForUpdate();break;case"update":await waitForUpdate();break;case"timer":await timeout(input1);break;case"bg-function":await bgFunctionParser(input1);break;case"bg-inject":{let sendInstruction=()=>"";const actionToPlay=t=>cba.instructArray=cba.defInstructArray.slice(t);let sendBgInstruction=!0;const clipboard=cba.clipboard;if(await eval(`(async () => {${input1}})()`),cba.clipboard=clipboard,!sendBgInstruction)return new Promise(t=>{sendInstruction=t});break}case"pause":cba.pause(),browser.browserAction.setBadgeText({text:"||"});break;default:await messageContentScript(instruction,cba.clipboard)}}async function messageContentScript(t,e){const n={action:"executeAction",instruction:t,clipboard:e},a=await cba.getPlayingTabId();await browser.tabs.sendMessage(a,n).then(playResponse)}async function playResponse(t){null==t?await timeout(1e3):"instructOK"==t.answere&&(cba.clipboard=t.clipboard)}async function bgFunctionParser(t){const e=/<\$attr=([^>]*)>/g,n=/clipboard\[["'](.*)["']\]/,a=[],r=/<\$function=(\S*)>/.exec(t);if(!r)return!1;const o=r[1];for(;attribute=e.exec(t);){const t=n.exec(attribute[1]);t?a.push(getClipboardValue(t[1])):a.push(attribute[1])}a.length?await readyFunctions[o](...a):await readyFunctions[o]()}function getClipboardValue(t){return cba.clipboard[t]}function timeout(t){return new Promise(e=>setTimeout(e,t))}async function waitForUpdate(){const t=await cba.getPlayingTabId();let e;return new Promise(n=>{e=(e,a)=>{e==t&&"complete"==a.status&&n()},browser.tabs.onUpdated.addListener(e)}).then(()=>browser.tabs.onUpdated.removeListener(e))}module.exports={playProject:playProject}},function(t,e){t.exports={removeCookie:async function(t){const e=await browser.cookies.getAll({});for(const n of e)if(new RegExp(t).test(n.domain)){const t="http"+(n.secure?"s":"")+"://"+n.domain+n.path;await browser.cookies.remove({url:t,name:n.name})}},saveToClipboard:function(t){const e=JSON.parse(t);for(const t in e)cba.clipboard[t]=e[t]},panelCreation:async function(t){if(!t)return!1;await browser.windows.create({url:t,width:600,height:600,type:"panel"})},windowCreation:async function(t){if(!t)return!1;await browser.windows.create({url:t})},removeCurrentWindow:async function(){const{id:t}=await browser.windows.getCurrent();await browser.windows.remove(t)},reloadCurrentTab:async function(){const{id:t}=(await browser.tabs.query({active:!0}))[0];await browser.tabs.reload(t)},requestService:async function(t,e,n,a=!0){const r=await async function(t,e,n="",a,r=!0){const o={};e&&(o.method=e);a&&(o.header={"Content-Type":a});"GET"!==e&&(o.body=n);let i=await fetch(t,o);r&&(i=await i.json());return i}(e,t,n,null,a);r&&(cba.clipboard.serviceAnswer=r)}}}]);