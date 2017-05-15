/** Conversation **/
(function(window) {
	function CHAT (){
		this.conversation = new Storage('CONVERSATION');
	}
	/**
     * export to either browser or node.js
     */
    if (typeof exports !== 'undefined') {
        exports.CHAT = CHAT
    }
    else {
        window.CHAT = CHAT

        if (typeof define === 'function' && define.amd) {
            define(function() {
                return {
                    CHAT: CHAT
                }
            })
        }
    }
})(typeof window === 'undefined' ? this : window);