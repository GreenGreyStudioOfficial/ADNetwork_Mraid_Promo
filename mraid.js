 (function() {
     var mraid = window.mraid = {};
     
     var STATES = mraid.STATES = {
        LOADING: 'loading',
        DEFAULT: 'default',
        HIDDEN: 'hidden'
     };
     
     var EVENTS = mraid.EVENTS = {
         ERROR: 'error',
         INFO: 'info',
         READY: 'ready',
         STATECHANGE: 'stateChange',
         VIEWABLECHANGE: 'viewableChange',
         SIZECHANGE: 'sizeChange'
       };
     
     var PLACEMENTS = mraid.PLACEMENTS = {
         INLINE : "inline",
         INTERSTITIAL : "interstitial"
     };

     var version = '3.0';
     var state = STATES.LOADING;
     var placementType = PLACEMENTS.INTERSTITIAL;
     var listeners = [];
     var screenSize = { width:0, height:0 };
     mraid.isViewable = true;

     mraid.getVersion = function() {
         console.log('getVersion (version = ' + version + ")");
         return version;
     };
     
     // ------------------------------------------------------------------------------
     //                      State
     // ------------------------------------------------------------------------------
     
     mraid.getState = function(){
         console.log('getState (state = ' + state + ")");
         return state;
    }
     
     mraid.setState = function(toState){
         console.log("setState (" + toState + ")" );
         if(state != toState){
             state = toState;
             document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "stateChange"}}));
             if (state === STATES.DEFAULT) {
                 document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "ready"}}));
             }
         }
    }
     
     // ------------------------------------------------------------------------------
     //                      Screen size
     // ------------------------------------------------------------------------------
     
     mraid.getScreenSize = function(){
         return screenSize;
     }
     
     mraid.setScreenSize = function(width,height){
         screenSize.width = width;
         screenSize.height = height;
         console.log("setScreenSize: " + "w: " + width + ", h: " + height);
         document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "sizeChange"}}));
     }
     
     mraid.setExposure = function(viewable){
         mraid.isViewable = viewable;
         console.log("setViewable: " + viewable);
         document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "exposureChange"}}));
     }
     
     // ------------------------------------------------------------------------------
     //                      Placement
     // ------------------------------------------------------------------------------
     
     mraid.getPlacementType = function(){
         console.log('getPlacementType');
         return placementType;
     }
     
     mraid.setPlacementType = function(type){
        if(type == PLACEMENTS.INLINE || type == PLACEMENTS.INTERSTITIAL) {
            console.log('setPlacementType: ' + type);
            placementType = type;
        }
     }
     
     // ------------------------------------------------------------------------------
     //                      Event Listeners
     // ------------------------------------------------------------------------------
     
     mraid.addEventListener = function(event, listener){
         if(listeners.containsListener(event, listener)){
             console.log('addEventListener - this function already registered for (' + event + ') event.');
             return;
         }
         console.log('addEventListener (event = ' + event + ')');
         listeners[event] = listeners[event] || [];
         listeners[event].push(listener);
     }

     mraid.removeEventListener = function(event, listener){
         listeners.removeListener(event, listener);
     }

    // ------------------------------------------------------------------------------
    //                      Actions from UI
    // ------------------------------------------------------------------------------
     
     mraid.close = function() {
         mraid.setState(STATES.HIDDEN);
         window.webkit.messageHandlers.nativeapp.postMessage({"type":"close"});
     }
     
     mraid.unload = function() {
         mraid.setState(STATES.HIDDEN);
         window.webkit.messageHandlers.nativeapp.postMessage({"type":"close"});
     }
     
     mraid.open = function(url) {
         let eventType = url.startsWith("tel://") ? "call" : "click";
         window.webkit.messageHandlers.nativeapp.postMessage({"type":eventType, "value":url});
     }
     
     mraid.storePicture = function(url){
         window.webkit.messageHandlers.nativeapp.postMessage({"type":"save", "value":url});
     }
     
 }());
