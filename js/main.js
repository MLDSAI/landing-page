
(function() {

  function renderLogo() {
    // TODO: move to template inside index.html?
    const logoHtml = `
      <div class="row first-row">
        <div class="left-col ml">
          <span>
            A
          </span>
          <span>
            L
          </span>
        </div>
        <div class="right-col machine-learning">
          <span>
            Advanced Leadership
          </span>
        </div>
      </div>
      <div class="row second-row">
        <div class="left-col ds">
          <span>
            F
          </span>
          <span>
            A
          </span>
        </div>
        <div class="right-col data-science">
          <span>
            Faciliation Agency
          </span>
        </div>
      </div>
    `;
    logoEls = document.querySelectorAll('.logo');
    for (const logoEl of logoEls) {
      logoEl.innerHTML = logoHtml;
    }
  }
  renderLogo();

  const logoEl = document.querySelector('#logo-main')

  const targetElId = '#logo-nav'
  const targetEl = document.querySelector(targetElId)
  const x1 = logoEl.getBoundingClientRect().left;
  const y1 = logoEl.getBoundingClientRect().top;
  const x2 = targetEl.getBoundingClientRect().left;
  const y2 = targetEl.getBoundingClientRect().top;
  var xDistance = -(x1 - x2);
  var yDistance = -(y1 - y2);
  console.log('xDistance:', xDistance, 'yDistance:', yDistance)
  

  const { tween, styler, timeline, easing } = popmotion;
  const logo = styler(logoEl);
  const rowStylers = Array.from(logoEl.children).map(styler);
  console.log('rowStylers:', rowStylers)
  const rowNames = rowStylers.map((s, i) => 'row' + i);
  console.log('rowNames:', rowNames)
  const labelEls = logoEl.querySelectorAll('.right-col')
  const labelStylers = Array.from(labelEls).map(styler)
  const labelNames = labelStylers.map((s, i) => 'label' + i);
  const coverEl = document.querySelector('#cover')
  const cover = styler(coverEl)
  const animateLogo = () => {
    return timeline([
      {track: 'logo', duration: 0, from: 0, to: {scale: 1.7}},
      [...rowStylers.map((s, i) => tweenUp(rowNames[i], 400, 50)), 50],
      '-400',
      [...labelStylers.map((s, i) => tweenRight(labelNames[i], 600, -150)), 25],
      '600',
      [tweenHome('logo', 600, xDistance -.3, yDistance -.8)],
      '-200',
      [
        {track: 'cover', duration: 2000, from: 1, to: {opacity: 0 }},
        {track: 'logo', duration: 800, from: {opacity: 1}, to: {opacity: 0}}
      ],
    ]).start(setStylers);
  }
  const tweenHome = (track, duration, xDistance, yDistance) => ({
    track,
    duration,
    from: {scale: 2, rotateY: 0, rotateX: 0},
    to: {
      scale: 1,
      x: xDistance,
      y: yDistance,
    },
    ease: {
      scale: easing.easeInOut,
      x: easing.backOut,
      y: easing.easeInOut,
    }
  })
  const tweenUp = (track, duration, yFrom) => ({
    track,
    duration,
    from: { y: yFrom, opacity: 0 },
    to: { y: 0, opacity: 1 },
    ease: { y: easing.backOut, opacity: easing.linear }
  });
  const tweenRight = (track, duration, xFrom) => ({
    track,
    duration,
    from: { x: xFrom, opacity: 0 },
    to: { x: 0, opacity: 1 },
    ease: { x: easing.backOut, opacity: easing.linear }
  });
  const setStylers = (v) => {
    if (v.logo !== undefined) logo.set(v.logo);
    rowNames.forEach((name, i) => {
      if (v[name] !== undefined) rowStylers[i].set(v[name])
    });
    labelNames.forEach((name, i) => {
      if (v[name] !== undefined) labelStylers[i].set(v[name])
    });
    if (v.cover !== undefined) cover.set(v.cover)
  };
  let animation = animateLogo()
  console.log('animation:', animation)
  initialized = false
  function waitUntilDone() {
    let progress = animation.getProgress()
    if (progress.logo != 1) {
      setTimeout(waitUntilDone, 300)
    } else {
      let coverEl = document.querySelector('#cover')
      coverEl.remove()
    }
  }
  waitUntilDone()
})()






// TODO: refactor using InteractionObserver
// https://www.codeply.com/go/H7ZKuxKTKm
$(document).scroll(debounce(onScroll, 10))

let $logoNav = $('#logo-nav')
console.log('$logoNav:', $logoNav)
let $mobileLogoNav = $('.mobile #logo-nav')
console.log('$mobileLogoNav:', $mobileLogoNav)
let $video = $('video')
let $window = $(window)
let $bodyWrap = $('#body-wrap')

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function onScroll(e){
  let logoHeight = $logoNav.height() || $mobileLogoNav.height()
  let videoHeight = $video.height()
  let scrollTop = $window.scrollTop()

  var body = document.body
  var html = document.documentElement

  var documentHeight = Math.max(
    body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight
  )

  let condition = (scrollTop > videoHeight - logoHeight)
  $bodyWrap.toggleClass('scrolled', condition)
  $logoNav.toggleClass('inverted', !condition)
  $mobileLogoNav.toggleClass('inverted', !condition)
  $('.toggle.icon').toggleClass('inverted', !condition)
};

new WOW().init();

let $contactForm = $('#contact-form')
$contactForm.submit((e) => {
  console.log('submit')
  e.preventDefault()


  let $name = $("#name")
  let $email = $("#email")
  let $phone = $("#phone")
  let $message = $("#message")
  let name = $name.val()
  let email = $email.val()
  let phone = $phone.val()
  let message = $message.val()
  let $submit = $("#submit")

  let $dimmer = $("#dimmer")
  $dimmer.html('<div class="ui active blue elastic loader"></div>')
  $dimmer.dimmer({closable: false})
  $dimmer.dimmer('show')

  const serviceID = 'service_tyhy8oj';
  const templateID = 'template_uo50m8o';
  const templateParams = { message };
  emailjs.send(serviceID, templateID, templateParams)
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
       let height = $contactForm.height()
       let $thankYou = $(`
         <h2>Thank You!</h2>
         <i id="paper-plane" class="ui icon paper plane outline"></i>
         <p>
           Thank you for sending us a message!
         </p>
       `)
       $thankYou.hide()
       $contactForm.replaceWith($thankYou)
       $thankYou.fadeIn()
       $dimmer.dimmer('hide')
    }, function(error) {
       console.log('FAILED...', error);
       $dimmer.html(`
         <h1>Something went wrong</h1>
         <h2>Please refresh the page and try again.</h2>
       `)
    });
})

// date
$('#current-year').html(new Date().getFullYear());
