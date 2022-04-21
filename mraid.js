 (function() {
     var mraid = window.mraid = {};
     
     var STATES = mraid.STATES = {
        LOADING: 'loading',
        DEFAULT: 'default',
        HIDDEN: 'hidden'
     };

     var version = '3.0';
     var state = STATES.LOADING;
     
     var screenSize = { width:0, height:0 };
     mraid.isViewable = true;

     mraid.getVersion = function() {
         //console.log('getVersion (version = ' + version + ")");
         return version;
     };
     
     mraid.getState = function(){
         //console.log('getState (state = ' + state + ")");
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
     
     mraid.getScreenSize = function(){
         return screenSize;
     }
     
     mraid.setScreenSize = function(width,height){
         screenSize.width = width;
         screenSize.height = height;
         //console.log("setScreenSize: " + "w: " + width + ", h: " + height);
         document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "sizeChange"}}));
     }
     
     mraid.setExposure = function(viewable){
         mraid.isViewable = viewable;
         //console.log("setViewable: " + viewable);
         document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "exposureChange"}}));
     }

     
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
