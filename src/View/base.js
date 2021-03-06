import { loadPlaylist, playThisSong } from "../index.js";
// window.loadPlaylist=loadPlaylist;
export const element = {
  searchResList: document.querySelector(".trending_data"),
  searchList: document.querySelector(".row2"),
  neeraj: document.querySelector(".neeraj"),
  songsQueueHeader: document.querySelector(".queue_title"),
  inputField: document.querySelector(".search_text"),
  list: document.querySelector(".searchingField"),
};

export const elementStrings = {
  loader: "loader",
};
export const clearInput = () => {
  console.log(element)
   if (element.inputField.value) {
     element.inputField.value = "";
   }
}
export const clearSearchField = () => {
    element.list.innerHTML="";
};
export const renderLoader = (parent) => {
  const loader = `
  <div class="${elementStrings.loader} play_size">
   <svg>
   <use href="image/icons.svg#icon-cw">
  </svg>
  </div>`;
  parent.insertAdjacentHTML("afterbegin", loader);
};
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
}

export const clearQueue = () => {
  const songsQueueList = document.querySelector(".songs_queue");
  if (songsQueueList) 
  {
    console.log("clearing queue");
    songsQueueList.remove();
  }
};


export  const limitTitleSize = (title, limit = 15) => {
  const newTitle = [];
  if (title && title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")}...`;
  }
  return title;
};
const numFormatter = (data)=>{
  if(typeof data === "number"){
        if( data > 999 && data < 1000000){
            return (data/1000).toFixed(1) + 'K' + " Fans"; 
        }else if(data > 1000000){
            return (data/1000000).toFixed(1) + 'M' + " Fans"; 
        }else if(data < 900){
            return data + " Fans"; 
        }
    }
   else if(typeof data === "string"){
          return limitTitleSize(data);
    }

};
 const renderResult = (data) => {
  const markup = `
         <div class="trending_image">
            <img src="${data.image}" alt="" class="trending_pic"/>
            <div class="playIcon">
               <i class="fas fa-play fa-2x play playButton" value="${data.playlistID}" ></i>
             </div>
            <h4 class="trending_title">${limitTitleSize(data.title)}</h4>
            <p class="trending_author" >${numFormatter(data.singers)}</p>
            </div>`;
        return markup;
  
};
const renderSongsInnQueue = (data, index) => {
  const markup = `
          <li>
            <div class="playing_data">
                <img src="${
                  data.image
                }" alt="" class="queue_image" value="${index}"/>
                <div class="Queue_Details">
                      <h4 class="queue_song">${limitTitleSize(data.song)}</h4>
                      <span> <p class="queue_author">${limitTitleSize(
                        data.singers
                      )}</p></span>
                </div>
            </div>
          </li>
             `;

  return markup;
};
const renderList = (data) => {
  const markup = `
                <div class="songsList">
                    <img src=${data.image} alt="" class="songsList_image"/>
                    <div class="songsList_details">
                        <h4 class="songsList_title">${limitTitleSize(data.title)}</h4>
                        <p class="songsList_author">${limitTitleSize(data.singers)}</p>
                    </div>        
                </div>
      `;
      element.list.insertAdjacentHTML("beforeend", markup);
};
export const renderPage = (data) => {
      let firstRowData = data.slice(0,12);
      let insideDiv ='';
        for(let i=0;i<firstRowData.length;i++) {
          insideDiv += renderResult(firstRowData[i]);
        }
        const markup1 = `
          <div class="trending-row">
            ${insideDiv}
          </div>
        `;
      element.neeraj.insertAdjacentHTML("beforeend", markup1);
      let secondRowData = data.slice(12,24)
      insideDiv = "";
      for (let i = 0; i < secondRowData.length; i++) {
        insideDiv += renderResult(secondRowData[i]);
      }
      const markup2 = `
          <div class="trending-row">
            ${insideDiv}
          </div>
        `; 
        element.neeraj.insertAdjacentHTML("beforeend", markup2);
      
        var anchors = document.querySelectorAll(".playButton");

              for (var z = 0; z < anchors.length; z++) {
                var elem = anchors[z];
                elem.onclick = function () {
                  return loadPlaylist(event);
                };
              }

}
export const renderSongsQueue= (queue) => {
  let songsListHTML='';
   queue.forEach((el,index) => {
     if(el.image){
      songsListHTML+=renderSongsInnQueue(el,index);
     }
   });
   const markup = `
          <ol class="songs_queue">
            ${songsListHTML}
          </ol>`;
    // console.log(markup);
    element.songsQueueHeader.insertAdjacentHTML("afterend", markup);
    var anchors = document.querySelectorAll(".queue_image");

    for (var z = 0; z < anchors.length; z++) {
      var elem = anchors[z];
      elem.onclick = function () {
        return playThisSong(event);
      };
    }
}
  
export const renderSearchList  = (list) =>  {
        list.forEach(renderList);
}