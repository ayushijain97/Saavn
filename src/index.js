import Trending from "./model/Trending.js";
// 1.)creating the audio tag
const audioPlayer = document.createElement("audio");

audioPlayer.volume = 0.5;
let currentVolume = audioPlayer.volume;
let isPlaying = false;
let playBackRate=1.0;
let doShuffle=false;
//2.) Creating new object
const trending = new Trending();

console.log(trending);


//3.) audio playing duration 
audioPlayer.addEventListener('loadedmetadata', function() {
    console.log("Playing " + audioPlayer.src + ", for: " + audioPlayer.duration + "seconds.");
    const duration = audioPlayer.duration;
    const currTime = audioPlayer.currentTime;
    console.log(currTime);
    getElement('.audio_duration').innerHTML = Math.floor(duration / 60) + ":" + Math.floor(duration % 60);
});

// 4.)audio playing currentTime
audioPlayer.addEventListener('timeupdate', (event) => {
    audioPlayer.playbackRate=playBackRate;
    const currentTime = Math.floor(audioPlayer.currentTime);
    const duration = Math.floor(audioPlayer.duration);
    // console.log("Current Time ", currentTime, " and Duration ", duration);
    let sec = currentTime;
    sec = sec % 3600;
    let min = Math.floor(sec / 60);
    sec = Math.floor(sec % 60);
    if (sec.toString().length < 2) sec = "0" + sec;
    if (min.toString().length < 2) min = "0" + min;
    getElement('.audio_current_time').innerHTML = min + ":" + sec;

    //calculation for seekBar 
    getElement('.slider').min = audioPlayer.startTime;
    getElement('.slider').max = audioPlayer.duration;
    getElement('.slider').value = audioPlayer.currentTime;

}, false);

// 5.)calling next song on ending up the song 
audioPlayer.onended = () => {
    playTrack(getNextSong());
}
// 6.)audio player duration 
audioPlayer.addEventListener('durationchange', function() {
    console.log("Playing " + audioPlayer.src + ", for: " + audioPlayer.duration + "seconds.");
    getElement('.slider').min = 0;
    getElement('.slider').max = audioPlayer.duration;

}, false);

// 7.)Playing  song through button 
let indexOfMusicBeingPlayed = 0;

const play = () => {
    hideButton('.playing__play');
    showButton('.playing__pause');
    if (audioPlayer.src) {
        audioPlayer.play();
    } else {
        playTrack(trending.url[indexOfMusicBeingPlayed]);
    }
    isPlaying = true;
}

const pause = () => {
    hideButton('.playing__pause');
    showButton('.playing__play');
    audioPlayer.pause();
    isPlaying = false;
}
const next = () => {
    playTrack(getNextSong());
    hideButton('.playing__play');
    showButton('.playing__pause');
}
const prev = () => {
    playTrack(getPreviousSong());
    hideButton('.playing__play');
    showButton('.playing__pause');
}
const repeat = () => {
    if(!audioPlayer.loop)
    {
        audioPlayer.loop=true;
        audioPlayer.play(); 
        changeColor(".playing__repeat", "blue");
        changeFontSize(".repeat_icon_size", "27px");
    }
    else{
        audioPlayer.loop=false;
        audioPlayer.play();
        changeColor(".playing__repeat", "");
        changeFontSize(".repeat_icon_size", ""); 
    }
   
}
const changeColor = (className , color) => {
    getElement(className).style.color=color;
}

const changeFontSize = (className , fontSize) => {
    getElement(className).style.fontSize=fontSize;
} 

const shuffle = () => {
    doShuffle = !doShuffle;
    console.log("should shuffle?", doShuffle);
    if(doShuffle){
        changeColor(".playing__shuffle", "blue");
        changeFontSize(".shuffle_icon_size", "27px");  
    }
    else{
        changeColor(".playing__shuffle", "");
        changeFontSize(".shuffle_icon_size", "");  
    }
     
}
// Volume
const onUnmuteClicked = () => {
    hideButton('.playing__unmute');
    showButton('.playing__mute');
    audioPlayer.volume = 0;
    getElement(".volume_slider").value = 0;
    console.log("off");
}

// mute
const onMuteClicked = () => {
    hideButton('.playing__mute');
    showButton('.playing__unmute');
    audioPlayer.volume = currentVolume;
    getElement(".volume_slider").value = currentVolume * 100;
    console.log("on");

}
// Hover
const showVolume = () => {
    showButton('.volume_slider');
}
const hideVolume = () => {
    setTimeout(() => {
        hideButton('.volume_slider');
    }, 2000);
}
// DropDown Speed List 
const playingSpeed = () => {
   playBackRate = getElement(".dropDown").value;
}


// audio playing seekBar
const changeTheTime = () => {
    audioPlayer.currentTime = getElement('.slider').value;
};
const changeVolume = () => {
    audioPlayer.volume = getElement(".volume_slider").value / 100;
    currentVolume = audioPlayer.volume;
};



const changePlayerCurrTime = (delta) => {
    audioPlayer.currentTime = audioPlayer.currentTime + delta;

}

const getNextSong = () => {
    if(doShuffle){
        let nextRandomValue=0;
        while(
            (nextRandomValue=Math.floor(Math.random()*trending.url.length)) === indexOfMusicBeingPlayed
            ) {}
        indexOfMusicBeingPlayed = nextRandomValue;
    }
    else{
        indexOfMusicBeingPlayed = (indexOfMusicBeingPlayed + 1) % trending.url.length;
    }
    console.log("Playing ", indexOfMusicBeingPlayed);
    return trending.url[indexOfMusicBeingPlayed];
}

const getPreviousSong = () => {
    indexOfMusicBeingPlayed = (indexOfMusicBeingPlayed - 1 + trending.url.length) % trending.url.length;
    return trending.url[indexOfMusicBeingPlayed];
}

const hideButton = (buttonCss) => {
    document.querySelector(buttonCss).style.display = 'none';
}
const showButton = (buttonCss) => {
    document.querySelector(buttonCss).style.display = 'block';
}

const playTrack = (el) => {
    // setInterval(updateCurrTime, 1000);
    audioPlayer.src = el;
    console.log(audioPlayer.duration);
    var playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
                // Automatic playback started!
                // Show playing UI.
            })
            .catch(error => {
                // Auto-play was prevented
                // Show paused UI.
            });
    }

}


const getElement = (css) => {
    return document.querySelector(css);
}

document.querySelector(".playing__pause").addEventListener("click", pause);
document.querySelector(".playing__play").addEventListener("click", play);
document.querySelector(".playing__previous").addEventListener("click", prev);
document.querySelector(".playing__next").addEventListener("click", next);
document.querySelector(".playing__repeat").addEventListener("click",repeat);
document.querySelector(".playing__shuffle").addEventListener("click",shuffle);
document.querySelector(".playing__unmute").addEventListener("click", onUnmuteClicked);
document.querySelector(".playing__mute").addEventListener("click", onMuteClicked);
document.querySelector(".slider").addEventListener("change", changeTheTime);
document.querySelector(".volume_slider").addEventListener("change", changeVolume);
document.querySelector(".volume__button").addEventListener("mouseover",showVolume);
document.querySelector(".volume__button").addEventListener("mouseout",hideVolume);
document.querySelector(".dropDown").addEventListener("change", playingSpeed);
document.addEventListener("keypress", function(event) {
    if (event.which === 32 || event.keyCode === 32) {
        if (isPlaying) {
            pause();
        } else {
            play();
        }

    }

});
document.addEventListener("keydown", function(event) {
    if (event.which === 37 || event.keyCode === 37) {
        changePlayerCurrTime(-10);

    }
    if (event.which === 39 || event.keyCode === 39) {
        changePlayerCurrTime(10);

    }

});
