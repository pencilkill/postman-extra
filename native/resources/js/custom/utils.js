/** Utils **/
(function(window) {
	function Utils (){};
    //
	Utils.getMd5Value = function (str) {
		return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(str)).toString();
	}
	
	Utils.getSaltMd5Value = function (str) {
		return this.getMd5Value(str + '\xa3\xac\xa1\xa3fdjf,jkgfkl').toString();
	}
	
	Utils.randomString = function (n) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < n; i++ )
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	
	Utils.nonce = function () {
		var time_length = 13;
		var random_length = 8;
		if(arguments.length > 0)
		{
			time_length = parseInt(arguments[0]);
		}
		if(arguments.length > 1)
		{
			random_length = parseInt(arguments[1]);
		}
			
		return (new Date().getTime() + '').substring(0, time_length) + ':' + this.randomString(random_length).toLowerCase();	
	}
	
	Utils.expand = function (url) {
		return url.replace(/(?:\{\{)[^\{^\}]+(?:\}\})/g, function (key) {var _key = key.replace(/(^\{*)|(\}*$)/g, '');
			return postman.getGlobalVariable(_key) || postman.getEnvironmentVariable(_key) || key;
		});
	}
    	
	Utils.removeQueryString = function (url, key) {
		return this.expand(url).replace(new RegExp('[\?\&]' + key + '\=[^\&]*'), '').replace(/\?\s*^/, '');
	}
	
	Utils.parse64 = function (str){
		return JSON.parse(CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8));
	}
	
	/**
     * export to either browser or node.js
     */
    if (typeof exports !== 'undefined') {
        exports.Utils = Utils
    }
    else {
        window.Utils = Utils

        if (typeof define === 'function' && define.amd) {
            define(function() {
                return {
                    Utils: Utils
                }
            })
        }
    }
})(typeof window === 'undefined' ? this : window);