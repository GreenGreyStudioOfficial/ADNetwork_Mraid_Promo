/*
 * promo.js
*/



var swipeViewId = "swipeView";
var framesData = [];
var visibleFrameIndex = -1;

var players = [];

function doMraidReadyCheck(){
    if (mraid.getState() == 'ready') {
        buildUI();
    }
}


function initPromoApp() {
    console.log('Promo app started');
    framesData = data.frames;
    addMraidEventListeners();
    doMraidReadyCheck();
}

function addMraidEventListeners() {
    document.addEventListener("mraidEvent", function(ev) {
        if (ev.detail.type === "stateChangeEvent") {
            doMraidReadyCheck();
        }
        else if (ev.detail.type === "resizeChangeEvent") {
            updateUI();
        }
        else if (ev.detail.type === "viewableChangeEvent") {
            updatePlayer();
        }
    });
}

function refreshUI() {
  let evt = window.document.createEvent('UIEvents');
  evt.initUIEvent('resize', true, true, window, 0);
  window.dispatchEvent(evt);
}

function createElement(tag, className, idName) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (idName) element.id = idName;
  return element
}

// Build UI
function buildUI() {
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
  startAction(0);

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

  let player = new Player(frameView.id, data, mraid.landscapeMode);
  players.push(player);

  document.addEventListener("playBackEvent", function(ev) {
    var event = {};
    event.type = ev.detail.type;
    event.urls = [];
    data.eventTracking.forEach(function (evtr){
      if (evtr.event === event.type) {
        event.urls.push(evtr.url);
      }
    })
    mraid.invokeSDK(event);
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
  if (index == 0) {
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

  var classToAdd = mraid.landscapeMode ? 'imageСard-landscape' : 'imageСard-portrait';
  wrapperView.classList.add(classToAdd);

  let bannerWrapper = createElement("div","bannerWrapper");
  let styleClass = mraid.landscapeMode ? "banner-landscape" : "banner-portrait";
  bannerWrapper.classList.add(styleClass);
  wrapperView.appendChild(bannerWrapper);

  // Banner
  let banner = createElement("img","banner");
  banner.src = mraid.landscapeMode ?  data.imageLandscapeUrl : data.imagePortraitUrl;
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

  createButton("Позвонить", 0);
  createButton("Перейти", 1);
  createButton("Сохранить", 2);


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
      //console.log("visibleFrameIndex: " + visibleFrameIndex);
      
    // Update video players
    let videoViews = document.getElementsByClassName("videoView");
    Array.prototype.forEach.call(videoViews, function(videoView) {
      videoView.pause();
    })

    let videoView = document.getElementById(`video-${visibleFrameIndex}`);
    if (videoView) {
      if (videoView.paused || videoView.ended) {
        videoView.play();
      } else {
        videoView.pause();
      }
    }

    // Create event
    startAction(visibleFrameIndex);
  }
}


// Update player on isViewable state change
function updatePlayer(){
    let videoView = document.getElementById(`video-${visibleFrameIndex}`);
    if (videoView && isInViewport(videoView)){
        if (mraid.isViewable) {
          if (videoView.paused || videoView.ended) {
            videoView.play();}
        }
        else {
            videoView.pause();
        }
    }
}

// Update UI on orientaion change
function updateUI() {
    //console.log("updateUI. landscapeMode: " + mraid.landscapeMode);
  // Image frames
  let imageFrames = document.getElementsByClassName('imageСard');
  if (!imageFrames || imageFrames.length === 0) {return}
  var classToRemove = mraid.landscapeMode ? 'imageСard-portrait' : 'imageСard-landscape';
  var classToAdd = mraid.landscapeMode ? 'imageСard-landscape' : 'imageСard-portrait';
  Array.prototype.forEach.call(imageFrames, function(frame) {
    frame.classList.remove(classToRemove);
    frame.classList.add(classToAdd);

    // Update banner image
    let banner = frame.getElementsByClassName('banner')[0];
    if (banner) {
      let class_ToRemove = mraid.landscapeMode ? 'banner-portrait' : 'banner-landscape';
      let class_ToAdd = mraid.landscapeMode ? 'banner-landscape' : 'banner-portrait';
      banner.parentElement.classList.remove(class_ToRemove);
      banner.parentElement.classList.add(class_ToAdd);

      let imgSrc = mraid.landscapeMode ? 'imageLandscapeUrl' : 'imagePortraitUrl';
      let frameData = framesData[parseInt(frame.parentElement.id)];
      banner.src = frameData[imgSrc];
    }
  })

  // Update GG logo position
  Array.prototype.forEach.call(document.getElementsByClassName('logoGG'), function(element) {
    classToRemove = mraid.landscapeMode ? 'logoGG-portrait' : 'logoGG-landscape';
    classToAdd = mraid.landscapeMode ? 'logoGG-landscape' : 'logoGG-portrait';
      element.classList.remove(classToRemove);
      element.classList.add(classToAdd);
  });
    
    // Update swipe image position
    Array.prototype.forEach.call(document.getElementsByClassName('swipe'), function(element) {
        element.style.marginBottom = (mraid.bigScreen && !mraid.landscapeMode) ? "65px" : "25px";
    });
    
    // Update GG logo video image position
    Array.prototype.forEach.call(document.getElementsByClassName('logoGGvideo'), function(elem) {
        elem.style.marginBottom = (mraid.bigScreen && !mraid.landscapeMode) ? "70px" : "25px";
    });

  // Update video frames
  players.forEach(function (player){
    player.update(mraid.landscapeMode);
  })

}

// Actions

function startAction(index) {
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
  mraid.invokeSDK(event);
  setTimeout(impressionAction, frameData.impTrackingTimeout, frameData.impTracking);
}

const impressionAction = urls => {
  var event = {};
  event.type = "impression";
  event.urls = urls;
  mraid.invokeSDK(event);
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
        Array.prototype.forEach.call(videoViews, function(videoView) {
          videoView.pause();
        })
    }
    
  mraid.invokeSDK(event);
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
  mraid.invokeSDK(event);
}

function callAction(index) {
  let frameData = framesData[index];
  var event = {};
  event.type = "call";
  event.value = frameData.buttonCallPhone;
  mraid.invokeSDK(event);
}

function saveAction(index) {
  let frameData = framesData[index];
  var event = {};
  event.type = "save";
  event.value = frameData.buttonStoreUrl;
    console.log(frameData.buttonStoreUrl);
  mraid.invokeSDK(event);
}
