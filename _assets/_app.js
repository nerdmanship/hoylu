/*CSSPlugin.defaultTransformPerspective = 500;

var c1 = select("#card1");
var grad1 = select(".grad1");
var c2 = select("#card2");
var grad2 = select(".grad2");
var c3 = select("#card3");
var grad3 = select("#card3 .grad3");
var c4 = select("#card4");
var grad4 = select("#card4 .grad4");

var tl = new TimelineMax({repeat: -1, repeatDelay: 1});

TweenMax.set(c2, {transformOrigin: "center top", rotationX: 90});
TweenMax.set(grad2, {autoAlpha: 1});
TweenMax.set(grad1, {autoAlpha: 1});
TweenMax.set(c3, {transformOrigin: "center bottom"});

tl.to(c3, 0.8, {rotationX: -90, ease: Power4.easeIn})
  .to(grad3, 0.8, {autoAlpha: 1, ease: Power4.easeIn}, 0)
  .to(grad4, 1, {autoAlpha: 1, ease: Power4.easeIn}, 0)
  .to(c2, 0.3, {rotationX: 0, ease: Power3.easeOut}, 0.8)
  .to(grad2, 1.7, {autoAlpha: 0, ease: Power3.easeOut}, 0.8)
  .to(grad1, 1.7, {autoAlpha: 0, ease: Power3.easeOut}, 0.8)
;

tl.play().timeScale(1);*/