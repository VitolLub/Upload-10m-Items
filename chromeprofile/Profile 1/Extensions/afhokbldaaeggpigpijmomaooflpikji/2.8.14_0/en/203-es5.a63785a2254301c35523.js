!function(){var e,t,i;function n(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(self.webpackChunkangular_newtab=self.webpackChunkangular_newtab||[]).push([[203],{66203:function(o,s,c){"use strict";c.r(s),c.d(s,{SupportModule:function(){return S}});var l=c(55109),f=c(36278),u=c(67563),m=c(31759),d=c(40485),p=c(42304),g=c(33960),h=c(88269),v=c(82758),b=c(19014),Z=c(90095),_=c(82181),A=c(35899),q=function(e){return["getAttach",e,"name"]};function w(e,t){if(1&e){var i=p.EpF();p.TgZ(0,"div",13),p.TgZ(1,"span",14),p._uU(2),p.ALo(3,"callbackPipe"),p.qZA(),p.TgZ(4,"i",15),p.NdJ("click",function(){return p.CHM(i),p.oxw().file=null}),p.qZA(),p.qZA()}if(2&e){var n=p.oxw();p.xp6(2),p.Oqu(p.xi3(3,1,n.file.name,p.VKq(4,q,n.file.name)))}}var x,k,T=[{path:"",component:(x=function(){function e(t,i,n,r,o){a(this,e),this.commonService=t,this._formBuilder=i,this.router=n,this._snackBar=r,this.cdr=o,this.getAttach=m.PY,this._send_progress=!1,this.messageForm=this._formBuilder.group({message:["",f.kI.required]})}var t,i,n;return t=e,(i=[{key:"messageSubmit",value:function(){var e=this;if(!this.messageForm.invalid){var t=new FormData;t.append("message",this.messageForm.get("message").value),this.file&&(this.file.size?t.append("file",this.file):this.file.name&&t.append("file",this.file.name)),this._send_progress=!0,this.commonService.createRequest("post","dialogs/create-support-message",t).toPromise().then(function(t){e._send_progress=!1,t.dialog_id&&e.router.navigate(["/dialogs/"+t.dialog_id])}).catch(function(){e._send_progress=!1})}}},{key:"onFileSelected",value:function(){var e=document.querySelector("#file");e.files[0]&&(e.files[0].size>5e6?(this.file=null,this._snackBar.open(d.max_file_size_error,null,{verticalPosition:"top",duration:3e3})):this.file=e.files[0]),this.cdr.detectChanges()}}])&&r(t.prototype,i),n&&r(t,n),e}(),x.\u0275fac=function(e){return new(e||x)(p.Y36(g.v),p.Y36(f.qu),p.Y36(u.F0),p.Y36(h.ux),p.Y36(p.sBO))},x.\u0275cmp=p.Xpm({type:x,selectors:[["ng-component"]],decls:16,vars:4,consts:function(){return[[1,"page"],[1,"title"],"Contacting support",[1,"example-form",2,"display","flex","flex-direction","column",3,"formGroup","submit"],[2,"width","80%"],["matInput","","formControlName","message","placeholder","Your message","matTextareaAutosize","true","maxlength","3000"],["matSuffix",""],[1,"fas","fa-paperclip","a-icon",3,"click"],["hidden","","type","file","id","file",3,"change"],["fileInput",""],["class","upload-filename",4,"ngIf"],["mat-raised-button","","color","primary",3,"disabled","showLoader"],"Send",[1,"upload-filename"],[1,"name"],[1,"fas","fa-times","a-icon",3,"click"]]},template:function(e,t){if(1&e){var i=p.EpF();p.TgZ(0,"div",0),p.TgZ(1,"div",1),p.TgZ(2,"h2"),p.SDv(3,2),p.qZA(),p.qZA(),p.TgZ(4,"div"),p.TgZ(5,"form",3),p.NdJ("submit",function(){return t.messageSubmit()}),p.TgZ(6,"mat-form-field",4),p._UZ(7,"textarea",5),p.TgZ(8,"span",6),p.TgZ(9,"i",7),p.NdJ("click",function(){return p.CHM(i),p.MAs(11).click()}),p.qZA(),p.qZA(),p.qZA(),p.TgZ(10,"input",8,9),p.NdJ("change",function(){return t.onFileSelected()}),p.qZA(),p.YNc(12,w,5,6,"div",10),p.TgZ(13,"div"),p.TgZ(14,"button",11),p.SDv(15,12),p.qZA(),p.qZA(),p.qZA(),p.qZA(),p.qZA()}2&e&&(p.xp6(5),p.Q6J("formGroup",t.messageForm),p.xp6(7),p.Q6J("ngIf",t.file),p.xp6(2),p.Q6J("disabled",!t.messageForm.get("message").value||t._send_progress)("showLoader",t._send_progress))},directives:[f._Y,f.JL,f.sg,v.KE,b.Nt,f.Fj,b.D7,f.JJ,f.u,f.nD,v.R9,l.O5,Z.lW,_.n],pipes:[A.A],styles:[".page[_ngcontent-%COMP%]{text-align:left}.fa-times[_ngcontent-%COMP%]{margin-left:.5rem}.upload-filename[_ngcontent-%COMP%]{margin-bottom:1rem;font-size:.9rem}"]}),x)}],y=function(){var e=function e(){a(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=p.oAB({type:e}),e.\u0275inj=p.cJS({imports:[[u.Bz.forChild(T)],u.Bz]}),e}(),z=c(8091),S=((k=function e(){a(this,e)}).\u0275fac=function(e){return new(e||k)},k.\u0275mod=p.oAB({type:k}),k.\u0275inj=p.cJS({imports:[[f.u5,l.ez,y,Z.ot,f.UX,f.u5,b.c,z.m]]}),k)}}])}();