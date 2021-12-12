let lang = chrome.i18n.getMessage("@@ui_locale")
lang = lang.toLowerCase()

// if (lang.indexOf('ru') != -1){
// 	lang = 'ru';
// } else if (lang.indexOf('ua') != -1){
// 	lang = 'ru';
// } else {
// 	lang = 'en';
// }

const selectedLanguage = localStorage.getItem('selectedLanguage')
if (selectedLanguage && ['ru','en'].indexOf(selectedLanguage) != -1){
	lang = selectedLanguage
} else if (lang.indexOf('en') != -1){
	lang = 'en';
} else if (lang.indexOf('ru') != -1){
	lang = 'ru';
} else if (lang.indexOf('ua') != -1){
	lang = 'ru';
} else {
	lang = 'en';
}

fetch(lang+'/index.html')
	.then(response => response.text())
	.then(response => {		
		let async = response.replaceAll('></script>',' async></script>');
		document.write(async);
	})