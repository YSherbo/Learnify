import { r as render } from './vidstack-Nzpo6ock.js';

class LitElement extends HTMLElement {
  constructor() {
    super(...arguments);
    this.rootPart = null;
  }
  connectedCallback() {
    this.rootPart = render(this.render(), this, {
      renderBefore: this.firstChild
    });
    this.rootPart.setConnected(true);
  }
  disconnectedCallback() {
    this.rootPart?.setConnected(false);
    this.rootPart = null;
    render(null, this);
  }
}

export { LitElement as L };
