import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query } from 'lit/decorators.js';

@customElement('rv-tile')
export class RvTile extends LitElement {
  @property({ type: Number }) colSpan = 1;
  @property({ type: Number }) rowSpan = 1;

  static override styles = css`
    :host {
      position: relative;
      display: block;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      width: 100%;
      height: 100%;
      overflow: hidden; /* Prevent overflow */
    }
    
    .tile-content {
      height: 100%;
      box-sizing: border-box;
    }

    .resize-handle {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      background: rgba(0, 0, 0, 0.2);
      cursor: se-resize;
    }
  `;

  private startResize(event: MouseEvent) {
    event.preventDefault();
    window.addEventListener('mousemove', this.resize);
    window.addEventListener('mouseup', this.stopResize);
  }

  private resize = (event: MouseEvent) => {
    const rect = this.getBoundingClientRect();
    const newWidth = event.clientX - rect.left;
    const newHeight = event.clientY - rect.top;

    const newColSpan = Math.ceil(newWidth / (rect.width / this.colSpan));
    const newRowSpan = Math.ceil(newHeight / (rect.height / this.rowSpan));

    this.colSpan = newColSpan > 0 ? newColSpan : 1;
    this.rowSpan = newRowSpan > 0 ? newRowSpan : 1;
    this.requestUpdate();
  };

  private stopResize = () => {
    window.removeEventListener('mousemove', this.resize);
    window.removeEventListener('mouseup', this.stopResize);
  };

  protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has("colSpan") || changedProperties.has("rowSpan")) {
      this.style.gridColumn = `span ${this.colSpan}`;
      this.style.gridRow = `span ${this.rowSpan}`;
    }
  }

  override render() {
    return html`
    <div class="tile-content">
      <slot></slot>
    </div>
    <!-- <div class="resize-handle" @mousedown="${this.startResize}"></div> -->
    `;
  }
}
