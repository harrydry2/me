import axios from "axios";
import { $, $$ } from "./bling";
// import { mailSubmitAddOn } from './mailPopup';

function closePopup() {
  // post scroll to top on close
  // $('.post').scrollTop = 0;
  // remove outer post
  $(".outerPost").style.display = "none";
  // remove no scroll and post no scroll
  $(".iosOverflow").classList.remove("noScroll");
  $(".iosOverflow").classList.remove("postNoScroll");
  // push back to "/"
  window.history.pushState("", "", "/");
  document.title = "Marketing Examples";
}

export function postPopup(cards) {
  cards.forEach((card) => {
    card.on("click", async (e) => {
      e.preventDefault();
      if (e.target.classList.contains("pCard__bottom-link-text")) {
        return;
      }
      const tag = card
        .querySelector(".card__bottom-tag")
        .className.split(" ")[1]
        .substring(4);
      // this will change as h4 changes
      const title = card.querySelector("h4").innerText;
      // add noScroll
      $(".iosOverflow").classList.add("noScroll");
      // show outer post
      $(".outerPost").style.display = "flex";
      $(".post").scrollTop = 0;
      // populate post
      const { slug } = e.currentTarget.dataset;
      $(".popupLoader").style.display = "flex";
      const [cardDataObject, contentDataObject] = await Promise.all([
        axios.get(`/api/getpCard?slug=${slug}`),
        axios.get(`/api/getcontent?slug=${slug}`),
      ]);
      const { data: cardData } = cardDataObject;
      const { data: contentData } = contentDataObject;
      $(".post__top").innerHTML = cardData;
      $(".content").innerHTML = contentData;
      $(".popupLoader").style.display = "none";
      // currently disabled
      // mailSubmitAddOn();
      // push
      if ($(".undera__center-text")) {
        if (window.innerWidth > 768) {
          $(".undera__center-text").innerText = "CLICK ICON TO SHARE";
        }
      }
      // bannertoggle
      // $('.ph').style.animationPlayState = 'paused';
      window.history.pushState("brother", "Brother MInda", `../${tag}/${slug}`);
      document.title = title;
    });
  });

  // close on click
  $(".outerPost__close").on("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    closePopup();
    // $('.ph').style.animationPlayState = 'running';
  });

  document.on("click", (e) => {
    if (e.target.classList.contains("outerPost")) {
      e.preventDefault();
      closePopup();
      // $('.ph').style.animationPlayState = 'running';
    }
  });

  // close on esc
  document.on("keydown", (e) => {
    if (e.keyCode === 27) {
      closePopup();
      // $('.ph').style.animationPlayState = 'running';
    }
  });
}
