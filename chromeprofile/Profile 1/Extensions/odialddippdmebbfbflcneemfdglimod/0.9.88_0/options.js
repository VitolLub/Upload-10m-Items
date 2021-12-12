var selectedTitle = "";
		
		var scripts = ["jquery.js"  
		
		
		];
		
		CodeMirror.commands.autocomplete = function(cm) {
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
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
		
		//-bg
		
		//------
		
		function save()
		{
			
			if(selectedTitle == "")
				return;
			
			var key = selectedTitle;
			var val = editorJs.getValue() ;
			var cssval = editorCss.getValue();
            var autos = $("#jscb").attr('checked');
			var hid = $("#jshid").attr('checked');
			var sf = $("#jsscriptfile option").filter(":selected").val();
			
			
            var tmp =  {"script": val, "autostart": autos, "hidden": hid , "sfile": sf, "css": cssval};

			localStorage[key] = JSON.stringify(tmp);
			currentSavedState = editorJs.getValue();
			currentSavedStateCss = editorCss.getValue();
			showMessage("Script and CSS tricks saved!");
			
			run();
		}
		function deleteRecord()
		{
			if(selectedTitle == "")
				return;
			if(selectedTitle == "Default")
			{
				showMessage("You can't delete 'Default' trick, sorry...");
				return;
			}
			var key = selectedTitle;			
			var $message = $("#jstmessage");
			
			if(confirm("Do you realy want to delete that trick?"))
			{
				delete localStorage[key];
				showMessage("'"+key+"' site's trick deleted!");
				$('.jstbox:contains('+key+')').slideUp(1000);
				editorJs.setValue("");				
				editorCss.setValue("");				
				currentSavedState = "";
				currentSavedStateCss = "";
				selectedTitle ="";
			}
		}
		var messageTimer=null;
		function showMessage(text)
		{
			var $message = $("#jstmessage");
			clearTimeout(messageTimer);
			$message.stop().animate({top:"0px"});
			$message.text(text);
			messageTimer = setTimeout(function(){
					$("#jstmessage").animate({top:"-50px"},
						function(){
							$message.text("");
					})},1750);
			
		}
		function run(){
			
			if(! localStorage["Default"] )
			{
				selectedTitle="Default";
				save();
				selectedTitle="";
			}
			$("#menu").empty();
			if(localStorage && localStorage.length != 0)
			{
				var keys = new Array();
				for(v in localStorage)
				{
					if(v!='cacheCss' && v!='cacheScript' && v!='info')
						keys.push(v);
				}
				keys.sort();
				//keys.unshift({"Default"});
				
				for(k in keys)
				{					
					var v = keys[k]; 
					var lsd = JSON.parse(localStorage[v]);
					addMenuBox(v,lsd);
					
				}
			}
			else
			{
				$("#menu").text("Nothing saved...");
			}
		}
		function addMenuBox(v,lsd)
		{
			var $divbox = $("<div class='jstbox'></div>");
			$divbox.append($("<div class='jsttitle'>").text(v));	
					
			$divbox.click(function(){ 
				selectSite(this);
			});
			
			if(v!="Default")
			{
				var $imgLink = $("<img class='goto' border=0 src='url_icon.gif'>");
				if(lsd.hidden == 'checked')
				{
					$imgLink.click(function(){
						chrome.windows.create({"url":"http://"+v, "incognito": true});
					});
					$imgLink.attr("src","url_icon_i.png");
				}
				else
				{
					$imgLink.click(function(){
						chrome.tabs.create({"url":"http://"+v});
					});
				}
				$divbox.append($imgLink);
				
				
				/*var $editLink = $("<img class='goto edit' border=0 src='edit_icon.png'>").click(function(){
					editTitle($(this).parent());
					return false;
				});
				$divbox.append($editLink);*/
			}
			
			if(lsd.hidden == 'checked')
			{
				if(hiddenOpt)
					$divbox.hide();
				$divbox.addClass('hiddenFlag');
			}
			
			if(selectedTitle == v)
				$divbox.addClass("selected");
				
			$("#menu").append($divbox);
		}
		
		
		var currentSavedState=null;
		var currentSavedStateCss=null;
		function selectSite(obj)
		{
			if( changed() )
				return;
			
			if( $("#editorJs").css("visibility") == "hidden")
				$("#editorJs").hide().css({"visibility":""}).fadeIn();
			
			var v = $(obj).text();
			var lsd = JSON.parse(localStorage[v]);
			
			if(lsd.script)
				editorJs.setValue(lsd.script);
			else
				editorJs.setValue("");
			if(lsd.css)
				editorCss.setValue(lsd.css);
			else
				editorCss.setValue("");
			
			selectedTitle = v;
			if(lsd.autostart)
				$("#jscb")[0].checked = true;
			else
				$("#jscb")[0].checked = false;
			$("#jscb").button("refresh");
			
			if(lsd.hidden)
				$("#jshid")[0].checked = true;
			else
				$("#jshid")[0].checked = false;
			$("#jshis").button("refresh");
				
			set=false;
			$("#jsscriptfile option").each(function(ind,el){
				if($(el).val() == lsd.sfile)
				{
					$(el).attr("selected",true);
					set=true;
				}
				else
					$(el).attr("selected","");
			});
			if(!set)
				$("#jsscriptfile option")[0].selected = true;
			
			$(".jstbox").removeClass("selected");
			
			$(obj).addClass("selected");
			
			currentSavedState = editorJs.getValue();
			currentSavedStateCss = editorCss.getValue();
			
			showMessage("Loaded '"+v+"' site's trick!");
		}
		function editTitle($box)
		{
			//$(".jsttitle", box)
		}
		function changed()
		{
			if(currentSavedState!=null)
			{
				if(currentSavedState != editorJs.getValue() )
				{
					return !confirm("Script changed! Discard?");
				}
			}
			if(currentSavedStateCss!=null)
			{
				if(currentSavedStateCss != editorCss.getValue() )
				{
					return !confirm("Css changed! Discard?");
				}
			}
			return false;
		}
		
		var editorJs = null;
		var editorCss = null;
		var hlLineJs = null;
		var hlLineCss = null;
		
		$(function(){//on load		
			$("#exportbtn").click(exportSettings);
			$("#importbtn").click(importSettings);
			$("#jssave").click(save);
			$("#jsdelete").click(deleteRecord);
			$("#textSizeUpBtn").click(function(){textSize(1)});
			$("#textSizeDownBtn").click(function(){textSize(-1)});
			$("#logo").css({"width":128}).delay(600).animate({"width":48},function(){$(this).attr("src","icon48.png")});
			
			
			$(window).resize(function(){
			console.log($(window).height());
				$("#editorwrap,#editorwrap2,#dummyheight").stop(true,false).delay(600).animate({"height":$(window).height() - 200});
			});
			$(window).resize();
			
			$(document).keydown(function(ev){
				if(ev.keyCode==112)
					return false;
			});
			editorJs = CodeMirror.fromTextArea(document.getElementById("taedit"), {
					mode: 'text/javascript',					
					tabMode: 'indent',
					lineNumbers:true,
					matchBrackets :true,
					extraKeys: {						
						"Esc": function() {
						  var scroller = editorJs.getScrollerElement();
						  if (scroller.className.search(/\bCodeMirror-fullscreen\b/) !== -1) {
							scroller.className = scroller.className.replace(" CodeMirror-fullscreen", "");
							scroller.style.height = '';
							scroller.style.width = '';
							editorJs.refresh();
						  }
						},
						"F1":function(){
							openJQueryHelp();
						},
						"Ctrl-Space": "autocomplete"
					},
					onCursorActivity: function() {
						if(hlLineJs!=null)
							editorJs.setLineClass(hlLineJs, null, null);    
							
						hlLineJs = editorJs.getCursor().line;						
						editorJs.setLineClass(hlLineJs, "activeline", "activeline");  
						
					}
				}); 
				
				
			
			editorCss = CodeMirror.fromTextArea(document.getElementById("taeditcss"), {
					mode: 'text/css',					
					tabMode: 'indent',
					lineNumbers:true,
					matchBrackets :true,
					extraKeys: {						
						"Esc": function() {
						  var scroller = editorCss.getScrollerElement();
						  if (scroller.className.search(/\bCodeMirror-fullscreen\b/) !== -1) {
							scroller.className = scroller.className.replace(" CodeMirror-fullscreen", "");
							scroller.style.height = '';
							scroller.style.width = '';
							editorCss.refresh();
						  }
						},
						"Ctrl-Space": "autocomplete"
					},
					onCursorActivity: function() {    
						if(hlLineCss!=null)
							editorCss.setLineClass(hlLineCss, null, null);    
							
						hlLineCss = editorCss.getCursor().line;						
						editorCss.setLineClass(hlLineCss, "activeline", "activeline");  
					}
				}); 
			
			//line highlight
			//hlLineJs = editorJs.setLineClass(0, "activeline");
			//hlLineCss = editorCss.setLineClass(0, "activeline");
			
			//hide some menu
			$(document).keydown(function(event){
				if(event.altKey && event.ctrlKey && String.fromCharCode( event.which ).toLowerCase() == 'h')
				{
					$(".jstbox.hiddenFlag").each(function(ind,el){$(el).delay(ind*100).slideToggle()});
					$("#jshid, label[for=jshid]").fadeToggle();
					
					if(hiddenOpt == true)
					{
						showMessage("WOOOOH! Hidden options!");
						hiddenOpt = false;
					}
					else
					{
						hiddenOpt = true;
					}
				}
				if(event.ctrlKey && String.fromCharCode( event.which ).toLowerCase() == 's')
				{
					save();
					return false;
				}
			});
			//scripts
			$("#jsscriptfile").append($("<option value=''>No script</option>"));
			for(var i=0;i<scripts.length;i++)
			{
				$("#jsscriptfile").append($("<option>"+scripts[i]+"</option>"));
			}
			///
			run(); //menu etc.
			
			//version
			$("#version").append(chrome.manifest.version);
			document.title = "JScript Tricks";
			//
			tabs();
			//dialog
			dialog = $("#floatingWindow").dialog({"autoOpen":false, height:500,"width":600});
			//buttons
			$("#jscb, #jshid").button({icons: {
						primary: "ui-icon-locked"
					}
				});
			
			
		});//;
		
		var hiddenOpt = true;
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
		var dialog;
		function openJQueryHelp()
		{
			var pos = editorJs.getCursor();
			var token = editorJs.getTokenAt(pos);
			var word = token.string;
			
			if(word.match(/^[\:a-z0-9]+$/i))
			{
			}
			else if(editorJs.somethingSelected())
			{
				word = editorJs.getSelection();
			}
			var $opt = $("#floatingWindow");
			var p = editorJs.cursorCoords(false,'page');
			
			$opt.dialog("option",{"position":[p.x,p.y+10],"title":"Loading..."});
			
			loadJqueryDoc(word);
				
		}
		function loadJqueryDoc(word)
		{
			var $opt = $("#floatingWindow");
			
			$opt.empty().append("<img class='loadingimg' src='loading.gif?seed' alt=''/>").dialog('open');
			
			$opt.load("http://api.jquery.com/"+word+"/ #content",function(){
				if($opt.text() == "")
				{
					searchJqueryDoc(word);
					return;
				}
				reformatJqueryDoc();
			}).error(function(){
				searchJqueryDoc(word);
			});
		}
		function reformatJqueryDoc(){
		
			var $opt = $("#floatingWindow");
			
			$opt.html($opt.html().replace(/src=\"/g,"src=\"http://api.jquery.com/"));
			$opt.dialog("option",{"title":$opt.find("h1:first").text()});
			$opt.find("h1, .jq-box.roundBottom:last").remove();
			
			$opt.find("a").each(function(ind,el){
				
				var href = $(el).attr("href");
				if(href.match(/^#/) ) //menu
				{
					$(el).click(function(){
						$("#accord").accordion( "activate" , $(this).attr("href") );
						return false;
					});
				}
				else
				{
					if(href[0] == "/" || !href.match(/^http/))
					{
						href = "http://api.jquery.com"+href;
					}
					
					$(el).click(function(){
						var w = $(this).attr("href").replace(/^http\:\/\/api\.jquery\.com\//g,"");//.replace(/\//g,"");
						loadJqueryDoc( w );
						return false;
					});
				}
			});
			
			if($opt.find(".entry").length > 1)
			{
				var $ac = $("<div id='accord'>");
				$opt.find(".entry").each(function(ind,el){
					$ac.append("<h3 id='"+el.id+"'><a href=#>"+$("h2 .name", el).text()+"</a></h3>");
					$ac.append(el);
				});
				$opt.append($ac);
				$("#accord").accordion({
					autoHeight: false,
					collapsible:true,
					"navigation": true,
					animated: false
				});
			}
		
		}
		function searchJqueryDoc(word){
			var $opt = $("#floatingWindow");
			
			$opt.dialog("option",{"title":"Searching '"+word+"'..."});
			
			$opt.load("http://api.jquery.com/"+word+"/ #content",function(){
				
				var $opt = $("#floatingWindow");
				if($opt.find("h1").length)
				{
					$opt.dialog("option",{"title":$opt.find("h1").text()});
					$opt.find("h1").remove();
					
					$opt.find("a.title-link").each(function(ind,el){
						$(el).data("href",el.href);
						$(el).attr("href","#");
						$(el).click(function(){
							loadJqueryDoc($(this).data("href").match(/\/[^\/]+\/$/g,"")[0].replace(/\//g,""));
						})
					
					})
				}
				else //search box
				{
					$opt.dialog("option",{"title": "'"+word+"' not found."});
					$opt.empty()
					$("#searchform-no-results").submit(function(){
						searchJqueryDoc($("#s-no-results").val());
						return false;
					});
				}
			
			});
		}
		function exportSettings()
		{
			//var w = window.open();
			//w.document.write("<pre>");
			var saveStr = "";
			if(localStorage && localStorage.length != 0)
			{
				for(v in localStorage)
				{
					saveStr += "#"+v+"#" + "\n" + localStorage[v] + "\n";
				}
			}
			
			
			var $opt = $("#floatingWindow").empty();
			$opt.dialog("option",{"title":"Export: copy and save it to a text file..."});
			$opt.append("<div id='exportTA' style='width:97%;height:97%;resize: none; white-space: pre; '></div>").dialog('open');
			
			$("#exportTA").text(saveStr)
			selectText($("#exportTA")[0]);
			
		}		
		function importSettings()
		{
			var $opt = $("#floatingWindow").empty();
			var btn = $("<input type='button' value='Import'>");
			$opt.dialog("option",{"title":"Import: Paste exported script here and push the button below."});
			$opt.append("<textarea id='importTA' style='width:97%;height:87%;resize: none;'></textarea>").dialog('open');
			$opt.append(btn);
			
			
			var message = "";
			btn.click(function(){
				if (confirm("This will overwrite script and css if importing name exists! Are you sure?") )
				{
					var k = undefined;
					var inputText = $("#importTA").val().split("\n");
					var imObj={};
					
					try
					{
						for(var i=0;i<inputText.length;i++)
						{
							if(inputText[i] == undefined || inputText[i] =="")
								continue
							
							//console.log("line: " + inputText[i])
							if(inputText[i].match(/^\#[\.a-z0-9\-]+\#$/i) )
							{
								//console.log("is key!")
								if(inputText[i] == "#info#" || inputText[i] == "#cacheCss#" || inputText[i] == "#cacheScript#")
									k = undefined;
								else
									k = inputText[i].replace(/#/g,"");
								
								continue;
							}
							if(k != undefined)
							{
								//console.log("add to key " + k + ": " + inputText[i])
								if(!imObj[k])
									imObj[k] = "";
								imObj[k] += inputText[i];
							}
						}
						
						//actual importing
						for(v in imObj)
						{
							localStorage[v] = imObj[v];
						}
						alert("Done. The page has to be reloaded now. Let me do that for you...");
						location.reload();
					}
					catch(ex)
					{
						alert("Something went wrong. :(");
						console.log("Import error. " + ex);
					}
				}
			})
		}
		function textSize(val)
		{
			var v = parseInt($(".CodeMirror").css("font-size")) + val;
			
			if(v > 4)
				$(".CodeMirror").css({"font-size":v+"px"});
				
			$("#textsizeval").text(v + "px");
		}
		function selectText(containerid) {
			if (document.selection) {
				var range = document.body.createTextRange();
				range.moveToElementText(containerid);
				range.select();
			} else if (window.getSelection()) {
				var range = document.createRange();
				range.selectNode(containerid);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);
			}
		}
		
		//