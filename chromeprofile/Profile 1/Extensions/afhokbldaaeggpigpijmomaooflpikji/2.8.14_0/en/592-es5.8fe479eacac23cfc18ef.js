!function(){var e,t,n,i,r,o,c;function s(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null==n)return;var i,r,o=[],c=!0,s=!1;try{for(n=n.call(e);!(c=(i=n.next()).done)&&(o.push(i.value),!t||o.length!==t);c=!0);}catch(a){s=!0,r=a}finally{try{c||null==n.return||n.return()}finally{if(s)throw r}}return o}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return u(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return u(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function l(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function f(e,t,n){return t&&l(e.prototype,t),n&&l(e,n),e}function g(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(self.webpackChunkangular_newtab=self.webpackChunkangular_newtab||[]).push([[592],{87221:function(e,t,n){"use strict";n.d(t,{QW:function(){return o}}),n(7581);var i=n(48318),r=n(42304),o=function(){var e=function e(){g(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=r.oAB({type:e}),e.\u0275inj=r.cJS({imports:[[i.BQ],i.BQ]}),e}()},27052:function(e,t,n){"use strict";n.d(t,{A:function(){return a}});var i=n(42304),r=n(33960),o=n(55109),c=function(e){return{big:e}},s=function(e){return{active:e}},a=function(){var e=function(){function e(t,n){g(this,e),this.commonService=t,this.cdr=n}return f(e,[{key:"Rating",value:function(e){var t=this.rating.own_rating;if(t&&t.isset)switch(e){case!0:switch(t.type){case!1:this.rating.own_rating.type=!0,this.rating.count++,this.rating.count++;break;case!0:this.rating.own_rating.isset=!1,this.rating.own_rating.type=!1,this.rating.count--}break;case!1:switch(t.type){case!1:this.rating.own_rating.isset=!1,this.rating.own_rating.type=!1,this.rating.count++;break;case!0:this.rating.own_rating.type=!1,this.rating.count--,this.rating.count--}}else switch(e){case!0:this.rating.own_rating.isset=!0,this.rating.own_rating.type=!0,this.rating.count++;break;case!1:this.rating.own_rating.isset=!0,this.rating.own_rating.type=!1,this.rating.count--}this.ratingAction(this.rating,e)}},{key:"ratingAction",value:function(e,t){this.commonService.createRequest("post","users/vote-action",{user_id_owner:this.user_id,action:t}).toPromise()}}]),e}();return e.\u0275fac=function(t){return new(t||e)(i.Y36(r.v),i.Y36(i.sBO))},e.\u0275cmp=i.Xpm({type:e,selectors:[["Rating"]],inputs:{rating:"rating",user_id:"user_id",big:"big"},decls:6,vars:10,consts:[[1,"rating-wrapper"],[1,"rating",3,"ngClass"],[1,"fas","fa-caret-up",3,"ngClass","click"],[1,"count"],[1,"fas","fa-caret-down",3,"ngClass","click"]],template:function(e,t){1&e&&(i.TgZ(0,"div",0),i.TgZ(1,"div",1),i.TgZ(2,"i",2),i.NdJ("click",function(){return t.Rating(!0)}),i.qZA(),i.TgZ(3,"span",3),i._uU(4),i.qZA(),i.TgZ(5,"i",4),i.NdJ("click",function(){return t.Rating(!1)}),i.qZA(),i.qZA(),i.qZA()),2&e&&(i.xp6(1),i.Q6J("ngClass",i.VKq(4,c,t.big)),i.xp6(1),i.Q6J("ngClass",i.VKq(6,s,t.rating.own_rating.isset&&t.rating.own_rating.type)),i.xp6(2),i.Oqu(t.rating.count),i.xp6(1),i.Q6J("ngClass",i.VKq(8,s,t.rating.own_rating.isset&&!t.rating.own_rating.type)))},directives:[o.mk],styles:[".rating[_ngcontent-%COMP%], .rating-wrapper[_ngcontent-%COMP%]{display:flex}.rating[_ngcontent-%COMP%]{justify-content:space-around;flex-direction:column;align-items:center}.rating[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:60px}.rating.big[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:75px}i[_ngcontent-%COMP%]{cursor:pointer;color:#ccc}.count[_ngcontent-%COMP%]{font-size:25px}.big[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%]{font-size:36px}.active[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#61a0ec}.active[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover, i[_ngcontent-%COMP%]:hover{color:#98c7ff}.active[_ngcontent-%COMP%]{color:#61a0ec}.no-pointer[_ngcontent-%COMP%]{cursor:default}.fa-spinner[_ngcontent-%COMP%]{font-size:15px;color:#ccc;margin:0 auto}"]}),e}()},80280:function(e,t,n){"use strict";n.d(t,{Y:function(){return s}});var i=n(4391),r=n(42304),o=n(94253),c=n(33960),s=function(){var e=function(){function e(t,n){g(this,e),this.dialog=t,this.commonService=n,this.title="",this.description=""}return f(e,[{key:"openDialog",value:function(e){switch(e){case"share_social":Math.floor(this.commonService.timer_status.duration/60),this.dialog.open(i.a,{data:{type:"refer_friend",from:"share-icon"},autoFocus:!1}).afterClosed().subscribe(function(e){})}}}]),e}();return e.\u0275fac=function(t){return new(t||e)(r.Y36(o.uw),r.Y36(c.v))},e.\u0275cmp=r.Xpm({type:e,selectors:[["ShareIcon"]],inputs:{title:"title",description:"description"},decls:1,vars:0,consts:[[1,"fas","fa-share","a-icon",3,"click"]],template:function(e,t){1&e&&(r.TgZ(0,"i",0),r.NdJ("click",function(){return t.openDialog("share_social")}),r.qZA())},styles:[".selected-skills[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;padding:0}.selected-skills[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style-type:none;margin-right:1rem;padding:.2rem .7rem;background-color:#e7edf0;color:#5c5c5c;border-radius:15px;display:flex;align-items:center;cursor:pointer;margin-top:.2rem}.selected-skills[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .fa-times[_ngcontent-%COMP%]{color:#00a0e3;margin-left:.4rem;font-size:.7rem}.selected-skills[_ngcontent-%COMP%]   li.removable[_ngcontent-%COMP%]:hover{background-color:#00a0e3;color:#fff}.selected-skills[_ngcontent-%COMP%]   li.removable[_ngcontent-%COMP%]:hover   .fa-times[_ngcontent-%COMP%]{color:#fff}.small[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{margin:.2rem 0 .5rem}.small[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-size:.8rem;padding:.2rem .5rem;margin-right:.5rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.selected-skills[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(.removable){cursor:default}"]}),e}()},38520:function(e,t,n){"use strict";n.d(t,{n:function(){return u}});var i=n(61855),r=n(42304),o=n(19033),c=n(99424),s=n(14887),u=function(){var e=function(){function e(t){g(this,e),this.element=t,this.debounceTime=0,this.threshold=1,this.visible=new r.vpe,this.subject$=new o.xQ}return f(e,[{key:"ngOnInit",value:function(){this.createObserver()}},{key:"ngAfterViewInit",value:function(){this.startObservingElements()}},{key:"ngOnDestroy",value:function(){this.observer&&(this.observer.disconnect(),this.observer=void 0),this.subject$.next(),this.subject$.complete()}},{key:"isVisible",value:function(e){return new Promise(function(t){var n=new IntersectionObserver(function(e){var i=a(e,1)[0];t(1===i.intersectionRatio),n.disconnect()});n.observe(e)})}},{key:"createObserver",value:function(){var e=this;this.observer=new IntersectionObserver(function(t,n){t.forEach(function(t){(function(e){return e.isIntersecting||e.intersectionRatio>0})(t)&&e.subject$.next({entry:t,observer:n})})},{rootMargin:"0px",threshold:this.threshold})}},{key:"startObservingElements",value:function(){var e=this;this.observer&&(this.observer.observe(this.element.nativeElement),this.subject$.pipe((0,c.g)(this.debounceTime),(0,s.h)(Boolean)).subscribe(function(t){var n=t.entry,r=t.observer;return(0,i.mG)(e,void 0,void 0,regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.target,e.next=3,this.isVisible(t);case 3:if(e.t0=e.sent,!e.t0){e.next=6;break}this.visible.emit(t),r.unobserve(t);case 6:case"end":return e.stop()}},e,this)}))}))}}]),e}();return e.\u0275fac=function(t){return new(t||e)(r.Y36(r.SBq))},e.\u0275dir=r.lG2({type:e,selectors:[["","observeVisibility",""]],inputs:{debounceTime:"debounceTime",threshold:"threshold"},outputs:{visible:"visible"}}),e}()},82181:function(e,t,n){"use strict";n.d(t,{n:function(){return r}});var i=n(42304),r=function(){var e=function(){function e(t){g(this,e),this.element=t}return f(e,[{key:"ngOnChanges",value:function(){this.showLoader?(this.innerHTMLBefore=this.element.nativeElement.innerHTML,this.element.nativeElement.innerHTML='<i class="fas fa-spinner fa-spin"></i>'):this.innerHTMLBefore&&this.element.nativeElement.innerHTML!=this.innerHTMLBefore&&(this.element.nativeElement.innerHTML=this.innerHTMLBefore)}}]),e}();return e.\u0275fac=function(t){return new(t||e)(i.Y36(i.SBq))},e.\u0275dir=i.lG2({type:e,selectors:[["","showLoader",""]],inputs:{showLoader:"showLoader"},features:[i.TTD]}),e}()},39603:function(a,u,l){"use strict";l.d(u,{K:function(){return Z}});var d=l(31759),v=l(4391),p=l(42304),m=l(33960),h=l(94253),b=l(55109),_=l(67563),O=l(65901),w=l(24160),y=l(35899);function P(e,t){1&e&&p._UZ(0,"i",16)}function C(e,t){1&e&&(p.TgZ(0,"span",17),p.SDv(1,18),p.qZA())}function M(e,t){1&e&&(p.TgZ(0,"span",19),p.SDv(1,20),p.qZA())}function x(e,t){if(1&e&&(p.TgZ(0,"div",21),p._UZ(1,"Price",22),p.qZA()),2&e){var n=p.oxw();p.xp6(1),p.Q6J("mtt","MTT"==n.service.rate.rate_cur?n.service.rate.rate:0)("usd","MTT"==n.service.rate.rate_cur?0:n.service.rate.rate)}}var T=function(e){return["getTimeForView",e,!0,!1]};function k(e,t){if(1&e&&(p.TgZ(0,"div",23),p._uU(1),p.ALo(2,"callbackPipe"),p.qZA()),2&e){var n=p.oxw();p.xp6(1),p.hij(" ",p.xi3(2,1,n.service.duration,p.VKq(4,T,n.service.duration))," ")}}var Z=function(){var a=function(){function e(t,n,i){g(this,e),this.commonService=t,this.dialog=n,this.cdr=i,this.moderate=!1,this.getTimeForView=d.VT}return f(e,[{key:"ngOnInit",value:function(){}},{key:"openDialog",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments.length>2?arguments[2]:void 0;if(!i||"A"!=i.target.tagName)switch(e){case"service-view":var r=n;this.dialog.open(v.a,{data:{type:"service-view",service:r,moderate:this.moderate},autoFocus:!1,maxWidth:"none",panelClass:"service-view-pain"}).afterClosed().subscribe(function(e){e&&e.moderate&&t.commonService.createRequest("post","services/moderate",{service_id:r.id,moderate:e.moderate,message:e.message}).toPromise().then(function(){for(var e=0;e<t.commonService.moderate.services.length;e++)t.commonService.moderate.services[e].id==r.id&&(t.commonService.moderate.services.splice(e,1),t.commonService.markForCheck_sub.next());if(t.commonService.notifications&&t.commonService.notifications.moderate&&t.commonService.notifications.moderate.services){var n=t.commonService.notifications.moderate.services.indexOf(t.service.id);-1!==n&&t.commonService.notifications.moderate.services.splice(n,1)}})}),this.commonService.user.id!=r.user.id&&this.commonService.createRequest("post","services/open-service",{service_id:r.id}).toPromise()}}}]),e}();return a.\u0275fac=function(e){return new(e||a)(p.Y36(m.v),p.Y36(h.uw),p.Y36(p.sBO))},a.\u0275cmp=p.Xpm({type:a,selectors:[["ServiceRow"]],inputs:{service:"service",moderate:"moderate"},decls:19,vars:9,consts:function(){var a,u,l,f,g;return[[1,"service","mt-card",3,"click"],[1,"l-side"],[1,"avatar"],["alt","",3,"src"],[1,"r-side"],[1,"description"],[1,"footer"],["class","fas fa-eye-slash","style","color:#4a5657","matTooltip",a="Not published","matTooltipPosition","above",4,"ngIf"],[1,"status"],["matTooltip",u="The service has been sent for moderation","matTooltipPosition","above","style","color: #009fe4;",4,"ngIf"],["matTooltip",l="The service did not pass moderation, change the description or contact support.","matTooltipPosition","above","style","color: red;",4,"ngIf"],[1,"username"],["target","_blank",3,"routerLink"],[2,"display","flex","justify-content","space-between","margin-top","8px"],["class","price","matTooltip",f="Cost","matTooltipPosition","above",4,"ngIf"],["class","prod-time","matTooltip",g="Productive time","matTooltipPosition","above",4,"ngIf"],["matTooltip",a,"matTooltipPosition","above",1,"fas","fa-eye-slash",2,"color","#4a5657"],["matTooltip",u,"matTooltipPosition","above",2,"color","#009fe4"],"On moderation",["matTooltip",l,"matTooltipPosition","above",2,"color","red"],"Rejected",["matTooltip",f,"matTooltipPosition","above",1,"price"],["direction","to_usd",3,"mtt","usd"],["matTooltip",g,"matTooltipPosition","above",1,"prod-time"]]},template:function(e,t){1&e&&(p.TgZ(0,"div",0),p.NdJ("click",function(e){return t.openDialog("service-view",t.service,e)}),p.TgZ(1,"div",1),p.TgZ(2,"div",2),p._UZ(3,"img",3),p.qZA(),p.qZA(),p.TgZ(4,"div",4),p.TgZ(5,"div",5),p._uU(6),p.qZA(),p.TgZ(7,"div",6),p.TgZ(8,"div"),p.YNc(9,P,1,0,"i",7),p.qZA(),p.TgZ(10,"div",8),p.YNc(11,C,2,0,"span",9),p.YNc(12,M,2,0,"span",10),p.qZA(),p.TgZ(13,"div",11),p.TgZ(14,"a",12),p._uU(15),p.qZA(),p.qZA(),p.TgZ(16,"div",13),p.YNc(17,x,2,2,"div",14),p.YNc(18,k,3,6,"div",15),p.qZA(),p.qZA(),p.qZA(),p.qZA()),2&e&&(p.xp6(3),p.Q6J("src",t.service.images[0],p.LSH),p.xp6(3),p.hij(" ",t.service.title," "),p.xp6(3),p.Q6J("ngIf",2==t.service.status&&t.service.not_public),p.xp6(2),p.Q6J("ngIf",0==t.service.status),p.xp6(1),p.Q6J("ngIf",2==t.service.status),p.xp6(2),p.Q6J("routerLink","/profile/"+t.service.user.id),p.xp6(1),p.Oqu(t.service.user.name+" "+t.service.user.surname),p.xp6(2),p.Q6J("ngIf",t.service.rate.rate&&t.service.rate.rate_cur),p.xp6(1),p.Q6J("ngIf",t.service.duration))},directives:[b.O5,_.yS,O.gM,w.C],pipes:[y.A],styles:[".footer[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%]{font-weight:600;font-size:12px}.service[_ngcontent-%COMP%]{text-align:left;cursor:pointer;min-height:150px;flex-direction:column;width:225px;margin:10px;border-top-right-radius:10px;overflow:hidden}.l-side[_ngcontent-%COMP%], .service[_ngcontent-%COMP%]{display:flex;border-top-left-radius:10px}.l-side[_ngcontent-%COMP%]{background-color:#f4f8fa;border-bottom-left-radius:10px}.r-side[_ngcontent-%COMP%]{padding:1rem;width:100%;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;min-height:150px}.avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:225px;height:100%;-o-object-fit:cover;object-fit:cover;border-right:0;height:150px}.head[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.rate[_ngcontent-%COMP%]{font-weight:600;color:#009fe4}.description[_ngcontent-%COMP%], .rate[_ngcontent-%COMP%]{cursor:pointer;font-size:14px}.prod-time[_ngcontent-%COMP%]{color:#3b4a99;font-weight:600;cursor:pointer}.footer[_ngcontent-%COMP%]{color:#1f1f1f;font-size:14px;display:flex;justify-content:flex-end;flex-direction:column}.footer[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:not(:last-child){margin-right:1rem}.price[_ngcontent-%COMP%]{color:#009fe4;font-weight:600}.footer[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:not(:hover){color:#b9b9b9}Skills[_ngcontent-%COMP%]{font-size:12px}  .desc p{margin:0}@media only screen and (max-width:545px){.service[_ngcontent-%COMP%]{width:300px}.avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:300px;height:200px}}"]}),a}()}}])}();