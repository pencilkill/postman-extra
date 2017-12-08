/** Utils **/
(function(global) {
	var Utils = function(){};
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
    if (typeof define === 'function' && define.amd) {
        define(function () { return Utils; });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Utils;
        }
        exports.Utils = Utils;
    } else {
        global.Utils = Utils;
    }
})(this);
 
/** STORAGE **/
(function(global) {
	var Storage = function (name) {
		this.name = name;
	}
    
	Storage.prototype.cache = function () {
        return (postman && JSON.parse(postman.getEnvironmentVariable(this.name) || '{}')) || {}
    }
	
	Storage.prototype.read = function (key) {
        var _u = this.cache();
        if($.isArray(key) === false)
        {
            key = [key];
        }
        for(var i = 0; i < key.length && _u; i++){
            _u = _u[key[i]];
        }
        //
        return _u;	
    }
	
	Storage.prototype.object = function (key) {
        var _u = this.read(key) || {};
        //
        return _u;	
    }
	
	Storage.prototype.write = function (key, value) {
        var _u = this.cache();
        if($.isArray(key) === false)
        {
            key = [key];
        }
        var __u = _u;
        for(var i = 0; i < key.length - 1; i++){
            __u[key[i]] = __u[key[i]] || {};
            __u = __u[key[i]];
        }
        __u[key[key.length - 1]] = value;
        //
        postman.setEnvironmentVariable(this.name, JSON.stringify(_u));
    }
	
	Storage.prototype.merge = function (key, value) {
        var _v = this.read(key);
        JSON.stringify($.extend(true, _v, value));
        this.write(key, _v);
    }
	
	Storage.prototype.clear = function () {
        postman.setEnvironmentVariable(this.name, '{}');
    }
	/**
     * export to either browser or node.js
     */
    if (typeof define === 'function' && define.amd) {
        define(function () { return Storage; });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Storage;
        }
        exports.Storage = Storage;
    } else {
        global.Storage = Storage;
    }
})(this);

/** UC **/
(function(global) {
	var UC = function () {	
		this.users = new Storage('USERS');
        this.btses = new Storage('BTSES');
	}
    	
	UC.prototype.encryptMac = function (url, method, access_token, nonce, mac_key) {
        var url = Utils.expand(url);
        
        var uri = url.replace(/^.*?\/\/[^\/]*(\/.*)$/g, '$1');
		var host = url.replace(/^.*?\/\/([^\/]*)\/.*$/g, '$1');
		//
		var mac = CryptoJS.HmacSHA256([nonce, method, uri, host, ''].join('\n'), mac_key).toString(CryptoJS.enc.Base64);
		//
		return 'MAC id="' + access_token + '",nonce="' + nonce + '",mac="' + mac + '"';
	}
	
	UC.prototype.mac = function (url, method, token) {
		return this.encryptMac(url, method, token['access_token'], Utils.nonce(), token['mac_key']);
	}
	
	UC.prototype.umac = function (url, method, key) {
		var token = this.users.read([key, 'token']);
		
		return this.mac(url, method, token);
	}
	
	UC.prototype.mac64 = function (url, method, token) {
		
		return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(this.mac(url, method, token)));
	}
	
	UC.prototype.umac64 = function (url, method, key) {
		var token = this.users.read([key, 'token']);
		
		return this.mac64(url, method, token);
	}
    	
	UC.prototype.amac = function (token) {
		var access_token = token['access_token'];
		var nonce = token['nonce'];
		var mac = token['mac'];
		//
		return 'MAC id="' + access_token + '",nonce="' + nonce + '",mac="' + mac + '"';;
	}
	
	UC.prototype.uamac = function (key) {
		var token = this.users.read([key, 'token']);
		
		return this.amac(token);
	}
	
	UC.prototype.bearer = function (token) {
		var access_token = token['access_token'];
		//
		return 'Bearer "' + access_token + '"';
	}
	
	UC.prototype.ubearer = function (key) {
		var token = this.users.read([key, 'token']);
		
		return this.bearer(token);
	}
        	
	UC.prototype.enctyptBts = function (url, method, access_token, mac_key) {
        var url = Utils.expand(url);

        var uri = url.replace(/^.*?\/\/[^\/]*(\/.*)$/g, '$1');
		var host = url.replace(/^.*?\/\/([^\/]*)\/.*$/g, '$1');
		//
		var mac = CryptoJS.HmacSHA256([method, uri, host, ''].join('\n'), mac_key).toString(CryptoJS.enc.Base64);
		//
		return 'BTS id="' + access_token + '",mac="' + mac + '"';
	}
    	
	UC.prototype.bts = function (url, method, token) {
        return this.encryptMac(url, method, token['access_token'], token['mac_key']);
	}
	
	UC.prototype.ubts = function (url, method, key) {
		var token = this.btses.read([key, 'token']);
		
		return this.bts(url, method, token);
	}
	
	UC.prototype.open = function (token) {
		var app_id = token['portal_name'];
        var open_id = token['open_id'];
		var open_key = token['open_key'];
		var nonce = Utils.nonce();
		//
		var token = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(open_id + nonce + open_key)).toString();
		//
		return 'APP appid="' + app_id + '",openid="' + open_id + '",nonce="' + nonce + '",token="' + token + '"';
	}
	
	UC.prototype.uopen = function (key) {
		var token = this.users.read([key, 'user_info']);
		
		return this.open(token);
	}
	/**
     * export to either browser or node.js
     */
    if (typeof define === 'function' && define.amd) {
        define(function () { return UC; });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = UC;
        }
        exports.UC = UC;
    } else {
        global.UC = UC;
    }
})(this);

/** CS **/
(function(global) {
	var CS = function (){
		this.session = new Storage('SESSIONS');
		this.token = new Storage('TOKENS');
		this.dentry = new Storage('DENTRIES');    
	}
/**
     * export to either browser or node.js
     */
    if (typeof define === 'function' && define.amd) {
        define(function () { return CS; });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = CS;
        }
        exports.CS = CS;
    } else {
        global.CS = CS;
    }
})(this);

/** Conversation **/
(function(global) {
	var CHAT = function (){
		this.conversation = new Storage('CONVERSATION');
	}
	/**
     * export to either browser or node.js
     */
    if (typeof define === 'function' && define.amd) {
        define(function () { return CHAT; });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = CHAT;
        }
        exports.CHAT = CHAT;
    } else {
        global.CHAT = CHAT;
    }
})(this);