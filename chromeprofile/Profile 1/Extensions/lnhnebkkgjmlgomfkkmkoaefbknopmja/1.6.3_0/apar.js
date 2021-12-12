(function(){
    
         
        document.getElementById('perfecto').innerText = "ApkOnline file apk manager. Note: You are allowed to upload to run only APK files. See our video tutorial."; 
    
       var username = ""; 
       if ( localStorage.getItem('username') )
       {
            username = localStorage.getItem('username');
       }
       else {
           username = "myapkonline" + randomS(5);
           localStorage.setItem('username', username);
       }
 
        document.getElementById('integrator').innerText = "My ApkOnline username: "+username; 

        var quer  = new XMLHttpRequest();
        quer.open('GET', 'https://www.apkonline.net/community/user.php?username=' + username, true);
        quer.onload = function (e) {
                if (quer.readyState === 4) {
                        if (quer.status === 200) {
                               // console.log(quer.responseText);
                            var response1 = quer.responseText;
                            localStorage.setItem('service', response1);
                            console.log('https://www.apkonline.net/phpextensions/connectorandroidonlineemulator.php?username=' + username  + "&service=" + response1);
                                var elf = $('#elfinder').elfinder({
					                   url : 'https://www.apkonline.net/phpextensions/connectorandroidonlineemulator.php?username=' + username  + "&service=" + response1,
                                       uiOptions : {
                                           
                                           
                                                    toolbar : [
                                                            //['back', 'forward'],
                                                            //['reload'],
                                                            ['home', 'up'],
                                                            ['mkdir', 'upload', "download"],
                                                            //['open', 'download'],
                                                            //['info'],
                                                            //['quicklook'],
                                                            //['copy', 'cut', 'paste'],
                                                            ['rm'],
                                                            ['duplicate', 'rename'],
                                                            //['extract', 'archive'],
                                                            //['search'],
                                                            //['view']
                                                    ],
                                           
                                       }
				                    }).elfinder('instance');
                        } else {
                                console.error(quer.statusText);
                        }
                 }
        };
        quer.onerror = function (e) {
                console.error(quer.statusText);
        };
        quer.send();    
   
    
  
})();




function randomS(len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
}


