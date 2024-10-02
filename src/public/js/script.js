import anime from "/animejs";

window.numbersProject = (function numbersProject() {
  let SVGnumbers;
  let container;
  let current = [];
  let rerun;
  const root = document.documentElement;
  const DURATION = 2500;
  const MAX_SYMBOLS = 7;

  window.onload = () => {
    container = document.querySelector(".container");
    SVGnumbers = document.querySelectorAll(".number-svg");
    rerun = document.querySelector("span#rerun");
    setTimeout(() => {
      showContainer();
    }, 0);
    touchHoverControl();
  };

  function showContainer() {
    container
      .animate(
        [
          { opacity: `0` },
          {
            opacity: `1`,
          },
        ],
        {
          duration: 200,
          fill: "forwards",
          easing: "linear(0, 0.5, 1, 0)",
        }
      )
      .finished.then(() => {
        container.animate(
          [
            { opacity: `0` },
            {
              opacity: `1`,
            },
          ],
          {
            duration: 2000,
            fill: "forwards",
            easing: "cubic-bezier(0,0.5,1,1)",
          }
        );
      });
  }

  function scrollSVG(target, speed) {
    target = target || Math.random() * 10;
    let prev = current;
    current = target
      .toString()
      .split("")
      .filter((e) => e !== ".");
    while (current.length < MAX_SYMBOLS) {
      current.push("0");
    }
    let itr = 0;
    for (const number of SVGnumbers) {
      //  console.log(
      //    number
      //      .animate(
      //        [
      //          {
      //            webkitMaskPositionY: `${prev[itr] ? Number(prev[itr]) : 0}em`,
      //            maskPosition: `0 ${prev[itr] ? Number(prev[itr]) : 0}em`,
      //          },
      //          {
      //            webkitMaskPositionY: `-${
      //              Number(current[itr]) + 10 * (speed + itr)
      //            }em`,
      //            maskPosition: `0 -${Number(current[itr]) + 10 * (speed + itr)}em`,
      //          },
      //        ],
      //        {
      //          duration: duration + 150 * itr,
      //          fill: "forwards",
      //          easing: "cubic-bezier(0, 0.55, 0.45, 1)",
      //        }
      //      )
      //      .effect.getKeyframes()
      //  );
      anime({
        targets: number,
        "-webkit-mask-position-y": [
          { value: `${prev[itr] ? Number(prev[itr]) : 0}em`, duration: 0 },
          {
            value: `-${Number(current[itr]) + 10 * (speed + itr)}em`,
            duration: DURATION + 150 * itr,
          },
        ],
        maskPosition: [
          {
            value: `0 ${prev[itr] ? Number(prev[itr]) : 0}em`,
            duration: 0,
          },
          {
            value: `0 -${Number(current[itr]) + 10 * (speed + itr)}em`,
            duration: DURATION + 150 * itr,
          },
        ],
        easing: "cubicBezier(0, 0.55, 0.45, 1)",
      });
      itr++;
    }
  }

  function handleRerunClick() {
    rerun
      .animate(
        { height: [`14px`, `0px`] },
        {
          duration: 750,
          fill: "forwards",
          easing: "linear",
        }
      )
      .finished.then(() => {
        rerun
          .animate(
            { height: [`0px`, `14px`] },
            {
              delay: 250,
              duration: 750,
              fill: "forwards",
              easing: "linear",
            }
          )
          .finished.then(() => scrollSVG(null, 3));
      });
  }

  function handleChangeColorClick(el) {
    let color = el.getAttribute("color");
    root.style.setProperty("--color", color);
  }

  // touchscreen hover
  // custom hover implementation for mobile devices
  // uses .touched class (apllied on touch event) on body to define a device (not the device but actual type of using it (by mouse or touches) which is more precise)
  // to apply hover add used selectors to SELECTORS value coma separated
  // and add .hovered class to your CSS right with your :hover selectors like
  //
  // button:hover,
  // button.hovered
  //
  // if you don't want touchstart to trigger :hover you should add :not(body.touched *) selector to your :hover selectors like
  //
  // button:hover:not(body.touched *)
  // button.hovered
  //
  // or use it as you like
  const touchHoverControl = function () {
    let hoveredElement;
    let moveDelayTimer;
    let overDelayTimer;
    let untouchListener;
    let SELECTORS = "button.color-change, .bottom-container button";
    const init = (function () {
      console.log("init");
      document.addEventListener("touchstart", (e) => initHover(e));
      document.addEventListener("touchmove", (e) => {
        clearTimeout(moveDelayTimer);
        moveDelayTimer = setTimeout(initHover, 15, e);
      });
      document.addEventListener("touchend", (e) => cancelHover(e));
      document.addEventListener("touchcancel", cancelHover);
    })();

    function initHover(e) {
      if (!untouchListener) {
        untouchListener = document.addEventListener("mouseover", untouch);
      }
      document.body.classList.add("touched");
      if (e.touches.length > 1) {
        cancelHover();
        return;
      }

      let touch = e.touches[0];
      let hovered = document
        .elementFromPoint(touch.clientX, touch.clientY)
        .closest(SELECTORS);
      if (!hovered) {
        cancelHover();
        return;
      }
      if (hovered !== hoveredElement) hover(hovered);
    }

    function hover(el) {
      cancelHover();
      hoveredElement = el;
      hoveredElement.classList.add("hovered");
    }

    function cancelHover(e) {
      if (!hoveredElement) return;
      if (e) {
        if (e.touches.length !== 0) {
          return;
        }
        // if we want to keep last hovered element hovered we should return here
        return;
      }
      hoveredElement.classList.remove("hovered");
      hoveredElement = null;
    }

    function untouch() {
      console.log("untouch");
      clearTimeout(overDelayTimer);
      overDelayTimer = setTimeout(() => {
        if (document.body.classList.contains("touched"))
          document.body.classList.remove("touched");
      }, 50);
      document.removeEventListener("mouseover", untouch);
      cancelHover();
    }
  };

  return {
    scrollSVG: scrollSVG,
    handleRerunClick: handleRerunClick,
    handleChangeColorClick: handleChangeColorClick,
  };
})();
