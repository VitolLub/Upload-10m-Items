(self.webpackChunkangular_newtab=self.webpackChunkangular_newtab||[]).push([[592],{87221:function(e,t,n){"use strict";n.d(t,{QW:function(){return r}}),n(7581);var i=n(48318),o=n(42304);let r=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=o.oAB({type:e}),e.\u0275inj=o.cJS({imports:[[i.BQ],i.BQ]}),e})()},27052:function(e,t,n){"use strict";n.d(t,{A:function(){return a}});var i=n(42304),o=n(33960),r=n(55109);const s=function(e){return{big:e}},c=function(e){return{active:e}};let a=(()=>{class e{constructor(e,t){this.commonService=e,this.cdr=t}Rating(e){let t=this.rating.own_rating;if(t&&t.isset)switch(e){case!0:switch(t.type){case!1:this.rating.own_rating.type=!0,this.rating.count++,this.rating.count++;break;case!0:this.rating.own_rating.isset=!1,this.rating.own_rating.type=!1,this.rating.count--}break;case!1:switch(t.type){case!1:this.rating.own_rating.isset=!1,this.rating.own_rating.type=!1,this.rating.count++;break;case!0:this.rating.own_rating.type=!1,this.rating.count--,this.rating.count--}}else switch(e){case!0:this.rating.own_rating.isset=!0,this.rating.own_rating.type=!0,this.rating.count++;break;case!1:this.rating.own_rating.isset=!0,this.rating.own_rating.type=!1,this.rating.count--}this.ratingAction(this.rating,e)}ratingAction(e,t){this.commonService.createRequest("post","users/vote-action",{user_id_owner:this.user_id,action:t}).toPromise()}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(o.v),i.Y36(i.sBO))},e.\u0275cmp=i.Xpm({type:e,selectors:[["Rating"]],inputs:{rating:"rating",user_id:"user_id",big:"big"},decls:6,vars:10,consts:[[1,"rating-wrapper"],[1,"rating",3,"ngClass"],[1,"fas","fa-caret-up",3,"ngClass","click"],[1,"count"],[1,"fas","fa-caret-down",3,"ngClass","click"]],template:function(e,t){1&e&&(i.TgZ(0,"div",0),i.TgZ(1,"div",1),i.TgZ(2,"i",2),i.NdJ("click",function(){return t.Rating(!0)}),i.qZA(),i.TgZ(3,"span",3),i._uU(4),i.qZA(),i.TgZ(5,"i",4),i.NdJ("click",function(){return t.Rating(!1)}),i.qZA(),i.qZA(),i.qZA()),2&e&&(i.xp6(1),i.Q6J("ngClass",i.VKq(4,s,t.big)),i.xp6(1),i.Q6J("ngClass",i.VKq(6,c,t.rating.own_rating.isset&&t.rating.own_rating.type)),i.xp6(2),i.Oqu(t.rating.count),i.xp6(1),i.Q6J("ngClass",i.VKq(8,c,t.rating.own_rating.isset&&!t.rating.own_rating.type)))},directives:[r.mk],styles:[".rating[_ngcontent-%COMP%], .rating-wrapper[_ngcontent-%COMP%]{display:flex}.rating[_ngcontent-%COMP%]{justify-content:space-around;flex-direction:column;align-items:center}.rating[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:60px}.rating.big[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:75px}i[_ngcontent-%COMP%]{cursor:pointer;color:#ccc}.count[_ngcontent-%COMP%]{font-size:25px}.big[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%]{font-size:36px}.active[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#61a0ec}.active[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover, i[_ngcontent-%COMP%]:hover{color:#98c7ff}.active[_ngcontent-%COMP%]{color:#61a0ec}.no-pointer[_ngcontent-%COMP%]{cursor:default}.fa-spinner[_ngcontent-%COMP%]{font-size:15px;color:#ccc;margin:0 auto}"]}),e})()},80280:function(e,t,n){"use strict";n.d(t,{Y:function(){return c}});var i=n(4391),o=n(42304),r=n(94253),s=n(33960);let c=(()=>{class e{constructor(e,t){this.dialog=e,this.commonService=t,this.title="",this.description=""}openDialog(e,t=null){let n;switch(e){case"share_social":Math.floor(this.commonService.timer_status.duration/60),n=this.dialog.open(i.a,{data:{type:"refer_friend",from:"share-icon"},autoFocus:!1}),n.afterClosed().subscribe(e=>{})}}}return e.\u0275fac=function(t){return new(t||e)(o.Y36(r.uw),o.Y36(s.v))},e.\u0275cmp=o.Xpm({type:e,selectors:[["ShareIcon"]],inputs:{title:"title",description:"description"},decls:1,vars:0,consts:[[1,"fas","fa-share","a-icon",3,"click"]],template:function(e,t){1&e&&(o.TgZ(0,"i",0),o.NdJ("click",function(){return t.openDialog("share_social")}),o.qZA())},styles:[".selected-skills[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;padding:0}.selected-skills[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style-type:none;margin-right:1rem;padding:.2rem .7rem;background-color:#e7edf0;color:#5c5c5c;border-radius:15px;display:flex;align-items:center;cursor:pointer;margin-top:.2rem}.selected-skills[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .fa-times[_ngcontent-%COMP%]{color:#00a0e3;margin-left:.4rem;font-size:.7rem}.selected-skills[_ngcontent-%COMP%]   li.removable[_ngcontent-%COMP%]:hover{background-color:#00a0e3;color:#fff}.selected-skills[_ngcontent-%COMP%]   li.removable[_ngcontent-%COMP%]:hover   .fa-times[_ngcontent-%COMP%]{color:#fff}.small[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{margin:.2rem 0 .5rem}.small[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-size:.8rem;padding:.2rem .5rem;margin-right:.5rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.selected-skills[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(.removable){cursor:default}"]}),e})()},38520:function(e,t,n){"use strict";n.d(t,{n:function(){return a}});var i=n(61855),o=n(42304),r=n(19033),s=n(99424),c=n(14887);let a=(()=>{class e{constructor(e){this.element=e,this.debounceTime=0,this.threshold=1,this.visible=new o.vpe,this.subject$=new r.xQ}ngOnInit(){this.createObserver()}ngAfterViewInit(){this.startObservingElements()}ngOnDestroy(){this.observer&&(this.observer.disconnect(),this.observer=void 0),this.subject$.next(),this.subject$.complete()}isVisible(e){return new Promise(t=>{const n=new IntersectionObserver(([e])=>{t(1===e.intersectionRatio),n.disconnect()});n.observe(e)})}createObserver(){this.observer=new IntersectionObserver((e,t)=>{e.forEach(e=>{(e=>e.isIntersecting||e.intersectionRatio>0)(e)&&this.subject$.next({entry:e,observer:t})})},{rootMargin:"0px",threshold:this.threshold})}startObservingElements(){this.observer&&(this.observer.observe(this.element.nativeElement),this.subject$.pipe((0,s.g)(this.debounceTime),(0,c.h)(Boolean)).subscribe(({entry:e,observer:t})=>(0,i.mG)(this,void 0,void 0,function*(){const n=e.target;(yield this.isVisible(n))&&(this.visible.emit(n),t.unobserve(n))})))}}return e.\u0275fac=function(t){return new(t||e)(o.Y36(o.SBq))},e.\u0275dir=o.lG2({type:e,selectors:[["","observeVisibility",""]],inputs:{debounceTime:"debounceTime",threshold:"threshold"},outputs:{visible:"visible"}}),e})()},82181:function(e,t,n){"use strict";n.d(t,{n:function(){return o}});var i=n(42304);let o=(()=>{class e{constructor(e){this.element=e}ngOnChanges(){this.showLoader?(this.innerHTMLBefore=this.element.nativeElement.innerHTML,this.element.nativeElement.innerHTML='<i class="fas fa-spinner fa-spin"></i>'):this.innerHTMLBefore&&this.element.nativeElement.innerHTML!=this.innerHTMLBefore&&(this.element.nativeElement.innerHTML=this.innerHTMLBefore)}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(i.SBq))},e.\u0275dir=i.lG2({type:e,selectors:[["","showLoader",""]],inputs:{showLoader:"showLoader"},features:[i.TTD]}),e})()},39603:function(e,t,n){"use strict";n.d(t,{K:function(){return _}});var i=n(31759),o=n(4391),r=n(42304),s=n(33960),c=n(94253),a=n(55109),l=n(67563),g=n(65901),d=n(24160),u=n(35899);function f(e,t){1&e&&r._UZ(0,"i",16)}function m(e,t){1&e&&(r.TgZ(0,"span",17),r.SDv(1,18),r.qZA())}function p(e,t){1&e&&(r.TgZ(0,"span",19),r.SDv(1,20),r.qZA())}function h(e,t){if(1&e&&(r.TgZ(0,"div",21),r._UZ(1,"Price",22),r.qZA()),2&e){const e=r.oxw();r.xp6(1),r.Q6J("mtt","MTT"==e.service.rate.rate_cur?e.service.rate.rate:0)("usd","MTT"==e.service.rate.rate_cur?0:e.service.rate.rate)}}const v=function(e){return["getTimeForView",e,!0,!1]};function b(e,t){if(1&e&&(r.TgZ(0,"div",23),r._uU(1),r.ALo(2,"callbackPipe"),r.qZA()),2&e){const e=r.oxw();r.xp6(1),r.hij(" ",r.xi3(2,1,e.service.duration,r.VKq(4,v,e.service.duration))," ")}}let _=(()=>{class e{constructor(e,t,n){this.commonService=e,this.dialog=t,this.cdr=n,this.moderate=!1,this.getTimeForView=i.VT}ngOnInit(){}openDialog(e,t=null,n){if(n&&"A"==n.target.tagName)return;let i;switch(e){case"service-view":let e=t;i=this.dialog.open(o.a,{data:{type:"service-view",service:e,moderate:this.moderate},autoFocus:!1,maxWidth:"none",panelClass:"service-view-pain"}),i.afterClosed().subscribe(t=>{t&&t.moderate&&this.commonService.createRequest("post","services/moderate",{service_id:e.id,moderate:t.moderate,message:t.message}).toPromise().then(()=>{for(let t=0;t<this.commonService.moderate.services.length;t++)this.commonService.moderate.services[t].id==e.id&&(this.commonService.moderate.services.splice(t,1),this.commonService.markForCheck_sub.next());if(this.commonService.notifications&&this.commonService.notifications.moderate&&this.commonService.notifications.moderate.services){let e=this.commonService.notifications.moderate.services.indexOf(this.service.id);-1!==e&&this.commonService.notifications.moderate.services.splice(e,1)}})}),this.commonService.user.id!=e.user.id&&this.commonService.createRequest("post","services/open-service",{service_id:e.id}).toPromise()}}}return e.\u0275fac=function(t){return new(t||e)(r.Y36(s.v),r.Y36(c.uw),r.Y36(r.sBO))},e.\u0275cmp=r.Xpm({type:e,selectors:[["ServiceRow"]],inputs:{service:"service",moderate:"moderate"},decls:19,vars:9,consts:function(){let e,t,n,i,o,r,s;return e="Not published",t="The service has been sent for moderation",n="The service did not pass moderation, change the description or contact support.",i="Cost",o="Productive time",r="On moderation",s="Rejected",[[1,"service","mt-card",3,"click"],[1,"l-side"],[1,"avatar"],["alt","",3,"src"],[1,"r-side"],[1,"description"],[1,"footer"],["class","fas fa-eye-slash","style","color:#4a5657","matTooltip",e,"matTooltipPosition","above",4,"ngIf"],[1,"status"],["matTooltip",t,"matTooltipPosition","above","style","color: #009fe4;",4,"ngIf"],["matTooltip",n,"matTooltipPosition","above","style","color: red;",4,"ngIf"],[1,"username"],["target","_blank",3,"routerLink"],[2,"display","flex","justify-content","space-between","margin-top","8px"],["class","price","matTooltip",i,"matTooltipPosition","above",4,"ngIf"],["class","prod-time","matTooltip",o,"matTooltipPosition","above",4,"ngIf"],["matTooltip",e,"matTooltipPosition","above",1,"fas","fa-eye-slash",2,"color","#4a5657"],["matTooltip",t,"matTooltipPosition","above",2,"color","#009fe4"],r,["matTooltip",n,"matTooltipPosition","above",2,"color","red"],s,["matTooltip",i,"matTooltipPosition","above",1,"price"],["direction","to_usd",3,"mtt","usd"],["matTooltip",o,"matTooltipPosition","above",1,"prod-time"]]},template:function(e,t){1&e&&(r.TgZ(0,"div",0),r.NdJ("click",function(e){return t.openDialog("service-view",t.service,e)}),r.TgZ(1,"div",1),r.TgZ(2,"div",2),r._UZ(3,"img",3),r.qZA(),r.qZA(),r.TgZ(4,"div",4),r.TgZ(5,"div",5),r._uU(6),r.qZA(),r.TgZ(7,"div",6),r.TgZ(8,"div"),r.YNc(9,f,1,0,"i",7),r.qZA(),r.TgZ(10,"div",8),r.YNc(11,m,2,0,"span",9),r.YNc(12,p,2,0,"span",10),r.qZA(),r.TgZ(13,"div",11),r.TgZ(14,"a",12),r._uU(15),r.qZA(),r.qZA(),r.TgZ(16,"div",13),r.YNc(17,h,2,2,"div",14),r.YNc(18,b,3,6,"div",15),r.qZA(),r.qZA(),r.qZA(),r.qZA()),2&e&&(r.xp6(3),r.Q6J("src",t.service.images[0],r.LSH),r.xp6(3),r.hij(" ",t.service.title," "),r.xp6(3),r.Q6J("ngIf",2==t.service.status&&t.service.not_public),r.xp6(2),r.Q6J("ngIf",0==t.service.status),r.xp6(1),r.Q6J("ngIf",2==t.service.status),r.xp6(2),r.Q6J("routerLink","/profile/"+t.service.user.id),r.xp6(1),r.Oqu(t.service.user.name+" "+t.service.user.surname),r.xp6(2),r.Q6J("ngIf",t.service.rate.rate&&t.service.rate.rate_cur),r.xp6(1),r.Q6J("ngIf",t.service.duration))},directives:[a.O5,l.yS,g.gM,d.C],pipes:[u.A],styles:[".footer[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%]{font-weight:600;font-size:12px}.service[_ngcontent-%COMP%]{text-align:left;cursor:pointer;min-height:150px;flex-direction:column;width:225px;margin:10px;border-top-right-radius:10px;overflow:hidden}.l-side[_ngcontent-%COMP%], .service[_ngcontent-%COMP%]{display:flex;border-top-left-radius:10px}.l-side[_ngcontent-%COMP%]{background-color:#f4f8fa;border-bottom-left-radius:10px}.r-side[_ngcontent-%COMP%]{padding:1rem;width:100%;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;min-height:150px}.avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:225px;height:100%;-o-object-fit:cover;object-fit:cover;border-right:0;height:150px}.head[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.rate[_ngcontent-%COMP%]{font-weight:600;color:#009fe4}.description[_ngcontent-%COMP%], .rate[_ngcontent-%COMP%]{cursor:pointer;font-size:14px}.prod-time[_ngcontent-%COMP%]{color:#3b4a99;font-weight:600;cursor:pointer}.footer[_ngcontent-%COMP%]{color:#1f1f1f;font-size:14px;display:flex;justify-content:flex-end;flex-direction:column}.footer[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:not(:last-child){margin-right:1rem}.price[_ngcontent-%COMP%]{color:#009fe4;font-weight:600}.footer[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:not(:hover){color:#b9b9b9}Skills[_ngcontent-%COMP%]{font-size:12px}  .desc p{margin:0}@media only screen and (max-width:545px){.service[_ngcontent-%COMP%]{width:300px}.avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:300px;height:200px}}"]}),e})()}}]);