!function(){var t,e,n,o,c,i,a,g,r,s,d,l,f,p,Z,m,_,u,v,b,P,C,O,M,h,x,T,A,q,k,S,z,y,w,$;function D(t,e){return e||(e=t.slice(0)),Object.freeze(Object.defineProperties(t,{raw:{value:Object.freeze(e)}}))}function I(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function U(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}(self.webpackChunkangular_newtab=self.webpackChunkangular_newtab||[]).push([[868],{37868:function(N,E,R){"use strict";R.r(E),R.d(E,{TakeProModule:function(){return dt}});var J=R(55109),Y=R(36278),j=R(67563),B=R(4391),L=R(42304),Q=R(33960),H=R(94253),W=R(90095),X=R(35899);function F(t,e){1&t&&(L.TgZ(0,"button",65),L.tHW(1,66),L._UZ(2,"i",67),L.N_p(),L.qZA())}function K(t,e){if(1&t){var n=L.EpF();L.TgZ(0,"button",68),L.NdJ("click",function(){return L.CHM(n),L.oxw().disablePro()}),L.SDv(1,69),L.qZA()}}function V(t,e){1&t&&(L.TgZ(0,"button",65),L.tHW(1,70),L._UZ(2,"i",67),L.N_p(),L.qZA())}function G(t,e){if(1&t){var n=L.EpF();L.TgZ(0,"button",68),L.NdJ("click",function(){return L.CHM(n),L.oxw().takePro()}),L.SDv(1,71),L.qZA()}}function tt(t,e){1&t&&(L.TgZ(0,"span"),L.SDv(1,72),L.qZA())}function et(t,e){1&t&&(L.TgZ(0,"span"),L.SDv(1,73),L.qZA())}function nt(t,e){1&t&&(L.TgZ(0,"span"),L.SDv(1,74),L.qZA())}var ot=function(t){return["getWhenDate",t,!0]};function ct(t,e){if(1&t&&(L.TgZ(0,"span"),L.YNc(1,et,2,0,"span",52),L.YNc(2,nt,2,0,"span",52),L.TgZ(3,"span"),L._uU(4),L.ALo(5,"callbackPipe"),L.qZA(),L.qZA()),2&t){var n=L.oxw();L.xp6(1),L.Q6J("ngIf","trial"==n.commonService.user.pro_status.type),L.xp6(1),L.Q6J("ngIf","active"==n.commonService.user.pro_status.type),L.xp6(2),L.Oqu(L.xi3(5,3,n.commonService.user.pro_status.time_end,L.VKq(6,ot,n.commonService.user.pro_status.time_end)))}}var it,at,gt=[{path:"",component:(it=function(){function t(e,n,o){I(this,t),this.commonService=e,this.dialog=n,this.cdr=o}var e,n,o;return e=t,(n=[{key:"ngOnInit",value:function(){location.hash.match(/a=activate/)&&(document.getElementById("statusinfo").scrollIntoView({behavior:"smooth"}),this.takePro())}},{key:"takePro",value:function(){var t=this;this.commonService.createRequest("post","finance/check-pro",{}).toPromise().then(function(e){"active"==e.status?t.commonService.user.pro=!0:"can_go_active"==e.status&&("maketime.online"==location.host?t._goPay(e.start_date):window.location.href="https://maketime.online/#/take-pro?a=activate")})}},{key:"_goPay",value:function(t){if(!this.payCloudService){var e=this;this.payCloudService=function(){var n=new cp.CloudPayments,o={cloudPayments:null};if(o.cloudPayments={recurrent:{interval:"Month",period:1,customerReceipt:{Items:[{label:"\u0410\u043a\u0442\u0438\u0432\u0430\u0446\u0438\u044f Pro \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 MakeTime",price:70,amount:70,vat:0,method:0,object:0}],taxationSystem:0,email:"uasmartapps@gmail.com",phone:"",isBso:!1,amounts:{electronic:70,advancePayment:0,credit:0,provision:0}}}},t){var c=new Date(t);o.cloudPayments.recurrent.startDate=c}n.charge({publicId:"pk_a6bc7d6fecf9f3562949d802700e8",description:"\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 \u043d\u0430 \u0435\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 Pro \u0430\u043a\u043a\u0430\u0443\u043d\u0442 MakeTime",amount:1,currency:"RUB",accountId:this.commonService.user.id,data:o,skin:"modern"},function(t){e.commonService.createRequest("post","finance/activate-pro",{}).toPromise().then(function(t){"active"==t.status&&(e.commonService.user.pro=!0),t.pro_status&&(e.commonService.user.pro_status=t.pro_status),e.cdr.detectChanges()})},function(t,e){})}}this.payCloudService()}},{key:"disablePro",value:function(){var t=this;this.dialog.open(B.a,{data:{type:"deactivate_pro"},restoreFocus:!1}).afterClosed().subscribe(function(e){e&&t.commonService.createRequest("post","finance/disable-pro",{}).toPromise().then(function(e){"disabled"==e.status&&(t.commonService.user.pro=!1),t.cdr.detectChanges()})})}}])&&U(e.prototype,n),o&&U(e,o),t}(),it.\u0275fac=function(t){return new(t||it)(L.Y36(Q.v),L.Y36(H.uw),L.Y36(L.sBO))},it.\u0275cmp=L.Xpm({type:it,selectors:[["ng-component"]],decls:127,vars:6,consts:function(){return[[1,"page"],[1,"s1"],[1,"left"],"\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 PRO \u0430\u043A\u043A\u0430\u0443\u043D\u0442","70 \u0440\u0443\u0431\u043B\u0435\u0439 \u0432 \u043C\u0435\u0441\u044F\u0446 \u0438\u043B\u0438 \u0447\u0430\u0448\u043A\u0430 \u043A\u043E\u0444\u0435 \u2014 \u044D\u0442\u043E \u043C\u043D\u043E\u0433\u043E \u0437\u0430 \u043F\u043E\u0432\u044B\u0448\u0435\u043D\u0438\u0435 \u0441\u0432\u043E\u0435\u0439 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438?",[1,"hide-in-mob"],["src","/assets/img/take-pro/s1-cup-wallet.svg","alt",""],[1,"s2"],[1,"separator"],"\u041F\u043E\u0447\u0435\u043C\u0443 \u044D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0432\u0430\u0436\u043D\u043E?",[1,"cards"],[1,"card"],["src","/assets/img/take-pro/s2-1.png","alt",""],"\u0418\u043D\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044F \u0432 \u0441\u0435\u0431\u044F","\u041C\u044B \u0446\u0435\u043D\u0438\u043C \u0442\u043E, \u0437\u0430 \u0447\u0442\u043E \u043F\u043B\u0430\u0442\u0438\u043C. \u0412\u044B \u043F\u043E\u043A\u0443\u043F\u0430\u0435\u0442\u0435 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438 \u0434\u043E\u0431\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u0441\u0432\u043E\u0438\u0445 \u0446\u0435\u043B\u0435\u0439.",["src","/assets/img/take-pro/s2-2.png","alt",""],"\u0411\u0438\u0437\u043D\u0435\u0441 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430","\u0412\u0430\u043C \u0431\u0443\u0434\u0443\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0432\u0441\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 MakeTime, \u0430 \u0432\u0430\u0448 PRO \u0441\u0442\u0430\u0442\u0443\u0441 \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u043E\u0431 \u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u0438 \u043A \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438.",["src","/assets/img/take-pro/s2-3.png","alt",""],"\u041D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0439 \u043F\u0430\u0440\u0442\u043D\u0435\u0440","\u041E\u0442\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u044F \u043F\u043E \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u043A\u043E\u0439 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0435 \u043D\u0430 10% \u0432\u044B\u0448\u0435, \u0438\u0442\u043E\u0433\u043E 40%.",["id","statusinfo",1,"s3"],"\u0412\u0430\u0448 \u0441\u0442\u0430\u0442\u0443\u0441",[1,"head"],[1,"avatar"],["src","/assets/img/take-pro/s3-man-1.png","alt",""],[1,"type"],"\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",[1,"action-button"],["mat-raised-button","","disabled","true",4,"ngIf"],["mat-raised-button","",3,"click",4,"ngIf"],[1,"body"],[1,"title"],"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E","\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 MakeTime.",[1,"footer"],[1,"block"],[1,"img"],["src","/assets/img/take-pro/s3-q.png","alt",""],[1,"desc"],"\u0412\u043E\u0432\u043B\u0435\u0447\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432 \u0442\u0430\u0439\u043C-\u043C\u0435\u043D\u0435\u0434\u0436\u043C\u0435\u043D\u0442","\u0412\u0441\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 MakeTime","\u0412\u044B\u0448\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u043A\u0438\u0435 \u043E\u0442\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u044F","PRO \u0441\u0442\u0430\u0442\u0443\u0441, \u043F\u043E\u0432\u044B\u0448\u0435\u043D \u0440\u0435\u0439\u0442\u0438\u043D\u0433",[1,"card","pro"],["src","/assets/img/take-pro/s3-man-2.png","alt",""],"\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B","70 \u0440\u0443\u0431 \u0432 \u043C\u0435\u0441\u044F\u0446","\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0432\u0441\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 MakeTime.","\u041F\u043E\u0432\u044B\u0448\u0435\u043D \u0440\u0435\u0439\u0442\u0438\u043D\u0433 \u0438 \u043C\u043E\u0442\u0438\u0432\u0430\u0446\u0438\u044F.","\u0412\u044B\u0448\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u043A\u0438\u0435 \u043E\u0442\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u044F.",[2,"font-weight","600"],[4,"ngIf"],["src","/assets/img/take-pro/s3-p-1.png","alt",""],"\u0412\u043E\u0432\u043B\u0435\u0447\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432 \u0442\u0430\u0439\u043C-\u043C\u0435\u043D\u0435\u0434\u0436\u043C\u0435\u043D\u0442",["src","/assets/img/take-pro/s3-p-2.png","alt",""],"\u0412\u0441\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 MakeTime",["src","/assets/img/take-pro/s3-p-3.png","alt",""],"\u0412\u044B\u0448\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u043A\u0438\u0435 \u043E\u0442\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u044F",["src","/assets/img/take-pro/s3-p-4.png","alt",""],"PRO \u0441\u0442\u0430\u0442\u0443\u0441, \u043F\u043E\u0432\u044B\u0448\u0435\u043D \u0440\u0435\u0439\u0442\u0438\u043D\u0433",[1,"s4"],["src","/assets/img/take-pro/s4-rocket.svg","alt",""],"\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0443\u044F \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442," + "\ufffd#123\ufffd\ufffd/#123\ufffd" + "\u0432\u044B \u0434\u0435\u043B\u0430\u0435\u0442\u0435 \u0430\u043A\u0446\u0435\u043D\u0442 \u043D\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C","\u0438 \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442\u0435 \u0432 \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u0438 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B MakeTime." + "\ufffd#126\ufffd\ufffd/#126\ufffd" + "\u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0438\u043C \u0437\u0430 \u0432\u0430\u0448 \u0432\u044B\u0431\u043E\u0440!",["mat-raised-button","","disabled","true"],"" + "\ufffd#2\ufffd" + "" + "\ufffd/#2\ufffd" + " \u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D",[1,"fas","fa-check"],["mat-raised-button","",3,"click"],"\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C","" + "\ufffd#2\ufffd" + "" + "\ufffd/#2\ufffd" + " \u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D","\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C","\u041F\u0440\u043E\u0431\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434 7 \u0434\u043D\u0435\u0439.","\u041F\u0440\u043E\u0431\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434 \u0434\u043E ","\u041E\u043F\u043B\u0430\u0447\u0435\u043D \u0434\u043E "]},template:function(t,e){1&t&&(L.TgZ(0,"div",0),L.TgZ(1,"section",1),L.TgZ(2,"div",2),L.TgZ(3,"div"),L.SDv(4,3),L.qZA(),L.TgZ(5,"div"),L.SDv(6,4),L.qZA(),L.qZA(),L.TgZ(7,"div",5),L._UZ(8,"img",6),L.qZA(),L.qZA(),L.TgZ(9,"section",7),L.TgZ(10,"div",8),L.SDv(11,9),L.qZA(),L.TgZ(12,"div",10),L.TgZ(13,"div",11),L.TgZ(14,"div"),L._UZ(15,"img",12),L.qZA(),L.TgZ(16,"div"),L.SDv(17,13),L.qZA(),L.TgZ(18,"div"),L.SDv(19,14),L.qZA(),L.qZA(),L.TgZ(20,"div",11),L.TgZ(21,"div"),L._UZ(22,"img",15),L.qZA(),L.TgZ(23,"div"),L.SDv(24,16),L.qZA(),L.TgZ(25,"div"),L.SDv(26,17),L.qZA(),L.qZA(),L.TgZ(27,"div",11),L.TgZ(28,"div"),L._UZ(29,"img",18),L.qZA(),L.TgZ(30,"div"),L.SDv(31,19),L.qZA(),L.TgZ(32,"div"),L.SDv(33,20),L.qZA(),L.qZA(),L.qZA(),L.qZA(),L.TgZ(34,"section",21),L.TgZ(35,"div",8),L.SDv(36,22),L.qZA(),L.TgZ(37,"div",10),L.TgZ(38,"div",11),L.TgZ(39,"div",23),L.TgZ(40,"div",24),L._UZ(41,"img",25),L.qZA(),L.TgZ(42,"div",26),L.SDv(43,27),L.qZA(),L.TgZ(44,"div",28),L.YNc(45,F,3,0,"button",29),L.YNc(46,K,2,0,"button",30),L.qZA(),L.qZA(),L.TgZ(47,"div",31),L.TgZ(48,"div",32),L.SDv(49,33),L.qZA(),L.TgZ(50,"ul"),L.TgZ(51,"li"),L.SDv(52,34),L.qZA(),L.qZA(),L.qZA(),L.TgZ(53,"div",35),L.TgZ(54,"div",36),L.TgZ(55,"div",37),L._UZ(56,"img",38),L.qZA(),L.TgZ(57,"div",39),L.SDv(58,40),L.qZA(),L.qZA(),L.TgZ(59,"div",36),L.TgZ(60,"div",37),L._UZ(61,"img",38),L.qZA(),L.TgZ(62,"div",39),L.SDv(63,41),L.qZA(),L.qZA(),L.TgZ(64,"div",36),L.TgZ(65,"div",37),L._UZ(66,"img",38),L.qZA(),L.TgZ(67,"div",39),L.SDv(68,42),L.qZA(),L.qZA(),L.TgZ(69,"div",36),L.TgZ(70,"div",37),L._UZ(71,"img",38),L.qZA(),L.TgZ(72,"div",39),L.SDv(73,43),L.qZA(),L.qZA(),L.qZA(),L.qZA(),L.TgZ(74,"div",44),L.TgZ(75,"div",23),L.TgZ(76,"div",24),L._UZ(77,"img",45),L.qZA(),L.TgZ(78,"div",26),L.SDv(79,46),L.qZA(),L.TgZ(80,"div",28),L.YNc(81,V,3,0,"button",29),L.YNc(82,G,2,0,"button",30),L.qZA(),L.qZA(),L.TgZ(83,"div",31),L.TgZ(84,"div",32),L.SDv(85,47),L.qZA(),L.TgZ(86,"ul"),L.TgZ(87,"li"),L.SDv(88,48),L.qZA(),L.TgZ(89,"li"),L.SDv(90,49),L.qZA(),L.TgZ(91,"li"),L.SDv(92,50),L.qZA(),L.TgZ(93,"li",51),L.YNc(94,tt,2,0,"span",52),L.YNc(95,ct,6,8,"span",52),L.qZA(),L.qZA(),L.qZA(),L.TgZ(96,"div",35),L.TgZ(97,"div",36),L.TgZ(98,"div",37),L._UZ(99,"img",53),L.qZA(),L.TgZ(100,"div",39),L.SDv(101,54),L.qZA(),L.qZA(),L.TgZ(102,"div",36),L.TgZ(103,"div",37),L._UZ(104,"img",55),L.qZA(),L.TgZ(105,"div",39),L.SDv(106,56),L.qZA(),L.qZA(),L.TgZ(107,"div",36),L.TgZ(108,"div",37),L._UZ(109,"img",57),L.qZA(),L.TgZ(110,"div",39),L.SDv(111,58),L.qZA(),L.qZA(),L.TgZ(112,"div",36),L.TgZ(113,"div",37),L._UZ(114,"img",59),L.qZA(),L.TgZ(115,"div",39),L.SDv(116,60),L.qZA(),L.qZA(),L.qZA(),L.qZA(),L.qZA(),L.qZA(),L.TgZ(117,"section",61),L.TgZ(118,"div"),L._UZ(119,"img",62),L.qZA(),L.TgZ(120,"div",39),L.TgZ(121,"div"),L.tHW(122,63),L._UZ(123,"br"),L.N_p(),L.qZA(),L.TgZ(124,"div"),L.tHW(125,64),L._UZ(126,"br"),L.N_p(),L.qZA(),L.qZA(),L.qZA(),L.qZA()),2&t&&(L.xp6(45),L.Q6J("ngIf",!e.commonService.user.pro),L.xp6(1),L.Q6J("ngIf",e.commonService.user.pro),L.xp6(35),L.Q6J("ngIf",e.commonService.user.pro),L.xp6(1),L.Q6J("ngIf",!e.commonService.user.pro),L.xp6(12),L.Q6J("ngIf",!e.commonService.user.pro_status),L.xp6(1),L.Q6J("ngIf",e.commonService.user.pro_status))},directives:[J.O5,W.lW],pipes:[X.A],styles:['.page[_ngcontent-%COMP%]{font-style:normal}.page[_ngcontent-%COMP%], .page[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-family:Montserrat}.page[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-weight:900}.s1[_ngcontent-%COMP%]{display:flex;text-align:left}.s1[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]{margin-right:4rem}.s1[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:first-child{font-weight:900;font-size:17px;line-height:26px;text-transform:uppercase;margin-top:2rem;color:#1f1f1f}.s1[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:last-child{font-size:17px;line-height:24px;color:#343434;margin-top:1rem}.separator[_ngcontent-%COMP%]{font-weight:900;font-size:17px;line-height:24px;text-transform:uppercase;color:#1f1f1f;display:flex;align-items:center;text-align:center}.s2[_ngcontent-%COMP%]   .separator[_ngcontent-%COMP%]:before{content:"";flex:1;border-bottom:1px solid hsla(206,9%,85%,.5);margin-right:2rem}.s2[_ngcontent-%COMP%]{margin-top:65px}.s2[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]{display:flex;justify-content:space-between;margin-top:40px}.card[_ngcontent-%COMP%]{background:#fff;box-shadow:0 15px 25px rgba(0,0,0,.08);border-radius:20px;width:230px}.s2[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:first-child   img[_ngcontent-%COMP%]{margin:8px}.s2[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2){font-weight:700;font-size:14px;line-height:15px;text-align:center;letter-spacing:.005em;text-transform:uppercase;color:#1f1f1f;margin-bottom:13px;margin-top:10px}.s2[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3){font-weight:300;font-size:14px;line-height:21px;text-align:center;color:#000;margin-bottom:25px;padding:0 10px}.s3[_ngcontent-%COMP%]   .separator[_ngcontent-%COMP%]{margin:70px 0 40px}.s3[_ngcontent-%COMP%]   .separator[_ngcontent-%COMP%]:after{content:"";flex:1;border-bottom:1px solid hsla(206,9%,85%,.5);margin-left:2rem}.s3[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.s3[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{width:375px;text-align:left;padding:20px;box-sizing:border-box}.s3[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%]{display:flex}.s3[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%]   .type[_ngcontent-%COMP%]{font-weight:900;font-size:12px;line-height:15px;padding-top:20px;padding-left:10px;color:#1f1f1f}.s3[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{height:120px}.s3[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]{padding-top:20px}.s3[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-weight:700;letter-spacing:.005em;color:#ff5249;font-size:14px;line-height:27px;margin:3px 0}.s3[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{margin:0;padding-left:20px;list-style:none}.s3[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-weight:400;font-size:12px;line-height:17px;color:#343434}.s3[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:before{content:"\\2022";color:#ff5249;font-weight:700;display:inline-block;width:16px;margin-left:-16px}.s3[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]{display:flex;justify-content:space-between;flex-wrap:wrap}.s3[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]{background:#e7edf0;border:1px solid #dee7eb;box-sizing:border-box;border-radius:5px;padding:10px 5px 0;width:162px;height:90px}.s3[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]:first-child, .s3[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]:nth-child(2){margin-bottom:11px}.s3[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]   .img[_ngcontent-%COMP%]{text-align:center;margin-bottom:7px}.s3[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{font-weight:700;font-size:11px;line-height:15px;text-align:center;color:#5c5c5c}.s3[_ngcontent-%COMP%]   .card.pro[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]{background-color:#fe4f48}.s3[_ngcontent-%COMP%]   .card.pro[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{color:#fff}.s3[_ngcontent-%COMP%]   .card.pro[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]:not(:nth-child(4))   img[_ngcontent-%COMP%]{position:relative;top:2px}.s3[_ngcontent-%COMP%]   .card.pro[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]{margin-left:auto;position:relative}.s3[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.pro)   .action-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not([disabled]){font-weight:500}.s3[_ngcontent-%COMP%]   .card.pro[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not([disabled]){background:#00a0e3;box-shadow:0 4px 8px rgba(0,160,227,.29),inset 0 -1px 2px hsla(0,0%,100%,.3);color:#fff}.s3[_ngcontent-%COMP%]   .card.pro[_ngcontent-%COMP%]   .type[_ngcontent-%COMP%]{margin-top:9px}.s4[_ngcontent-%COMP%]{text-align:center;margin-top:100px;position:relative;margin-bottom:40px}.s4[_ngcontent-%COMP%]:after{content:"";display:block;position:absolute;top:0;left:0;background:url(/assets/img/take-pro/s4-bg.svg) no-repeat top;width:100%;height:100%;opacity:1;z-index:0}.s4[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{margin-top:10px}.s4[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:first-child{font-weight:700;font-size:16px;line-height:22px;text-align:center;text-transform:uppercase;color:#1f1f1f}.s4[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2){font-size:15px;line-height:22px}.s4[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:relative;top:-13px;z-index:1}@media only screen and (max-width:950px){.s3[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]{align-items:center;flex-direction:column-reverse}.s3[_ngcontent-%COMP%]   .card.pro[_ngcontent-%COMP%]{margin-bottom:1rem}}@media only screen and (max-width:780px){.s2[_ngcontent-%COMP%]   .cards[_ngcontent-%COMP%]{flex-direction:column;align-items:center}.s2[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{margin-bottom:1rem;width:375px}}']}),it)}],rt=function(){var t=function t(){I(this,t)};return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=L.oAB({type:t}),t.\u0275inj=L.cJS({imports:[[j.Bz.forChild(gt)],j.Bz]}),t}(),st=R(8091),dt=((at=function t(){I(this,t)}).\u0275fac=function(t){return new(t||at)},at.\u0275mod=L.oAB({type:at}),at.\u0275inj=L.cJS({imports:[[Y.u5,J.ez,rt,W.ot,Y.u5,st.m]]}),at)}}])}();