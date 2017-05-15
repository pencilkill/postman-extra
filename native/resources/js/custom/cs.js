/** CS **/
(function(window) {
	function CS (){
		this.session = new Storage('SESSIONS');
		this.token = new Storage('TOKENS');
		this.dentry = new Storage('DENTRIES');    
	}
	/**
     * export to either browser or node.js
     */
    if (typeof exports !== 'undefined') {
        exports.CS = CS
    }
    else {
        window.CS = CS

        if (typeof define === 'function' && define.amd) {
            define(function() {
                return {
                    CS: CS
                }
            })
        }
    }
})(typeof window === 'undefined' ? this : window);