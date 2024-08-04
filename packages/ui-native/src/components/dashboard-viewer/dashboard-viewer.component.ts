import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import styles from "./dashboard-viewer.styles";
import { IVisualization, RdashDocument } from "@revealbi/dom";
import { RevealSdkSettings } from "../../RevealSdkSettings";

@customElement("rv-dashboard-viewer")
export class RvDashboardViewer extends LitElement {
    static override styles = styles;

    @property({ type: String }) dashboard: string | RdashDocument | undefined;

    private async fetchDashboard(dashboard: string): Promise<RdashDocument> {
        const response = await fetch(`${RevealSdkSettings.serverUrl}DashboardFile/${dashboard}`);
        if (response.ok) {
            const result = await response.json();
            return RdashDocument.loadFromJson(result["model"]);
        }
        throw new Error(`Failed to fetch dashboard ${dashboard}`);
    }

    private async updateDashboard(dashboard: string | RdashDocument | undefined): Promise<void> {
        if (dashboard) {
            if (typeof dashboard === "string") {
                this.dashboard = await this.fetchDashboard(dashboard);
            }
        }
    }

    protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        const dashboardChanged = changedProperties.has("dashboard") && this.dashboard !== undefined;

        if (dashboardChanged) {
            this.updateDashboard(this.dashboard);
        }
    }

    renderVisualization(dashboard: RdashDocument, visualization: IVisualization) {
        return html`
            <div class="widget">
                <div class="tile-header">${visualization.title}</div>
                <div style="height: calc(100% - 40px)">
                    <rv-chart .dashboard=${dashboard} .visualization=${visualization}></rv-chart>
                </div>
            </div>`;
    }

    protected override render() {
        const dashboard = this.dashboard as RdashDocument;
        
        return html`
        ${dashboard ? html`
            <div class="dashboard-container">
                <div class="header">${dashboard.title}</div>

                <div class="layout">                
                    <rv-tile-layout colCount="60" rowCount="60">
                        ${dashboard.visualizations?.map(viz => html`
                            <rv-tile
                                .colSpan=${viz.columnSpan}
                                .rowSpan=${viz.rowSpan}          
                            >${this.renderVisualization(dashboard, viz)}</rv-tile>
                        `)}
                    </rv-tile-layout> 
                </div>               
            </div>
        ` : html`
            <div>Loading...</div>
            `}
        `;
    }

}