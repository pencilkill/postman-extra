/** STORAGE **/
(function(window) {
	function Storage (name) {
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
    if (typeof exports !== 'undefined') {
        exports.Storage = Storage
    }
    else {
        window.Storage = Storage

        if (typeof define === 'function' && define.amd) {
            define(function() {
                return {
                    Storage: Storage
                }
            })
        }
    }
})(typeof window === 'undefined' ? this : window);