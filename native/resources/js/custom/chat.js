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