/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var _a;class Notion{static _isEditorPart(t){return t.matches(this.BLOCK_ELEMENT_SELECTOR)&&!this._isInCommentDialog(t)}static _isInCommentDialog(t){return!!closestElement(t,this.COMMENT_DIALOG_SELECTOR)}static _isEditableElement(t){return!(t.matches(this.UNEDITABLE_ELEMENT_SELECTOR)&&!t.querySelector(this.EDITABLE_ELEMENT_SELECTOR))}static _isInEditableElement(t){let e=t;do{if(e.matches(this.EDITABLE_ELEMENT_SELECTOR))return!0;if(e.matches(this.UNEDITABLE_ELEMENT_SELECTOR))return!1;e=e.parentElement}while(e);return!1}static _getScrollElement(t){if(!this._scrollElements.has(t)){const e=t.querySelector(this.SCROLLER_SELECTOR);this._scrollElements.set(t,e||t)}return this._scrollElements.get(t)}static _turnOnSpellcheck(t){if(!this._turnOffedElements.has(t))return;const e=this._turnOffedElements.get(t);for(const t of e)t.setAttribute("spellcheck","true")}static _turnOffSpellcheck(t){this._turnOffedElements.has(t)||this._turnOffedElements.set(t,new Set);const e=this._turnOffedElements.get(t),n=Array.from(t.querySelectorAll(this.SPELLCHECKED_ELEMENT_SELECTOR));for(const t of n)this._isInCommentDialog(t)||(t.setAttribute("spellcheck","false"),e.add(t))}static _onInputAreaMutation(t,e){if(e.some((e=>e.target===t&&e.addedNodes.length>0))){const e=this._destroyCallbacks.get(t);e&&e(t)}else this._turnOffSpellcheck(t)}static isEditor(t){return t.matches(this.MAIN_ELEMENT_SELECTOR)}static getEditor(t){return this._isEditorPart(t)?closestElement(t,this.MAIN_ELEMENT_SELECTOR):null}static initInputArea(t){this._turnOffSpellcheck(t);const e=new MutationObserver((e=>this._onInputAreaMutation(t,e)));this._mutationObservers.set(t,e),e.observe(t,Notion.INPUT_AREA_MUTATION_OBSERVER_OPTIONS)}static destroyInputArea(t){this._scrollElements.delete(t),this._turnOnSpellcheck(t),this._turnOffedElements.delete(t);const e=this._mutationObservers.get(t);e&&(e.disconnect(),this._mutationObservers.delete(t)),this._destroyCallbacks.delete(t)}static onInputAreaDestroy(t,e){this._destroyCallbacks.set(t,e)}static createMutationObserver(t){return new FilteringMutationObserver(t,this._isMutationIgnored)}static isElementIgnored(t,e){const n=t.tagName.toUpperCase();return!!CEElementInspector.SKIPPING_TAGS.includes(n)||("none"===e.display||("BLOCKQUOTE"===n||(!!t.matches(this.COMMENT_DIALOG_SELECTOR)||(!this._isEditableElement(t)||!("SUP"!==n||!t.textContent)&&CEElementInspector.SUP_REGEXP.test(t.textContent.trim())))))}static getHighlighterTargetElement(t){return this._getScrollElement(t)}static addHighlighterScrollEventListener(t,e){this._getScrollElement(t).addEventListener("scroll",e)}static removeHighlighterScrollEventListener(t,e){this._getScrollElement(t).removeEventListener("scroll",e)}static getHighlighterVisibleBox(t,e){const n=this._getScrollElement(t);return e.getPaddingBox(n,!0,!1)}static getHighlighterScrollableElementSize(t,e){const n=this._getScrollElement(t);return e.getScrollDimensions(n,!1)}static getHighlighterScrollPosition(t,e,n,i){const o=this._getScrollElement(t);return e.getScrollPosition(o,n,i)}static getToolbarParent(t){return this._getScrollElement(t)}static getToolbarPosition(t,e,n,i,o){const s=t.querySelector(this.PAGE_LAST_BLOCK_SELECTOR)||t.querySelector(this.PAGE_HEADER_SELECTOR);if(!s)return null;const r=t.ownerDocument.documentElement.clientHeight,E=n.getBorderBox(s,!1),l=n.getScaleFactor(e),c=n.getZoom(e),a=l.x*c,_=l.y*c;let h=i?E.left/a+6:E.right/a-6-o.width;if(E.bottom>r)return{fixed:!0,left:Math.round(h)+"px"};let d=E.bottom/_-6-o.height;const O=document.querySelector(this.TOPBAR_SELECTOR);if(O){d-=n.getBorderBox(O).height}d+=this._getScrollElement(t).scrollTop;const L=document.querySelector(this.SIDEBAR_SELECTOR);if(L){h-=n.getBorderBox(L).width}return{fixed:!1,left:Math.round(h)+"px",top:Math.round(d)+"px"}}}_a=Notion,Notion.MAIN_ELEMENT_SELECTOR="div.notion-frame",Notion.BLOCK_ELEMENT_SELECTOR="div.notranslate[contenteditable='true'][spellcheck='true']",Notion.SCROLLER_SELECTOR="div.notion-scroller",Notion.COMMENT_DIALOG_SELECTOR="div.notion-margin-discussion-item",Notion.SPELLCHECKED_ELEMENT_SELECTOR="[spellcheck='true']",Notion.EDITABLE_ELEMENT_SELECTOR="[contenteditable='true']",Notion.UNEDITABLE_ELEMENT_SELECTOR="[contenteditable='false']",Notion.PAGE_CONTROLS_SELECTOR="div.notion-frame div.notion-page-controls",Notion.SELECTION_HALO_SELECTOR="div.notion-selectable-halo",Notion.ICON_SELECTOR="div.notion-record-icon",Notion.PAGE_HEADER_SELECTOR="div.notion-scroller div.notion-page-block div[contenteditable='true']",Notion.PAGE_LAST_BLOCK_SELECTOR="div.notion-page-content > div.notion-selectable:not(.notion-divider-block):last-child",Notion.TOPBAR_SELECTOR="div.notion-app-inner div.notion-topbar",Notion.SIDEBAR_SELECTOR="div.notion-cursor-listener > div.notion-sidebar-container:first-child",Notion.INPUT_AREA_MUTATION_OBSERVER_OPTIONS={attributes:!1,characterData:!1,childList:!0,subtree:!0},Notion._scrollElements=new Map,Notion._turnOffedElements=new Map,Notion._mutationObservers=new Map,Notion._destroyCallbacks=new Map,Notion._isMutationIgnored=t=>{const e=isElementNode(t.target)?t.target:t.target.parentElement;return!!e&&(!closestElement(e,_a.SCROLLER_SELECTOR)||(!!closestElement(e,_a.COMMENT_DIALOG_SELECTOR)||(!!closestElement(e,_a.PAGE_CONTROLS_SELECTOR)||(!_a._isInEditableElement(e)||(!("attributes"!==t.type||!e.matches(_a.SELECTION_HALO_SELECTOR))||(!("attributes"!==t.type||!e.matches(_a.ICON_SELECTOR))||"attributes"===t.type&&"placeholder"===t.attributeName))))))},window.__ltThunderbirdHack=1;