(self.webpackChunkangular_newtab=self.webpackChunkangular_newtab||[]).push([[648],{13452:function(t,e,s){"use strict";s.d(e,{ev:function(){return ut},Dz:function(){return lt},w1:function(){return ht},ge:function(){return dt},fO:function(){return ct},XQ:function(){return mt},as:function(){return ft},Gk:function(){return pt},nj:function(){return _t},BZ:function(){return at},by:function(){return gt},p0:function(){return yt}});var o=s(33262),i=s(43897),r=s(42304),n=s(27851),a=s(8987),l=s(99569),c=s(55109),h=s(19033),d=s(75666),u=s(15844),f=s(2070),_=s(13141),m=s(92422),p=s(90819);const y=[[["caption"]],[["colgroup"],["col"]]],w=["caption","colgroup, col"];function g(t){return class extends t{constructor(...t){super(...t),this._sticky=!1,this._hasStickyChanged=!1}get sticky(){return this._sticky}set sticky(t){const e=this._sticky;this._sticky=(0,o.Ig)(t),this._hasStickyChanged=e!==this._sticky}hasStickyChanged(){const t=this._hasStickyChanged;return this._hasStickyChanged=!1,t}resetStickyChanged(){this._hasStickyChanged=!1}}}const R=new r.OlP("CDK_TABLE");let C=(()=>{class t{constructor(t){this.template=t}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkCellDef",""]]}),t})(),S=(()=>{class t{constructor(t){this.template=t}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkHeaderCellDef",""]]}),t})(),k=(()=>{class t{constructor(t){this.template=t}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkFooterCellDef",""]]}),t})();class D{}const b=g(D);let x=(()=>{class t extends b{constructor(t){super(),this._table=t,this._stickyEnd=!1}get name(){return this._name}set name(t){this._setNameInput(t)}get stickyEnd(){return this._stickyEnd}set stickyEnd(t){const e=this._stickyEnd;this._stickyEnd=(0,o.Ig)(t),this._hasStickyChanged=e!==this._stickyEnd}_updateColumnCssClassName(){this._columnCssClassName=[`cdk-column-${this.cssClassFriendlyName}`]}_setNameInput(t){t&&(this._name=t,this.cssClassFriendlyName=t.replace(/[^a-z0-9_-]/gi,"-"),this._updateColumnCssClassName())}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(R,8))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkColumnDef",""]],contentQueries:function(t,e,s){if(1&t&&(r.Suo(s,C,5),r.Suo(s,S,5),r.Suo(s,k,5)),2&t){let t;r.iGM(t=r.CRH())&&(e.cell=t.first),r.iGM(t=r.CRH())&&(e.headerCell=t.first),r.iGM(t=r.CRH())&&(e.footerCell=t.first)}},inputs:{sticky:"sticky",name:["cdkColumnDef","name"],stickyEnd:"stickyEnd"},features:[r._Bn([{provide:"MAT_SORT_HEADER_COLUMN_DEF",useExisting:t}]),r.qOj]}),t})();class v{constructor(t,e){const s=e.nativeElement.classList;for(const o of t._columnCssClassName)s.add(o)}}let O=(()=>{class t extends v{constructor(t,e){super(t,e)}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(x),r.Y36(r.SBq))},t.\u0275dir=r.lG2({type:t,selectors:[["cdk-header-cell"],["th","cdk-header-cell",""]],hostAttrs:["role","columnheader",1,"cdk-header-cell"],features:[r.qOj]}),t})(),E=(()=>{class t extends v{constructor(t,e){super(t,e)}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(x),r.Y36(r.SBq))},t.\u0275dir=r.lG2({type:t,selectors:[["cdk-cell"],["td","cdk-cell",""]],hostAttrs:["role","gridcell",1,"cdk-cell"],features:[r.qOj]}),t})();class N{constructor(){this.tasks=[],this.endTasks=[]}}const G=new r.OlP("_COALESCED_STYLE_SCHEDULER");let T=(()=>{class t{constructor(t){this._ngZone=t,this._currentSchedule=null,this._destroyed=new h.xQ}schedule(t){this._createScheduleIfNeeded(),this._currentSchedule.tasks.push(t)}scheduleEnd(t){this._createScheduleIfNeeded(),this._currentSchedule.endTasks.push(t)}ngOnDestroy(){this._destroyed.next(),this._destroyed.complete()}_createScheduleIfNeeded(){this._currentSchedule||(this._currentSchedule=new N,this._getScheduleObservable().pipe((0,m.R)(this._destroyed)).subscribe(()=>{for(;this._currentSchedule.tasks.length||this._currentSchedule.endTasks.length;){const t=this._currentSchedule;this._currentSchedule=new N;for(const e of t.tasks)e();for(const e of t.endTasks)e()}this._currentSchedule=null}))}_getScheduleObservable(){return this._ngZone.isStable?(0,d.D)(Promise.resolve(void 0)):this._ngZone.onStable.pipe((0,p.q)(1))}}return t.\u0275fac=function(e){return new(e||t)(r.LFG(r.R0b))},t.\u0275prov=r.Yz7({token:t,factory:t.\u0275fac}),t})(),F=(()=>{class t{constructor(t,e){this.template=t,this._differs=e}ngOnChanges(t){if(!this._columnsDiffer){const e=t.columns&&t.columns.currentValue||[];this._columnsDiffer=this._differs.find(e).create(),this._columnsDiffer.diff(e)}}getColumnsDiff(){return this._columnsDiffer.diff(this.columns)}extractCellTemplate(t){return this instanceof A?t.headerCell.template:this instanceof Y?t.footerCell.template:t.cell.template}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc),r.Y36(r.ZZ4))},t.\u0275dir=r.lG2({type:t,features:[r.TTD]}),t})();class H extends F{}const B=g(H);let A=(()=>{class t extends B{constructor(t,e,s){super(t,e),this._table=s}ngOnChanges(t){super.ngOnChanges(t)}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc),r.Y36(r.ZZ4),r.Y36(R,8))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkHeaderRowDef",""]],inputs:{columns:["cdkHeaderRowDef","columns"],sticky:["cdkHeaderRowDefSticky","sticky"]},features:[r.qOj,r.TTD]}),t})();class I extends F{}const L=g(I);let Y=(()=>{class t extends L{constructor(t,e,s){super(t,e),this._table=s}ngOnChanges(t){super.ngOnChanges(t)}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc),r.Y36(r.ZZ4),r.Y36(R,8))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkFooterRowDef",""]],inputs:{columns:["cdkFooterRowDef","columns"],sticky:["cdkFooterRowDefSticky","sticky"]},features:[r.qOj,r.TTD]}),t})(),M=(()=>{class t extends F{constructor(t,e,s){super(t,e),this._table=s}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc),r.Y36(r.ZZ4),r.Y36(R,8))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkRowDef",""]],inputs:{columns:["cdkRowDefColumns","columns"],when:["cdkRowDefWhen","when"]},features:[r.qOj]}),t})(),P=(()=>{class t{constructor(e){this._viewContainer=e,t.mostRecentCellOutlet=this}ngOnDestroy(){t.mostRecentCellOutlet===this&&(t.mostRecentCellOutlet=null)}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.s_b))},t.\u0275dir=r.lG2({type:t,selectors:[["","cdkCellOutlet",""]]}),t.mostRecentCellOutlet=null,t})(),z=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=r.Xpm({type:t,selectors:[["cdk-header-row"],["tr","cdk-header-row",""]],hostAttrs:["role","row",1,"cdk-header-row"],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(t,e){1&t&&r.GkF(0,0)},directives:[P],encapsulation:2}),t})(),q=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=r.Xpm({type:t,selectors:[["cdk-row"],["tr","cdk-row",""]],hostAttrs:["role","row",1,"cdk-row"],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(t,e){1&t&&r.GkF(0,0)},directives:[P],encapsulation:2}),t})(),j=(()=>{class t{constructor(t){this.templateRef=t}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.Rgc))},t.\u0275dir=r.lG2({type:t,selectors:[["ng-template","cdkNoDataRow",""]]}),t})();const Z=["top","bottom","left","right"];class W{constructor(t,e,s,o,i=!0,r=!0,n){this._isNativeHtmlTable=t,this._stickCellCss=e,this.direction=s,this._coalescedStyleScheduler=o,this._isBrowser=i,this._needsPositionStickyOnElement=r,this._positionListener=n,this._cachedCellWidths=[],this._borderCellCss={top:`${e}-border-elem-top`,bottom:`${e}-border-elem-bottom`,left:`${e}-border-elem-left`,right:`${e}-border-elem-right`}}clearStickyPositioning(t,e){const s=[];for(const o of t)if(o.nodeType===o.ELEMENT_NODE){s.push(o);for(let t=0;t<o.children.length;t++)s.push(o.children[t])}this._coalescedStyleScheduler.schedule(()=>{for(const t of s)this._removeStickyStyle(t,e)})}updateStickyColumns(t,e,s,o=!0){if(!t.length||!this._isBrowser||!e.some(t=>t)&&!s.some(t=>t))return void(this._positionListener&&(this._positionListener.stickyColumnsUpdated({sizes:[]}),this._positionListener.stickyEndColumnsUpdated({sizes:[]})));const i=t[0],r=i.children.length,n=this._getCellWidths(i,o),a=this._getStickyStartColumnPositions(n,e),l=this._getStickyEndColumnPositions(n,s),c=e.lastIndexOf(!0),h=s.indexOf(!0);this._coalescedStyleScheduler.schedule(()=>{const o="rtl"===this.direction,i=o?"right":"left",d=o?"left":"right";for(const n of t)for(let t=0;t<r;t++){const o=n.children[t];e[t]&&this._addStickyStyle(o,i,a[t],t===c),s[t]&&this._addStickyStyle(o,d,l[t],t===h)}this._positionListener&&(this._positionListener.stickyColumnsUpdated({sizes:-1===c?[]:n.slice(0,c+1).map((t,s)=>e[s]?t:null)}),this._positionListener.stickyEndColumnsUpdated({sizes:-1===h?[]:n.slice(h).map((t,e)=>s[e+h]?t:null).reverse()}))})}stickRows(t,e,s){if(!this._isBrowser)return;const o="bottom"===s?t.slice().reverse():t,i="bottom"===s?e.slice().reverse():e,r=[],n=[],a=[];for(let c=0,h=0;c<o.length;c++){if(!i[c])continue;r[c]=h;const t=o[c];a[c]=this._isNativeHtmlTable?Array.from(t.children):[t];const e=t.getBoundingClientRect().height;h+=e,n[c]=e}const l=i.lastIndexOf(!0);this._coalescedStyleScheduler.schedule(()=>{var t,e;for(let n=0;n<o.length;n++){if(!i[n])continue;const t=r[n],e=n===l;for(const o of a[n])this._addStickyStyle(o,s,t,e)}"top"===s?null===(t=this._positionListener)||void 0===t||t.stickyHeaderRowsUpdated({sizes:n,offsets:r,elements:a}):null===(e=this._positionListener)||void 0===e||e.stickyFooterRowsUpdated({sizes:n,offsets:r,elements:a})})}updateStickyFooterContainer(t,e){if(!this._isNativeHtmlTable)return;const s=t.querySelector("tfoot");this._coalescedStyleScheduler.schedule(()=>{e.some(t=>!t)?this._removeStickyStyle(s,["bottom"]):this._addStickyStyle(s,"bottom",0,!1)})}_removeStickyStyle(t,e){for(const s of e)t.style[s]="",t.classList.remove(this._borderCellCss[s]);Z.some(s=>-1===e.indexOf(s)&&t.style[s])?t.style.zIndex=this._getCalculatedZIndex(t):(t.style.zIndex="",this._needsPositionStickyOnElement&&(t.style.position=""),t.classList.remove(this._stickCellCss))}_addStickyStyle(t,e,s,o){t.classList.add(this._stickCellCss),o&&t.classList.add(this._borderCellCss[e]),t.style[e]=`${s}px`,t.style.zIndex=this._getCalculatedZIndex(t),this._needsPositionStickyOnElement&&(t.style.cssText+="position: -webkit-sticky; position: sticky; ")}_getCalculatedZIndex(t){const e={top:100,bottom:10,left:1,right:1};let s=0;for(const o of Z)t.style[o]&&(s+=e[o]);return s?`${s}`:""}_getCellWidths(t,e=!0){if(!e&&this._cachedCellWidths.length)return this._cachedCellWidths;const s=[],o=t.children;for(let i=0;i<o.length;i++)s.push(o[i].getBoundingClientRect().width);return this._cachedCellWidths=s,s}_getStickyStartColumnPositions(t,e){const s=[];let o=0;for(let i=0;i<t.length;i++)e[i]&&(s[i]=o,o+=t[i]);return s}_getStickyEndColumnPositions(t,e){const s=[];let o=0;for(let i=t.length;i>0;i--)e[i]&&(s[i]=o,o+=t[i]);return s}}const U=new r.OlP("CDK_SPL");let V=(()=>{class t{constructor(t,e){this.viewContainer=t,this.elementRef=e}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.s_b),r.Y36(r.SBq))},t.\u0275dir=r.lG2({type:t,selectors:[["","rowOutlet",""]]}),t})(),$=(()=>{class t{constructor(t,e){this.viewContainer=t,this.elementRef=e}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.s_b),r.Y36(r.SBq))},t.\u0275dir=r.lG2({type:t,selectors:[["","headerRowOutlet",""]]}),t})(),X=(()=>{class t{constructor(t,e){this.viewContainer=t,this.elementRef=e}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.s_b),r.Y36(r.SBq))},t.\u0275dir=r.lG2({type:t,selectors:[["","footerRowOutlet",""]]}),t})(),J=(()=>{class t{constructor(t,e){this.viewContainer=t,this.elementRef=e}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.s_b),r.Y36(r.SBq))},t.\u0275dir=r.lG2({type:t,selectors:[["","noDataRowOutlet",""]]}),t})(),Q=(()=>{class t{constructor(t,e,s,o,i,r,n,a,l,c,d){this._differs=t,this._changeDetectorRef=e,this._elementRef=s,this._dir=i,this._platform=n,this._viewRepeater=a,this._coalescedStyleScheduler=l,this._viewportRuler=c,this._stickyPositioningListener=d,this._onDestroy=new h.xQ,this._columnDefsByName=new Map,this._customColumnDefs=new Set,this._customRowDefs=new Set,this._customHeaderRowDefs=new Set,this._customFooterRowDefs=new Set,this._headerRowDefChanged=!0,this._footerRowDefChanged=!0,this._stickyColumnStylesNeedReset=!0,this._forceRecalculateCellWidths=!0,this._cachedRenderRowsMap=new Map,this.stickyCssClass="cdk-table-sticky",this.needsPositionStickyOnElement=!0,this._isShowingNoDataRow=!1,this._multiTemplateDataRows=!1,this._fixedLayout=!1,this.viewChange=new u.X({start:0,end:Number.MAX_VALUE}),o||this._elementRef.nativeElement.setAttribute("role","grid"),this._document=r,this._isNativeHtmlTable="TABLE"===this._elementRef.nativeElement.nodeName}get trackBy(){return this._trackByFn}set trackBy(t){this._trackByFn=t}get dataSource(){return this._dataSource}set dataSource(t){this._dataSource!==t&&this._switchDataSource(t)}get multiTemplateDataRows(){return this._multiTemplateDataRows}set multiTemplateDataRows(t){this._multiTemplateDataRows=(0,o.Ig)(t),this._rowOutlet&&this._rowOutlet.viewContainer.length&&(this._forceRenderDataRows(),this.updateStickyColumnStyles())}get fixedLayout(){return this._fixedLayout}set fixedLayout(t){this._fixedLayout=(0,o.Ig)(t),this._forceRecalculateCellWidths=!0,this._stickyColumnStylesNeedReset=!0}ngOnInit(){this._setupStickyStyler(),this._isNativeHtmlTable&&this._applyNativeTableSections(),this._dataDiffer=this._differs.find([]).create((t,e)=>this.trackBy?this.trackBy(e.dataIndex,e.data):e),this._viewportRuler.change().pipe((0,m.R)(this._onDestroy)).subscribe(()=>{this._forceRecalculateCellWidths=!0})}ngAfterContentChecked(){this._cacheRowDefs(),this._cacheColumnDefs();const t=this._renderUpdatedColumns()||this._headerRowDefChanged||this._footerRowDefChanged;this._stickyColumnStylesNeedReset=this._stickyColumnStylesNeedReset||t,this._forceRecalculateCellWidths=t,this._headerRowDefChanged&&(this._forceRenderHeaderRows(),this._headerRowDefChanged=!1),this._footerRowDefChanged&&(this._forceRenderFooterRows(),this._footerRowDefChanged=!1),this.dataSource&&this._rowDefs.length>0&&!this._renderChangeSubscription?this._observeRenderChanges():this._stickyColumnStylesNeedReset&&this.updateStickyColumnStyles(),this._checkStickyStates()}ngOnDestroy(){this._rowOutlet.viewContainer.clear(),this._noDataRowOutlet.viewContainer.clear(),this._headerRowOutlet.viewContainer.clear(),this._footerRowOutlet.viewContainer.clear(),this._cachedRenderRowsMap.clear(),this._onDestroy.next(),this._onDestroy.complete(),(0,i.Z9)(this.dataSource)&&this.dataSource.disconnect(this)}renderRows(){this._renderRows=this._getAllRenderRows();const t=this._dataDiffer.diff(this._renderRows);if(!t)return void this._updateNoDataRow();const e=this._rowOutlet.viewContainer;this._viewRepeater.applyChanges(t,e,(t,e,s)=>this._getEmbeddedViewArgs(t.item,s),t=>t.item.data,t=>{1===t.operation&&t.context&&this._renderCellTemplateForItem(t.record.item.rowDef,t.context)}),this._updateRowIndexContext(),t.forEachIdentityChange(t=>{e.get(t.currentIndex).context.$implicit=t.item.data}),this._updateNoDataRow(),this.updateStickyColumnStyles()}addColumnDef(t){this._customColumnDefs.add(t)}removeColumnDef(t){this._customColumnDefs.delete(t)}addRowDef(t){this._customRowDefs.add(t)}removeRowDef(t){this._customRowDefs.delete(t)}addHeaderRowDef(t){this._customHeaderRowDefs.add(t),this._headerRowDefChanged=!0}removeHeaderRowDef(t){this._customHeaderRowDefs.delete(t),this._headerRowDefChanged=!0}addFooterRowDef(t){this._customFooterRowDefs.add(t),this._footerRowDefChanged=!0}removeFooterRowDef(t){this._customFooterRowDefs.delete(t),this._footerRowDefChanged=!0}setNoDataRow(t){this._customNoDataRow=t}updateStickyHeaderRowStyles(){const t=this._getRenderedRows(this._headerRowOutlet),e=this._elementRef.nativeElement.querySelector("thead");e&&(e.style.display=t.length?"":"none");const s=this._headerRowDefs.map(t=>t.sticky);this._stickyStyler.clearStickyPositioning(t,["top"]),this._stickyStyler.stickRows(t,s,"top"),this._headerRowDefs.forEach(t=>t.resetStickyChanged())}updateStickyFooterRowStyles(){const t=this._getRenderedRows(this._footerRowOutlet),e=this._elementRef.nativeElement.querySelector("tfoot");e&&(e.style.display=t.length?"":"none");const s=this._footerRowDefs.map(t=>t.sticky);this._stickyStyler.clearStickyPositioning(t,["bottom"]),this._stickyStyler.stickRows(t,s,"bottom"),this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement,s),this._footerRowDefs.forEach(t=>t.resetStickyChanged())}updateStickyColumnStyles(){const t=this._getRenderedRows(this._headerRowOutlet),e=this._getRenderedRows(this._rowOutlet),s=this._getRenderedRows(this._footerRowOutlet);(this._isNativeHtmlTable&&!this._fixedLayout||this._stickyColumnStylesNeedReset)&&(this._stickyStyler.clearStickyPositioning([...t,...e,...s],["left","right"]),this._stickyColumnStylesNeedReset=!1),t.forEach((t,e)=>{this._addStickyColumnStyles([t],this._headerRowDefs[e])}),this._rowDefs.forEach(t=>{const s=[];for(let o=0;o<e.length;o++)this._renderRows[o].rowDef===t&&s.push(e[o]);this._addStickyColumnStyles(s,t)}),s.forEach((t,e)=>{this._addStickyColumnStyles([t],this._footerRowDefs[e])}),Array.from(this._columnDefsByName.values()).forEach(t=>t.resetStickyChanged())}_getAllRenderRows(){const t=[],e=this._cachedRenderRowsMap;this._cachedRenderRowsMap=new Map;for(let s=0;s<this._data.length;s++){let o=this._data[s];const i=this._getRenderRowsForData(o,s,e.get(o));this._cachedRenderRowsMap.has(o)||this._cachedRenderRowsMap.set(o,new WeakMap);for(let e=0;e<i.length;e++){let s=i[e];const o=this._cachedRenderRowsMap.get(s.data);o.has(s.rowDef)?o.get(s.rowDef).push(s):o.set(s.rowDef,[s]),t.push(s)}}return t}_getRenderRowsForData(t,e,s){return this._getRowDefs(t,e).map(o=>{const i=s&&s.has(o)?s.get(o):[];if(i.length){const t=i.shift();return t.dataIndex=e,t}return{data:t,rowDef:o,dataIndex:e}})}_cacheColumnDefs(){this._columnDefsByName.clear(),K(this._getOwnDefs(this._contentColumnDefs),this._customColumnDefs).forEach(t=>{this._columnDefsByName.has(t.name),this._columnDefsByName.set(t.name,t)})}_cacheRowDefs(){this._headerRowDefs=K(this._getOwnDefs(this._contentHeaderRowDefs),this._customHeaderRowDefs),this._footerRowDefs=K(this._getOwnDefs(this._contentFooterRowDefs),this._customFooterRowDefs),this._rowDefs=K(this._getOwnDefs(this._contentRowDefs),this._customRowDefs);const t=this._rowDefs.filter(t=>!t.when);this._defaultRowDef=t[0]}_renderUpdatedColumns(){const t=(t,e)=>t||!!e.getColumnsDiff(),e=this._rowDefs.reduce(t,!1);e&&this._forceRenderDataRows();const s=this._headerRowDefs.reduce(t,!1);s&&this._forceRenderHeaderRows();const o=this._footerRowDefs.reduce(t,!1);return o&&this._forceRenderFooterRows(),e||s||o}_switchDataSource(t){this._data=[],(0,i.Z9)(this.dataSource)&&this.dataSource.disconnect(this),this._renderChangeSubscription&&(this._renderChangeSubscription.unsubscribe(),this._renderChangeSubscription=null),t||(this._dataDiffer&&this._dataDiffer.diff([]),this._rowOutlet.viewContainer.clear()),this._dataSource=t}_observeRenderChanges(){if(!this.dataSource)return;let t;(0,i.Z9)(this.dataSource)?t=this.dataSource.connect(this):(0,f.b)(this.dataSource)?t=this.dataSource:Array.isArray(this.dataSource)&&(t=(0,_.of)(this.dataSource)),this._renderChangeSubscription=t.pipe((0,m.R)(this._onDestroy)).subscribe(t=>{this._data=t||[],this.renderRows()})}_forceRenderHeaderRows(){this._headerRowOutlet.viewContainer.length>0&&this._headerRowOutlet.viewContainer.clear(),this._headerRowDefs.forEach((t,e)=>this._renderRow(this._headerRowOutlet,t,e)),this.updateStickyHeaderRowStyles()}_forceRenderFooterRows(){this._footerRowOutlet.viewContainer.length>0&&this._footerRowOutlet.viewContainer.clear(),this._footerRowDefs.forEach((t,e)=>this._renderRow(this._footerRowOutlet,t,e)),this.updateStickyFooterRowStyles()}_addStickyColumnStyles(t,e){const s=Array.from(e.columns||[]).map(t=>this._columnDefsByName.get(t)),o=s.map(t=>t.sticky),i=s.map(t=>t.stickyEnd);this._stickyStyler.updateStickyColumns(t,o,i,!this._fixedLayout||this._forceRecalculateCellWidths)}_getRenderedRows(t){const e=[];for(let s=0;s<t.viewContainer.length;s++){const o=t.viewContainer.get(s);e.push(o.rootNodes[0])}return e}_getRowDefs(t,e){if(1==this._rowDefs.length)return[this._rowDefs[0]];let s=[];if(this.multiTemplateDataRows)s=this._rowDefs.filter(s=>!s.when||s.when(e,t));else{let o=this._rowDefs.find(s=>s.when&&s.when(e,t))||this._defaultRowDef;o&&s.push(o)}return s}_getEmbeddedViewArgs(t,e){return{templateRef:t.rowDef.template,context:{$implicit:t.data},index:e}}_renderRow(t,e,s,o={}){const i=t.viewContainer.createEmbeddedView(e.template,o,s);return this._renderCellTemplateForItem(e,o),i}_renderCellTemplateForItem(t,e){for(let s of this._getCellTemplates(t))P.mostRecentCellOutlet&&P.mostRecentCellOutlet._viewContainer.createEmbeddedView(s,e);this._changeDetectorRef.markForCheck()}_updateRowIndexContext(){const t=this._rowOutlet.viewContainer;for(let e=0,s=t.length;e<s;e++){const o=t.get(e).context;o.count=s,o.first=0===e,o.last=e===s-1,o.even=e%2==0,o.odd=!o.even,this.multiTemplateDataRows?(o.dataIndex=this._renderRows[e].dataIndex,o.renderIndex=e):o.index=this._renderRows[e].dataIndex}}_getCellTemplates(t){return t&&t.columns?Array.from(t.columns,e=>{const s=this._columnDefsByName.get(e);return t.extractCellTemplate(s)}):[]}_applyNativeTableSections(){const t=this._document.createDocumentFragment(),e=[{tag:"thead",outlets:[this._headerRowOutlet]},{tag:"tbody",outlets:[this._rowOutlet,this._noDataRowOutlet]},{tag:"tfoot",outlets:[this._footerRowOutlet]}];for(const s of e){const e=this._document.createElement(s.tag);e.setAttribute("role","rowgroup");for(const t of s.outlets)e.appendChild(t.elementRef.nativeElement);t.appendChild(e)}this._elementRef.nativeElement.appendChild(t)}_forceRenderDataRows(){this._dataDiffer.diff([]),this._rowOutlet.viewContainer.clear(),this.renderRows()}_checkStickyStates(){const t=(t,e)=>t||e.hasStickyChanged();this._headerRowDefs.reduce(t,!1)&&this.updateStickyHeaderRowStyles(),this._footerRowDefs.reduce(t,!1)&&this.updateStickyFooterRowStyles(),Array.from(this._columnDefsByName.values()).reduce(t,!1)&&(this._stickyColumnStylesNeedReset=!0,this.updateStickyColumnStyles())}_setupStickyStyler(){this._stickyStyler=new W(this._isNativeHtmlTable,this.stickyCssClass,this._dir?this._dir.value:"ltr",this._coalescedStyleScheduler,this._platform.isBrowser,this.needsPositionStickyOnElement,this._stickyPositioningListener),(this._dir?this._dir.change:(0,_.of)()).pipe((0,m.R)(this._onDestroy)).subscribe(t=>{this._stickyStyler.direction=t,this.updateStickyColumnStyles()})}_getOwnDefs(t){return t.filter(t=>!t._table||t._table===this)}_updateNoDataRow(){const t=this._customNoDataRow||this._noDataRow;if(t){const e=0===this._rowOutlet.viewContainer.length;if(e!==this._isShowingNoDataRow){const s=this._noDataRowOutlet.viewContainer;e?s.createEmbeddedView(t.templateRef):s.clear(),this._isShowingNoDataRow=e}}}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(r.ZZ4),r.Y36(r.sBO),r.Y36(r.SBq),r.$8M("role"),r.Y36(n.Is,8),r.Y36(c.K0),r.Y36(a.t4),r.Y36(i.k),r.Y36(G),r.Y36(l.rL),r.Y36(U,12))},t.\u0275cmp=r.Xpm({type:t,selectors:[["cdk-table"],["table","cdk-table",""]],contentQueries:function(t,e,s){if(1&t&&(r.Suo(s,j,5),r.Suo(s,x,5),r.Suo(s,M,5),r.Suo(s,A,5),r.Suo(s,Y,5)),2&t){let t;r.iGM(t=r.CRH())&&(e._noDataRow=t.first),r.iGM(t=r.CRH())&&(e._contentColumnDefs=t),r.iGM(t=r.CRH())&&(e._contentRowDefs=t),r.iGM(t=r.CRH())&&(e._contentHeaderRowDefs=t),r.iGM(t=r.CRH())&&(e._contentFooterRowDefs=t)}},viewQuery:function(t,e){if(1&t&&(r.Gf(V,7),r.Gf($,7),r.Gf(X,7),r.Gf(J,7)),2&t){let t;r.iGM(t=r.CRH())&&(e._rowOutlet=t.first),r.iGM(t=r.CRH())&&(e._headerRowOutlet=t.first),r.iGM(t=r.CRH())&&(e._footerRowOutlet=t.first),r.iGM(t=r.CRH())&&(e._noDataRowOutlet=t.first)}},hostAttrs:[1,"cdk-table"],hostVars:2,hostBindings:function(t,e){2&t&&r.ekj("cdk-table-fixed-layout",e.fixedLayout)},inputs:{trackBy:"trackBy",dataSource:"dataSource",multiTemplateDataRows:"multiTemplateDataRows",fixedLayout:"fixedLayout"},exportAs:["cdkTable"],features:[r._Bn([{provide:R,useExisting:t},{provide:i.k,useClass:i.yy},{provide:G,useClass:T},{provide:U,useValue:null}])],ngContentSelectors:w,decls:6,vars:0,consts:[["headerRowOutlet",""],["rowOutlet",""],["noDataRowOutlet",""],["footerRowOutlet",""]],template:function(t,e){1&t&&(r.F$t(y),r.Hsn(0),r.Hsn(1,1),r.GkF(2,0),r.GkF(3,1),r.GkF(4,2),r.GkF(5,3))},directives:[$,V,J,X],styles:[".cdk-table-fixed-layout{table-layout:fixed}\n"],encapsulation:2}),t})();function K(t,e){return t.concat(Array.from(e))}let tt=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.oAB({type:t}),t.\u0275inj=r.cJS({imports:[[l.Cl]]}),t})();var et=s(48318),st=s(38131),ot=s(42599),it=s(98300);const rt=[[["caption"]],[["colgroup"],["col"]]],nt=["caption","colgroup, col"];let at=(()=>{class t extends Q{constructor(){super(...arguments),this.stickyCssClass="mat-table-sticky",this.needsPositionStickyOnElement=!1}}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275cmp=r.Xpm({type:t,selectors:[["mat-table"],["table","mat-table",""]],hostAttrs:[1,"mat-table"],hostVars:2,hostBindings:function(t,e){2&t&&r.ekj("mat-table-fixed-layout",e.fixedLayout)},exportAs:["matTable"],features:[r._Bn([{provide:i.k,useClass:i.yy},{provide:Q,useExisting:t},{provide:R,useExisting:t},{provide:G,useClass:T},{provide:U,useValue:null}]),r.qOj],ngContentSelectors:nt,decls:6,vars:0,consts:[["headerRowOutlet",""],["rowOutlet",""],["noDataRowOutlet",""],["footerRowOutlet",""]],template:function(t,e){1&t&&(r.F$t(rt),r.Hsn(0),r.Hsn(1,1),r.GkF(2,0),r.GkF(3,1),r.GkF(4,2),r.GkF(5,3))},directives:[$,V,J,X],styles:['mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-row::after,mat-header-row::after,mat-footer-row::after{display:inline-block;min-height:inherit;content:""}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.mat-table{border-spacing:0}tr.mat-header-row{height:56px}tr.mat-row,tr.mat-footer-row{height:48px}th.mat-header-cell{text-align:left}[dir=rtl] th.mat-header-cell{text-align:right}th.mat-header-cell,td.mat-cell,td.mat-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.mat-header-cell:first-of-type,td.mat-cell:first-of-type,td.mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}th.mat-header-cell:last-of-type,td.mat-cell:last-of-type,td.mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}.mat-table-sticky{position:-webkit-sticky !important;position:sticky !important}.mat-table-fixed-layout{table-layout:fixed}\n'],encapsulation:2}),t})(),lt=(()=>{class t extends C{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275dir=r.lG2({type:t,selectors:[["","matCellDef",""]],features:[r._Bn([{provide:C,useExisting:t}]),r.qOj]}),t})(),ct=(()=>{class t extends S{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275dir=r.lG2({type:t,selectors:[["","matHeaderCellDef",""]],features:[r._Bn([{provide:S,useExisting:t}]),r.qOj]}),t})(),ht=(()=>{class t extends x{get name(){return this._name}set name(t){this._setNameInput(t)}_updateColumnCssClassName(){super._updateColumnCssClassName(),this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`)}}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275dir=r.lG2({type:t,selectors:[["","matColumnDef",""]],inputs:{sticky:"sticky",name:["matColumnDef","name"]},features:[r._Bn([{provide:x,useExisting:t},{provide:"MAT_SORT_HEADER_COLUMN_DEF",useExisting:t}]),r.qOj]}),t})(),dt=(()=>{class t extends O{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275dir=r.lG2({type:t,selectors:[["mat-header-cell"],["th","mat-header-cell",""]],hostAttrs:["role","columnheader",1,"mat-header-cell"],features:[r.qOj]}),t})(),ut=(()=>{class t extends E{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275dir=r.lG2({type:t,selectors:[["mat-cell"],["td","mat-cell",""]],hostAttrs:["role","gridcell",1,"mat-cell"],features:[r.qOj]}),t})(),ft=(()=>{class t extends A{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275dir=r.lG2({type:t,selectors:[["","matHeaderRowDef",""]],inputs:{columns:["matHeaderRowDef","columns"],sticky:["matHeaderRowDefSticky","sticky"]},features:[r._Bn([{provide:A,useExisting:t}]),r.qOj]}),t})(),_t=(()=>{class t extends M{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275dir=r.lG2({type:t,selectors:[["","matRowDef",""]],inputs:{columns:["matRowDefColumns","columns"],when:["matRowDefWhen","when"]},features:[r._Bn([{provide:M,useExisting:t}]),r.qOj]}),t})(),mt=(()=>{class t extends z{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275cmp=r.Xpm({type:t,selectors:[["mat-header-row"],["tr","mat-header-row",""]],hostAttrs:["role","row",1,"mat-header-row"],exportAs:["matHeaderRow"],features:[r._Bn([{provide:z,useExisting:t}]),r.qOj],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(t,e){1&t&&r.GkF(0,0)},directives:[P],encapsulation:2}),t})(),pt=(()=>{class t extends q{}return t.\u0275fac=function(){let e;return function(s){return(e||(e=r.n5z(t)))(s||t)}}(),t.\u0275cmp=r.Xpm({type:t,selectors:[["mat-row"],["tr","mat-row",""]],hostAttrs:["role","row",1,"mat-row"],exportAs:["matRow"],features:[r._Bn([{provide:q,useExisting:t}]),r.qOj],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(t,e){1&t&&r.GkF(0,0)},directives:[P],encapsulation:2}),t})(),yt=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.oAB({type:t}),t.\u0275inj=r.cJS({imports:[[tt,et.BQ],et.BQ]}),t})();class wt extends i.o2{constructor(t=[]){super(),this._renderData=new u.X([]),this._filter=new u.X(""),this._internalPageChanges=new h.xQ,this._renderChangesSubscription=null,this.sortingDataAccessor=(t,e)=>{const s=t[e];if((0,o.t6)(s)){const t=Number(s);return t<9007199254740991?t:s}return s},this.sortData=(t,e)=>{const s=e.active,o=e.direction;return s&&""!=o?t.sort((t,e)=>{let i=this.sortingDataAccessor(t,s),r=this.sortingDataAccessor(e,s);const n=typeof i,a=typeof r;n!==a&&("number"===n&&(i+=""),"number"===a&&(r+=""));let l=0;return null!=i&&null!=r?i>r?l=1:i<r&&(l=-1):null!=i?l=1:null!=r&&(l=-1),l*("asc"==o?1:-1)}):t},this.filterPredicate=(t,e)=>{const s=Object.keys(t).reduce((e,s)=>e+t[s]+"\u25ec","").toLowerCase(),o=e.trim().toLowerCase();return-1!=s.indexOf(o)},this._data=new u.X(t),this._updateChangeSubscription()}get data(){return this._data.value}set data(t){this._data.next(t),this._renderChangesSubscription||this._filterData(t)}get filter(){return this._filter.value}set filter(t){this._filter.next(t),this._renderChangesSubscription||this._filterData(this.data)}get sort(){return this._sort}set sort(t){this._sort=t,this._updateChangeSubscription()}get paginator(){return this._paginator}set paginator(t){this._paginator=t,this._updateChangeSubscription()}_updateChangeSubscription(){var t;const e=this._sort?(0,st.T)(this._sort.sortChange,this._sort.initialized):(0,_.of)(null),s=this._paginator?(0,st.T)(this._paginator.page,this._internalPageChanges,this._paginator.initialized):(0,_.of)(null),o=(0,ot.aj)([this._data,this._filter]).pipe((0,it.U)(([t])=>this._filterData(t))),i=(0,ot.aj)([o,e]).pipe((0,it.U)(([t])=>this._orderData(t))),r=(0,ot.aj)([i,s]).pipe((0,it.U)(([t])=>this._pageData(t)));null===(t=this._renderChangesSubscription)||void 0===t||t.unsubscribe(),this._renderChangesSubscription=r.subscribe(t=>this._renderData.next(t))}_filterData(t){return this.filteredData=null==this.filter||""===this.filter?t:t.filter(t=>this.filterPredicate(t,this.filter)),this.paginator&&this._updatePaginator(this.filteredData.length),this.filteredData}_orderData(t){return this.sort?this.sortData(t.slice(),this.sort):t}_pageData(t){if(!this.paginator)return t;const e=this.paginator.pageIndex*this.paginator.pageSize;return t.slice(e,e+this.paginator.pageSize)}_updatePaginator(t){Promise.resolve().then(()=>{const e=this.paginator;if(e&&(e.length=t,e.pageIndex>0)){const t=Math.ceil(e.length/e.pageSize)-1||0,s=Math.min(e.pageIndex,t);s!==e.pageIndex&&(e.pageIndex=s,this._internalPageChanges.next())}})}connect(){return this._renderChangesSubscription||this._updateChangeSubscription(),this._renderData}disconnect(){var t;null===(t=this._renderChangesSubscription)||void 0===t||t.unsubscribe(),this._renderChangesSubscription=null}}class gt extends wt{}},81046:function(t){"use strict";t.exports=JSON.parse('{"name":"en","options":{"months":["January","February","March","April","May","June","July","August","September","October","November","December"],"shortMonths":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"days":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"shortDays":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"toolbar":{"exportToSVG":"Download SVG","exportToPNG":"Download PNG","exportToCSV":"Download CSV","menu":"Menu","selection":"Selection","selectionZoom":"Selection Zoom","zoomIn":"Zoom In","zoomOut":"Zoom Out","pan":"Panning","reset":"Reset Zoom"}}}')}}]);