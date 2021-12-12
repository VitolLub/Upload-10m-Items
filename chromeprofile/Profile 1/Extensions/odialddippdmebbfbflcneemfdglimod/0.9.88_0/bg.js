
      /**
       * Create a context menu which will only show up for images.
       */
		/*chrome.browserAction.onClicked.addListener(function(tab) {
			
			//chrome.tabs.executeScript(null,{file: "jquery.js",});
			//chrome.tabs.executeScript(null,{file: "myscript.js"});
		});
*/

        chrome.extension.onRequest.addListener(function(request, sender) {
            if (request.method == "JSTinjectScript")
            {
				
				var d = request.key.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/); 
				var key = d[1];
				
				
				var dlsd = JSON.parse(localStorage["Default"]);
				
				if(dlsd.autostart)
				{
					chrome.tabs.insertCSS(sender.tab.id,{code:dlsd.css, runAt:"document_start"});
					
					if(dlsd.sfile != "")
					{
						chrome.tabs.executeScript(sender.tab.id,{file: dlsd.sfile}, function(){
							chrome.tabs.executeScript(sender.tab.id,{code:dlsd.script});
						});
					}
					else
					{
						//chrome.tabs.executeScript(sender.tab.id,{code:dlsd.script});
					}
				}
		
			
                if( localStorage[key] )
                {
					var lsd = JSON.parse(localStorage[key]);
					
					
                    if(lsd.autostart)
                    {
                        chrome.browserAction.setIcon({path:"icon24_auto.png"});
						chrome.tabs.insertCSS(sender.tab.id,{code:lsd.css, runAt:"document_start"});
						
						if(lsd.sfile != "")
						{
							chrome.tabs.executeScript(sender.tab.id,{file: lsd.sfile}, function(){
								chrome.tabs.executeScript(sender.tab.id,{code:lsd.script});
							});
						}
						else
						{
							chrome.tabs.executeScript(sender.tab.id,{code:lsd.script});
						}
                    }
                }
            }          
        });
		
		
        chrome.tabs.onActiveChanged.addListener(function(tabId) {
            chrome.tabs.get(tabId, function(tab){				
                changeIcon(tab)
            })

        });

        function  changeIcon(tab)
        {
			var matches= tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/);
				
            if( matches[1] && localStorage[matches[1]] )
            {
                var lsd = JSON.parse(localStorage[matches[1]]);
                if(lsd.autostart)
                {
                    chrome.browserAction.setIcon({path:"icon24_auto.png"});    
                    return;
                }
            }
            chrome.browserAction.setIcon({path:"icon24.png"});    
        }
		
		chrome.manifest = (function() {
			var manifestObject = false;
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					manifestObject = JSON.parse(xhr.responseText);
				}
			};
			xhr.open("GET", chrome.extension.getURL('/manifest.json'), false);

			try {
				xhr.send();
			} catch(e) {
				console.log('Couldn\'t load manifest.json');
			}

			return manifestObject;

		})();
		if( localStorage["info"] == undefined || localStorage["info"] != chrome.manifest.version)
		{		
			localStorage["info"] = chrome.manifest.version;
			alert("JS TRICKS news: Import/Export buttons in options pane, as requested.");
		}	  
