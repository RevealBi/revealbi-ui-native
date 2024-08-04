import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ChartType, type IVisualization, RdashDocument } from "@revealbi/dom";
import { ChartRegistry, IChartRenderer } from "./chart-render-registry";
import styles from "./chart-tile.styles";
import { DataService } from "../../data/data-service";

@customElement("rv-chart-tile")
export class RVChartTile extends LitElement {
    static override styles = styles;

    @property({ type: Object }) dashboard: RdashDocument | undefined;
    @property({ type: Object }) visualization!: IVisualization;

    protected override async updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if (changedProperties.has("visualization") && this.visualization) {
            const data = await DataService.fetchVisualizationData(this.dashboard as RdashDocument, this.visualization);
            console.log(data.value.Table);
            this.renderChart(data);
        }
    }

    private renderChart(data: any) {
        const container = this.shadowRoot?.querySelector(".chart-host");
        if (!container) return;

        // Clear any existing content
        container.innerHTML = "";

        //if it's a custom chart type, let's use the title as the key
        const chartType: ChartType | string = this.visualization.chartType === ChartType.Custom ? this.visualization.title ?? "" : this.visualization.chartType;

        // Get the renderer for the chart type
        const chartRenderer: IChartRenderer | undefined = ChartRegistry.getChartRenderer(chartType);
        if (chartRenderer) {
            chartRenderer.render(this.visualization, container, data ? data.value : null);
        } else {
            container.innerHTML = `<div>Unsupported chart type: ${this.visualization.chartType}</div>`;
        }
    }

    override render() {
        return html`
        <div class="chart-tile-container">
            <div class="header-title">${this.visualization.title}</div>
            <div class="chart-host"></div>
        </div>
        `;
    }
}
