console.log(
  'Исходный проект: +10; Обязательный дополнительный фукционал: +10; Дополнительный функционал: кнопке звука добавил интерактивности при изменении звука, добавил попап с инструкцией по горячим клавишам и слайдер фоновый: +10'
);
const slidesList = document.querySelectorAll('.slidesList__item');
const popupBtn = document.querySelector('.popup-btn');
const leftSlide = document.querySelector('.leftBtn');
const rightSlide = document.querySelector('.rightBtn');
const popup = document.querySelector('.popup');
const video = document.querySelector('.player__video');
const videoPlayer = document.querySelector('.player');
const videoLibrary = document.querySelectorAll('.slider-panel li');
const play = document.querySelector('.player__play-button');
const audioBtn = document.querySelector('.player__sound-btn');
const fullScreenBtn = document.querySelector('.player__fullscreen-btn');
const videoScroll = document.querySelector('.progress__video');
const audioScroll = document.querySelector('.progress__volume');

let activeSlideIndex = 0;
let soundMute = false;
let mouseMove = false;
video.volume = 0.5;
videoScroll.value = 0;

function playVideo() {
  if (video.paused) {
    video.play();
    play.firstElementChild.classList.value = 'fas fa-pause';
  } else {
    video.pause();
    play.firstElementChild.classList.value = 'fas fa-play';
  }
}

function clickAudioBtn() {
  if (video.volume > 0) {
    audioBtn.firstElementChild.classList.value = 'fas fa-volume-mute';
    video.volume = 0;
    soundMute = true;
  } else if (+audioScroll.value >= 0.5) {
    audioBtn.firstElementChild.classList.value = 'fas fa-volume-up';
    video.volume = +audioScroll.value;
    soundMute = false;
  } else if (+audioScroll.value < 0.5 && +audioScroll.value > 0) {
    audioBtn.firstElementChild.classList.value = 'fas fa-volume-down';
    video.volume = +audioScroll.value;
    soundMute = false;
  } else {
    audioBtn.firstElementChild.classList.value = 'fas fa-volume-off';
    video.volume = +audioScroll.value;
    soundMute = false;
  }
}

function audioScrollEvent(e) {
  if (e === 'ArrowUp') audioScroll.value = +audioScroll.value + 0.03;
  if (e === 'ArrowDown') audioScroll.value = +audioScroll.value - 0.03;
  const value = Math.floor(+audioScroll.value * 100);
  audioScroll.style.background = `linear-gradient(to right, #24809E 0%, #24809E ${value}%, #C4C4C4 ${value}%, #C4C4C4 100%)`;
  if (!soundMute) {
    video.volume = +audioScroll.value;
    value >= 50
      ? (audioBtn.firstElementChild.classList.value = 'fas fa-volume-up')
      : (audioBtn.firstElementChild.classList.value = 'fas fa-volume-down');
    if (value === 0) audioBtn.firstElementChild.classList.value = 'fas fa-volume-off';
  } else if (soundMute) {
    video.volume = 0;
  }
}

function videoScrollEvent(e) {
  const value = Math.round(+videoScroll.value);
  const progressTime = (e.offsetX / videoScroll.offsetWidth) * video.duration;
  videoScroll.style.background = `linear-gradient(to right, #24809E 0%, #24809E ${value}%, #C4C4C4 ${value}%, #C4C4C4 100%)`;
  video.currentTime = progressTime;
}

function videoTimeUpdate() {
  const percentage = (video.currentTime / video.duration) * 100;
  videoScroll.style.background = `linear-gradient(to right, #24809E 0%, #24809E ${percentage}%, #C4C4C4 ${percentage}%, #C4C4C4 100%)`;
  if (video.currentTime > 0) {
    videoScroll.value = percentage;
  } else {
    videoScroll.value = 0;
  }
}

function toggleScreen() {
  document.fullscreenElement === null ? videoPlayer.requestFullscreen() : document.exitFullscreen();
}

function activeButtons(e) {
  if (e.code === 'Space') playVideo();
  if (e.code === 'KeyM') clickAudioBtn();
  if (e.code === 'KeyF') toggleScreen();
  if (e.code === 'ArrowRight') video.currentTime += 5;
  if (e.code === 'ArrowLeft') video.currentTime -= 5;
  if (e.code === 'ArrowUp') audioScrollEvent(e.code);
  if (e.code === 'ArrowDown') audioScrollEvent(e.code);
  if (e.code === 'Comma') {
    video.playbackRate > 0.5 ? (video.playbackRate -= 0.1) : (video.playbackRate = 0.5);
  }
  if (e.code === 'Period') {
    video.playbackRate < 2.1 ? (video.playbackRate += 0.1) : (video.playbackRate = 2.1);
  }
  if (e.code === 'Escape') {
    popup.classList.remove('active');
    popupBtn.classList.remove('active');
  }
}

function leftSlideChanger() {
  activeSlideIndex--;
  if (activeSlideIndex < 0) activeSlideIndex = slidesList.length - 1;
  document.body.style.background = `url(assets/img/background${activeSlideIndex}.jpg) no-repeat center`;
  document.body.style.backgroundSize = `cover`;
}

function rightSlideChanger() {
  activeSlideIndex++;
  if (activeSlideIndex > slidesList.length - 1) activeSlideIndex = 0;
  document.body.style.background = `url(assets/img/background${activeSlideIndex}.jpg) no-repeat center`;
  document.body.style.backgroundSize = `cover`;
}

leftSlide.addEventListener('click', leftSlideChanger);
rightSlide.addEventListener('click', rightSlideChanger);

popupBtn.addEventListener('click', function () {
  popup.classList.toggle('active');
  popupBtn.classList.toggle('active');
});

play.addEventListener('click', playVideo);
video.addEventListener('click', playVideo);

video.addEventListener('timeupdate', videoTimeUpdate);
videoScroll.addEventListener('click', videoScrollEvent);
videoScroll.addEventListener('mousemove', e => mouseMove && videoScrollEvent(e));
videoScroll.addEventListener('mousedown', () => (mouseMove = true));
videoScroll.addEventListener('mouseup', () => (mouseMove = false));

audioBtn.addEventListener('click', clickAudioBtn);
audioScroll.addEventListener('input', audioScrollEvent);

fullScreenBtn.addEventListener('click', toggleScreen);
video.addEventListener('dblclick', toggleScreen);

document.addEventListener('keydown', e => activeButtons(e));

videoLibrary.forEach((item, index) =>
  item.addEventListener('click', function () {
    video.src = `assets/video/video${index}.mp4`;
    play.firstElementChild.classList.value = 'fas fa-play';
    video.poster = `assets/img/poster${index}.jpg`;
    videoScroll.style.background = `linear-gradient(to right, #24809e 0%, #24809e 0%, #c4c4c4 0%, #c4c4c4 100%)`;
  })
);
