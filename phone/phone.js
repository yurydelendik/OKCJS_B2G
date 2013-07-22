
function initPhone() {
  var numbers = document.getElementById("layer10");
  var numbersBack = document.getElementById("layer5");
  var disk = document.getElementById("disco-rot");
  var handset = document.getElementById("layer9");
  var svg = document.getElementById("svg5323");

  var dialed = false;
  var handsetOff = false;
  handset.addEventListener("click", function (e) {
    handsetOff = !handsetOff;
    if (handsetOff) {
      document.body.classList.add("handsetOff");
    } else {
      hangUp();
      document.body.classList.remove("handsetOff");
    }
    handset.setAttribute("transform",
      handset.getAttribute(handsetOff ? "data-transform-off" : "data-transform-on"));
  });

  function toSvgCoordinates(e) {
    var source = e.touches ? e.touches[0] : e;
    var pt = svg.createSVGPoint();
    pt.x = source.clientX;
    pt.y = source.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function getAngle(p) {
    var DISK_CENTER_X = 264.6615;
    var DISK_CENTER_Y = 273.347;

    var dx = p.x - DISK_CENTER_X;
    var dy = p.y - DISK_CENTER_Y;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  function normalizeAngle(a) {
    return ((a % 360) + 360) % 360;
  }

  var rotating = false;
  var startAngle, currentAngle, lastAngle, holeOffset;
  function updateTransform() {
    var angle = currentAngle - startAngle;
    disk.setAttribute("transform",
      disk.getAttribute("data-transform-rot").replace(/\$angle/, angle));
  }

  function handleEvent(e) {
    if (e.touches && e.stopPropogation) {
      e.stopPropogation();
    }
    e.preventDefault();
  }

  function rotationStarted(e) {
    var FIRST_DIGIT_ANGLE = -30;
    var DIGIT_ANGLE_INTERVAL = 30;

    var p = toSvgCoordinates(e);
    startAngle = currentAngle = lastAngle = getAngle(p);
    holeOffset = normalizeAngle(FIRST_DIGIT_ANGLE - startAngle) % DIGIT_ANGLE_INTERVAL;
    rotating = true;

    document.title = toStop;
    updateTransform();
    handleEvent(e);
  }

  function rotationEnded(e) {
    var FIRST_DIGIT_ANGLE = 60;
    var DIGIT_ANGLE_INTERVAL = 30;
    var ANIMATION_INTERVAL = 70;
    var ANIMATION_STEP = 20;
    rotating = false;

    var clicks = Math.floor((normalizeAngle(currentAngle - startAngle + holeOffset) - FIRST_DIGIT_ANGLE) / DIGIT_ANGLE_INTERVAL) + 1;

    var animationTimer = setInterval(function () {
      if (normalizeAngle(currentAngle - startAngle) < ANIMATION_STEP) {
        currentAngle = lastAngle = startAngle;
        clearInterval(animationTimer);
      } else {
        currentAngle -= ANIMATION_STEP;
      }    
      updateTransform();
    }, ANIMATION_INTERVAL);

    if (clicks >= 1 && clicks <= 10 && handsetOff) {
      ringDigit(clicks % 10);
    }

    handleEvent(e);
  }

  function rotationMoved(e) {
    var STOP_MIN_ANGLE = 25;
    var STOP_MAX_ANGLE = 120;

    if (!rotating) {
      handleEvent(e);
      return;
    }

    var p = toSvgCoordinates(e);
    currentAngle = getAngle(p);

    handleEvent(e);

    if (normalizeAngle(currentAngle - lastAngle) > 90) {
      return;
    }
    var stopAngle = STOP_MIN_ANGLE - holeOffset;
    if (lastAngle <= stopAngle &&
        currentAngle > stopAngle && currentAngle < STOP_MAX_ANGLE) {
      currentAngle = stopAngle;
    }
    lastAngle = currentAngle;

    updateTransform();
  }

  var currentNumber = "";
  function ringDigit(digit) {
    currentNumber += digit;
    if (/([2-9](11|\d{6})|1{\d}{10})/.test(currentNumber) && !dialed) {
      dial(currentNumber);
    }
  }

  function dial(number) {
    dialed = true;

    alert('Dialed: ' + number);
  }

  function hangUp() {
    currentNumber = "";
    dialed = false;
  }


  // starting to track the disk rotation of certain shapes
  [numbers, numbersBack, disk].forEach(function (subject) {
    subject.addEventListener("touchstart", rotationStarted);
    subject.addEventListener("touchend", rotationEnded);
    subject.addEventListener("mousedown", rotationStarted);
    subject.addEventListener("mouseup", rotationEnded);
  });
  // ... however tracking movement on entire svg surface
  svg.addEventListener("touchmove", rotationMoved);
  svg.addEventListener("mousemove", rotationMoved);
}

document.addEventListener("DOMContentLoaded", initPhone);
