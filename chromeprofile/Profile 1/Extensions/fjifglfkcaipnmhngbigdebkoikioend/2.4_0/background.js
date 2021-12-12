// URLs
var extnVer = 'chrome_v2.4';
var campaignInfo = '?utm_source=extension&utm_content=' + extnVer;
var baseApiUrl = 'https://reviewmeta.com/api/';
var baseUrl = 'https://reviewmeta.com/';
var apiUrls = {};
apiUrls[1] = 'amazon/';
apiUrls[2] = 'bodybuilding/';
apiUrls[4] = 'amazon-ca/';
apiUrls[3] = 'amazon-uk/';
apiUrls[5] = 'amazon-au/';
apiUrls[7] = 'amazon-fr/';
apiUrls[6] = 'amazon-de/';
apiUrls[8] = 'amazon-it/';
apiUrls[9] = 'amazon-jp/';
apiUrls[10] = 'amazon-in/';
apiUrls[11] = 'amazon-es/';
apiUrls[12] = 'amazon-cn/';
apiUrls[13] = 'amazon-mx/';
apiUrls[14] = 'amazon-br/';
apiUrls[15] = 'amazon-nl/';
apiUrls[16] = 'amazon-sg/';

//Support URL
var supportUrl = 'https://reviewmeta.com/blog/reviewmeta-browser-extension-support-and-faq/?utm_source=ext_install&utm_content=' + extnVer;

// base URL, browser icon click sends to this url if we are not on amazon or BB product page
var clickURLBase = 'https://reviewmeta.com' + campaignInfo;

// BB store regex
var BBStoreRegex = /bodybuilding.com\/store\/(.+?)\/(.+?)\.htm/i;
// BB review regex
var BBReviewRegex = /reviews.bodybuilding.com\/(.+?)\/(.+?)\//i;

// store all amazon product tab ID with data here
// so we can update icon and click url when user switches tabs
var tabsWithProducts = {};
// get manifest as object
var manifest = chrome.runtime.getManifest();
// this function gets overriden depending on active tab
var rMurls = {};

//This object will store the existing source/product data for each Tab so we aren't updating needlessly.
var tabsData = {};

//This object will store any existing API results so we aren't hitting the API needlessly.
var apiData = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {}, 11: {}, 12: {}, 13: {}, 14: {}, 15: {} };

//Every time a tab is updated, this is run.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  	if(changeInfo.url){
  		//We got the new URL.  Let's Parse.
  		var newUrl = changeInfo.url;
  		var urlData = parseUrl(newUrl);
  		
  		if(urlData && urlData.source){
  			//Yay! This is a product page.	
  			//Did the tabsData change?  Because if not, we do NOTHING!
  			if (compareData(urlData,tabsData[tabId])){
  				//Yes, it has changed.  Update the tabsData to reflect this.
  				tabsData[tabId] = urlData;
  				
  				//First, let's check to see if we already have the response data:
  				var apiResult = fetchSavedResponseData(urlData);
  				if (apiResult && apiResult.timestamp) {
  					//Yup!  We already have it!
  					tabsWithProducts[tabId] = apiResult.response;
					setBrowserIcon(tabId);
  				} else {
  					//Nope, need to hit API.
  					//Set the data to loading.
  					var tempLoading = {};
  					tempLoading['href'] = 'loading';
  					tabsWithProducts[tabId] = tempLoading;
					setBrowserIcon(tabId);
  					sendToAPI(urlData, function(response) {
						if (response) {
							// insert response into tabs object
							tabsWithProducts[tabId] = response;
							saveResponseData(urlData, response);
							setBrowserIcon(tabId);
						}
					});
  				}
  			}
  		}else{
  			//It's not a product page of any sort, so let's close 'er down!
			delete tabsWithProducts[tabId];
			delete tabsData[tabId];
			setBrowserIcon(tabId);
  		}
	} else if ( changeInfo.status === 'loading' && tabsWithProducts[tabId] ) {
		//Otherwise, it's loading with no "new URL".  Could be a refresh?  could be navigating away.
        chrome.tabs.get(tabId, function (tab) {
        	if( tab == null || tab.url == null || tab.url.indexOf('reviewmeta.com') !== -1 ) {
        		//We aren't on Amazon anymore!  Shut 'er down!
				delete tabsWithProducts[tabId];
				delete tabsData[tabId];
			}
			setBrowserIcon(tabId);
        });
	
	}
});

//Hey!  It's the first install!  Let's show them the support page!
chrome.runtime.onInstalled.addListener(function(details) {
  	if(details.reason == 'install'){
		chrome.tabs.create({
			url: supportUrl
		});
  	}
});

/*
//Every time tab is "changed", we re-load the proper stuff in extension icon.
chrome.tabs.onActivated.addListener(function(tabInfo) {
	if (tabInfo.tabId) {
		setBrowserIcon(tabInfo.tabId);
	}
});
*/

//When you CLICK the Extension icon!
chrome.browserAction.onClicked.addListener(function(tabId) {
	var destinationURL = clickURLBase;
	
	if(rMurls[tabId.id] === undefined){   
		destinationURL = clickURLBase;
	}else{
		destinationURL = rMurls[tabId.id] + campaignInfo;
	}

	chrome.tabs.create({
		url: destinationURL
	});
});

//This function takes a URL and figures out the source, Item_id, product_slug, brand_slug, product_slug_review, brand_slug_review
function parseUrl(url) {
	//First let's figure out what is the source.
	var ret = {};
	var productSource = 0;
	var urlType = 1;
	if (url.indexOf('amazon.com.au') !== -1) {	
  		productSource = 5;
	} else if (url.indexOf('amazon.com.mx') !== -1) {	
  		productSource = 13;
	} else if (url.indexOf('amazon.com.br') !== -1) {	
  		productSource = 14;
	} else if (url.indexOf('amazon.ca') !== -1) {	
  		productSource = 4;
	} else if (url.indexOf('amazon.co.uk') !== -1) {	
  		productSource = 3;
	} else if (url.indexOf('amazon.com') !== -1) {	
  		productSource = 1;
	} else if (url.indexOf('amazon.de') !== -1) {	
  		productSource = 6;
	} else if (url.indexOf('amazon.fr') !== -1) {	
  		productSource = 7;
	} else if (url.indexOf('amazon.it') !== -1) {	
  		productSource = 8;
	} else if (url.indexOf('amazon.co.jp') !== -1) {	
  		productSource = 9;
	} else if (url.indexOf('amazon.in') !== -1) {	
  		productSource = 10;
	} else if (url.indexOf('amazon.es') !== -1) {	
  		productSource = 11;
	} else if (url.indexOf('amazon.cn') !== -1) {	
  		productSource = 12;
	} else if (url.indexOf('amazon.nl') !== -1) {	
  		productSource = 15;
	} else if (url.match(BBStoreRegex)) {
  		productSource = 2;
	} else if (url.indexOf('/supplement-reviews/') == -1 && addTrailingSlash(url).match(BBReviewRegex)) {
  		productSource = 2;
		var urlType = 2;
	}
	
	if (productSource == 2) {
		//It's BB.
		if (urlType == 1) {
			//It's a store page
			var matchResults = url.match(BBStoreRegex);
			if (matchResults && matchResults[1] && matchResults[2]) {
				ret.source = productSource;
				ret.urlType = 'store';
				ret.brandSlug = matchResults[1];
				ret.productSlug = matchResults[2];
			}
		} else if (urlType == 2) {
			//It's a review page
			var matchResults = addTrailingSlash(url).match(BBReviewRegex);
			if (matchResults && matchResults[1] && matchResults[2]) {
				ret.source = productSource;
				ret.urlType = 'review';
				ret.brandSlug = matchResults[1];
				ret.productSlug = matchResults[2];
			}
		}
	} else if (productSource) {
		//Otherwise it's an Amazon.
		
		var isMemberReview = url.search('/member-reviews/');
		var isCustomerReview = url.search('/customer-reviews/');
		var isCustomerProfile = url.search('/profile/');
		var isSingleReview = url.search('/review/');

		if ( isMemberReview >= 0 || isCustomerReview >= 0 || isCustomerProfile >= 0 || isSingleReview >= 0 ) {
			ret = {};
		} else {
			var matchResults = url.match("\\/([A-Z0-9]{10})(?:\\/|\\?|$|#)");
			
			if (matchResults && matchResults && matchResults[1] && matchResults[1].length) {
				ret.asin = matchResults[1];
				ret.source = productSource;
			}
		}
	}
	return ret;
}

//This function sees if the new data has changed.
function compareData(newData, oldData) {
	var ret = 1;
	if (oldData && newData.source == oldData.source) {
		if (newData.source == 2) {
			if (newData.productSlug == oldData.productSlug && newData.brandSlug == oldData.brandSlug) {
				ret = 0;
			}
		} else {
			if (newData.asin == oldData.asin) {
				ret = 0;
			}
		}
	}
	return ret;
}

function fetchSavedResponseData(urlData) {
	var ret = {};
	var onHrAgo = Date.now() - 3600000;
	var itemId = '';
	
	if (urlData.source == 2 ) {
		itemId = urlData.brandSlug + '-' + urlData.productSlug;
	} else { 
		itemId = urlData.asin;
	}
	if ( apiData[urlData.source][itemId] && apiData[urlData.source][itemId].timestamp > onHrAgo ) {
		ret = apiData[urlData.source][itemId];
	}
	
	return ret;
}

function saveResponseData(urlData, response) {
	var itemId = '';
	if (urlData.source == 2 ) {
		itemId = urlData.brandSlug + '-' + urlData.productSlug;
	} else { 
		itemId = urlData.asin;
	}
	
	apiData[urlData.source][itemId] = {};
	apiData[urlData.source][itemId]['response'] = response;
	apiData[urlData.source][itemId]['timestamp'] = Date.now();
}

// function that handles API request
function sendToAPI(urlData, callback) {
	//First let's figure out the URL.
	var URL = baseApiUrl + apiUrls[urlData.source];
	
	if (urlData.source == 2) {
		URL = URL + urlData.brandSlug + '/' + urlData.productSlug + '/' + urlData.urlType;
	} else {
		URL = URL + urlData.asin;
	}

	//Now process.
	var xhr = new XMLHttpRequest();
	// GET request on APIURL
	xhr.open('GET', URL, true);
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4) {
			// if request is finished and successful send response in callback
			if (xhr.status == 200 && xhr.responseText && xhr.responseText.length > 1) {
				var jsonResponse = JSON.parse(xhr.responseText);
				callback(jsonResponse);
				// else send empty object
			} else {
				callback({});
			}
		}
	};
	xhr.send();
}

// sets the browser icon
function setBrowserIcon(tabId) {
	if (tabsWithProducts[tabId]) {
		var product = tabsWithProducts[tabId];
	
		if ( product.href == 'loading' ) {
			//It's loading phase.
			chrome.browserAction.setIcon({
				path : "icons/icon_loading.png",
				tabId: tabId
			});
			chrome.browserAction.setBadgeText({
				text: 'load',
				tabId: tabId
			});
			chrome.browserAction.setBadgeBackgroundColor({
				color: '#cacaca',
				tabId: tabId
			});
			
			//Let's guess at the URL.
			if ( tabsData[tabId]  && tabsData[tabId].source) {
				if( tabsData[tabId].source == 2 ){
					if( tabsData[tabId].urlType == 'store' &&  tabsData[tabId].brandSlug && tabsData[tabId].productSlug) {
						rMurls[tabId] = baseUrl + apiUrls[2] + tabsData[tabId].brandSlug + '/' + tabsData[tabId].productSlug;
					} else {
						rMurls[tabId]=clickURLBase;
					}
				} else if ( tabsData[tabId].asin ) {
					rMurls[tabId] = baseUrl + apiUrls[tabsData[tabId].source] + tabsData[tabId].asin;
				} else {
					rMurls[tabId]=clickURLBase;
				}
			} else {
				rMurls[tabId]=clickURLBase;
			}
			
		} else { 
			//Light it up.
			chrome.browserAction.setIcon({
				path : "icons/default_icon_lit.png",
	  			tabId: tabId
			});
	
			// if product rating is 0
			if (product.rating === 0) {
				chrome.browserAction.setBadgeBackgroundColor({
					color: '#ff0000',
					tabId: tabId
				});
				chrome.browserAction.setBadgeText({
					text: 'N/A',
					tabId: tabId
				});
				return;
			}
			// if product is detected on amazon, but API returned blank
			if (!product.rating || !product.s_overall) {
				chrome.browserAction.setBadgeBackgroundColor({
					color: '#0000ff',
					tabId: tabId
				});
				chrome.browserAction.setBadgeText({
					text: '-',
					tabId: tabId
				});
				return;
			}

			// else, product is found on API
			// set badge color and rating
			chrome.browserAction.setBadgeText({
				text: product.rating + '',
				tabId: tabId
			});

			if (product.s_overall == 1) {
				chrome.browserAction.setBadgeBackgroundColor({
					color: '#48BD3A',
					tabId: tabId
				});
			} else if (product.s_overall == 2) {
				chrome.browserAction.setBadgeBackgroundColor({
					color: '#B5BA16',
					tabId: tabId
				});
			} else {
				chrome.browserAction.setBadgeBackgroundColor({
					color: '#ff0000',
					tabId: tabId
				});
			}
			rMurls[tabId]=product.href;
		}
		return;
	}
	// if non of the above returned we are on some other page
	// set default icon
	chrome.browserAction.setBadgeText({
		text: '',
		tabId: tabId
	});
	chrome.browserAction.setBadgeBackgroundColor({
		color: '#ff0000',
		tabId: tabId
	});
	chrome.browserAction.setIcon({
	  path : "icons/default_icon.png",
	  tabId: tabId
	});
	rMurls[tabId]=clickURLBase;
}

// add trailing slash to URL if does not exist
function addTrailingSlash(url) {

	return url.replace(/\/?$/, '/');
}

//checks if image exists
function imageExists(url) {
	var img = new Image();
	img.src = url;
	return img.height !== 0;
}