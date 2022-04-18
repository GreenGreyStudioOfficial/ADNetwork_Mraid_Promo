 (function() {
     var mraid = window.mraid = {};
     
     var STATES = mraid.STATES = {
         LOADING: 'loading',
         DEFAULT: 'default'
       };

     var version = '3.0';
     var state = STATES.LOADING;
     mraid.debug = false;
     
     var screenSize = { width:0, height:0 };
     mraid.bigScreen = false;
     mraid.landscapeMode = false;
     mraid.isViewable = true;

     mraid.getVersion = function() {
         log('getVersion (version = ' + version + ")");
         return version;
     };
     
     mraid.getState = function(){
         log('getState (state = ' + state + ")");
         return state;
    }
     
     mraid.getScreenSize = function(){
         return screenSize;
     }
     
     mraid.setScreenSize = function(width,height,bigScreen){
         screenSize.width = width;
         screenSize.height = height;
         
         mraid.bigScreen = bigScreen;
         mraid.landscapeMode = width > height;
         
         log("setScreenSize: " + "w: " + width + ", h: " + height + ", big: " + bigScreen);
         
         document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "resizeChangeEvent"}}));
     }
     
     mraid.setViewable = function(viewable){
         mraid.isViewable = viewable;
         log("setViewable: " + viewable);
         document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "viewableChangeEvent"}}));
     }

     mraid.invokeSDK = function (event) {
         //log(event);
         window.webkit.messageHandlers.nativeapp.postMessage(event);
     }
     
     mraid.setState = function(toState){
             log("setState (" + toState + ")" );
             if(state != toState){
                 state = toState;
                 document.dispatchEvent(new CustomEvent("mraidEvent", {bubbles: true,detail:{type: "stateChangeEvent"}}));
             }
         }
     
     function log(str){
         if(mraid.debug){
             console.log('mraid.js::' + str);
         }
     }
     
     mraid.setState(STATES.DEFAULT);
     
 }());
