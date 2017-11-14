chrome.browserAction.onClicked.addListener(function(tab) {
    var myAudio = new Audio();
    myAudio.src = "song.mp3";
    myAudio.play();
});
