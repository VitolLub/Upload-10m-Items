$(document).ready(function () {
function checksetting() {
	if (localStorage['helper']==null) localStorage['helper']=1;
	if (localStorage['push']==null) localStorage['push']=1;
	if (localStorage['power']>0) {
		$('#s3').prop('checked', true);
		$('#poweryes').prop('checked', true);
		chrome.browserAction.setIcon({path : {"19": "img/icon19.png"}});
	} else {
		$('#s3').prop('checked', false);
		$('#powerno').prop('checked', true);
		chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
	}
	if (localStorage['area']=='right') {
		$('#rightarea').prop('checked', true);
	} else {
		$('#leftarea').prop('checked', true);
	}
	if (localStorage['helper']>0) {
		$('#helperyes').prop('checked', true);
	} else {
		$('#helperno').prop('checked', true);
	}
	if (localStorage['push']>0) {
		$('#pushyes').prop('checked', true);
	} else {
		$('#pushno').prop('checked', true);
	}
}
function timer(){
	localStorage['lastsec'] = localStorage['lastsec'] - 100;
	if(localStorage['lastsec']==0){$('#refresh').removeClass('disabled');}
	else{setTimeout(timer,1000);}
}
function refresh(){
	checksetting();
	var req = new XMLHttpRequest();
    req.open("GET", 'https://payad.me/ext.php', true);
    req.onload = function( e ) {
		var usr = e.target.responseText;
		if (JSON.parse(usr).status == 'success') {
			$('#pamprof-info').show();
			$('#pamprof-stats').show();
			$('#pamprof-stats .statistic').show();
			$('#pamprof-edit').show();
			$('.slider-v2').show();
			$('#logingout').show();
			$('#pamprof-stats .setting').hide();
			$('.btn-group').show();	
			$('#loginform').hide();
			$('.Cube').hide();
			$('h2.title').html(JSON.parse(usr).name);
			$('#pamprof-balance a').html(JSON.parse(usr).balance);
			$('#pamprof-balance-stat .lastpay').html(JSON.parse(usr).lastpay);
			$('#pamprof-balance-stat .zarabotano_seg').html(JSON.parse(usr).zarabotano_seg);
			$('#pamprof-balance-stat .zarefov').html(JSON.parse(usr).zarefov);
			$('#pamprof-balance-stat .zarabotano').html(JSON.parse(usr).zarabotano);
			$('#pamprof-balance-stat .prosmotrov').html(JSON.parse(usr).prosmotrov);
			$('.pamprof-location').html(JSON.parse(usr).location);
			$('.pamprof-gender').html(JSON.parse(usr).gender);
			$('#pamprof-image img').attr('src', JSON.parse(usr).img);
			$('#logingout').attr('href', 'https://payad.me/auth?out=1&x='+JSON.parse(usr).x);
			$('#s3').attr('checked', true);
			localStorage['reviews_update'] = (new Date()).valueOf();
			$.each(JSON.parse(usr).reviews, function(k,v) {
				localStorage['reviews_'+v.page_alias+'_update'] = localStorage['reviews_update'];
				localStorage['reviews_'+v.page_alias] = v.page_id;
			});
		}
		if (JSON.parse(usr).status == 'error') {
			chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
			$('h2.title').html('Ошибка');
			$('#loginform').hide();
			$('#pamprof-edit').hide();
			$('.slider-v2').hide();
			$('#logingout').hide();
			$('.btn-group').hide();
			$('#pamprof-info').show();
			$('#pamprof-info').html('<div class="alert alert-error" style="margin:0!important;padding:8px 14px;text-align:justify;">Для работы расширения необходимо полностью заполнить свой профиль: <a target="_blank" href="https://payad.me/profile/settings">Заполнить профиль</a>.</div>');
		}
		if (JSON.parse(usr).status == 'fail') {
			chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
			$('#rusername').val(localStorage['payadlogin']);
			$('#rpassword').val(localStorage['payadpass']);
			$('input[name=x]').val(JSON.parse(usr).x);
			$('input[name=key]').val(JSON.parse(usr).key);
			$('h2.title').html('Авторизация');
			$('#pamprof-stats .setting').hide();
			$('#pamprof-info').hide();
			$('#pamprof-stats').hide();
			$('.btn-group').hide();	
			$('.Cube').hide();
			$('#loginform').show();
			$('#pamprof-edit').hide();
			$('.slider-v2').hide();
			$('#logingout').hide();
		}
	}
	req.send(null);
}
checksetting();
var version = 118;
var req = new XMLHttpRequest();
    req.open("GET", 'https://payad.me/ext.php', true);
    req.onload = function( e ) {
		var usr = e.target.responseText;
		if(localStorage['power']>0) {
			chrome.browserAction.setIcon({path : {"19": "img/icon19.png"}});
		} else {
			localStorage['power'] = 0;
			chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
		}
		if (version < JSON.parse(usr).version) {
			$('#oldversion').show();
		}
		if (JSON.parse(usr).txt !='') {
			$('#txt').html(JSON.parse(usr).txt);
			$('#txt').show();
		}
		if (localStorage['lastsec']>0) {
			$('#refresh').addClass('disabled');
			setTimeout(timer,localStorage['lastsec']);
		}
		if (JSON.parse(usr).status == 'success') {
			$('h2.title').html(JSON.parse(usr).name);
			$('#pamprof-info').show();
			$('#pamprof-stats').show();
			$('#pamprof-balance a').html(JSON.parse(usr).balance);
			$('#pamprof-balance-stat .lastpay').html(JSON.parse(usr).lastpay);
			$('#pamprof-balance-stat .zarabotano_seg').html(JSON.parse(usr).zarabotano_seg);
			$('#pamprof-balance-stat .zarefov').html(JSON.parse(usr).zarefov);
			$('#pamprof-balance-stat .zarabotano').html(JSON.parse(usr).zarabotano);
			$('#pamprof-balance-stat .prosmotrov').html(JSON.parse(usr).prosmotrov);
			$('.pamprof-location').html(JSON.parse(usr).location);
			$('.pamprof-gender').html(JSON.parse(usr).gender);
			$('#pamprof-image img').attr('src', JSON.parse(usr).img);
			localStorage['reviews_update'] = (new Date()).valueOf();
			$.each(JSON.parse(usr).reviews, function(k,v) {
				localStorage['reviews_'+v.page_alias+'_update'] = localStorage['reviews_update'];
				localStorage['reviews_'+v.page_alias] = v.page_id;
			});
		}
		if (JSON.parse(usr).status == 'error') {
			chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
			$('h2.title').html('Ошибка');
			$('#loginform').hide();
			$('#pamprof-edit').hide();
			$('.slider-v2').hide();
			$('#logingout').hide();
			$('.btn-group').hide();
			$('#pamprof-info').show();
			$('#pamprof-info').html('<div class="alert alert-error" style="margin:0!important;padding:8px 14px;text-align:justify;">Для работы расширения необходимо полностью заполнить свой профиль: <a target="_blank" href="https://payad.me/profile/settings">Заполнить профиль</a>.</div>');
		}
		if (JSON.parse(usr).status == 'fail') {
			chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
			$('#rusername').val(localStorage['payadlogin']);
			$('#rpassword').val(localStorage['payadpass']);
			$('input[name=x]').val(JSON.parse(usr).x);
			$('input[name=key]').val(JSON.parse(usr).key);
			$('h2.title').html('Авторизация');
			$('#pamprof-stats .setting').hide();
			$('#pamprof-info').hide();
			$('#pamprof-stats').hide();
			$('.btn-group').hide();	
			$('.Cube').hide();
			$('#loginform').show();
			$('#pamprof-edit').hide();
			$('.slider-v2').hide();
			$('#logingout').hide();
		}
		$('#logingout').attr('href', 'https://payad.me/auth?out=1&x='+JSON.parse(usr).x); 
		$('.Cube').hide();
		$('.btn-group').show();
    }
	req.send(null);

$('#s3').change(function() {
    if($(this).is(":checked")) {
        localStorage['power'] = 1;
		$('#poweryes').prop('checked', true);
		chrome.browserAction.setIcon({path : {"19": "img/icon19.png"}});
    } else {
		localStorage['power'] = 0;
		$('#powerno').prop('checked', true);
		chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
	}
});
$('#pamprof-edit').click(function(){
	$('h2.title').html('<span class="pamicons">0</span>Настройки');
	$('.statistic').hide();
	$('#pamprof-info').hide();
	$('.btn-group').hide();
	checksetting();
	$('.setting').show();
});
$('#save-setting').click(function(){
	localStorage['power'] = $('input[name=power]:checked').val();
	localStorage['area'] = $('input[name=area]:checked').val();
	localStorage['helper'] = $('input[name=helper]:checked').val();
	localStorage['push'] = $('input[name=push]:checked').val();
	refresh();
});
$('#cancel-setting').click(function(){
	refresh();
});
$('#logingout').click(function(){
	xhr = new XMLHttpRequest();
	xhr.open("GET", $(this).attr("href"), true);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) 
		{
			if (xhr.responseText) 
			{
				refresh();
				$('#userauthbutton').attr('disabled', false);
			}
		}
	}
});
$('#rpassword-eye').click(function() {
	if ($('input[name=rpassword]').attr('type') == 'password') {
		$('input[name=rpassword]').prop('type', 'text');
		$('input[name=rpassword]').parent('div').find('.password-eye').addClass('password-eye-open');
	} else {
		$('input[name=rpassword]').prop('type', 'password');
		$('input[name=rpassword]').parent('div').find('.password-eye').removeClass('password-eye-open');
	}
});
$('#userauthbutton').click(function(){
		var rusername = $('#rusername').val();
		var rpassword = $('#rpassword').val();
		var x = $('input[name=x]').val();
		var key = $('input[name=key]').val();
		$('.errors_container').html('').addClass('hide');
		if(!rusername && !rpassword){
			$('#rpassword').val('').attr('type', 'password').parent('div').find('.password-eye').removeClass('password-eye-open');
			$('.errors_container').removeClass('hide');
			$('.errors_container').append('Пожалуйста, укажите свой email');
		}
		if(!rusername && rpassword){
			$('#rpassword').val('').attr('type', 'password').parent('div').find('.password-eye').removeClass('password-eye-open');
			$('.errors_container').removeClass('hide');
			$('.errors_container').append('Пожалуйста, укажите свой email');
		}
		if(rusername && !rpassword){
			$('#rpassword').val('').attr('type', 'password').parent('div').find('.password-eye').removeClass('password-eye-open');
			$('.errors_container').removeClass('hide');
			$('.errors_container').append('Пожалуйста, введите пароль');
		}
		if(rusername && rpassword){
			$('#userauthbutton').attr('disabled', true);
			var req = new XMLHttpRequest();
			req.open("POST", 'https://payad.me/auth.php?a=check&g=3', true);
			req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			req.onload = function( e ) {
				if(JSON.parse(e.target.responseText).status == 'success') {
					localStorage['payadlogin'] = rusername;
					localStorage['payadpass'] = rpassword;
					localStorage['power'] = 1;
					localStorage['helper'] = 1;
					localStorage['push'] = 1;
					refresh();
				} else {
					$('#userauthbutton').attr('disabled', false);
					$('#loginform #rpassword').val('').attr('type', 'password').parent('div').find('.password-eye').removeClass('password-eye-open');
					$('#loginform .errors_container').removeClass('hide');
					$('#loginform .errors_container').append(JSON.parse(e.target.responseText).data.error);
				}
			}
			req.send("rusername="+rusername+"&rpassword="+rpassword+"&authtype=user&x="+x+"&key="+key);
		}
		return false;
	});
});