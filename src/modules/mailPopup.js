/* eslint-disable no-var */
import axios from "axios";
import { differenceInHours } from "date-fns";
import { $, $$ } from "./bling";

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

function submitMail(button, red, input, num, honeyPot) {
  console.log(window.SL, "is this a thing?");
  var numm = num;
  button.on("click", async () => {
    if (
      $(".iosOverflow") &&
      $(".iosOverflow").classList.contains("number5chanel")
    ) {
      numm = 5;
    }
    if (honeyPot.value) {
      console.log("HONEY ERROR")
      return;
    }
    red.style.display = "block";
    if (validateEmail(input.value)) {
      if (typeof window.SL !== "undefined") {
        SL.trackSubscriber(input.value);
        console.log(SL, input.value);
      }
      window.localStorage.setItem("onEmailList", "true");
      if (numm === 7) {
        var { data } = await axios.post("/api/subscribeCourse", {
          email: input.value,
        });
      } else {
        var { data } = await axios.post("/api/subscribe", {
          email: input.value,
          num: numm,
        });
      }
      if (data.email === "true") {
        red.style.color = "#00c26e";
        red.innerText = `Just sent an email — Check spam :)`;
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
  // honeyPot check
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
