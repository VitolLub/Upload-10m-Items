!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=7)}({7:function(e,t,n){function i(e,t=!0){const n=document.querySelector(e);n&&(n.style["outline-style"]=t?"solid":"",n.style["outline-color"]=t?"red":"",n.style["outline-width"]=t?"1px":"")}n(8),n(9),browser.runtime.onMessage.addListener((e,t)=>"highlight"==e.action?i(e.selector):"unHighlight"==e.action?i(e.selector,!1):void 0)},8:function(e,t){const n=browser.runtime.connect({name:"recordPort"});function i(e){return this.closest(e)}function r(e,t){return"function"==typeof e?e(t):e}function o(e,t){for(const{queries:n,type:o,input1:c,input2:u}of t){const t=n.map(i.bind(e)).filter(e=>e);if(t.length){const e=t[0];return s(o,[r(c,e),r(u,e)])}}}function c({target:e,type:t}){const n=[{queries:["input[type=text]","input[type=password]","textarea","select"],type:"change",input1:u,input2:e=>e.value},{queries:["input[type=radio]","input[type=checkbox]"],type:"check",input1:u,input2:""}],i=[{queries:["[contenteditable='true']"],type:"change",input1:u,input2:e=>e.innerHTML}];"click"===t&&o(e,[{queries:["button","input[type='button'], [contenteditable='true']"],type:"click",input1:u,input2:""},{queries:["input[type=submit]","input[type=image]"],type:"click-update",input1:u,input2:""},{queries:["a[href^='#']","a[href='']"],type:"click",input1:u,input2:""},{queries:["a[href]"],type:"redirect",input1:e=>e.getAttribute("href"),input2:""}]),"change"===t&&o(e,n),"blur"===t&&o(e,i)}function u(e){const t=[];if(e.nodeType===Node.TEXT_NODE&&(e=e.parentElement),e.nodeType!==Node.ELEMENT_NODE)return!1;for(;e&&e!==document.documentElement;){if(e.id){t.unshift("#"+e.id);break}{let n=e.nodeName.toLowerCase(),i=e,r=1;for(;i=i.previousElementSibling;)i.nodeName.toLowerCase()==n&&r++;1!=r?t.unshift(`${n}:nth-of-type(${r})`):t.unshift(n)}e=e.parentElement}return!!t.length&&t.join(" > ")}function s(e,t){n.postMessage({msgType:"RecordedEvent",type:e,inputs:t})}document.addEventListener("click",c,!0),document.addEventListener("change",c,!0),document.addEventListener("blur",c,!0)},9:function(module,exports){let clipboard={};async function executeAction(recordRow,request){const{type:type,inputs:inputs}=recordRow,[input1,input2]=inputs;switch(type){case"change":{const e=document.querySelector(input1);e.focus();const t={bubbles:!0},n=e.closest('[contenteditable="true"]');if(n){e.innerHTML=placeholders(input2);const n=new Event("input");e.dispatchEvent(n,t)}else{e.value=placeholders(input2);const n=new Event("change");e.dispatchEvent(n,t)}break}case"click-update":case"click":{const e=document.querySelector(input1),t={bubbles:!0};e.dispatchEvent(new MouseEvent("mousedown"),t),e.focus(),e.click(),e.dispatchEvent(new MouseEvent("mouseup"),t);break}case"check":document.querySelector(input1).checked=!0;break;case"redirect":window.location=input1;break;case"inject":{const e="grabClipboardHere",t=document.createElement("script");t.setAttribute("type","application/javascript"),t.textContent=`\n        var clipboard=${JSON.stringify(request.clipboard)};\n        ${input1};\n        var newdiv = document.createElement('div');\n        if(document.getElementById('${e}')!= null) {\n          document.getElementById('${e}').textContent = JSON.stringify(clipboard);\n        }\n        else {\n          newdiv.setAttribute('id', '${e}');\n          newdiv.textContent = JSON.stringify(clipboard);\n          document.body.appendChild(newdiv);\n        }\n        document.getElementById('${e}').style.display = 'none';`,document.documentElement.appendChild(t),document.documentElement.removeChild(t);const n=document.querySelector("#"+e);n&&(clipboard=JSON.parse(n.textContent));break}case"cs-inject":await eval(`(async () => {${input1}})()`);break;case"copy":{const e=document.querySelector(input1);e&&(clipboard.copy=e.textContent);break}case"copy-html":{const e=document.querySelector(input1);e&&(clipboard.copy=e.innerHTML);break}}return Promise.resolve({answere:"instructOK",clipboard:clipboard})}function placeholders(e){const t=/<\$unique=.*?>/,n=/<\$clipboard=.*?>/;if(t.test(e)){const n=t.exec(e)[0],i=n.indexOf(">"),r=n.indexOf("="),o=n.slice(r+1,i),c=(new Date).getTime()+"",u=c.substring(c.length-o);return e.replace(t,u)}if(/<\$past>/.test(e))return clipboard.copy;if(n.test(e)){const t=n.exec(e)[0],i=t.indexOf(">"),r=t.indexOf("="),o=t.slice(r+1,i);return e.replace(t,clipboard[o])}return e}browser.runtime.onMessage.addListener((e,t)=>{if("executeAction"==e.action){clipboard=e.clipboard;try{return executeAction(e.instruction,e)}catch(e){return Promise.resolve({answere:"instructOK",clipboard:clipboard})}}})}});