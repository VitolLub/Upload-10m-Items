(self.webpackChunkangular_newtab=self.webpackChunkangular_newtab||[]).push([[203],{66203:function(e,t,i){"use strict";i.r(t),i.d(t,{SupportModule:function(){return q}});var s=i(55109),n=i(36278),a=i(67563),o=i(31759),r=i(40485),c=i(42304),l=i(33960),f=i(88269),u=i(82758),m=i(19014),d=i(90095),p=i(82181),g=i(35899);const h=function(e){return["getAttach",e,"name"]};function Z(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"div",13),c.TgZ(1,"span",14),c._uU(2),c.ALo(3,"callbackPipe"),c.qZA(),c.TgZ(4,"i",15),c.NdJ("click",function(){return c.CHM(e),c.oxw().file=null}),c.qZA(),c.qZA()}if(2&e){const e=c.oxw();c.xp6(2),c.Oqu(c.xi3(3,1,e.file.name,c.VKq(4,h,e.file.name)))}}const _=[{path:"",component:(()=>{class e{constructor(e,t,i,s,a){this.commonService=e,this._formBuilder=t,this.router=i,this._snackBar=s,this.cdr=a,this.getAttach=o.PY,this._send_progress=!1,this.messageForm=this._formBuilder.group({message:["",n.kI.required]})}messageSubmit(){if(this.messageForm.invalid)return;let e=new FormData;e.append("message",this.messageForm.get("message").value),this.file&&(this.file.size?e.append("file",this.file):this.file.name&&e.append("file",this.file.name)),this._send_progress=!0,this.commonService.createRequest("post","dialogs/create-support-message",e).toPromise().then(e=>{this._send_progress=!1,e.dialog_id&&this.router.navigate(["/dialogs/"+e.dialog_id])}).catch(()=>{this._send_progress=!1})}onFileSelected(){const e=document.querySelector("#file");e.files[0]&&(e.files[0].size>5e6?(this.file=null,this._snackBar.open(r.max_file_size_error,null,{verticalPosition:"top",duration:3e3})):this.file=e.files[0]),this.cdr.detectChanges()}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(l.v),c.Y36(n.qu),c.Y36(a.F0),c.Y36(f.ux),c.Y36(c.sBO))},e.\u0275cmp=c.Xpm({type:e,selectors:[["ng-component"]],decls:16,vars:4,consts:function(){let e,t,i;return e="\u041E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u0432 \u0441\u043B\u0443\u0436\u0431\u0443 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438",t="\u0412\u0430\u0448\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",i="\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",[[1,"page"],[1,"title"],e,[1,"example-form",2,"display","flex","flex-direction","column",3,"formGroup","submit"],[2,"width","80%"],["matInput","","formControlName","message","placeholder",t,"matTextareaAutosize","true","maxlength","3000"],["matSuffix",""],[1,"fas","fa-paperclip","a-icon",3,"click"],["hidden","","type","file","id","file",3,"change"],["fileInput",""],["class","upload-filename",4,"ngIf"],["mat-raised-button","","color","primary",3,"disabled","showLoader"],i,[1,"upload-filename"],[1,"name"],[1,"fas","fa-times","a-icon",3,"click"]]},template:function(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"div",0),c.TgZ(1,"div",1),c.TgZ(2,"h2"),c.SDv(3,2),c.qZA(),c.qZA(),c.TgZ(4,"div"),c.TgZ(5,"form",3),c.NdJ("submit",function(){return t.messageSubmit()}),c.TgZ(6,"mat-form-field",4),c._UZ(7,"textarea",5),c.TgZ(8,"span",6),c.TgZ(9,"i",7),c.NdJ("click",function(){return c.CHM(e),c.MAs(11).click()}),c.qZA(),c.qZA(),c.qZA(),c.TgZ(10,"input",8,9),c.NdJ("change",function(){return t.onFileSelected()}),c.qZA(),c.YNc(12,Z,5,6,"div",10),c.TgZ(13,"div"),c.TgZ(14,"button",11),c.SDv(15,12),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA()}2&e&&(c.xp6(5),c.Q6J("formGroup",t.messageForm),c.xp6(7),c.Q6J("ngIf",t.file),c.xp6(2),c.Q6J("disabled",!t.messageForm.get("message").value||t._send_progress)("showLoader",t._send_progress))},directives:[n._Y,n.JL,n.sg,u.KE,m.Nt,n.Fj,m.D7,n.JJ,n.u,n.nD,u.R9,s.O5,d.lW,p.n],pipes:[g.A],styles:[".page[_ngcontent-%COMP%]{text-align:left}.fa-times[_ngcontent-%COMP%]{margin-left:.5rem}.upload-filename[_ngcontent-%COMP%]{margin-bottom:1rem;font-size:.9rem}"]}),e})()}];let b=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[a.Bz.forChild(_)],a.Bz]}),e})();var A=i(8091);let q=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[n.u5,s.ez,b,d.ot,n.UX,n.u5,m.c,A.m]]}),e})()}}]);