	// Saves options to localStorage.
		function save_options() {
			chrome.tabs.getSelected(null, function(tab) {
				var domain = tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
				saveBody(domain);
			});
		}
		function saveBody(url)
		{
            var tmpp = {script:"",autostart:false};
    		if(localStorage[url])
            {
				 tmpp = JSON.parse(localStorage[url]);
			}	
            
            tmpp.script = editor.getValue();
			tmpp.css = editorCss.getValue();
            tmpp.autostart = document.getElementById("jstcb").checked;
			tmpp.sfile  = "jquery.js";
			
            localStorage[url] = JSON.stringify(tmpp);
            
			// Update status to let user know options were saved.
			var status = document.getElementById("title");
			status.innerHTML = "Options Saved.";
			setTimeout(function() {
				status.innerHTML = "";
			}, 750);
		}
		// Restores select box state to saved value from localStorage.
		function restore_options(callback) {
			chrome.tabs.getSelected(null, function(tab) {
				var domain = tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
				restoreBody(domain);
				if(callback)
					callback();
			});
		}
		function restoreBody(url)
		{
			if(!localStorage[url])
			{
				return "";
			}
			var lsd = JSON.parse(localStorage[url]);
			var ta = document.getElementById("scriptText");
			var taCss = document.getElementById("scriptTextCss");
			var cb = document.getElementById("jstcb");
			ta.value = lsd.script;
			taCss.value = lsd.css;
			if(lsd.autostart)
				cb.checked = true;
			$("#jstcb").button("refresh");
				
		}
		function execute(script,css)
		{
			chrome.tabs.executeScript(null,{file: "jquery.js"}, function(){
			
					if(css != "")
					{
						chrome.tabs.insertCSS(null,{code:css});
					}
					
					if(script != "")
					{
						chrome.tabs.executeScript(null,{code:script},function(){
						
							var status = document.getElementById("title");
							status.innerHTML = "Script applied.";
							setTimeout(function() {
								status.innerHTML = "";
							}, 750);
						
						});
						
					}
					
				});
		}
		function run(){
			
			execute(editor.getValue(),editorCss.getValue());
		}
		function runSelected(){
			
			execute(editor.getSelection(),editorCss.getSelection());
		}
		function cacheScript()
		{
			if(editor)
				localStorage['cacheScript'] =  editor.getValue();
		}
		function cacheCss()
		{
			if(editorCss)
				localStorage['cacheCss'] =  editorCss.getValue();
		}
		function load_cache_all()
		{
			if($("#tabs > ul li:first").hasClass("selected"))
				load_cache_script();
			else
				load_cache_css();
		}
		function load_cache_script()
		{
			if( localStorage['cacheScript'] && confirm("Load last cached script?"))
				editor.setValue(localStorage['cacheScript']);
		}
		function load_cache_css()
		{
			if(localStorage['cacheCss'] && confirm("Load last cached CSS?"))
				editorCss.setValue( localStorage['cacheCss'] );
		}
		
		var editor=null;
		var editorCss=null;
		$(function(){//on popup load
			
			$("#runBtn").click(run);
			$("#runSelectedBtn").click(runSelected);
			$("#saveOptBtn").click(save_options);
			$("#laodCacheBtn").click(load_cache_all);
			
		
			restore_options(function(){
				//run();
				editor = CodeMirror.fromTextArea(document.getElementById("scriptText"), {
					mode: 'text/javascript',
					tabMode: 'indent',
					lineNumbers:true,
					matchBrackets :true,
					extraKeys:{
						"Ctrl-S":function(){
							save_options();
						}			
					},
					onChange  : function(){
						cacheScript();
					}
				}); 	
				editorCss = CodeMirror.fromTextArea(document.getElementById("scriptTextCss"), {
					mode: 'text/css',
					tabMode: 'indent',
					lineNumbers:true,
					matchBrackets :true,
					extraKeys:{
						"Ctrl-S":function(){
							save_options();
						}			
					},
					onChange  : function(){
						cacheCss();
					}
				}); 	
			});
			$("#jstcb").button({icons: {
						primary: "ui-icon-locked"
					}
				}).click(save_options);
			 tabs();
		});//;
		function tabs()
		{
			$("#tabs > ul li").each(function(ind,el){
			
				$(el).click(function(){
					
					var target = $(this).data("tabName");
					$("#tabs > ul li").removeClass("selected");
					$(this).addClass("selected");
					
					$("#tabs > div").each(function(ind,el){
						$(el).css({"z-index":100});
						if(el.id == target)
							$(el).css({"z-index":200}).animate({"margin-left":0});
						else
							$(el).animate({"margin-left":-$("#tabs").width()});
							
					});
				})
				$(el).data("tabName",$(el).children("a").attr("href").replace("#",""));
				$(this).text($(this).children("a").text()).children("a").remove();
				
			});
			
			$("#tabs > div").css({"z-index:":200}).not("#tabs-1").css({"margin-left":-$("#tabs").width(),'z-index':100});
			$("#tabs > ul li:first").addClass("selected");
			
		}