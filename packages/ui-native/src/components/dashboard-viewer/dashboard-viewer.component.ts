import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property } from 'lit/decorators.js';
import styles from "./dashboard-viewer.styles";
import { RdashDocument } from "@revealbi/dom";
import { DashboardService } from "../../data/data-service";

@customElement("rv-dashboard-viewer")
export class RvDashboardViewer extends LitElement {
    static override styles = styles;

    @property({ type: String }) dashboard: string | RdashDocument | undefined;

    private async updateDashboard(dashboard: string | RdashDocument | undefined): Promise<void> {
        if (dashboard) {
            if (typeof dashboard === "string") {
                this.dashboard = await DashboardService.getById(dashboard);
            }
        }
    }

    protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        const dashboardChanged = changedProperties.has("dashboard") && this.dashboard !== undefined;

        if (dashboardChanged) {
            this.updateDashboard(this.dashboard);
        }
    }

    protected override render() {
        const dashboard = this.dashboard as RdashDocument;
        
        return html`
        ${dashboard ? html`
            <div class="header">${dashboard.title}</div>
            <!-- todo: filters -->
            <div class="layout">                
                <rv-tile-layout colCount="60" rowCount="60">
                    ${dashboard.visualizations?.map(viz => html`
                        <rv-tile .colSpan=${viz.columnSpan} .rowSpan=${viz.rowSpan}>
                            <rv-chart-tile .dashboard=${dashboard} .visualization=${viz}></rv-chart-tile>
                        </rv-tile>
                    `)}
                </rv-tile-layout> 
            </div>               
        ` : html`
            <div>Loading...</div>
            `}
        `;
    }

}