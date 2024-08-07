import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query } from 'lit/decorators.js';

@customElement('rv-tile')
export class RvTile extends LitElement {
  @property({ type: Number }) colSpan = 1;
  @property({ type: Number }) rowSpan = 1;
  @property({ type: Boolean, reflect: true }) maximized = false;

  static override styles = css`
    :host {
      display: grid;  
      grid-template-columns: 1fr;      
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;    
      
      grid-column: span var(--col-span, 1);
      grid-row: span var(--row-span, 1);
    }

    :host([maximized]) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      border-radius: 0;
    }

    @media (max-width: 768px) { /* Tablets and smaller */
      :host(:not([maximized])) {
        grid-column: auto;
        grid-row: auto;
      }
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('rv-tile-maximize-changed', this.toggleMaximizeHandler);
  }

  override disconnectedCallback() {
    this.removeEventListener('rv-tile-maximize-changed', this.toggleMaximizeHandler);
    super.disconnectedCallback();
  }

  private toggleMaximizeHandler = (event: any) => {
    this.maximized = event.detail.maximized;
  };

  protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has("colSpan") || changedProperties.has("rowSpan")) {
      this.style.setProperty('--col-span', this.colSpan.toString());
      this.style.setProperty('--row-span', this.rowSpan.toString());
    }
  }

  override render() {
    return html`
      <slot></slot>
    `;
  }
}
