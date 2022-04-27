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
         EXPOSURECHANGE: "exposureChange",
         SIZECHANGE: 'sizeChange'
       };
     
     var PLACEMENTS = mraid.PLACEMENTS = {
         INLINE : "inline",
         INTERSTITIAL : "interstitial"
     };
     
     var FEATURES = mraid.FEATURES = {
         "SMS" : "sms",
         "TEL" : "tel",
         "STORE_PICTURE" : "storePicture",
         "INLINE_VIDEO" : "inlineVideo",
         "CALENDAR" : "calendar"
     };

     var version = '3.0';
     var state = STATES.LOADING;
     var placementType = PLACEMENTS.INTERSTITIAL;
     var listeners = [];
     var screenSize = { width:0, height:0 };
     var supportedFeatures = [];
     mraid.isViewable = false;

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
             mraid.fireEvent(EVENTS.STATECHANGE)
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
         mraid.fireEvent(EVENTS.SIZECHANGE)
     }
     
     mraid.viewableChange = function(viewable){
         mraid.isViewable = viewable;
         console.log("viewableChange: " + viewable);
         mraid.fireEvent(EVENTS.VIEWABLECHANGE)
     }
     
     mraid.setExposure = function(viewable){
         mraid.isViewable = viewable;
         console.log("setExposure: " + viewable);
         mraid.fireEvent(EVENTS.EXPOSURECHANGE)
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
     //                      Support for features
     // ------------------------------------------------------------------------------
     mraid.setSupports = function(feature, isSupported){
         console.log("set feature " + feature + " " + isSupported);
         supportedFeatures[feature] = isSupported;
     }
     
     mraid.supports = function(feature){
         console.log('supports - ' + feature + ' : ' + (supportedFeatures[feature] === true));
         return supportedFeatures[feature]=== true;
     }
     
     // ------------------------------------------------------------------------------
     //                      Event Listeners
     // ------------------------------------------------------------------------------
     
     mraid.fireEvent = function(event){
         console.log("fire event (" + event + ")");
         if(listeners.containsEvent(event)){
             listeners.invoke(event);
         }
     }
     
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
     
     
     listeners.invoke = function(event){
         listeners[event].forEach(function(listener){
             listener();
         });
     }

     listeners.containsEvent = function(event){
         return Array.isArray(listeners[event]);
     }

     listeners.containsListener = function(event, listener){
         var listenerString = String(listener);
         if(Array.isArray(listeners[event])){
             listeners[event].forEach(function(listener){
                 var thisStr = String(listener);
                 if(thisStr === listenerString){
                     return true;
                 }
             });
         }
         return false;
     }

     listeners.removeListener = function(event, listener){
         var listenerString = String(listener);
         var index = -1;
         if(Array.isArray(listeners[event])){
             listeners[event].forEach(function(listener){
                 var thisStr = String(listener);
                 if(thisStr === listenerString){
                     console.log("removing event listener (" + event + ")");
                     index = listeners[event].indexOf(listener);
                 }
             });
         }
         if(index > 0){
             listeners[event].splice(index, 1);
         }
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
