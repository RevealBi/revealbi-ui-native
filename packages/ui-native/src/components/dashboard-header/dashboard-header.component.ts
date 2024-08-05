import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("rv-dashboard-header")
export class RvDashboardHeader extends LitElement {
    @property({ type: String }) override title: string = "";

    static override styles = css`
        .header {
            font-size: var(--rv-font-size-2x-large);
            font-weight: bold;
            margin-bottom: 10px;
        }
    `;

    override render() {
        return html`<div class="header">${this.title}</div>`;
    }
}
