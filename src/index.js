import Trending from "./model/Trending.js";

import {
  renderLoader,
  clearLoader,
  renderPage,
  limitTitleSize,
  renderSongsQueue,
  clearQueue,
  clearInput,
  element
} from "./View/base.js";
// 1.)creating the audio tag
const audioPlayer = document.createElement("audio");

audioPlayer.volume = 0.5;
let currentVolume = audioPlayer.volume;
let isPlaying = false;
let playBackRate = 1.0;
let doShuffle = false;
let indexArray = [];
const trending = new Trending();
let songsQueue = [];
const proxyUrl = `http://localhost:8080/`;

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
    audioPlayer.playbackRate = playBackRate;
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

export const play = () => {
    handlePlayPauseIcon();
    if (audioPlayer.src) {
        audioPlayer.play();
    } else {
        playTrack(trending.url[indexOfMusicBeingPlayed]);
    }
    document.querySelector(".playing_image").classList.add("rotating_image");
    isPlaying = true;
}

const pause = () => {
    handlePlayPauseIcon();
    audioPlayer.pause();
    document.querySelector(".playing_image").classList.remove("rotating_image");
    isPlaying = false;
}

const handlePlayPauseIcon = () => {
    if(isPlaying) {
        // Means currently music was playing and somebody clicked pause.
        hideButton(".playing__pause");
        showButton(".playing__play");
    } else {
        // Means currently no music is being played and somebody clicked on Play button
        showButton(".playing__pause");
        hideButton(".playing__play");
    }
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
    if (!audioPlayer.loop) {
        audioPlayer.loop = true;
        audioPlayer.play();
        changeColor(".playing__repeat", "blue");
        changeFontSize(".repeat_icon_size", "27px");
    } else {
        audioPlayer.loop = false;
        audioPlayer.play();
        changeColor(".playing__repeat", "");
        changeFontSize(".repeat_icon_size", "");
    }

}
const changeColor = (className, color) => {
    getElement(className).style.color = color;
}

const changeFontSize = (className, fontSize) => {
    getElement(className).style.fontSize = fontSize;
}

const shuffle = () => {
    doShuffle = !doShuffle;
    console.log("should shuffle?", doShuffle);
    if (doShuffle) {
        changeColor(".playing__shuffle", "blue");
        changeFontSize(".shuffle_icon_size", "27px");
    } else {
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
   document.querySelector(".volume_slider").style.display = "flex";
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
// shuffling the songs
const getRandomValue = () => {
    let nextRandomValue = 0;
    while ((nextRandomValue = Math.floor(Math.random() * trending.url.length)) === indexOfMusicBeingPlayed) {}
    return nextRandomValue;
}

export const playThisSong = (event) => {
    const songIndex = event.srcElement.getAttribute("value");
    indexOfMusicBeingPlayed=songIndex;
        playTrack(trending.url[songIndex]);
}

const getNextSong = () => {
    if (doShuffle) {

        indexArray.push(indexOfMusicBeingPlayed);
        indexOfMusicBeingPlayed = getRandomValue();

        for (let i = 0; i < indexArray.length; i++) {
            if (indexArray[i] === indexOfMusicBeingPlayed) {
                indexOfMusicBeingPlayed = getRandomValue();
                continue;
            }
            if (indexArray.length === trending.url.length) {
                indexArray = [];
                break;
            }
        }
    } else {
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

function configureToastr() {
    toastr.options = {
      positionClass: "toast-bottom-center",
      showDuration: "300"
    };
}

async function getHomePage() {
  // Display an info toast with no title
  configureToastr();
  let details = null;
    renderLoader(document.querySelector(".trending_data"));
  if (sessionStorage.getItem("homepage")) {
    details = JSON.parse(sessionStorage.getItem("homepage"));
  } else {
    console.log("Getting data");
    try {
      const result = await axios(
        "https://ayushi-web-scrapper.herokuapp.com/metadata"
      );
      //   console.log(result);
      details = result.data;
      sessionStorage.setItem("homepage", JSON.stringify(details));
    } catch (err) {
      console.log(err);
    }
  }
    clearLoader();
    renderPage(details);
}

export const loadPlaylist = async (event) => {
    const playlistID = event.srcElement.getAttribute("value");
    console.log("Loading Playlist ", playlistID);
    
    if(isPlaying) {
        renderLoader(document.querySelector(".playing__pause"));
    }
    else {
        renderLoader(document.querySelector(".playing__play"));
    }
    try {
        const res = await axios(
            // proxyUrl +
             `https://ayushi-web-scrapper.herokuapp.com/playlist/${playlistID}`
        );
        console.log(res);
        trending.url = [];
        indexOfMusicBeingPlayed = 0;
        clearLoader();
        clearQueue();
        songsQueue=[];
        if (res.data.songs) {
            res.data.songs.forEach((song) => trending.url.push(song.media_url));
            songsQueue = res.data.songs;
        } else if (res.data.song) {
            trending.url.push(res.data.media_url);
            songsQueue.push(res.data);
        }
        renderSongsQueue(songsQueue);
        toastr.info(songsQueue.length + " Song added into the queue...!");
        indexOfMusicBeingPlayed=0;
        next();
    } catch (err) {
        console.log(err);
    }
}


const playTrack = (el) => {
    // setInterval(updateCurrTime, 1000);
    handlePlayPauseIcon();
    isPlaying = true;
    document.querySelector(".playing_image").classList.add("rotating_image");
    console.log(songsQueue);
    if (songsQueue) {

        getElement(".playing_image").setAttribute(
            "src",
            songsQueue[indexOfMusicBeingPlayed].image
        );
        getElement(".playing_title").innerHTML = limitTitleSize(
            songsQueue[indexOfMusicBeingPlayed].song
        );
        getElement(".playing_author").innerHTML = limitTitleSize(
            songsQueue[indexOfMusicBeingPlayed].singers
        );
    }
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


const downloadSong = () => {
    var songURL = proxyUrl + trending.url[indexOfMusicBeingPlayed];
    fetch(songURL)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = "mySong.mp4";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert("oh no!"));
}

const searchInputField = (e) => {
  // switching between search bar
  document.querySelector(".search").style.display = "none";
  document.querySelector(".searchSong").style.display = "flex";
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".searchSong").style.display = "none";
    document.querySelector(".search").style.display = "flex";
  });
  document.querySelector(".clear__icon").addEventListener("click", () => {
    clearInput();
  });
  document.addEventListener("keypress", async function(event) {
    if (event.which === 13 || event.keyCode === 13) {
            event.preventDefault();
           
   const query = element.inputField.value;
     if(query)
        {
            const res = await axios(
                `https://ayushi-web-scrapper.herokuapp.com/music/search/${query}`
            );
            console.log("this query has songs",res.data);
                clearInput();
        } 
    }
  });
};

const toggleQueueClass = () => {
      getElement(".queue").style.transform= "translatex(-300px)";  
}
const toggleClass = () => {
   getElement(".queue").style.transform = "none";
};

const getElement = (css) => {
    return document.querySelector(css);
}


window.addEventListener("load", getHomePage);
document.querySelector(".playing__pause").addEventListener("click", pause);
document.querySelector(".playing__play").addEventListener("click", play);
document.querySelector(".playing__previous").addEventListener("click", prev);
document.querySelector(".playing__next").addEventListener("click", next);
document.querySelector(".playing__repeat").addEventListener("click", repeat);
document.querySelector(".playing__shuffle").addEventListener("click", shuffle);
document.querySelector(".playing__unmute").addEventListener("click", onUnmuteClicked);
document.querySelector(".playing__mute").addEventListener("click", onMuteClicked);
document.querySelector(".slider").addEventListener("change", changeTheTime);
document.querySelector(".volume_slider").addEventListener("change", changeVolume);
document.querySelector(".volume__button").addEventListener("mouseover", showVolume);
document.querySelector(".volume__button").addEventListener("mouseout", hideVolume);
document.querySelector(".dropDown").addEventListener("change", playingSpeed);
document.querySelector(".download__song").addEventListener("click", downloadSong);
document.querySelector(".search").addEventListener("click",searchInputField);
document.querySelector(".queue").addEventListener("mouseover",toggleQueueClass);
document
  .querySelector(".queue")
  .addEventListener("mouseout", toggleClass);
document.querySelector(".search").addEventListener("click", searchInputField);
document.addEventListener("keypress", function(event) {
    if (event.which === 32 || event.keyCode === 32) {
        event.preventDefault();
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