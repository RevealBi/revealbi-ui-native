import { DashboardFilter, RdashDocument } from "@revealbi/dom";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("rv-dashboard-filters")
export class RvDashboardFilters extends LitElement {
    @property({ type: Object }) dashboard!: RdashDocument;
    @property({ type: Object }) filters: DashboardFilter[] = [];

    static override styles = css`
        :host {
            display: grid;
            grid-template-columns: auto 1fr;
        }
    `;

    override render() {
        return this.filters?.map(filter => html`
            <rv-dashboard-filter .dashboard=${this.dashboard} .filter=${filter}></rv-dashboard-filter>
        `);
    }
}
