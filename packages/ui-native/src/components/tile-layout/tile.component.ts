import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query } from 'lit/decorators.js';

@customElement('rv-tile')
export class RvTile extends LitElement {
  @property({ type: Number }) colSpan = 1;
  @property({ type: Number }) rowSpan = 1;

  static override styles = css`
    :host {
      display: grid;  
      grid-template-columns: 1fr;
      
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;      
    }
  `;

  protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has("colSpan") || changedProperties.has("rowSpan")) {
      this.style.gridColumn = `span ${this.colSpan}`;
      this.style.gridRow = `span ${this.rowSpan}`;
    }
  }

  override render() {
    return html`
      <slot></slot>
    `;
  }
}
