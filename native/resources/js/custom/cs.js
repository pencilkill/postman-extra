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