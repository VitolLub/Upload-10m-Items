!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=17)}([function(t,e){const n="projects";async function i(){return(await browser.storage.local.get(n))[n]}function o(t){const e={};return e[n]=t.map(s),browser.storage.local.set(e)}function s(t){return t.editable&&delete t.editable,t.subItems&&(t.subItems=t.subItems.map(s)),t}function c(t,e){return t.filter(({text:t})=>t===e).length>0}function r(t,e){if(!t||!t.length)return null;let n=1;for(;t.filter(({text:t})=>t===`${e}${n}`).length>0;)n++;return`${e}${n}`}function a(t,e){for(const{id:n,subItems:i}of t){if(n===e)return!0;if(i&&i.filter(({id:t})=>t===e).length>0)return!0}return!1}t.exports={load:i,saveState:o,importProjects:async function(t,e){const n=await i();let s=null;if(e)s=n.filter(({text:t})=>t===e)[0];else{const t=r(n,"group");let e=0;for(;a(n,`${t}_${++e}`););const i=`${t}_${e}`;console.log(i),s=function(t,e){return{id:e,text:t,type:"group",expanded:!1,subItems:[]}}(t,i),n.push(s)}for(const e of t){const{text:t,id:i}=e;if(c(s.subItems,t)&&(e.text=r(s.subItems,t+"_")),!i||a(n,i)){let i=0;for(;a(n,`${t}_${++i}`););e.id=`${t}_${i}`}s.subItems.push(e)}return o(n)},addAction:async function(t,e,n){const s=await i(),[c]=s.filter(({id:e})=>e===t);if(!c)return!1;const[r]=c.subItems.filter(({id:t})=>t===e);if(!r||!r.actions)return!1;const{actions:a}=r;return a.push(n),o(s)},name:n}},function(t,e){const n="customActions";t.exports={load:async function(){return(await browser.storage.local.get(n))[n]},saveState:function(t){const e={};return e[n]=t,browser.storage.local.set(e)},name:n,predefined:[{data:{type:"timer",inputs:["1000","Please enter the time in milliseconds"]},info:{description:"Stops workflow of project for mentioned period in milliseconds then continue with it."},text:"Timer"},{data:{type:"update",inputs:["this event will let the script wait for page update",""]},info:{description:"This action will let the execution flow wait for page update/load and then continue with it."},text:"Update"},{data:{type:"bg-function",inputs:["<$function=removeCookie>\n<$attr=.*>","use regular expressions to filter domains"]},info:{description:"Clear browser cookie(s) for domains matching corresponding regular expression in `<$attr=.*>`, ex.: `<$attr=google.com>`"},text:"Clear cookies"},{data:{type:"bg-function",inputs:['<$function=saveToClipboard>\n<$attr={"name": "value"}>',"Write to clipboard Object to access data later. Use Json in the attr"]},info:{description:"Write to clipboard Object to access data later. Use Json in the attr."},text:"Clipboard"}]}},function(t,e){var n=n||[];n.push(["_setAccount","UA-32260034-1"]),n.push(["_trackPageview"]),function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://ssl.google-analytics.com/ga.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}(),t.exports={_gaq:n}},function(t,e){t.exports={Notification:class{constructor(t){this.notificationElement=document.querySelector(t)}show(t,e){this.notificationElement.textContent=t,this.notificationElement.classList.remove("error"),e&&this.notificationElement.classList.add("error")}clean(){this.show("")}error(t){this.show(t,!0)}},NO_PROJ_SELECTED:"Please select project",NO_PROJ_GROUP_SELECTED:"Please select Group or Project",NO_ACTION_SELECTED:"Please select action",SELECT_PROJ_NOT_GROUP:"Please select project (not group)",CHANGES_SAVED:"Changes has been saved",NO_GROUP_ROOT_SELECTED:"Please select group or 'Root'",NO_IMPORT_DATA:"Please specify the import data",NO_PROJ_GROUP_TYPE:"Type should either be of type 'group' or 'project'",PROJECT_IMPORTED:"The group or project is imported",NO_FUNCTION_NAME:"Please specify 'name' of the function",NO_SELECTED_FUNCTION:"Please select a function",CHANGES_SAVED:"Changes has been saved",NAME_EXISTS_GROUP:"The group with choosen name already exists",NAME_EXISTS_PROJECT:"The group already has project with current name",PROJECT_EDIT:"Please click 'save' below projects list to finish renaming"}},function(t,e,n){const{saveState:i}=n(0),o=n(1);function s(){return{data:JSON.parse(localStorage.getItem("data")),settings:JSON.parse(localStorage.getItem("settings")),cbaFunctions:JSON.parse(localStorage.getItem("cba-functions"))}}function c({projects:t},e){return t&&t.length?t.map(({name:t,action:n})=>{return{id:e?`${e}_${t}`:t,text:t,actions:(i=n,i&&i.length?i.map(({data:t,evType:e,newValue:n})=>{let i=e;return"copy"===e?i="copy-html":"submit-click"===e&&(i="click-update"),{type:i,inputs:"timer"===i?[n,t]:[t,n]}}):[]),type:"project"};var i}):[]}function r(t){const e=[];for(const n of Object.keys(t)){const i={text:n,id:n,expanded:!1,subItems:c(t[n],n),type:"group"};e.push(i)}return e}t.exports={migrate:async function(){const{data:t,cbaFunctions:e}=s();if(t&&await i(r(t)),e){const t=[];for(const{name:n,data:i,evType:s,newValue:c}of e){const[e]=o.predefined.filter(({text:t})=>t===n),r=c||"",a=s,u="timer"==a?[r,i]:[i,r],p=e?e.info:{description:""};t.push({data:{type:a,inputs:u},text:n,info:p})}await o.saveState(t)}},backup:async function(){const{data:t,settings:e,cbaFunctions:n}=s();if(t||e||n){const i={data:t,settings:e,cbaFunctions:n};await browser.storage.local.set({backup:i})}},migrateData:r,migrateProjects:c}},function(t,e,n){const i=n(6),o=["inject","cs-inject","bg-inject","bg-function","check","click","click-update","update","redirect","copy","copy-html","pause"],s=["update","timer","pause"],c=["timer"],r=["change","check","click","click-update","copy","copy-html"];t.exports=class{constructor(t){const{type:e,inputs:n,text:i,info:o={}}=t,[s,c]=n;this.typeInput=document.querySelector(e),this.mainInput=document.querySelector(s),this.secondaryInput=document.querySelector(c),this.functionNameInput=document.querySelector(i),this.functionDescriptionInput=document.querySelector(o.description),this.functionLinkInput=document.querySelector(o.link),this.tooltip=null,this.typeInput.addEventListener("change",this.onTypeChange.bind(this)),this._populateTypes(),this.onTypeChange()}get _type(){return this.typeInput.value}set _type(t){this.typeInput.value=t,this.onTypeChange()}get _main(){return this.mainInput.value}set _main(t){this.mainInput.value=t}get _secondary(){return this.secondaryInput.value}set _secondary(t){this.secondaryInput.value=t}get _functionName(){return this.functionNameInput.value}set _functionName(t){this.functionNameInput.value=t}get _functionDescription(){return this.functionDescriptionInput.value}set _functionDescription(t){this.functionDescriptionInput.value=t}get _functionLink(){return this.functionLinkInput.value}set _functionLink(t){this.functionLinkInput.value=t}isReverse(){return c.includes(this._type)}isFunction(){return this.functionNameInput}isHighlight(t){return r.includes(t)}_populateTypes(){for(const{name:t}of i){const e=document.createElement("option");e.value=t,e.textContent=t,this.typeInput.appendChild(e)}}setTooltip(t){this.tooltip=document.querySelector(t),this.setTooltipInfo()}setTooltipInfo(){const{link:t,description:e,name:n}=i.filter(({name:t})=>t===this._type)[0],o=n,s=e;this.tooltip.setData({heading:o,text:s,link:t,linkText:"Learn more"})}reset(){this.typeInput.selectedIndex=0,this._main="",this._secondary=""}getItem(){const t=[this._main,this._secondary],e={type:this._type,inputs:this.isReverse()?t.reverse():t};return this.isFunction()?{data:e,text:this._functionName,info:{description:this._functionDescription,link:this._functionLink}}:e}setItem(t){let e,n,i,o="";this.isFunction()&&t.data?(({type:n,inputs:o}=t.data),({info:i={},text:e}=t)):({type:n,inputs:o}=t),n?this._type=n:this.typeInput.selectedIndex=0,o?this.isReverse()?(this._main=o[1]||"",this._secondary=o[0]||""):(this._main=o[0]||"",this._secondary=o[1]||""):(this._main="",this._secondary=""),e&&(this._functionName=e),i&&i.description&&(this._functionDescription=i.description),i&&i.link&&(this._functionLink=i.link)}onTypeChange(){this.mainInput.disabled=!1,this.secondaryInput.disabled=!1;const t=this._type;this.tooltip&&this.setTooltipInfo(),o.includes(t)&&(this.secondaryInput.disabled=!0),s.includes(t)&&(this.mainInput.disabled=!0)}}},function(t,e){const n="https://chrome-automation.com",i=[{name:"inject",description:"Injects script into web page and iframes.",link:n+"/inject"},{name:"cs-inject",description:"Injects javascript code into the content script.",link:n+"/inject-cs"},{name:"bg-inject",description:"Inject script into backroung page of the extension.",link:n+"/bg-inject"},{name:"bg-function",description:"Predefined scripts that are executed in the context of the background page.",link:n+"/bg-function"},{name:"change",description:"Changes value of HTML inputs.",link:n+"/change"},{name:"check",description:"Checks/unchecks checkboxes.",link:n+"/check"},{name:"click",description:"Triggers click event.",link:n+"/click"},{name:"click-update",description:"Triggers click event and waits for the page to update to proceed with the rest of the actions.",link:n+"/click-update"},{name:"update",description:"Waits for the browser update and then continue with workflow.",link:n+"/update"},{name:"timer",description:"Timer action is used to stop workflow of project for mentioned period in milliseconds then continue with it.",link:n+"/timer"},{name:"redirect",description:"Redirects the page to mentioned URL and wait for browser update to continue with project workflow.",link:n+"/redirect"},{name:"copy",description:"Copy content of the element into clipboard['copy'] object, which can be used later during the execution.",link:n+"/copy"},{name:"copy-html",description:"Copy HTML content of the element into clipboard['copy'] object, which can be used later during the execution.",link:n+"/copy-html"},{name:"pause",description:"Pause project workflow, waits for 'resume' button to be clicked in extension popup.",link:n+"/pause"}];t.exports=i},,,,,,,,,,,function(t,e,n){n(2),n(18),n(19),n(21),async function(){const{version:t}=await browser.app.getDetails();document.querySelector("#version").textContent="v. "+t}()},function(t,e,n){const i=n(0),{migrateData:o,migrateProjects:s}=n(4),{Notification:c,NO_GROUP_ROOT_SELECTED:r,NO_IMPORT_DATA:a,NO_PROJ_GROUP_TYPE:u,PROJECT_IMPORTED:p}=n(3),l=new c("#panel-import .notification"),d=document.querySelector("#exportList"),f=document.querySelector("#importList"),m=document.querySelector("#automImport"),h=document.querySelector("#automExport");async function g(){const t=await i.load();d.items=t.map(t=>(t.expanded=!0,t))}async function y(){const t=(await i.load()).map(t=>(t.subItems&&delete t.subItems,t));t.length&&"root"===t[0].id||t.unshift({id:"root",text:"Root",type:"group"}),f.items=t}g(),y(),document.querySelector("#importProjects").addEventListener("click",(async function(){if(l.clean(),!m.value)return void l.error(a);const t=f.getSelectedItem();if(!t)return void l.error(r);let e=JSON.parse(m.value);if("isLeaf"in e)if(e.isLeaf){const t=[e];[e]=s({projects:t},"")}else{const t={};t[e.name]=e,[e]=o(t)}let n="";if("group"===e.type)n=e.subItems;else{if("project"!==e.type)return void l.error(u);n=[e]}if("Root"===t.text)await i.importProjects(n);else{const e=t.text;await i.importProjects(n,e)}l.show(p)})),d.addEventListener("select",(async function(){const t=d.getSelectedItem();t.expanded&&(t.expanded=!1),t.selected&&(t.selected=!1),h.value=JSON.stringify(t)})),browser.storage.onChanged.addListener(t=>{t[i.name]&&(g(),y())})},function(t,e,n){const i=n(20),o=n(1),{Notification:s,NO_FUNCTION_NAME:c,NO_SELECTED_FUNCTION:r}=n(3),a=n(5),u=new s("#panel-functions .notification"),p=new a({type:"#funcEvType",inputs:["#funcData","#funcNewValue"],text:"#funcName",info:{description:"#funcDescription",link:"#funcLink"}}),l=document.querySelector("#functions");async function d(){l.items=await o.load()}function f(){return o.saveState(l.items)}d(),l.addEventListener("select",(function(){const t=l.getSelectedItem();p.setItem(t)})),i((function(t){switch(t){case"addFunction":{const t=p.getItem();if(!t.text)return void u.error(c);l.addRow(t),f();break}case"deleteFunction":{const t=l.getSelectedItem();if(!t)return void u.error(r);l.deleteRow(t.id),f();break}case"saveFunction":{const t=l.getSelectedItem();if(!t)return void u.error(r);const e=p.getItem();if(!e.text)return void u.error(c);l.updateRow(e,t.id),f();break}}})),browser.storage.onChanged.addListener(t=>{t[o.name]&&d()})},function(t,e){t.exports=function(t){document.body.addEventListener("click",({target:e})=>{const n=e.dataset.action;n&&t(n)})}},function(t,e,n){const i=document.querySelector("cba-tabs"),{load:o,saveState:s}=n(22);!async function(){const t=await o();t?i.select(t):i.select("import-tab")}(),i.addEventListener("tabChange",async({detail:t})=>{s(t)})},function(t,e){t.exports={load:async function(){const{tab:t}=await browser.storage.local.get("tab");return t},saveState:function(t){const e=t;return browser.storage.local.set({tab:e})}}}]);