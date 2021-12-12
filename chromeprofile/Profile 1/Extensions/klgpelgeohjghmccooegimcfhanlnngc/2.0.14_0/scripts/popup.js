$(document).ready(function() {
	$('.btn-pop').click(function(){
		chrome.runtime.sendMessage({type: 'toggleState'}, function(status){
			status ? $('.btn-pop').html('disabel') : $('.btn-pop').html('enabel');
		});	
	});

	
});