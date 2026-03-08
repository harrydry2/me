/* eslint-disable no-var */
import axios from "axios";
import { differenceInHours } from "date-fns";
import { $, $$ } from "./bling";

// Bot protection: block submissions within 2.5s of page load (script runs on load)
const MIN_SUBMIT_DELAY_MS = 2000;
const PAGE_LOAD_TIME = Date.now();

// mail

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function actualPopup() {
  $(".outerMail").style.display = "flex";
  if ($(".iosOverflow")) {
    $(".iosOverflow").classList.add("mailNoScroll");
    $(".iosOverflow").classList.add("number5chanel");
  }
}

// Honeypot: hidden field that bots fill, humans leave empty. Send to server so API can reject too.
function getHoneypotValue(honeyPot) {
  if (!honeyPot || typeof honeyPot.value !== "string") return "";
  return honeyPot.value.trim();
}

function submitMail(button, red, input, num, honeyPot) {
  if (!button || !red || !input) return;
  var numm = num;
  button.on("click", async () => {
    if (
      $(".iosOverflow") &&
      $(".iosOverflow").classList.contains("number5chanel")
    ) {
      numm = 5;
    }
    const hp = getHoneypotValue(honeyPot);
    if (hp) {
      return; // Bot: silent reject, no feedback
    }
    if (Date.now() - PAGE_LOAD_TIME < MIN_SUBMIT_DELAY_MS) {
      return; // Too fast: silent reject (likely bot)
    }
    red.style.display = "block";
    if (validateEmail(input.value)) {
      const body = { email: input.value, website: getHoneypotValue(honeyPot) };
      if (window.__turnstileWidgetId && !window.__turnstileFailed && typeof window.turnstile !== "undefined") {
        const token = window.turnstile.getResponse(window.__turnstileWidgetId);
        if (!token) {
          red.style.color = "#D0021B";
          red.innerText = "Please wait a moment and try again.";
          return;
        }
        body["cf-turnstile-response"] = token;
      }
      if (typeof window.SL !== "undefined") {
        SL.trackSubscriber(input.value);
      }
      window.localStorage.setItem("onEmailList", "true");
      if (numm === 7) {
        var { data } = await axios.post("/api/subscribeCourse", body);
      } else {
        var { data } = await axios.post("/api/subscribe", {
          ...body,
          num: numm,
        });
      }
      if (window.__turnstileWidgetId && !window.__turnstileFailed && window.turnstile) {
        window.turnstile.reset(window.__turnstileWidgetId);
      }
      if (data.email === "true") {
        red.style.color = "#00c26e";
        red.innerText = `Double opt in required — Check your inbox (may take 2 mins) :)`;
        if (numm === 1) {
          red.classList.add("gta__1");
        } else if (numm === 2) {
          red.classList.add("gta__2");
        } else if (numm === 3) {
          red.classList.add("gta__3");
        } else if (numm === 4) {
          red.classList.add("gta__4");
        } else if (numm === 5) {
          red.classList.add("gta__5");
        }
      }
      if (data.email === "duplicate") {
        red.style.color = "#D0021B";
        red.innerText = "Email already signed up";
      }
      if (data.email === "dunno") {
        red.style.color = "#D0021B";
        red.innerText = "Unknown error. Tweet @harrydry";
      }
    } else {
      red.style.color = "#D0021B";
      red.innerText = "Not a valid email. Try again.";
    }
    input.value = "";
  });
}

export function mailPopup() {
  const mailButton = $(".newmail__input-input .newmail__input-input-button");
  const mailInput = $(".newmail__input-input input");
  const mailRed = $(".newmail__input .newmail__input-red");
  const outerMail = $(".outerMail");
  const mailClose = $(".newmail__icon");
  const honeyPot = $(".nhMailPopup");

  // const onEmailList = window.localStorage.getItem("onEmailList");
  const onEmailList = false;
  const lsMail = window.localStorage.getItem("lsmail");
  const howLongSinceClosed = differenceInHours(new Date(), lsMail);
  console.log(howLongSinceClosed);
  console.log(lsMail);
  var alreadyPoppedUp = false;
  var emailNum = 4;

  if ($(".outerMailActive")) {
    outerMail.style.display = "flex";
    if ($(".iosOverflow")) {
      $(".iosOverflow").classList.add("mailNoScroll");
    }
    alreadyPoppedUp = true;
  }

  if (
    onEmailList !== "true" &&
    !alreadyPoppedUp &&
    (lsMail == null || howLongSinceClosed > 1)
  ) {
    if (window.innerWidth <= 30000) {
      setTimeout(() => {
        $(".outerMail").style.display = "flex";
        if ($(".iosOverflow")) {
          $(".iosOverflow").classList.add("mailNoScroll");
          $(".iosOverflow").classList.add("number5chanel");
        }
      }, 30000);
    }
  }

  if ($(".outerMailActive") && $("#turnstile-newsletter") && window.__turnstileSiteKey) {
    function initTurnstile() {
      if (typeof window.turnstile === "undefined") {
        setTimeout(initTurnstile, 50);
        return;
      }
      window.turnstile.ready(() => {
        window.__turnstileWidgetId = window.turnstile.render("#turnstile-newsletter", {
          sitekey: window.__turnstileSiteKey,
          size: "invisible",
          callback: () => {
            const btn = document.querySelector(".outerMailActive .newmail__input-input-button");
            if (btn) btn.removeAttribute("disabled");
          },
          "error-callback": () => {
            // e.g. 110200 = domain not in Cloudflare widget hostnames – enable button so form still works
            window.__turnstileFailed = true;
            const btn = document.querySelector(".outerMailActive .newmail__input-input-button");
            if (btn) btn.removeAttribute("disabled");
          },
        });
      });
    }
    initTurnstile();
  }

  mailClose.on("click", () => {
    window.localStorage.setItem("lsmail", new Date());
    outerMail.style.display = "none";
    if ($(".iosOverflow")) {
      $(".iosOverflow").classList.remove("mailNoScroll");
    }
    alreadyPoppedUp = true;
    if ($(".fed")) {
      window.history.pushState("", "", `/inspiration`);
    } else {
      window.history.pushState("", "", `/`);
    }
    // window.history.back();
  });
  submitMail(mailButton, mailRed, mailInput, emailNum, honeyPot);
}

export function mailSubmitHome() {
  const mailButtonSpec = $(".nh1");
  const mailInputSpec = $(".nh2");
  const mailRedSpec = $(".nh3");
  const honeyPot = $(".nh4");
  if (!mailButtonSpec || !mailInputSpec || !mailRedSpec) return;
  submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 1, honeyPot);
}

export function mailSubmitFromPost() {
  const mailButtonSpec = $(".postEmail .mail__button");
  const mailInputSpec = $(".postEmail .mail__input > input");
  const mailRedSpec = $(".postEmail .mail__bc-red");
  submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 2);
}

// export function mailSubmitAddOn() {
//   const mailButtonSpec = $('.addOnEmail .mail__button');
//   const mailInputSpec = $('.addOnEmail .mail__input > input');
//   const mailRedSpec = $('.addOnEmail .mail__bc-red');
//   submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 3);
// }

export function mailSubmitFromHandbook() {
  const mailButtonSpec = $(".flowBreaker__inner .mail__button");
  const mailInputSpec = $(".flowBreaker__inner .mail__input > input");
  const mailRedSpec = $(".flowBreaker__inner .mail__bc-red");
  submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 3);
}

// export function mailSubmitFromCourseTop() {
//   const mailButtonSpec = $(".cmt1");
//   const mailInputSpec = $(".cmt2");
//   const mailRedSpec = $(".cmt3");
//   submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 7);
// }

// export function mailSubmitFromCourseBottom() {
//   const mailButtonSpec = $(".cmt4");
//   const mailInputSpec = $(".cmt5");
//   const mailRedSpec = $(".cmt6");
//   submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 7);
// }

export function mailSubmitFromCourseNew() {
  const mailButtonSpec = $(".lc1");
  const mailInputSpec = $(".lc2");
  const mailRedSpec = $(".lc3");
  submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 7);
}

export function mailSubmitFed() {
  const mailButtonSpec = $(".search__text");
  const mailInputSpec = $(".search__left > input");
  const mailRedSpec = $(".search__text-info");
  const honeyPot = $(".nh5");
  submitMail(mailButtonSpec, mailRedSpec, mailInputSpec, 1, honeyPot);
}

// 1 - home
// 2 - on page
// 3 - on page ajax
// 4 - direct
// 5 - popup
// 6 - fromHandbook
// 7 - fromCourse
