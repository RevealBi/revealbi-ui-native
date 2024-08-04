import { html, LitElement, PropertyValueMap, PropertyValues } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ChartType, type IVisualization, RdashDocument } from "@revealbi/dom";
import { ChartRegistry, IChartRenderer } from "./chart-render-registry";
import styles from "./chart-tile.styles";
import { DataService } from "../../data/data-service";
import { ModuleManager } from "igniteui-webcomponents-core";
import { IgcToolbarComponent, IgcToolbarModule } from "igniteui-webcomponents-layouts";

ModuleManager.register(IgcToolbarModule);

@customElement("rv-chart-tile")
export class RVChartTile extends LitElement {
    static override styles = styles;

    @property({ type: Object }) dashboard!: RdashDocument;
    @property({ type: Object }) visualization!: IVisualization;

    private toolbar?: IgcToolbarComponent;
    private container? : HTMLElement;

    protected override firstUpdated(_changedProperties: PropertyValues): void {
        this.toolbar = this.shadowRoot?.getElementById(`toolbar-${this.visualization.id}`) as IgcToolbarComponent;
        this.container = this.shadowRoot?.getElementById(`chart-tile-container-${this.visualization.id}`) as HTMLElement;
    }

    protected override async updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if (changedProperties.has("visualization") && this.visualization) {
            const data = await DataService.fetchVisualizationData(this.dashboard as RdashDocument, this.visualization);
            this.renderChart(data);
        }
    }

    private renderChart(data: any) {
        if (!this.container) return;

        //if it's a custom chart type, let's use the title as the key
        const chartType: ChartType | string = this.visualization.chartType === ChartType.Custom ? this.visualization.title ?? "" : this.visualization.chartType;

        // Get the renderer for the chart type
        const chartRenderer: IChartRenderer | undefined = ChartRegistry.getChartRenderer(chartType);
        if (chartRenderer) {
            chartRenderer.render(this.visualization, this.container, data ? data.value : null);
            
            const chart = this.shadowRoot?.querySelector("igc-data-chart");
            if (chart) {
                if (this.toolbar) this.toolbar.target = chart;
            }

        } else {
            const host = this.shadowRoot?.getElementById(`chart-host-${this.visualization.id}`);
            if (host) host.innerHTML = `<div>Unsupported chart type: ${this.visualization.chartType}</div>`;
        }
    }

    override render() {
        return html`
        <div id="chart-tile-container-${this.visualization.id}" class="chart-tile-container">
            <div class="header">
                <div class="header-title">${this.visualization.title}</div>
                <div class="toolbar">
                <igc-toolbar id="toolbar-${this.visualization.id}" ></igc-toolbar>
    </div>
            </div>
            <div id="chart-host-${this.visualization.id}" class="chart-host"></div>
        </div>
        `;
    }
}
