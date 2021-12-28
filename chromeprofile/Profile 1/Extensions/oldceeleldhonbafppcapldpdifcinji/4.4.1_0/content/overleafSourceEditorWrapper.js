/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class OverleafSourceEditorWrapper extends CEElementWrapper{constructor(e,t,s=Number.MAX_SAFE_INTEGER){super(e,t,s)}_updateText(){const e=this._inputArea.querySelector(OverleafSourceEditorWrapper.TEXT_LAYER_SELECTOR);if(!e){const e=""!==this._text;return this._textChunks=[],this._text="",this._textOffset=0,e}const t=[];let s=0,n=0,r=null,l=!0,i=!1;const o=DOMWalker.create(e);let c=!1;do{const e=o.currentNode;null===r&&(r=this._ceElementInspector.getParagraphLastValuableNode(e)),c=!1;let a=!1,E="";if(isElementNode(e))e===r&&(r=null,this._ceElementInspector.isTextEndsWithLineBreak(e)&&(l=!0,i=!1,E+="\n\n")),this._ceElementInspector.isBlock(e)?(r=null,l=!0,i=!1,!E&&this._ceElementInspector.isBlockElementRelevant(e)&&(E="\n\n")):this._ceElementInspector.isBr(e)&&(r=null,l=!0,i=!1,!E&&this._ceElementInspector.isBRElementRelevant(e)&&(E="\n"));else if(isTextNode(e)&&(a=!0,E=this._ceElementInspector.getParsedText(e),E)){const t=null===r||r===e;this._ceElementInspector.getParsingOptions(e).preserveWhitespaces||((l||i)&&(E=E.replace(CEElementWrapper.LEADING_WHITESPACES_REGEXP,"")),t&&(E=E.replace(CEElementWrapper.TRAILING_WHITESPACES_REGEXP,""))),l=l&&""===E,i=E.endsWith(" "),r===e&&(r=null,this._ceElementInspector.isTextEndsWithLineBreak(e)&&(l=!0,i=!1,E+="\n\n"))}if(t.push({node:e,isTextNode:a,rawText:a?e.nodeValue:"",rawTextOffset:s,parsedText:E,parsedTextOffset:n}),a&&(s+=e.nodeValue.length),n+=E.length,n>this._textLengthThreshold)break}while(o.next(c));const a=OverleafSourceEditor.getEditorText(this._inputArea,t),E=this._text!==a.fullText;return this._textChunks=a.textChunks,this._text=a.fullText,this._textOffset=a.offset,E}getTextRanges(e,t){return super.getTextRanges(e-this._textOffset,t)}replaceText(e,t,s){return super.replaceText(e-this._textOffset,t,s)}getSelection(){const e=super.getSelection();return e&&(e.start+=this._textOffset,e.end+=this._textOffset),e}setSelection(e){const t=e.start-this._textOffset,s=void 0===e.end?e.end:e.end-this._textOffset;super.setSelection({start:t,end:s})}scrollToText(e,t,s=300,n="nearest",r){super.scrollToText(e-this._textOffset,t,s,n,r)}}OverleafSourceEditorWrapper.TEXT_LAYER_SELECTOR="div.ace_layer.ace_text-layer";