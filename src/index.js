import "./sass/styles.sass";
import axios from "axios";
import Masonry from "masonry-layout";

import { $, $$ } from "./modules/bling";
import { postPopup } from "./modules/postPopup";
import {
  initObserver,
  fedLoadScroll,
  fedFilter,
  cegimobtap,
  toggle,
  cegMobileFilter,
  cegMobileNewsletter,
} from "./modules/fed";

// import { vimeoWatcher, adjustDashes, searchBar, playFromTimestamp} from "./modules/coursedash";

import {
  mailPopup,
  actualPopup,
  mailSubmitFromPost,
  mailSubmitFromCourseNew,
  mailSubmitHome,
  mailSubmitFromHandbook,
} from "./modules/mailPopup";

import { lazyLoad } from "./modules/lazyLoad";

window.page = 2;
window.cegpage = 1;
window.busy = false;
window.beenDone = false;
window.gifbusy = false;
window.cegbusy = false;
// 1) Deals with the filter across screens

let filterArray;
const array = Array.from($$(".filters__spec"));
const arrayLength = array.length;

if (window.innerWidth < 768) {
  filterArray = array.slice(arrayLength / 2, arrayLength);
} else {
  filterArray = array.slice(0, arrayLength / 2);
}

if (
  !$(".gif") &&
  !$(".th") &&
  !$(".nlcc") &&
  !$(".ceg") &&
  !$(".cegM") &&
  !$(".zzz") &&
  !$(".zzy") &&
  !$(".roast") &&
  !$(".fed")
) {
  lazyLoad(filterArray);
  if (window.innerWidth < 1025) {
    cegMobileNewsletter();
    cegMobileFilter();
  }
}

if (
  !$(".gif") &&
  !$(".th") &&
  !$(".nlcc") &&
  !$(".ceg") &&
  !$(".cegM") &&
  !$(".zzz") &&
  !$(".zzy") &&
  !$(".roast") &&
  !$(".fed")
) {
  let currentnum;
  let oldnum;
  const fcString = $(".filterContainer").className;
  if (fcString.includes(" ")) {
    console.log(fcString.length);
    if (fcString.length > 35) {
      oldnum = fcString.slice(-2);
    } else {
      oldnum = fcString.slice(-1);
    }
  } else {
    oldnum = "0";
  }
  console.log(oldnum);
  filterArray.forEach((filterItem) => {
    filterItem.on("click", async (e) => {
      currentnum = e.currentTarget.dataset.num;
      // reset page settings for new filters
      e.preventDefault();
      window.page = 2;
      window.busy = false;
      // toggle active state
      e.currentTarget.parentElement.parentElement.classList.toggle(
        `cegfilters__active${currentnum}`
      );
      // remove parent filters already there.
      e.currentTarget.parentElement.parentElement.classList.remove(
        `cegfilters__active${oldnum}`
      );
      // remove any filters active already there
      if (oldnum === currentnum) {
        e.currentTarget.classList.toggle("filters__active");
      } else {
        filterArray.forEach((filter) => {
          filter.classList.remove(`filters__active`);
        });
        e.currentTarget.classList.toggle("filters__active");
      }
      // array of active filters
      const activeFilters = filterArray
        .filter((filter) => filter.classList.contains("filters__active"))
        .map((filter) => filter.dataset.term);
      // if no filters default to all
      if (activeFilters.length === 0) {
        window.history.pushState("", "", `/`);
        var { data } = await axios.get(`/api/lazy/1/all`);
      } else {
        // change push state
        window.history.pushState("", "", `/${activeFilters}`);
        // axios the filtered marketing ideas
        var { data } = await axios.get(`/api/lazy/1/${activeFilters}`);
      }
      oldnum = currentnum;
      $(".outerCard").innerHTML = data;
      // popup after dynamically inserted
      postPopup(Array.from($$(".card")));
    });
  });
}

// if (
//   !$(".gif") &&
//   !$(".th") &&
//   !$(".cc") &&
//   !$(".ceg") &&
//   !$(".cegM") &&
//   !$(".fed")
// ) {
//   const hmButton = $(".hm__button");
//   const hmFilters = $(".hm__filters");
//   hmButton.on("click", () => {
//     const it1 = "Show filters";
//     const it2 = "Show marketing ideas";
//     if (hmButton.innerText === it1) {
//       hmButton.innerText = it2;
//     } else {
//       hmButton.innerText = it1;
//     }
//     hmFilters.classList.toggle("hm__filters-active");
//     $(".iosOverflow").classList.toggle("noScroll");
//   });
// }

// mailPopup
if (
  !$(".gif") &&
  !$(".th") &&
  !$(".nlcc") &&
  !$(".ceg") &&
  !$(".zzz") &&
  !$(".zzy") &&
  !$(".roast") &&
  !$(".cegM")
) {
  if (!window.location.href.includes("utm_source=newsletter")) {
    mailPopup();
  } else {
    console.log("no more emails popups for loving subs");
  }
  mailSubmitHome();
}
//

if ($(".undera__center-text")) {
  if (window.innerWidth > 768) {
    $(".undera__center-text").innerText = "CLICK ICON TO SHARE";
  }
}

// only if Post page
// now disabled
// if ($('.postNoScroll')) {
//   mailSubmitFromPost();
// }

// popup from homepage (also if close post page)
if (
  !$(".gif") &&
  !$(".th") &&
  !$(".nlcc") &&
  !$(".ceg") &&
  !$(".cegM") &&
  !$(".zzz") &&
  !$(".zzy") &&
  !$(".roast") &&
  !$(".fed")
) {
  postPopup(Array.from($$(".card")));
}

if ($(".nlcc")) {
  $(".nlc").style.minHeight = `${window.innerHeight}px`;
  $(".nlc__main").style.minHeight = `${window.innerHeight}px`;
  $(".nlc__main").style.opacity = "1";
  mailSubmitFromCourseNew();
  if ($(".nlc__added")) {
    $(".nlc").on("click", () => {
      $(".nlc__added").style.display = "none";
    });
  }
}

// if ($(".ceg")) {
//   // window.addEventListener('load', resizeCEG);
//   cegLoad(false);
//   cegLoadScroll();
//   cegFilter();
//   if (window.innerWidth < 930) {
//     cegMobileFilter();
//   }
//   window.on("resize", debounce(async () => resizeCegAll(), 100));
// }

if ($(".fed")) {
  mailSubmitHome();
  mailPopup();
  const msnry = new Masonry(".fedgrid", {
    // options
    itemSelector: ".cegio",
    gutter: window.gutter,
    transitionDuration: 0,
  });
  msnry.layout();
  $(".fedgrid").style.opacity = 1;
  initObserver();
  fedFilter();
  toggle();
  if (window.innerWidth < 1026) {
    cegMobileFilter();
    cegMobileNewsletter();
  }
  cegimobtap($$(".cegio"));
  $(".handbook__bottom").on("click", () => {
    actualPopup();
  });
  history.scrollRestoration = "manual";
}

// course9

if ($(".zzy")) {
  $(".zzy__sexyButton").on("click", () => {
    console.log("nothing!");
  });
}
// course 10

// if ($(".zzz")) {
//   vimeoWatcher();
//   adjustDashes();
//   searchBar();
//   playFromTimestamp();
// }
