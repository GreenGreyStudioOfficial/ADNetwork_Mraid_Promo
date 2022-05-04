/*
 * promo.js
*/

/*
function Download(url,onComplete) {
    console.log("Start download: " + url);
    var http = new XMLHttpRequest();
    http.open('GET', url,true);
    http.responseType = 'blob';
    http.onload = function() {
        console.log("BANANA")
        if (this.status === 200|| this.status == 0) {
            const localUrl = URL.createObjectURL(this.response);
            console.log("Video downloaded: " + localUrl);
            onComplete(localUrl);
        }
    }
    
    http.onerror = function(error){
        console.log("DOWNLOAD ERROR: ");
        console.log(error);
    }
    
    http.send();
}

function ProcessUrl(id, url,onComplete) {
    var http = new XMLHttpRequest();
    http.open('GET', url);
    http.responseType = 'blob';
    
    http.onload = function() {
        if (this.status === 200|| this.status == 0) {
            const localUrl = URL.createObjectURL(this.response);
            //console.log("onload. ID: " + id + ", localUrl: " + localUrl);
            onComplete(id, localUrl);
        }
    }
    
    http.onerror = function() {
        console.log('err' ,arguments);
    }
    http.send();
}

// Media cache
function MediaCache(frames) {
    this.data = {};
    this.requests = new Array();
    
    frames.forEach(function (frame){
        switch (frame.type) {
          case "VideoPlayer":
                processVideoFrameData(frame);
                break;
          case "ImageCard":
                //processImageFrameData(frame);
                break;
          default:
                break;
        }
    })
    
    function processVideoFrameData(frame) {
        if (frame.videoPortraitFileId && frame.videoPortraitUrl) {
            queueMedia(frame.videoPortraitFileId, frame.videoPortraitUrl);
        }
        if (frame.videoLandscapeFileId && frame.videoLandscapeUrl) {
            queueMedia(frame.videoLandscapeFileId, frame.videoLandscapeUrl);
        }
        //if (frame.logoImageFileId && frame.videoPortraitUrl) {
        //    queueMedia(frame.logoImageFileId, frame.logoImageUrl);
        //}
    }
    
    function processImageFrameData(frame) {
        if (frame.imagePortraitFileId && frame.imagePortraitUrl) {
            queueMedia(frame.imagePortraitFileId, frame.imagePortraitUrl);
        }
        if (frame.imageLandscapeFileId && frame.imageLandscapeUrl) {
            queueMedia(frame.imageLandscapeFileId, frame.imageLandscapeUrl);
        }
        if (frame.buttonStoreFileId && frame.buttonStoreUrl) {
            queueMedia(frame.buttonStoreFileId, frame.buttonStoreUrl);
        }
    }
    
    function queueMedia(id, url) {
        console.log("Download media. ID: " + id + ", URL: " + url);
        
        let that = this;
         this.requests.push(new ProcessUrl(id,url, function onComplete(id, localUrl) {
             console.log("Downloaded. ID: " + id + ", localUrl: " + localUrl);
             that.data[id] = localUrl;
         }))
         
    }
}

*/

// Video player
function Player (containerId, data){
    //console.log("Player in container: " + containerId);
    this.data = data;
    this.currentTime = undefined;
    this.videoDuration = undefined;
    
    this.impression = undefined;
    this.midpoint = undefined;
    this.firstQuartile = undefined;
    this.midpoint = undefined;
    this.thirdQuartile = undefined;
    this.complete = undefined;
    this.containerId = containerId;
    
    let container = document.getElementById(containerId);
    let video = document.createElement("video");
    video.className = "videoView";
    video.id = `video-${containerId}`;
    video.autoplay = false//containerId == "0";
    video.muted = true;
    video.playsinline = true;
    video.webkitPlaysinline = true;
    video.controls = false;
    video.preload = "metadata";
    video.setAttribute('playsinline',"playsinline");
    container.appendChild(video);

    let that = this;
    
    video.onloadedmetadata = function() {
        console.log("video.onloadedmetadata");
        that.videoDuration = Math.round(this.duration);
        this.currentTime = that.currentTime ? that.currentTime : 0;
    }
      
    //video.onloadeddata = function(){
    //  console.log("video.onloadeddata");
    //}

    video.addEventListener("click", function(event) {
      this.muted = !this.muted;
    });

    video.addEventListener('timeupdate', function(event) {
      that.currentTime = this.currentTime;
      const progress = Math.round(this.currentTime/that.videoDuration*100)/100;
                                  
      if (!that.impression && (this.currentTime >= data.impTrackingTimeout/1000)) {
        that.impression = progress;
        this.dispatchEvent(new CustomEvent("playBackEvent", {bubbles: true,detail:{type: "impression"}}));
      }
                                  
      if (!that.firstQuartile && (progress >= 0.24 && progress <= 0.26)) {
        that.firstQuartile = progress;
        this.dispatchEvent(new CustomEvent("playBackEvent", {bubbles: true,detail:{type: "firstQuartile"}}));
      }

      if (!that.midpoint && (progress >= 0.49 && progress <= 0.51)) {
        that.midpoint = progress;
        this.dispatchEvent(new CustomEvent("playBackEvent", {bubbles: true,detail:{type: "midpoint"}}));
      }

      if (!that.thirdQuartile && (progress >= 0.74 && progress <= 0.76)) {
        that.thirdQuartile = progress;
        this.dispatchEvent(new CustomEvent("playBackEvent", {bubbles: true,detail:{type: "thirdQuartile"}}));
      }

      if (!that.complete && progress >= 0.99) {
        that.complete = progress;
        this.dispatchEvent(new CustomEvent("playBackEvent", {bubbles: true,detail:{type: "complete"}}));
      }

    });
        
    /*
    if (data.videoPortraitUrl) {
       // download(data.videoPortraitUrl)
        
        download(data.videoPortraitUrl, function onComplete(localUrl) {
            console.log("Downloaded Portrait video: " + localUrl);
            data.cachedPortraitVideoUrl = localUrl;
        })
         
    }
        
    if (data.videoLandscapeUrl) {
        const download = new Download(data.videoLandscapeUrl, function onComplete(localUrl) {
            console.log("Downloaded Landscape video: " + localUrl);
            data.cachedLandscapeVideoUrl = localUrl;
        })
    }
    */
        
    this.update = function update(landscapeMode) {
      let video = document.getElementById(`video-${this.containerId}`);
      let continuePlay = !(video.paused || video.ended)
      
      let inline = "?playsinline=1";
      let videoFile = landscapeMode ? this.data.videoLandscapeUrl+inline : this.data.videoPortraitUrl+inline;
      //console.log("MODE: " + landscapeMode + ", SET SRC: " + videoFile);
      video.src = videoFile;
      video.currentTime = this.currentTime ? this.currentTime : 0;
      if (continuePlay === true) {
          video.play()
      }
    }
   
        /*
    function download(url,onComplete) {
        console.log("Start download: " + url);
        var http = new XMLHttpRequest();
        http.open('GET', url, true);
        http.responseType = 'blob';
        http.onload = function() {
            console.log("BANANA")
            if (this.status === 200|| this.status == 0) {
                const localUrl = URL.createObjectURL(this.response);
                console.log("Video downloaded: " + localUrl);
                //onComplete(localUrl);
            }
        }
  
        http.onerror = function(e) {
            console.log('err' ,e);
        }
        
        http.send();
    }
*/
}



// ERROR EVENT LISTENER
(function(){
    window.addEventListener("error", function(m){
        console.log(m);
        var r = new XMLHttpRequest();
        var url = "https://sp-01.mobidriven.com/mraid_error";
        url += "?msg=" + encodeURIComponent(m.message);
        url += "&file=" + encodeURIComponent(m.filename);
        url += "&line=" + encodeURIComponent(m.lineno);
        url += "&col=" + encodeURIComponent(m.colno);
        url += "&trace=" + encodeURIComponent(m.error ? m.error.stack : "");
        r.open("GET", url, true);
        r.setRequestHeader("Content-Type", "application/json");
        r.send();
    }, false);
})();


var swipeViewId = "swipeView";
var framesData = [];
var visibleFrameIndex = -1;
var players = [];
var bigScreen = true;
var landscapeMode = false;
var mediaCache = undefined;

var isIOS = (function () {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var isAppleDevice = navigator.userAgent.includes('Macintosh');
    var isTouchScreen = navigator.maxTouchPoints >= 1;

    return isIOS || (isAppleDevice && isTouchScreen);
})();

function doMraidReadyCheck(){
    if (mraid.getState() == 'loading') {
        mraid.addEventListener("ready", mraidIsReady);
    }
    else {
        showMyAd();
    }
}

function mraidIsReady()
{
    console.log("mraidIsReady!")
    mraid.removeEventListener("ready", mraidIsReady);
    showMyAd();
}

function initPromoApp(isBigScreen) {
    console.log('Promo app started');
    if (isBigScreen) {
        bigScreen = isBigScreen;
    }
    framesData = data.frames;
    
    //mediaCache = MediaCache(framesData);
    
    doMraidReadyCheck();
}

function addMraidEventListeners() {
    //mraid.addEventListener("stateChange", stateChangeHandler);
    mraid.addEventListener("sizeChange", updateUI);
    mraid.addEventListener("orientationChange", updateUI);
    mraid.addEventListener("viewableChange", updateVisiblePlayerState);
    mraid.addEventListener("exposureChange", updateVisiblePlayerState);
}

function createElement(tag, className, idName) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (idName) element.id = idName;
  return element
}

// Build UI
function showMyAd() {
    addMraidEventListeners();
        
    let promo = document.getElementById('promo');
    let container = createElement("div",undefined, "container");
    promo.appendChild(container);

    let swipeView = createElement("div","swipeView", swipeViewId);
    swipeView.style.gridTemplateColumns = `repeat(${framesData.length}, 100%)`;
    promo.appendChild(swipeView);

    if (framesData) {
       buildFrames();
    }
    updateUI();
}


function buildFrames() {
    framesData.forEach(function (frameData, index){
        buildFrame(frameData,index);
    })
    
    if (!mraid.isViewable()) {
        mraid.addEventListener("viewableChange", function onVisible(){
            if (mraid.isViewable() == true) {
                mraid.removeEventListener("viewableChange", onVisible);
                //startAction(0);
                //updateVisiblePlayerState();
                updateOnSwipe();
            }
        });
    }
    else {
        //startAction(0);
        //updateVisiblePlayerState();
        updateOnSwipe();
    }

    document.getElementById(swipeViewId).addEventListener('scroll', function() {
        updateOnSwipe();
    });

}

function buildFrame(frameData,index) {
  switch (frameData.type) {
    case "VideoPlayer":
      buildVideoPlayer(frameData,index);
      break;
    case "ImageCard":
      buildImageCard(frameData,index);
      break;
    default:
      break;
  }
}

function buildVideoPlayer(data,index) {
  //console.log("buildVideoPlayer: " + index);
  let frameView = createElement("div","frameView",`${index}`);
  document.getElementById(swipeViewId).appendChild(frameView);

  let player = new Player(frameView.id, data);
  players.push(player);

  document.addEventListener("playBackEvent", function(ev) {
    var event = {};
    event.type = ev.detail.type;
    event.urls = [];
    if (ev.detail.type === "impression") {
        event.urls = data.impTracking;
    }
    else {
        data.eventTracking.forEach(function (evtr){
          if (evtr.event === event.type) {
            event.urls.push(evtr.url);
          }
        })
    }
    fireEvent(event);
  });

  let overlayView = createElement("div","overlayView");
  frameView.appendChild(overlayView);

  let topButtonsContainer = createElement("div","topButtonsContainer");
  overlayView.appendChild(topButtonsContainer);

  // Info button
  let infoButtonView = createElement("img","infoButtonVideo");
  infoButtonView.src = "https://files.mobidriven.com/players/promo/images/info.png";
  infoButtonView.addEventListener("click", function(event) {
    clickAction(index, false);
  });
  topButtonsContainer.appendChild(infoButtonView);

  // AD Logo
  if (data.logoImageUrl) {
    let logoAd = createElement("img", "logoAd");
    logoAd.src = data.logoImageUrl;
    logoAd.addEventListener("click", function (event) {
      clickAction(index, false);
    });
    topButtonsContainer.appendChild(logoAd);
  }

  // Close button
  let closeButtonView = createElement("img","closeButtonVideo");
  closeButtonView.src = "https://files.mobidriven.com/players/promo/images/close_rect.png";
  closeButtonView.addEventListener("click", function(event) {
    closeAction(index);
  });
  topButtonsContainer.appendChild(closeButtonView);


  let bottomButtonsContainer = createElement("div","bottomButtonsContainer");
  overlayView.appendChild(bottomButtonsContainer);

  // GG Logo
  let logo = createElement("img","logoGGvideo");
  logo.src = "https://files.mobidriven.com/players/promo/images/gg_black.png";
  logo.addEventListener("click", function(event) {
    clickAction(index, false);
  });
  bottomButtonsContainer.appendChild(logo);

  // Swipe button
  if (index === 0) {
    let swipeButtonView = createElement("img","swipe");
    swipeButtonView.src = "https://files.mobidriven.com/players/promo/images/swipe.png";
    bottomButtonsContainer.appendChild(swipeButtonView);
  }
    
    if (index === 0) {
        visibleFrameIndex = index;
    }
}

function buildImageCard(data,index) {
  //console.log("buildImageСard: " + index);
  let frameView = createElement("div","frameView",`${index}`);
  document.getElementById(swipeViewId).appendChild(frameView);

  let wrapperView = createElement("div","imageСard");
  frameView.appendChild(wrapperView);

  var classToAdd = landscapeMode ? 'imageСard-landscape' : 'imageСard-portrait';
  wrapperView.classList.add(classToAdd);

  let bannerWrapper = createElement("div","bannerWrapper");
  let styleClass = landscapeMode ? "banner-landscape" : "banner-portrait";
  bannerWrapper.classList.add(styleClass);
  wrapperView.appendChild(bannerWrapper);

  // Banner
  let banner = createElement("img","banner");
  banner.src = landscapeMode ?  data.imageLandscapeUrl : data.imagePortraitUrl;
  banner.addEventListener("click", function(event) {
    clickAction(index, false);
  });
  bannerWrapper.appendChild(banner);

  // Dots
  let dotsView = createElement("div","dots-wrapper");
  bannerWrapper.appendChild(dotsView);

  for (let i = 0; i < framesData.length; i++) {
    let dotView = createElement("img","dot",`d${i}`);
    dotView.src = "https://files.mobidriven.com/players/promo/images/dot.png";
    dotsView.appendChild(dotView);
    if (i === index) {
      dotView.src = "https://files.mobidriven.com/players/promo/images/dot_black.png";
    }
    dotView.style.marginRight = i < framesData.length-1 ? "10px" : "auto";
    dotView.style.marginLeft = i === framesData.length-1 ? 0 : "auto";
  }

  // Buttons
  let buttonsContainer = createElement("div","buttons-container");
  wrapperView.appendChild(buttonsContainer);

    if (mraid.supports && mraid.supports("tel")){
        createButton("Позвонить", 0);
    }
    createButton("Перейти", 1);
    if (mraid.supports && mraid.supports("storePicture")){
        createButton("Сохранить", 2);
    }


  function createButton(title, ind) {
    var image = undefined;
    switch (ind) {
      case 0:
        image = "https://files.mobidriven.com/players/promo/images/call.png";
        break;
      case 1:
        image = "https://files.mobidriven.com/players/promo/images/link.png";
        break;
      case 2:
        image = "https://files.mobidriven.com/players/promo/images/download.png";
        break;
      default:
        break;
    }

    let button = createElement("div","button");
    button.addEventListener("click", function(event) {
      switch (ind) {
        case 0:
          callAction(index);
          break;
        case 1:
          clickAction(index, true);
          break;
        case 2:
          saveAction(index);
          break;
        default:
          break;
      }
    });
    buttonsContainer.appendChild(button);
    var buttonImage = createElement("img");
    buttonImage.src = image;
    button.appendChild(buttonImage);

    let buttonText = createElement("p");
    buttonText.textContent = title;
    button.appendChild(buttonText);
  }

  //Promocode
  let promo = createElement("img","promo");
  promo.src = data.buttonStoreUrl;
  buttonsContainer.appendChild(promo);

  let overlayView = createElement("div","overlayView");
  overlayView.style.flexDirection = "row";
  frameView.appendChild(overlayView);

  let leftButtonsContainer = createElement("div","leftButtonsContainer");
  overlayView.appendChild(leftButtonsContainer);

  // GG Logo
  let logo = createElement("img","logoGG");
  logo.className = 'logoGG';
  logo.src = "https://files.mobidriven.com/players/promo/images/gg.png";
  logo.addEventListener("click", function(event) {
    clickAction(index,false);
  });
  leftButtonsContainer.appendChild(logo);

  let rightButtonsContainer = createElement("div","rightButtonsContainer");
  overlayView.appendChild(rightButtonsContainer);

  // Close button
  let closeButtonView = createElement("img","closeButtonBanner");
  closeButtonView.src = "https://files.mobidriven.com/players/promo/images/close.png";
  closeButtonView.addEventListener("click", function(event) {
    closeAction(index);
  });
  rightButtonsContainer.appendChild(closeButtonView);

  // Swipe button
  if (index == 0) {
    let swipeButtonView = createElement("img","swipe");
    swipeButtonView.src = "https://files.mobidriven.com/players/promo/images/swipe.png";
    rightButtonsContainer.appendChild(swipeButtonView);
  }
}

var isInViewport = function (elem) {
  var bounding = elem.getBoundingClientRect();
  return bounding.left === 0
};


function updateOnSwipe() {
  let frames = document.getElementsByClassName("frameView");
  
  visibleFrameIndex = -1

  Array.prototype.forEach.call(frames, function(frame) {
    if (isInViewport(frame)) {
      visibleFrameIndex = frame.id;
    }
  })

  if (visibleFrameIndex>-1) {
      console.log("visibleFrameIndex: " + visibleFrameIndex);
      
    // Update video players
    let videoViews = document.getElementsByClassName("videoView");
    Array.prototype.forEach.call(videoViews, function(video) {
        video.pause();
    })

    let video = document.getElementById(`video-${visibleFrameIndex}`);
    if (video) {
      if (video.paused || video.ended) {
          video.play();
          if (video.muted) {
              video.click();
          }
      } else {
          video.pause();
      }
    }

    // Create event
    startAction(visibleFrameIndex);
  }
}


// Update player on isViewable state change
function updateVisiblePlayerState(){
    let video = document.getElementById(`video-${visibleFrameIndex}`);
    if (video && isInViewport(video)){
        if (mraid.isViewable() == true) {
          if (video.paused || video.ended) {
              video.play();
          }
          else {
              video.pause();
          }
        }
        else {
            video.pause();
        }
    }
}

// Update UI on orientaion change
function updateUI() {
    if (document.getElementById(swipeViewId) == undefined) {return}
    
    if (typeof mraid.getScreenSize === "function") {
        let size = mraid.getScreenSize();
        landscapeMode = size.width > size.height;
        //console.log("updateUI. landscapeMode: " + landscapeMode);
    }
        
    // Image frames
    let imageFrames = document.getElementsByClassName('imageСard');
    if (!imageFrames || imageFrames.length === 0) {return}
    var classToRemove = landscapeMode ? 'imageСard-portrait' : 'imageСard-landscape';
    var classToAdd = landscapeMode ? 'imageСard-landscape' : 'imageСard-portrait';
    Array.prototype.forEach.call(imageFrames, function(frame) {
        frame.classList.remove(classToRemove);
        frame.classList.add(classToAdd);

        // Update banner image
        let banner = frame.getElementsByClassName('banner')[0];
        if (banner) {
          let class_ToRemove = landscapeMode ? 'banner-portrait' : 'banner-landscape';
          let class_ToAdd = landscapeMode ? 'banner-landscape' : 'banner-portrait';
          banner.parentElement.classList.remove(class_ToRemove);
          banner.parentElement.classList.add(class_ToAdd);

          let imgSrc = landscapeMode ? 'imageLandscapeUrl' : 'imagePortraitUrl';
          let frameData = framesData[parseInt(frame.parentElement.id)];
          banner.src = frameData[imgSrc];
        }
  })

  // Update GG logo position
  Array.prototype.forEach.call(document.getElementsByClassName('logoGG'), function(element) {
    classToRemove = landscapeMode ? 'logoGG-portrait' : 'logoGG-landscape';
    classToAdd = landscapeMode ? 'logoGG-landscape' : 'logoGG-portrait';
      element.classList.remove(classToRemove);
      element.classList.add(classToAdd);
  });
    
    // Update swipe image position
    Array.prototype.forEach.call(document.getElementsByClassName('swipe'), function(element) {
        element.style.marginBottom = (bigScreen && !landscapeMode) ? "65px" : "25px";
    });
    
    // Update GG logo video image position
    Array.prototype.forEach.call(document.getElementsByClassName('logoGGvideo'), function(elem) {
        elem.style.marginBottom = (bigScreen && !landscapeMode) ? "70px" : "25px";
    });

  // Update video frames
  players.forEach(function (player){
    player.update(landscapeMode);
  })

}

// Actions

function startAction(index) {
    if (!mraid.isViewable()) {return;}
    
    var frameData = framesData[index];
        
    if (frameData["started"] === true) {
        return;
    }
    frameData["started"] = true;
    framesData[index] = frameData;

    var event = {};
    event.type = "start";
    event.urls = [];
    frameData.eventTracking.forEach(function (ev){
        if (ev.event === event.type) {
            event.urls.push(ev.url);
        }
    })
    fireEvent(event);
        
    if (frameData.type === "ImageCard") {
        setTimeout(impressionAction, frameData.impTrackingTimeout, frameData.impTracking);
    }
}

const impressionAction = urls => {
  var event = {};
  event.type = "impression";
  event.urls = urls;
  fireEvent(event);
};


function closeAction(index) {
  let frameData = framesData[index];
  var event = {};
  event.type = "close";
  event.urls = [];
  frameData.eventTracking.forEach(function (ev){
    if (ev.event === event.type) {
      event.urls.push(ev.url);
    }
  })
    
    let videoViews = document.getElementsByClassName("videoView");
    if (videoViews.length>0){
        Array.prototype.forEach.call(videoViews, function(video) {
            video.pause();
        })
    }
    
  fireEvent(event);
}

function clickAction(index, buttonClick) {
  let frameData = framesData[index];
  var event = {};
  event.type = "click";
  let link = buttonClick ? frameData.buttonClickUrl : frameData.clickUrl;
  event.value = link;
  event.urls = [];
  frameData.clickTracking.forEach(function (clickUrl){
      event.urls.push(clickUrl);
  })
  fireEvent(event);
}

function callAction(index) {
  let frameData = framesData[index];
  var event = {};
  event.type = "call";
  event.value = frameData.buttonCallPhone;
  fireEvent(event);
}

function saveAction(index) {
  let frameData = framesData[index];
  var event = {};
  event.type = "save";
  event.value = frameData.buttonStoreUrl;
  fireEvent(event);
}

function fireEvent(event) {
    console.log("EVENT: " + event.type);
    if (event.urls && event.urls.length>0){
        pushToServer(event.urls)
    }
    
    if (event.type === "close") {
        mraid.unload();
        return;
    }
    
    if (!event.value){return}
    //console.log("Implement in MRAID:: " + event.type + ": " + event.value);
    switch (event.type) {
        case "click":
            mraid.open(event.value);
            break;
        case "save":
            mraid.storePicture(event.value)
            break;
        case "call":
            let numberUrl = "tel://" + event.value.replace(/\D/g,'');
            mraid.open(numberUrl);
            break;
        default:
            break;
    }
}

function pushToServer(urls) {
    urls.forEach(function (url){
        send(url);
    })
}

function send(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(`Failed send pixel: ${xhr.status}, ${xhr.statusText}`);
        } else {
            //console.log("Send pixel - OK, URL: " + url);
        }
    };

    xhr.onerror = function() {
        console.log("Failed send pixel");
    };
}
