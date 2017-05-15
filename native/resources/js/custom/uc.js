/** UC **/
(function(global) {    
	var UC = function () {	
		this.users = new Storage('USERS');
	}
	
	UC.prototype.mac = function (url, method, token) {
        var url = Utils.expand(url);
		var access_token = token['access_token'];
		var nonce = Utils.nonce();
		//
		var mac_key = token['mac_key'];
        var uri = url.replace(/^.*?\/\/[^\/]*(\/.*)$/g, '$1');
		var host = url.replace(/^.*?\/\/([^\/]*)\/.*$/g, '$1');
		//
		var mac = CryptoJS.HmacSHA256([nonce, method, uri, host, ''].join('\n'), mac_key).toString(CryptoJS.enc.Base64);
		//
		return 'MAC id="' + access_token + '",nonce="' + nonce + '",mac="' + mac + '"';
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