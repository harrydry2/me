import axios from "axios";
import { $, $$ } from "./bling";
import { postPopup } from "./postPopup";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export function lazyLoad(filterArray) {
  window.onscroll = async () => {
    if (window.busy) {
      return;
    }
    if (
      Math.round(window.innerHeight + window.scrollY + 350) >=
      document.body.offsetHeight
    ) {
      window.busy = true;
      // get active filters
      const activeFilters = filterArray
        .filter((filter) => filter.classList.contains("filters__active"))
        .map((filter) => filter.dataset.term)
        .join("-");
      // set filter param
      const filterParam = activeFilters.length === 0 ? "all" : activeFilters;
      try {
        const { data } = await axios.get(
          `/api/lazy/${window.page}/${filterParam}`
        );
        $(".outerCard").insertAdjacentHTML("beforeend", data);
        postPopup(Array.from($$(".card")));
        if (data.length) {
          window.page += 1;
        } else {
          return;
        }
        window.busy = false;
      } catch (err) {
        console.log(err);
      }
    }
  };
}

function isMobile(ua) {
  const mobileRE =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  return mobileRE.test(ua);
}
