var Module = (function(my){

  var INTERVAL = 0.2;
  var enabled = false;
  var itemsLength = 0;
  var productsMap = [];
  var $resultPopup;

  var stayOn = false;
  var isOverLink = false;
  var dragablePopup = false;

  my.init = function() {
    console.log('content init');
    initMessageListener();
    appendExtensionElements();
    chrome.runtime.sendMessage({type: "getState"}, function(state) {
      enabled = state;
      if (enabled) {
        console.log("enabled : "+enabled);
        onloadHandler();
      }
      observerInit();
    });
  };


  function initMessageListener() {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.type == "updateState"){
          console.log("update to enabled with data : "+request.data);
          enabled = request.data;
        }

        if (request.type == "getProductsData"){

         console.log("got products request");

         var rank = $('.extension-rank').length;

         console.log("sending rank : " + rank);

         sendResponse({status : "OK" , content : rank});

       }

     });
  }
  function appendExtensionElements(){
    appendPlayButton();
    appendPopup() ;
  }
  function appendPopup() {
    //$resCol = $('#resultsCol');
    $resCol = $('#search');
    
    if (!$resCol[0]) $resCol = $('#zg_left_col1'); //.a-container.g-fix-wide-screen // #wishlist-page
    if (!$resCol[0]) $resCol = $('#zg-ordered-list'); //.a-container.g-fix-wide-screen // #wishlist-page
    if (!$resCol[0]) $resCol = $('#wishlist-page');// #dp-container
    if (!$resCol[0]) $resCol = $('#dp-container');
    ///  '<a id="extention-close-popup">&#10006;</a> <div id="popup-wraper"> </div>';
    if($resultPopup && $resultPopup.length>0)
    	$resultPopup.remove();
    $resultPopup = $('<div id="extension-resultPopup" ><a id="extention-close-popup">&#10006;</a> <div id="popup-wraper"><span style="color:#000000"><b>Loading ...</b></span></div></div>')
    .appendTo($resCol)
    .hide()
    .draggable();

    $resultPopup.find('#extention-close-popup').mousedown(function(e){
      stayOn = !stayOn;
      popupAddContent();
      $resultPopup.hide();
    });
  }
  function appendPlayButton(){
  }
  function observerInit () {
    console.log("In observerInit()");  
    var target = document.querySelector('#search .s-result-list');
    if(!target) target = document.querySelector('#zg_centerListWrapper');
    var carousels = document.querySelectorAll('.a-carousel-container.a-carousel-display-swap'); // .a-carousel-transition-swap.a-carousel-initialized
    // carousels.push(document.querySelector('#rhf-container'));
    console.log("enabled: ", enabled);
    if (!enabled) return;

    var observer = new MutationObserver( function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          var items = [];
          var targetClass = 's-result-item'; 
          var addedNodesLength = mutation.addedNodes.length;
          if ( addedNodesLength === 1 ) {
            // $.each(mutation.addedNodes, function(i, node){
            //   if($(node).attr('data-p13n-asin-metadata') || $(node).attr('data-asin')) {
            //     items.push(node);
            //   }
            // });
            if (items.length == 0) items = $(mutation.addedNodes[0]).find('.' + targetClass);
          }
          else if (addedNodesLength > 1) {
            $.each(mutation.addedNodes, function(i, node){

              //if ($(node).attr('data-asin') || $(node).attr('data-p13n-asin-metadata')) items.push(node);
              if ($(node).hasClass(targetClass)) {
                items.push(node);
              }
            });
          }
          $.each(mutation.addedNodes, function(i, node){
            var arr = getRelevantItems(node);
            if (arr.length > 0){
              arr.forEach(function(c) {
                items.push(c);
              });
            }
            if($(node).attr('data-p13n-asin-metadata') || $(node).attr('data-asin')) {
              items.push(node);
            }
          });
          processItems(items);
          if($('.'+targetClass).find('.extension-rank').length == itemsLength){
            console.log("Finished all products " + $('.extension-rank').length);
          }            
        }
      });
    });
    var config = { subtree: true, childList: true, characterData: true };
    
    if (target) observer.observe(target, config);
    carousels.forEach(function(c) {
      observer.observe(c, config);
    });
  }

  function onloadHandler() {
    // a-carousel-container a-carousel-display-swap a-carousel-transition-swap a-carousel-initialized
    console.log('in onLoadHandler()');

    //$(document).ready(function(){
      var items = getRelevantItems();

      var mass = $('.zg_more_item');
      //items = items == null ? $('.g-items-section > .g-item-sortable') : items ;
      itemsLength = items.length;

      $(document).click(function(e) {
        if (stayOn && !isOverLink){
          popupAddContent();
          $resultPopup.hide();
          stayOn = !stayOn;
        }
      });

      window.addEventListener('scroll', function (event) {
        processItems(items);
        if (mass) processItems(mass);
        if ($('.a-section.pa-ad-details')) processItems($('.a-section.pa-ad-details'));

        /* For vAmaxon a-carousel-card */
        if ($('li.a-carousel-card'))  processItems($('li.a-carousel-card'));  
     }, false);
      processItems(items);
      if (mass) processItems(mass);
      if ($('.a-section.pa-ad-details')) processItems($('.a-section.pa-ad-details'));

      /* For vAmaxon a-carousel-card */
      if ($('li.a-carousel-card'))  processItems($('li.a-carousel-card'));  
    }
    function getRelevantItems(dom){
      dom = dom || document;
      $dom = $(dom);
    //var items = $dom.find('.s-result-list > li');
    var items = $dom.find('.s-result-list > div');
      items = $(items).filter(function(){
        return $(this).attr("data-asin") != "";
      });    
      if(items.length == 0) {//zg_item zg_homeWidgetItem
        items = $dom.find('.zg-item-immersion');
        items.css('height','auto');
      }
      if (items.length == 0) {
        items = $dom.find('.zg_item.zg_homeWidgetItem');// .zg_itemWrapper
      }
      if (items.length == 0) {
        items = $dom.find('.a-section.g-item-sortable');
      }
      return items;
    }
    function processItems(items) {

    //console.log("In processItems(items)");
    //console.log('items: ', items);
    var incItems=0;
    for (var i = 0, len = items.length; i < len; i++) {
      // if ($(items[i]).find('#extension-asin-view').length > 0){
      //   console.log('extention applayed', items[i]);
      //   console.log($(items[i]).find('#extension-asin-view'));
      // }else {
        if (isInViewport(items[i])) {
         if($(items[i]).attr('processed')!="yes") {
          processItem(items[i],  incItems*1000);
          incItems++;
        }
      }
    }

   // console.log("Finished all products " + $('.extension-rank').length);
 }
 var isInViewport = function (elem) {
  var bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};
function processItem(item, delay) {
  var $item = $(item);
  $item.attr("processed","yes");
    // $item.css("bacground-color", "#00ff00");
    var links = $item.find('a');
    // console.log("links : ",links);
    if (!links.length){
      console.log("No links");
      return;
    }

    // find the right link and put it on prodUrl
    var prodUrl = links[0].href;
    for (var i = 0; i < links.length; i++){
      var it = $(links[i]).find('img');
      if (it[0]) prodUrl = links[i].href;
    }

    //console.log(prodUrl.search("bestsellers") + " , " + prodUrl);
    // console.log("Product URL : ",prodUrl);

              var $sibling = $item.find('.s-item-container'); // B00MH4QI26
              if (!$sibling.length) $sibling = $item.find('.zg_itemImmersion');
              if (!$sibling.length) $sibling = $item.find('.a-section.p13n-asin');
              if (!$sibling.length) $sibling = $item.find('.a-section.g-item-sortable');
              if (!$sibling.length && window.location.href.search('/registry/wishlist')) {
                $sibling = $item;
              }
              if (!$sibling.length){
                console.log("I don't know where to put content: " + url);
                return;
              }

              var loadingView = $('<div class="extension-result">\
                <b class="extension-loader">Loading ...</b>\
                </div>');

              if($sibling.find('.a-text-center.a-fixed-left-grid-col.g-itemImage.g-item-sortable-padding').length != 0){
                $sibling.find('.a-text-center.a-fixed-left-grid-col.g-itemImage.g-item-sortable-padding').css('height','auto');                  
                $sibling.find('.a-fixed-right-grid-col.g-item-details.a-col-left').css('padding-left','18px');
                var str = '.a-text-center.a-fixed-left-grid-col.g-itemImage.g-item-sortable-padding  > .a-link-normal:first';
                loadingView.insertAfter($sibling.find(str));
              }else if($sibling.find('.a-row > .a-column').length != 0){
                $sibling.find('.a-row').css('height','auto');
                loadingView.insertAfter($sibling.find('.a-row > .a-column:first'));
              }else if($sibling.find('.a-section').length != 0){
                $sibling.find('.a-link-normal').css('height','auto'); 
                $sibling.find('.zg_itemImmersion').css('height', "auto");
                var $sub = getNewHtmlForSibling($sibling);
                loadingView.insertAfter($sub.find('a:first'));
              }else if($sibling.find('.a-carousel-photo').length != 0){
                $('.a-carousel-viewport').css('height','auto');
                var $sub = $($sibling.find('.sp_dpOffer'));
                var href = $sub.find('a:first').attr('href');                    
                var tmp = $sub.html().split('</div>');
                  var str = tmp[0] + '</div></a>'; //  + rankElement.html() + quickView.html() + asinView.html()
                  str += '<a class="a-link-normal" href="' + href + '">';
                  for (var i = 1; i < tmp.length; i++){
                    if (i != tmp.length-1){
                      str += tmp[i] + '</div>';
                    }else{
                      str += tmp[i] + '</div></a>';
                    }
                  }
                  $sub.html(str);
                  loadingView.insertAfter($sub.find('a:first'));
                }else if ($sibling != 0){
                  console.log("cant find relevant BSRmenue insert method use default option");
                  $sibling.css('height','auto');
                  loadingView.insertAfter($sibling);
                }

                setTimeout( function(){

                  chrome.runtime.sendMessage({type: "getProductData",url: prodUrl}, function(res) {

                    if(res.status == "Error"){
                      console.error("Can't get url ...");
                      return;
                    }
                    var url = res.url;
                    var data = res.data;

        var asin = $item.attr('data-asin'); //url.split( '/' )[5] ; // data-p13n-asin-metadata
        if (!asin) asin = $item.children('div').attr('data-asin');
        if (!asin){
          var asinAtt = $($item.find('.p13n-asin')[0]).attr('data-p13n-asin-metadata');
          if (asinAtt){
            asin = JSON.parse(asinAtt).asin;
          } else if (!asinAtt) {
            var arr = prodUrl.split('/');
            for (var i = 0; i < arr.length; i++){
              if (arr[i] == 'dp' && arr[i+1]){
                asin = arr[i+1];
                i = arr.length;
              }
            }
          }
        }
        if (!asin) {
          var arr = prodUrl.split('&');

          arr.forEach(function(c) {
            if (c.search('asin') >= 0) asin = c.split('=')[1];
          });
        }
        if (!asin) console.log('can\'t find asin: ', item);


        var productNameInUrl = url.split( '/' )[3];


        var details = getDetails(data, url);
        if (!details) console.log("no details: ", item);



        var whoInBuyBox = getMerchantInfo(data, url);

              //console.log("merchant info : " , whoInBuyBox.innerHTML);

              var rank = processRankDetails(details.innerHTML);
              
              //var merchantInfo = processMerchantInfoDetails(whoInBuyBox.innerHTML);
              var brandUrl = processBrand(whoInBuyBox.innerHTML);

              var sellersUrl = processSellers(whoInBuyBox);

              var $sibling = $item.find('.s-item-container'); // B00MH4QI26
              if (!$sibling.length) $sibling = $item.find('.zg_itemImmersion');
              if (!$sibling.length) $sibling = $item.find('.a-section.p13n-asin');
              if (!$sibling.length) $sibling = $item.find('.a-section.g-item-sortable');
              if (!$sibling.length && window.location.href.search('/registry/wishlist')) {
                $sibling = $item;
              }
              if (!$sibling.length){
                console.log("I don't know where to put content: " + url);
                return;
              }


              var tempRank = /(#.*\s+)\(/.exec(rank);
              if(tempRank == null){
                rank = /(\d+.*\s+)\(/.exec(rank);
                if (rank == null && details){
                  rank = "NO MAIN #BSR";
                }
              } else{
                rank = tempRank;
              }
              
              if (rank !== '' && rank !== null) {
                var noBSR = false;
                //console.log(rank[1]);
                if (rank == "NO MAIN #BSR"){
                  rank = '<a ><span class="extension-rank">NO MAIN #BSR</span></a>';
                  noBSR = true;
                }else{
                  // rank = rank[1].replace(/([#\d,]+)\s+in/g, '<a ><span class="extension-rank">$1</span></a> in');
                  var tmp = rank[1].replace('#','');
                  // rank = tmp.replace(/([\d,]+)\s+in/g, '<a ><span class="extension-rank">#$1</span></a> in');
                  var arr = tmp.split(' ');
                  arr[0] = '<a ><span class="extension-rank">#'+arr[0]+'</span></a>'
                  rank = arr.join(' ');
                }

                var rankElement = $('<div style="font-weight:bold;" class="extension-result">'  + rank + '</div>');


                var cccAmzLocation = getAmzLocation();

                var cccAmzLocationKeepa = getAmzLocationKeepa()

                var cccImageUrl = 'https://graph.keepa.com/pricehistory.png?asin='+asin+'&domain='+cccAmzLocationKeepa+'&width=750&height=350&amazon=1&new=0&range=365&salesrank=1';

                //var ccc  = $('<div><img src="'+cccImageUrl+'"></img></div>');

                var cccImagePriceUrl = 'https://charts.camelcamelcamel.com/'+cccAmzLocation+'/'+asin+'/amazon-new.png?force=1&zero=0&w=725&h=440&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en';

                //var cccPrice  = $('<div><img src="'+cccImagePriceUrl+'"></img></div>');

                var cccUrl = '#'

                if(productNameInUrl !== undefined){
                  cccUrl = 'https://'+cccAmzLocation+'.camelcamelcamel.com/' + productNameInUrl + '/product/' + asin ; 
                }

                var quickView = $('<div class="extension-result">\
                  <span style="font-weight:bold;">Quick View:</span>\
                  <a  target="_blank"><span class="extension-ccc" >BSR History</span></a>\
                  <span>|</span>\
                  <a  target="_blank"><span class="extension-ccc-price" >Price History</span></a>\
                  <span>|</span>\
                  <a  target="_blank"><span class="extension-brand" >Brand</span></a>\
                  </div>');
                if ($item.width() < 97){
                  // href="'+cccUrl+'" *2
                  // href="'+brandUrl+'"
                  quickView = $('<div class="extension-result">\
                    <span style="font-weight:bold;">Quick View:</span>\
                    <a target="_blank"><span class="extension-ccc" >BSR History</span></a>\
                    <span></span>\
                    <a target="_blank"><span class="extension-ccc-price" >Price History</span></a>\
                    <span></span>\
                    <a target="_blank"><span class="extension-brand" >Brand</span></a>\
                    </div>');
                }

                $('#example').popover();

                var asinView = $('<div id="extension-asin-view" class="extension-result">\
                  <span style="font-weight:bold;">ASIN: </span><span>'+asin+'</span>\
                  </div>');


                quickView.find('.extension-ccc')
                .mouseenter(function(event){
                  $resultPopup.show();
                  var ccc  = $('<div><img src="'+cccImageUrl+'"></img></div>');
                  popupAddContent(ccc);
                  isOverLink = true;
                  chrome.runtime.sendMessage({type: "eventWithLabel",category: "quick-view",action:"mouse-hover",label: "ccc-bsr"}, function(status) {
                  });
                })
                .mouseleave(function(e){
                  isOverLink = false;
                  if (!stayOn){
                    popupAddContent().hide();
                  }
                })
                .mousedown(function(e){

                  stayOn = !stayOn;
                });

                quickView.find('.extension-ccc')
                .click(function(event){
                  chrome.runtime.sendMessage({type: "eventWithLabel",category: "quick-view",action:"mouse-click",label: "ccc-bsr"}, function(status) {
                  }); 
                });

                quickView.find('.extension-ccc-price')
                .mouseenter(function(event){
                  $resultPopup.show();
                  var cccPrice  = $('<div><img src="'+cccImagePriceUrl+'"></img></div>');
                  popupAddContent(cccPrice);
                  isOverLink = true;
                  chrome.runtime.sendMessage({type: "eventWithLabel",category: "quick-view",action:"mouse-hover",label: "ccc-price"}, function(status) {
                  });
                })
                .mouseleave(function(e){
                  isOverLink = false;
                  if (!stayOn){
                    popupAddContent().hide();
                  }
                })
                .mousedown(function(e){

                  stayOn = !stayOn;
                });

                quickView.find('.extension-ccc-price').click(function(event){
                  chrome.runtime.sendMessage({type: "eventWithLabel",category: "quick-view",action:"mouse-click",label: "ccc-price"}, function(status) {
                  });   
                });


                rankElement.find('.extension-rank')
                .mouseenter(function(event){
                  $resultPopup.show();
                  isOverLink = true;
                  popupAddContent(details);
                  chrome.runtime.sendMessage({type: "eventWithLabel",category: "quick-view",action:"mouse-hover",label: "details"}, function(status) {
                  });
                })
                .mouseleave(function(e){
                  isOverLink = false;
                  if (!stayOn){
                    popupAddContent().hide();
                  }
                })
                .mousedown(function(e){

                  stayOn = !stayOn;
                });

                quickView.find('.extension-brand')
                .mouseenter(function(event){
                  isOverLink = true;
                  var brandProducts = '';
                  $resultPopup.show(); 

                  var date = new Date();
                  var startMs = date.getTime();
                  $.get(brandUrl).done( function(data){

                    brandProducts = $(data).find('#ProductGrid-MNW8WXE');

                    if(brandProducts.length === 0){
                      brandProducts = $(data).find('#search .s-result-list');
                      //brandProducts = $(data).find('#center'); 
                    }

                    popupAddContent(brandProducts);  

                    date = new Date();
                    var endMs = date.getTime();

                    var loadTimeMs = endMs - startMs ;

                    chrome.runtime.sendMessage({type: "eventWithLabelAndValue",category: "quick-view",action:"mouse-hover",label: "brand",value: loadTimeMs}, function(status) {
                    });          
                  });
                })
                .mouseleave(function(e){
                  isOverLink = false;
                  if (!stayOn){
                    popupAddContent().hide();
                  }
                })
                .mousedown(function(e){

                  stayOn = !stayOn;
                });
                quickView.find('.extension-brand').click(function(event){
                  chrome.runtime.sendMessage({type: "eventWithLabel",category: "quick-view",action:"mouse-click",label: "brand"}, function(status) {
                  });
                });


                //var fbaCalcLink =  $('<div class="extension-result"><span>After FBA fees:&nbsp</span><a style="color:#b12704;font-weight:bold" id="fbaCalcLink">N/A</a></div>');

                //fbaCalcLink.insertAfter($sibling.find('.a-row > .a-column:first'));
                if (asin == 'B00MHQI26'){
                  console.log("###########################");
                  console.log($sibling);// a-carousel-photo
                }
                // 1 , 2 , 4 , 3
                if($sibling.find('.a-text-center.a-fixed-left-grid-col.g-itemImage.g-item-sortable-padding').length != 0){
                  $sibling.find('.a-text-center.a-fixed-left-grid-col.g-itemImage.g-item-sortable-padding').css('height','auto');                  
                  $sibling.find('.a-fixed-right-grid-col.g-item-details.a-col-left').css('padding-left','18px');
                  var str = '.a-text-center.a-fixed-left-grid-col.g-itemImage.g-item-sortable-padding  > .a-link-normal:first';
                  asinView.insertAfter($sibling.find(str));
                  quickView.insertAfter($sibling.find(str));
                  rankElement.insertAfter($sibling.find(str));
                  $sibling.find('.extension-loader').remove();
                }else if($sibling.find('.a-row > .a-column').length != 0){
                  $sibling.find('.a-row').css('height','auto');
                  asinView.insertAfter($sibling.find('.a-row > .a-column:first'));
                  quickView.insertAfter($sibling.find('.a-row > .a-column:first'));
                  rankElement.insertAfter($sibling.find('.a-row > .a-column:first'));
                  $sibling.find('.extension-loader').remove();
                }else if($sibling.find('.a-section').length != 0){
                  $sibling.find('.a-link-normal').css('height','auto'); 
                  $sibling.find('.zg_itemImmersion').css('height', "auto");

                  var $sub = getNewHtmlForSibling($sibling);
                  asinView.insertAfter($sub.find('a:first'));
                  quickView.insertAfter($sub.find('a:first'));
                  rankElement.insertAfter($sub.find('a:first'));
                  $sub.find('.extension-loader').remove();
                }else if($sibling.find('.a-carousel-photo').length != 0){
                  $('.a-carousel-viewport').css('height','auto');
                  var $sub = $($sibling.find('.sp_dpOffer'));
                  var href = $sub.find('a:first').attr('href');                    
                  var tmp = $sub.html().split('</div>');
                  var str = tmp[0] + '</div></a>'; //  + rankElement.html() + quickView.html() + asinView.html()
                  str += '<a class="a-link-normal" href="' + href + '">';
                  for (var i = 1; i < tmp.length; i++){
                    if (i != tmp.length-1){
                      str += tmp[i] + '</div>';
                    }else{
                      str += tmp[i] + '</div></a>';
                    }
                  }
                  $sub.html(str);
                  asinView.insertAfter($sub.find('a:first'));
                  quickView.insertAfter($sub.find('a:first'));
                  rankElement.insertAfter($sub.find('a:first'));
                  $sub.find('.extension-loader').remove();
                }else if ($sibling != 0){
                  console.log("cant find relevant BSRmenue insert method use default option");
                  $sibling.css('height','auto');
                  asinView.insertAfter($sibling);
                  quickView.insertAfter($sibling);
                  rankElement.insertAfter($sibling);
                  $sub.find('.extension-loader').remove();
                }

                 //var prime = $sibling.find('i.a-icon-prime');

                //console.log('prime : ', prime  );

                chrome.runtime.sendMessage({type: "getSellersData",url: sellersUrl}, function(res) {
                  var sellersData = res.data;
                  if(res.status == "Error"){
                    console.error("Can't get SellersData ...");
                    return;
                  }
                  //$.get(sellersUrl).done( function(sellersData){
                   var ownerDocument = document.implementation.createHTMLDocument('virtual');
                   var amzSeller = $(sellersData, ownerDocument).find('.olpSellerName').children('img');

                   if(amzSeller.length == 1){
                     //console.log(amzSeller.attr('src'));
                     asinView.append('<span>|</span><span style="color:red;"> Sold by Amazon </span>');
                      //asinView.css('background','#FF9966');//'url('+amzSeller.attr('src')+')').css('background-repeat','no-repeat');
                    }

                    var fbaSeller = $(sellersData, ownerDocument).find('.olpDeliveryColumn').children('.olpBadgeContainer');

                  if(sellersUrl === ''){ //only one fba seller

                    var prime = $sibling.find('i.a-icon-prime');
                    if(prime.length >= 1){
                      fbaSeller.length = 1;
                    }
                    
                  }

                  if(fbaSeller.length > 0){

                   asinView.append('<span>|</span><span style="color:red;"> '+fbaSeller.length+' FBA Sellers</span>');

                 }
               });

              }

            }); 

}, delay);
}


function getDetails(html, url) {
	var ownerDocument = document.implementation.createHTMLDocument('virtual');
 var details = $(html, ownerDocument).find('#detail-bullets .content')[0];
 if (!details) details = $(html, ownerDocument).find('#detailBullets')[0];
 if (!details) details = $(html, ownerDocument).find('#prodDetails')[0];
 if (!details) details = $(html, ownerDocument).find('#detail_bullets_id')[0];
    if (!details) details = $(html, ownerDocument).find('#productDetailsTable')[0];// kmd-technical-details-info
    if (!details) details = $(html, ownerDocument).find('.kmd-technical-details-info')[0];// technicalSpecifications_feature_div
    if (!details) details = $(html, ownerDocument).find('#technicalSpecifications_feature_div')[0];
    if (!details) details = $(html, ownerDocument).find('.aiv-container-limited > table')[0];
    if (!details) details = $(html, ownerDocument).find('#tech-specs-desktop')[0];
    if (!details) {
      console.log('Details not found: ' + url);
      details = '';
    }
    return details;
  }
  function getMerchantInfo(html, url) {
    //var $html = $(html);
    var ownerDocument = document.implementation.createHTMLDocument('virtual');
    var details = $(html, ownerDocument).find('#centerCol')[0];
    
    if (!details) {
      console.log('getMerchantInfo not found: ' + url);
      details = '';
    }
    return details;
  }
  function processRankDetails(html) {
  	var ownerDocument = document.implementation.createHTMLDocument('virtual');
    if (!html) return '';

    var rankStr = $(html, ownerDocument).find('#SalesRank').html();
    if (!rankStr) rankStr =  $(html, ownerDocument).find("#productDetails_detailBullets_sections1 > tbody > tr > th:contains('Best Sellers Rank')").parent().find("td > span > span:nth-child(1)").html();
    if (!rankStr) rankStr = '';
    return rankStr;
  }
  function processMerchantInfoDetails(html){
  	var ownerDocument = document.implementation.createHTMLDocument('virtual');
    if (!html) return '';
    var infoStr = $(html, ownerDocument).find('#merchant-info').html();
    if (!infoStr) infoStr = '';
    return infoStr;
  }
  function processBrand(html){
  	var ownerDocument = document.implementation.createHTMLDocument('virtual');
    if (!html) return '';
    var infoStr = $(html, ownerDocument).find('#brand').attr('href');
    if (!infoStr) infoStr = $(html, ownerDocument).find('#bylineInfo').attr('href');    
    if (!infoStr) infoStr = '';
    //console.log(infoStr);
    
    return infoStr;
  }
  function processSellers(html){
  	var ownerDocument = document.implementation.createHTMLDocument('virtual');
    if (!html) return '';

    //var $html = $(html, ownerDocument);
    var infoStr ="";
    if ($(html, ownerDocument).find('#olp_feature_div a:first-of-type').length > 0) {
      infoStr = $(html, ownerDocument).find('#olp_feature_div a:first-of-type')[0].href;      
    }
    if ($(html, ownerDocument).find('#sellerProfileTriggerId').length > 0) {
      if (!infoStr) infoStr = $(html, ownerDocument).find('#sellerProfileTriggerId')[0].href;
    }
    //infoStr = infoStr.find('a').attr('href');
    if (!infoStr) infoStr = '';
    //console.log(infoStr);
    
    return infoStr;
  }

  function getNewHtmlForSibling($sibling){
    var $img = $($sibling.find('img'));
    var $sub = $img;
    while ($sub.prop("tagName") != 'A'){
      $sub = $($sub.parent());
    }
    $sub = $($sub.parent());
    var href = $sub.find('a:first').attr('href');
    var tmp = $sub.html().split('</div>');
    var str = tmp[0] + '</div></a>'; //  + rankElement.html() + quickView.html() + asinView.html()
    str += '<a class="a-link-normal" href="' + href + '">';
    for (var i = 1; i < tmp.length; i++){
      if (i != tmp.length-1){
        str += tmp[i] + '</div>';
      }else{
        str += tmp[i] + '</div></a>';
      }
    }
    $sub.html(str);
    return $sub;
  }
  function getAmzLocation(){
    var cccAmzLocation = 'us';
    if(window.location.hostname == 'www.amazon.co.uk'){
      cccAmzLocation = 'uk';
    }
    if(window.location.hostname == 'www.amazon.de'){
      cccAmzLocation = 'de';
    }
    if(window.location.hostname == 'www.amazon.fr'){
      cccAmzLocation = 'fr';
    }
    if(window.location.hostname == 'www.amazon.co.jp'){
      cccAmzLocation = 'jp';
    }
    if(window.location.hostname == 'www.amazon.cn'){
      cccAmzLocation = 'cn';
    }
    return cccAmzLocation;
  }
  function getAmzLocationKeepa(){
    var cccAmzLocationKeepa = 'com';
    if(window.location.hostname == 'www.amazon.co.uk'){
      cccAmzLocationKeepa = 'uk';
    }
    if(window.location.hostname == 'www.amazon.de'){
      cccAmzLocationKeepa = 'de';
    }
    if(window.location.hostname == 'www.amazon.fr'){
      cccAmzLocationKeepa = 'fr';
    }
    if(window.location.hostname == 'www.amazon.co.jp'){
      cccAmzLocationKeepa = 'jp';
    }
    if(window.location.hostname == 'www.amazon.cn'){
      cccAmzLocationKeepa = 'cn';
    }
    return cccAmzLocationKeepa;
  }

  function popupAddContent(content){
    content = content || '<span style="color:#000000"><b>Loading ...</b></span>';
    $html = $("<div>");
    $html.append(content);
    $resultPopup.find('#popup-wraper').html($html);
    return $resultPopup;
  }

  return my;

})(Module || {});


Module.init();
