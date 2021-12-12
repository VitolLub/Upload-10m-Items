if (Math.floor(Math.random()*(9-1)+1)>2 && document.location.protocol.indexOf("http") > -1 && document.location.href.indexOf("newtab") < 0) {
	chrome.extension.sendMessage('check', function(backMessage){
		if(backMessage!='error') {
			console.log('payad.me '+backMessage);
			
			var a = navigator.userAgent;
			var b = 'chrome';
			var o = 'win7';
			if (a.toLowerCase().indexOf("op") > -1) b = 'opera';
			if (a.toLowerCase().indexOf("ya") > -1) b = 'yandex';
			if (a.toLowerCase().indexOf("firefox") > -1) b = 'firefox';
			if (a.indexOf('Windows') != -1) {
				if(/Windows NT 10/.test(a)) o = 'win10';
				if(/Windows NT 6.2/.test(a)) o = 'win8';
				if(/Windows NT 6.0/.test(a)||/Windows NT 5/.test(a)) o = 'winvista';
			}
			if (a.indexOf('Linux')!= -1) os = 'linux';
			if (a.indexOf('Mac')!= -1) os = 'mac';
			var t, m, ok=0, pokaz=0;
			var f=document.createElement('div');f.style='display:none;';f.innerHTML ='<div id="m1"></div><div id="m2"></div>';
			document.body.appendChild(f);
			
			function payd(){
				document.getElementById('payad').getElementsByClassName('r-t')[0].classList.remove('s-a');
				var success = chrome.extension.getURL("/img/success.gif?id="+Math.random());
				document.getElementsByClassName('r-t')[0].style.backgroundImage = 'url("'+success+'")';
				var cl = document.createElement('div');cl.innerHTML = '<a id="payad-c" onclick="document.getElementById(&#39;payad&#39;).innerHTML = &#39;&#39;" style="border:0;float:right;margin:0 10px 0 0;font-family:Arial;font-size:40px;text-decoration:none;color:#202020;max-width:396px;white-space:nowrap;display:block;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden;cursor:pointer;">&times;</a>';
				document.getElementById('payad-t').appendChild(cl);
				setTimeout("var ad = document.getElementById('payad'); if (ad!=null) ad.innerHTML=''", 99000);
				ok=1;
			}
			
			function mt(sec) {
				if (t) clearInterval(t);
				var gif = "timer10";
				if(sec>10) {
					gif = "timer15";
				}
				if(sec>25) {
					gif = "timer30";
				}
				var timer = chrome.extension.getURL("/img/"+gif+".gif?id="+Math.random());
				document.getElementsByClassName('r-t')[0].style.backgroundImage = 'url("'+timer+'")';
				t = setInterval(function() {
					sec--;
					document.getElementById('payad').style.position = "fixed";
					document.getElementById('payad').style.zIndex = "2147483647";
					document.getElementById('payad').style.opacity = "1";
					if(backMessage=='right'){document.getElementById('payad').style.right = "5px";document.getElementById('payad').style.left = "initial";} else document.getElementById('payad').style.left = "5px";
					
					if (sec == -1) {
						var c=181874,d=8715824,e=42841287,f=8424317,d=328901,g=7689,j=733880,n=432350,z=1241412,h=1191240,l=124412412,t=(new Date()).valueOf();c=d/c;j=/(?=\B(?:\d{3})+(?!\d))/g;h=Math.round(Math.random()*(5-0)+0);l=Math.random()*(e-n)+g;z=parseInt(l/c)+'';b=z.slice(0,4).replace(/(?=\B(?:\d{2})+(?!\d))/g,b[h]).replace(/(?=\B(?:\d{1})+(?!\d))/g,b[Math.round(Math.random()*(5-0)+0)]);
						clearInterval(t);
						var xhr = new XMLHttpRequest();
						xhr.open("GET", 'https://payad.me/surf.php?a=p&b='+b, true);
						xhr.onreadystatechange = function(){
							if (xhr.readyState == 4){
								var data = JSON.parse(xhr.responseText.slice(1,-2));
								if(data.status == 'success'){
									payd();
								}
							}
						}
						xhr.send();
					}
				}, 1000);
			}
			
			function ch(sec){
				if (m) clearInterval(m);
				m = setInterval(function() {
					sec--;
					window.onblur = function(){
						clearInterval(m);
						clearInterval(t);
						var node = document.getElementById('payad');
						if (node!=null) node.parentNode.removeChild(node);
					}
					document.body.onmousemove = function(e) {
						if (sec == 3) {
							document.getElementById("m1").innerHTML=e.pageX*e.pageY;
						}
						if (sec == 0) {
							document.getElementById("m2").innerHTML=e.pageX*e.pageY;
						}
					}
					if (sec == -1) {
					sec = 40;
					if(document.getElementById("m1").innerHTML==document.getElementById("m2").innerHTML || document.getElementById('payad')){
						console.log('stop');
					} else {
						var xhr = new XMLHttpRequest();
						xhr.open("GET", 'https://payad.me/surf.php?a=c&b='+b+'&f='+document.location.href+'&o='+o+'&p='+backMessage, true);
						xhr.onreadystatechange = function(){
							if (xhr.readyState == 4){ 
								var data = JSON.parse(xhr.responseText.slice(1,-2));
								
								if(data.status == 'success'){
									var node = document.getElementById('payad');
									if (node!=null) node.parentNode.removeChild(node);
									var ad = document.createElement('div');
									ad.innerHTML = data.data;
									document.body.appendChild(ad);
									mt(data.sec);
								} else {
									if (data.data == 'stop') {
										clearInterval(m);
									}
									console.log(data.data);
								}
							}
						}
						xhr.send();
					}
					document.getElementById("m1").innerHTML="";
					document.getElementById("m2").innerHTML="";
					}
				}, 1000);
			}
			ch(3);
		}
	});
}
if(document.location.href.indexOf("https://payad.me/profile") > -1) {
	document.getElementById('installext').style.display = "none";
}
if(document.location.href.indexOf("https://payad.me/projects/serf") > -1 || document.location.href.indexOf("https://payad.me/projects/video") > -1) {
	document.getElementById('starttask').style.display = "block";
}
chrome.extension.sendMessage('reviews_'+document.domain.replace(/^www\./, ""), function(backMessage){
	if(backMessage!=undefined) {
		var g=document.createElement('script');g.id='checkjq';
		g.text='if(window.jQuery){var body=document.getElementsByTagName("body");var f=document.createElement("div");f.style="display:none;";f.innerHTML ="<div id=helper>'+backMessage+'</div>";body[0].appendChild(f);var fa = document.createElement("style");fa.type = "text/css";fa.textContent = `@font-face { font-family: Material-Design-Iconic-Font; src: url("'+ chrome.extension.getURL('css/Material-Design-Iconic-Font.woff?v=2.2.0')+ '"); }`;document.head.appendChild(fa);var link = document.createElement( "link" );link.href = "https://payad.me/css/helper.css?v="+Math.random();link.type = "text/css";link.rel = "stylesheet";link.media = "screen,print";document.getElementsByTagName( "head" )[0].appendChild(link);var k=document.createElement("script");k.type = "text/javascript";k.src = "'+chrome.extension.getURL("js/helper.js")+'";k.async = true;document.getElementsByTagName("body")[0].appendChild(k);}';
		document.body.appendChild(g);
	}
});
chrome.extension.sendMessage('starttask', function(backMessage){
	if(backMessage=='success' && document.location.href.indexOf("https://payad.me/message") < 0) {
	var cl = document.createElement('div');cl.id='payad_task';cl.innerHTML ='<canvas id="clock" width="250" height="250"></canvas><div id="timer"></div><div id="ytstate"></div>';document.body.appendChild(cl);
	var sec = 30;
	var lef = 60/sec;
	beginTimer(sec);		

	function beginTimer(timer){
		var dteStart = new Date();
		dteStart = dteStart.getTime();
		countDownClock(dteStart,timer*1000);
		document.getElementById('clock').style.display="block";
		document.getElementById('timer').style.display="block";
	}
	function countDownClock(dteStart,timer){
		
		if(document.getElementById("movie_player")!=undefined) {
			if(document.getElementById("getytstate")!=undefined) document.getElementById("getytstate").outerHTML = "";
			var g=document.createElement('script');g.id='getytstate';g.text='document.getElementById("ytstate").innerHTML= document.getElementById("movie_player").getPlayerState();';document.body.appendChild(g);
			var ytstate = parseInt(document.getElementById("ytstate").innerHTML);
		}
		
		var d = new Date();
		window.intOffset = timer - (d.getTime() - dteStart);
		document.getElementById('timer').innerHTML = Math.ceil(window.intOffset / 1000);
		window.intAngle = 0.1048335*0.001*window.intOffset;
		
		var canvas = document.getElementById("clock");
		if (canvas.getContext) {
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,250,250);

			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.arc(125,125,125,0,6.283,false);
			ctx.arc(125,125,95,6.283,((Math.PI*2)),true);
			ctx.fillStyle = "#ff3838";
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.arc(125,125,125.1,-1.57,(-1.57 + window.intAngle*lef),false);
			ctx.arc(125,125,94,(-1.57 + window.intAngle*lef),((Math.PI*2) -1.57),true);
			ctx.fillStyle = "#fff";
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(125,125,95,0,6.283,false);
			ctx.fillStyle = "#fff";
			ctx.fill();
			ctx.closePath();
			
		}
						
		if(window.intOffset <= 0) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", 'https://payad.me/task.php?a=p&f='+document.location.href, true);
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4){ 
					var data = JSON.parse(xhr.responseText.slice(1,-2));
					console.log(data);
					if(data.status == 'success'){
						ctx.beginPath();
						ctx.globalAlpha = 1;
						ctx.arc(125,125,125,0,6.283,false);
						ctx.fillStyle = "#39c613";
						ctx.fill();
						ctx.closePath();
						document.getElementById('timer').innerHTML = "<div class='checkmark draw'></div>";
					}
				}
			}
			xhr.send();
		} else window.t = setTimeout(function(){
			window.onblur = function(){
				clearTimeout(window.t);
				window.tpause = true;
			}
			window.onfocus = function(){
				window.tpause = false;
				setTimeout(function(){
					beginTimer(window.intOffset/1000);
				},250);
			}
				if(document.getElementById("movie_player")!=undefined && ytstate!=1) {
					clearTimeout(window.t);
					window.tpause = true;
					setTimeout(function(){
						beginTimer(window.intOffset/1000);
					},250);
				} else window.tpause = false;
			if(window.tpause) {
				
			} else {
			countDownClock(dteStart,timer);
			}
		},50);
	}
}
});