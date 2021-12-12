function getASIN()
{
	var asin = document.getElementById("ASIN");
	return asin;
}

function ID () 
{
	return '_' + Math.random().toString(36).substr(2, 9);
};
function checkIdExistance(userid) {

	return new Promise(function(resolve,reject){
	{
		httpGetExt("https://amazon-ext.imi.biz.ua/api/user/"+userid,true)
		.then((data)=>{
			var res=JSON.parse(data);
			resolve(res.UserVerified);
		});
		
	}})
	
}
function checkUser(userid)
{
	return new Promise(function(resolve,reject)
	{
		return checkIdExistance(userid)
		.then(
			(result)=>
			{
				if(result)
					resolve(true);
				else
					resolve(false);
				})
	});
}
function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function getUserId() {

	return new Promise(function(resolve,reject){
	{
		chrome.storage.local.get(['userID'], function(result) {
			if(result.userID == null)
			{
				result.userID = ID();

				chrome.storage.local.set({userID: result.userID}, function() {
				});
			}
			var	userID = result.userID;
			resolve(userID);
		});
	}})
	
}
function processStatusText(statusText)
{
	var response=JSON.parse(JSON.parse(statusText).Result);
	
	console.log(response.eligibleToReview);
	return response.eligibleToReview;
}

function httpGetExt(url,isJson) {

    return new Promise(function(resolve, reject) {
  
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      if(isJson)
        xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        if (this.status == 200) {
          resolve(this.response);
        } else {
          var error = new Error(this.statusText);
          error.code = this.status;
          reject(error);
        }
      };
  
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };
  
      xhr.send();
    });
  
	}
	function httpPostExt(url,parameters,isJson) {

    return new Promise(function(resolve, reject) {
  
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      if(isJson)
        xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        if (this.status == 200) {
          resolve(this.response);
        } else {
          var error = new Error(this.statusText);
          error.code = this.status;
          reject(error);
        }
      };
  
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };
  
      xhr.send(JSON.stringify(parameters));
    });
  
  }
  function httpGet(url)
  {
    return httpGetExt(url,false);
  }
function mkRequest(attribute_asin)
{
	console.log('mkRequest');
    return httpGet("https://amazon-ext.imi.biz.ua/api/product/"+attribute_asin,true);
}