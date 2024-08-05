import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query } from 'lit/decorators.js';

@customElement('rv-tile-layout')
export class RvTileLayout extends LitElement {
  @property({ type: Number }) rowCount: number = 4; // Default to 3 rows
  @property({ type: Number }) colCount: number = 5; // Default to 60 columns

  static override styles = css`
    :host {
      display: grid;
      position: relative;
      box-sizing: border-box;
      grid-template-columns: repeat(var(--col-count, 4), 1fr);
      grid-template-rows: repeat(var(--row-count, 5), 1fr);
      gap: 5px;
      width: 100%;
      height: 100%;
    }

    @media (max-width: 768px) {
      :host {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }

      ::slotted(rv-tile) {
        width: 100%;
        height: 300px;
        min-width: 300px;
      }
    }
  `;

  protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('rowCount') || changedProperties.has('colCount')) {
      this.style.setProperty('--row-count', this.rowCount.toString());
      this.style.setProperty('--col-count', this.colCount.toString());
    }
  }

  override render() {
    return html`
        <slot></slot>
    `;
  }
}
