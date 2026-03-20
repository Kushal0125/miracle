if (!customElements.get('category-featured-collections')) {
  class CategoryFeaturedCollections extends HTMLElement {
    constructor() {
      super();
      this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
      this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));
      this.onBlockSelect = this.onBlockSelect.bind(this);
    }

    connectedCallback() {
      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => this.activateTab(tab));
        tab.addEventListener('keydown', (event) => this.onKeydown(event));
      });

      document.addEventListener('shopify:block:select', this.onBlockSelect);
    }

    disconnectedCallback() {
      document.removeEventListener('shopify:block:select', this.onBlockSelect);
    }

    onKeydown(event) {
      const currentIndex = this.tabs.indexOf(event.currentTarget);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % this.tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = this.tabs.length - 1;

      if (nextIndex !== currentIndex) {
        event.preventDefault();
        this.activateTab(this.tabs[nextIndex], { focus: true });
      }
    }

    onBlockSelect(event) {
      if (!this.contains(event.target)) return;

      const blockId = event.target.dataset.blockId;
      if (!blockId) return;

      const matchingTab = this.tabs.find((tab) => tab.dataset.blockId === blockId);
      if (matchingTab) {
        this.activateTab(matchingTab, { focus: true });
      }
    }

    activateTab(tab, { focus = false } = {}) {
      const targetId = tab.dataset.target;
      const targetPanel = this.querySelector(`#${CSS.escape(targetId)}`);
      if (!targetPanel) return;

      this.tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        item.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      this.panels.forEach((panel) => {
        const isActive = panel === targetPanel;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });

      if (focus) tab.focus();

      const slider = targetPanel.querySelector('slider-component');
      if (slider && typeof slider.resetPages === 'function') {
        requestAnimationFrame(() => slider.resetPages());
      }
    }
  }

  customElements.define('category-featured-collections', CategoryFeaturedCollections);
}
