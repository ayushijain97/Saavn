import Trending from "./model/Trending.js";
// creating the audio tag
const audioPlayer = document.createElement("audio");
const trending = new Trending();
console.log(trending);

audioPlayer.addEventListener('loadedmetadata', function() {
    console.log("Playing " + audioPlayer.src + ", for: " + audioPlayer.duration + "seconds.");
    const duration = audioPlayer.duration;
    const currTime = audioPlayer.currentTime;
    console.log(currTime);
    getElement('.audio_duration').innerHTML = Math.floor(duration / 60) + ":" + Math.floor(duration % 60);
});

audioPlayer.addEventListener('timeupdate', (event) => {
    const currentTime = Math.floor(audioPlayer.currentTime);
    const duration = Math.floor(audioPlayer.duration);
    console.log("Current Time ", currentTime, " and Duration ", duration);
    getElement('.audio_current_time').innerHTML = Math.floor(currentTime / 60) + ":" + Math.floor(currentTime);
}, false);

audioPlayer.onended = () => {
    playTrack(getNextSong());
}

audioPlayer.addEventListener('durationchange', function() {
    console.log("Playing " + audioPlayer.src + ", for: " + audioPlayer.duration + "seconds.");
});

let indexOfMusicBeingPlayed = 0;

const play = () => {
    hideButton('.playing__play');
    showButton('.playing__pause');
    if (audioPlayer.src) {
        audioPlayer.play();
    } else {
        playTrack(trending.url[indexOfMusicBeingPlayed]);
    }
    // // trending.audioPlayer;
    // trending.url.forEach(el => playTrack(el));
    // // trending.playTrack();
}

const pause = () => {
    hideButton('.playing__pause');
    showButton('.playing__play');
    audioPlayer.pause();
}

const next = () => {
    playTrack(getNextSong());
}

const prev = () => {
    playTrack(getPreviousSong());
}

const getNextSong = () => {
    indexOfMusicBeingPlayed = (indexOfMusicBeingPlayed + 1) % trending.url.length;
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