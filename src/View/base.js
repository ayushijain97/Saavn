import { loadPlaylist, playThisSong } from "../index.js";
// window.loadPlaylist=loadPlaylist;
export const element = {
  searchResList: document.querySelector(".trending_data"),
  searchList: document.querySelector(".row2"),
  neeraj: document.querySelector(".neeraj"),
  songsQueueHeader: document.querySelector(".queue_title"),
};

export const elementStrings = {
  loader: "loader",
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
    
export const renderResult = (data) => {
  const markup = `
         <div class="trending_image">
            <img src="${data.image}" alt="" class="trending_pic"/>
            <div class="playIcon">
               <i class="fas fa-play fa-2x play playButton" value="${data.playlistID}" ></i>
             </div>
            <h4 class="trending_title">${limitTitleSize(data.title)}</h4>
            <p class="trending_author" >${limitTitleSize(data.singers)}</p>
            </div>`;
            return markup;
  
};
export const renderSongsInQueue = (data,index) => {
  const markup = `
          <li>
             <img src="${data.image}" alt="" class="queue_image" value="${index}"/>
          </li>
             `;
        
  return markup;
}



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
      songsListHTML+=renderSongsInQueue(el,index);
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
  

