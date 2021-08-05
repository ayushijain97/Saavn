import { loadPlaylist } from "../index.js";
export const element = {
  searchResList: document.querySelector(".trending_data"),
  searchList: document.querySelector(".row2"),
  neeraj: document.querySelector(".neeraj"),
};

export const elementStrings = {
  loader: "loader",
};

export const renderLoader = (parent) => {
  const loader = `
  <div class="${elementStrings.loader}">
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
export  const limitTitleSize = (title, limit = 17) => {
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
            <h4 class="trending_title" value="${data.title}" >${limitTitleSize(data.title)}</h4>
            <p class="trending_author" >${limitTitleSize(data.singers)}</p>
            </div>`;
            // document.querySelector(".trending_title").addEventListener("click",loadPlaylist);
            return markup;
  
};
export const renderPage = (data) => {
      let firstRowData = data.slice(0,12);
      // const markup1 = `
      // <div class="trending-row">
      //   ${firstRowData.forEach((data)=> {
      //       renderResult(data);
      //   })}
      // </div>
      //   `;
        let insideDiv ='';
        for(let i=0;i<firstRowData.length;i++) {
          insideDiv+=renderResult(firstRowData[i]);
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
}
  

