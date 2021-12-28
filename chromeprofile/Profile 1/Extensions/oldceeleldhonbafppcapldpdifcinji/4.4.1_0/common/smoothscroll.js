!function(){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */var t=function(){return(t=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};var e,r=function(t){return.5*(1-Math.cos(Math.PI*t))},n=function(){return Date.now()},o=function(t){var e=(n()-t.timeStamp)/(t.duration||500);if(e>1)return t.method(t.targetX,t.targetY),void t.callback();var i=(t.timingFunc||r)(e),a=t.startX+(t.targetX-t.startX)*i,c=t.startY+(t.targetY-t.startY)*i;t.method(a,c),t.rafId=requestAnimationFrame((function(){o(t)}))},i=function(t,r,i){var a=(void 0===e&&(e=Element.prototype.scroll||Element.prototype.scrollTo||function(t,e){this.scrollLeft=t,this.scrollTop=e}),e).bind(t);if(void 0!==r.left||void 0!==r.top){var c=t.scrollLeft,l=t.scrollTop,s=r.left,u=void 0===s?c:s,d=r.top,f=void 0===d?l:d;if("smooth"!==r.behavior)return a(u,f);var h=t.style.scrollBehavior;t.style.scrollBehavior="auto";var w=function(){window.removeEventListener("wheel",v),window.removeEventListener("touchmove",v),t.style.scrollBehavior=h},m={timeStamp:n(),duration:r.duration,startX:c,startY:l,targetX:u,targetY:f,rafId:0,method:a,timingFunc:r.timingFunc,callback:function(){w(),i&&i()}},v=function(){cancelAnimationFrame(m.rafId),w()};window.addEventListener("wheel",v,{passive:!0,once:!0}),window.addEventListener("touchmove",v,{passive:!0,once:!0}),o(m)}},a=function(t,e,r,n){var o=0===e&&r||1===e&&!r?t.inline:t.block;return"center"===o?1:"nearest"===o?0:"start"===o?0===e?n?5:4:2:"end"===o?0===e?n?4:5:3:r?0===e?0:2:0===e?4:0};function c(t,e,r,n,o,i,a,c){return i<t&&a>e||i>t&&a<e?0:i<=t&&c<=r||a>=e&&c>=r?i-t-n:a>e&&c<r||i<t&&c>r?a-e+o:0}var l=function(t){return"visible"!==t&&"clip"!==t},s=function(t){if(t.clientHeight<t.scrollHeight||t.clientWidth<t.scrollWidth){var e=getComputedStyle(t);return l(e.overflowY)||l(e.overflowX)}return!1},u=function(t){var e=t.parentNode;return e&&(e.nodeType===Node.DOCUMENT_FRAGMENT_NODE?e.host:e)};window.scrollRangeIntoView=function(e,r,n){for(var o,l,d=document.scrollingElement||document.documentElement,f=[],h=e.startContainer,w=u(h);null!==w;w=u(w)){if(w===d){f.push(w);break}w===document.body&&s(w)&&!s(document.documentElement)||s(w)&&f.push(w)}var m=window.visualViewport?window.visualViewport.width:innerWidth,v=window.visualViewport?window.visualViewport.height:innerHeight,p=window.scrollX||window.pageXOffset,g=window.scrollY||window.pageYOffset,b=e.getBoundingClientRect(),y=b.height,k=b.width,E=b.top,M=b.right,W=b.bottom,T=b.left,I=getComputedStyle(h instanceof HTMLElement?h:h.parentNode),L=I.writingMode||I.webkitWritingMode||I.getPropertyValue("-ms-writing-mode")||"horizontal-tb",X=["horizontal-tb","lr","lr-tb","rl"].some((function(t){return t===L})),Y=["vertical-rl","tb-rl"].some((function(t){return t===L})),H=a(r,0,X,Y),O=a(r,1,X,Y),S=function(){switch(O){case 2:case 0:return E;case 3:return W;default:return E+y/2}}(),x=function(){switch(H){case 1:return T+k/2;case 5:return M;default:return T}}(),C=[],B=function(e){var n=e.getBoundingClientRect(),o=n.height,a=n.width,l=n.top,s=n.right,u=n.bottom,f=n.left,h=getComputedStyle(e),w=parseInt(h.borderLeftWidth,10),b=parseInt(h.borderTopWidth,10),E=parseInt(h.borderRightWidth,10),M=parseInt(h.borderBottomWidth,10),W=0,T=0,I="offsetWidth"in e?e.offsetWidth-e.clientWidth-w-E:0,L="offsetHeight"in e?e.offsetHeight-e.clientHeight-b-M:0;if(d===e){switch(O){case 2:W=S;break;case 3:W=S-v;break;case 1:W=S-v/2;break;case 0:W=c(g,g+v,v,b,M,g+S,g+S+y,y)}switch(H){case 4:T=x;break;case 5:T=x-m;break;case 1:T=x-m/2;break;case 0:T=c(p,p+m,m,w,E,p+x,p+x+k,k)}W=Math.max(0,W+g),T=Math.max(0,T+p)}else{switch(O){case 2:W=S-l-b;break;case 3:W=S-u+M+L;break;case 1:W=S-(l+o/2)+L/2;break;case 0:W=c(l,u,o,b,M+L,S,S+y,y)}switch(H){case 4:T=x-f-w;break;case 5:T=x-s+E+I;break;case 1:T=x-(f+a/2)+I/2;break;case 0:T=c(f,s,a,w,E+I,x,x+k,k)}var X=e.scrollLeft,Y=e.scrollTop;W=Math.max(0,Math.min(Y+W,e.scrollHeight-o+L)),T=Math.max(0,Math.min(X+T,e.scrollWidth-a+I)),S+=Y-W,x+=X-T}C.push((function(n){return i(e,t(t({},r),{top:W,left:T}),n)}))};try{for(var F=function(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}(f),N=F.next();!N.done;N=F.next()){B(N.value)}}catch(t){o={error:t}}finally{try{N&&!N.done&&(l=F.return)&&l.call(F)}finally{if(o)throw o.error}}let V=C.length;C.forEach((function(t){return t((function(){0==--V&&n()}))}))}}();