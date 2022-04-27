// Video player
class Player {
  data = undefined;
  containerId = undefined;
  currentTime = undefined;
  videoDuration = undefined;

  firstQuartile = undefined;
  midpoint = undefined;
  thirdQuartile = undefined;
  complete = undefined;


  constructor(containerId, data, landscapeMode) {
    console.log("Player in container: " + containerId);

    this.data = data;
    this.containerId = containerId;
    let container = document.getElementById(containerId);
    let inline = "?playsinline=1";
    let videoFile = landscapeMode ? data.videoLandscapeUrl+inline : data.videoPortraitUrl+inline;
    //  console.log(videoFile)
    let videoView = document.createElement("video");
    videoView.className = "videoView";
    videoView.id = `video-${containerId}`;
    videoView.src = videoFile;
    videoView.autoplay = containerId == "0";
    videoView.muted = false;
    videoView.playsinline = true;
    videoView.webkitPlaysinline = true;
    videoView.controls = false;
    videoView.pause();

    videoView.setAttribute('playsinline',"playsinline");
    container.appendChild(videoView);

    videoView.preload = 'metadata';
    let that = this;
    videoView.onloadedmetadata = function() {
      that.videoDuration = Math.round(videoView.duration);
      this.currentTime = that.currentTime ? that.currentTime : 0;
    }

    videoView.addEventListener("click", function(event) {
      this.muted = !this.muted;
    });

    videoView.addEventListener('timeupdate', function(event) {
      that.currentTime = this.currentTime;
      const progress = Math.round(this.currentTime/that.videoDuration*100)/100;

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
  }

  update(landscapeMode) {
    let videoView = document.getElementById(`video-${this.containerId}`);
    let inline = "?playsinline=1";
    let videoFile = landscapeMode ? this.data.videoLandscapeUrl+inline : this.data.videoPortraitUrl+inline;
    videoView.src = videoFile;
    videoView.currentTime = this.currentTime ? this.currentTime : 0;
  }

}
