(() => {
  const sliderState = new WeakMap();

  function getImages(slider) {
    return Array.from(slider.querySelectorAll('[data-hover-slider-image]'));
  }

  function setActiveImage(slider, nextIndex) {
    const images = getImages(slider);
    if (images.length < 2) return;

    images.forEach((image, index) => {
      image.classList.toggle('is-active', index === nextIndex);
    });
  }

  function startSlider(slider) {
    if (!slider || sliderState.has(slider)) return;

    const images = getImages(slider);
    if (images.length < 2) return;

    const interval = Number(slider.dataset.hoverSliderInterval) || 900;
    const state = {
      index: 0,
      timer: window.setInterval(() => {
        state.index = (state.index + 1) % images.length;
        setActiveImage(slider, state.index);
      }, interval),
    };

    sliderState.set(slider, state);
  }

  function stopSlider(slider) {
    const state = sliderState.get(slider);
    if (!state) return;

    window.clearInterval(state.timer);
    sliderState.delete(slider);
    setActiveImage(slider, 0);
  }

  document.addEventListener('mouseover', (event) => {
    const slider = event.target.closest('[data-hover-slider]');
    if (!slider) return;

    const relatedTarget = event.relatedTarget;
    if (relatedTarget && slider.contains(relatedTarget)) return;

    startSlider(slider);
  });

  document.addEventListener('mouseout', (event) => {
    const slider = event.target.closest('[data-hover-slider]');
    if (!slider) return;

    const relatedTarget = event.relatedTarget;
    if (relatedTarget && slider.contains(relatedTarget)) return;

    stopSlider(slider);
  });

  document.addEventListener('focusin', (event) => {
    const slider = event.target.closest('[data-hover-slider]');
    if (!slider) return;

    startSlider(slider);
  });

  document.addEventListener('focusout', (event) => {
    const slider = event.target.closest('[data-hover-slider]');
    if (!slider) return;

    const relatedTarget = event.relatedTarget;
    if (relatedTarget && slider.contains(relatedTarget)) return;

    stopSlider(slider);
  });
})();
