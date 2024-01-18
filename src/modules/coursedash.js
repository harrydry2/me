import { $, $$ } from "./bling";
import axios from "axios";

// var { data: alltheData } = await axios.get(`/api/coursesearch`);
// var iframe = $(".zzz__right-cont-video iframe");
// var player = new Vimeo.Player(iframe);

function displayMatches (e) {
  const matchArray = findMatches(this.value, alltheData).slice(0, 5);
  const displayResults = matchArray.length > 0 ? "block" : "none";
  const html = matchArray.map(obj => {
    const regex = new RegExp('\\b' + this.value, 'gi');
    const videoName = obj.video.replace(regex, match => `<span class="zzz_hl">${match}</span>`);
    const chapterName = obj.chapter.replace(regex, match => `<span class="zzz_hl">${match}</span>`);
    return `
      <a class="zzz__menu-search-results-cont" href="${obj.slug}">
        <div class="zzz__menu-search-results-cont-left">
          <img src="${obj.img}" alt="" />
          <div class="zzz__menu-search-results-cont-left-vid">${videoName}<span> › ${chapterName}</span></div>
        </div>
        <img class="zzz__menu-search-results-cont-arrow" src="https://ik.imagekit.io/o08ysq9vx/gpt99/searchArrow.svg" alt="" />
      </a>
    `;
  }).join('');
  $(".zzz__menu-search-results").style.display = displayResults;
  $(".zzz__menu-search-results").innerHTML = html;
}

function findMatches (wordToMatch, alltheData) {
  if (!wordToMatch.trim()) {
    return [];
  }
  return alltheData.filter(obj => {
    const regex = new RegExp(wordToMatch, 'gi');
    return obj.video.match(regex) || obj.chapter.match(regex);
  });
}

export async function searchBar() {
  $('.zzz__menu-search input').addEventListener('keyup', displayMatches);
}

export async function playFromTimestamp () {
  const timestamp = $('.zzz__right-cont-video').dataset.timestamp;
  try {
    await player.setCurrentTime(timestamp);
    await player.play();
  } catch (error) {
    console.error('Error setting the video time:', error);
  }
}

export function vimeoWatcher() {
  player.on("ended", async function () {
    // countdown
    const isthebarStuck = $('.zzz__bar-progress-width').dataset.barStuck;
    adjustDashes(isthebarStuck);
    const countdownElement = $('.zzz__right-cont-split-end-countdown');
    var slug = window.location.pathname.split("/").pop();
    var {data: { redirectUrl }} = await axios.post(`/api/vidended`, {
      slug,
    });
    let countdownValue = 5;
    $('.zzz__right-cont-split-end').style.opacity = 1
    const countdownInterval = setInterval(function() {
      countdownValue -= 1;
      countdownElement.textContent = countdownValue;
      if (countdownValue <= 0) {
          clearInterval(countdownInterval); // Stop the interval
          window.location.href = redirectUrl; // Redirect user
      }
  }, 1000);
  });
}

export function adjustDashes(isthebarStuck = "true") {
  // select errthing
  const progressWidth = $('.zzz__bar-progress-width')
  const dashedLine = $('.zzz__bar-dashed');
  const progressWriter = $('.zzz__bar-writer');

  console.log(isthebarStuck, "barstuckfrontend");
  const totalVids = 100;
  var completedVids = isthebarStuck === "true" ? parseInt(progressWidth.dataset.completedVids) : parseInt(progressWidth.dataset.completedVids) + 1;
  const completionPercentage = (completedVids / totalVids) * 100;
  const totalDashes = completedVids;


  progressWidth.style.width = `${completionPercentage + 1}%`
  progressWriter.style.left = `calc(${completionPercentage + 1}% - 20px)`
  const lineWidth = (progressWidth.offsetWidth - 16) / (totalDashes * 2);
  dashedLine.style.width = `${(lineWidth * 2 * totalDashes) - 2}px`;
  dashedLine.style.backgroundImage = `linear-gradient(to right, white ${lineWidth}px, transparent ${lineWidth}px)`;
  dashedLine.style.backgroundSize = `${lineWidth * 2}px 1px`;
}
