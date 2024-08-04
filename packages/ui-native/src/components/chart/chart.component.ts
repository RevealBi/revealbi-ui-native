import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ChartType, type IVisualization, JsonConvert, RdashDocument } from "@revealbi/dom";
import { ChartRegistry, IChartRenderer } from "./chart-render-registry";
import { RevealSdkSettings } from "../../RevealSdkSettings";
import styles from "./chart.styles";

@customElement("rv-chart")
export class RvChart extends LitElement {
    static override styles = styles;

    @property({ type: Object }) dashboard: RdashDocument | undefined;
    @property({ type: Object }) visualization!: IVisualization;
    private _dataEndpoint: string = `${RevealSdkSettings.serverUrl}dashboard/editor/widget/data`;

    private async fetchData() {

        const viz = JsonConvert.serialize(this.visualization);
        let dataSources: string[] = [];
        this.dashboard?.dataSources.forEach((dataSource) => {
            const ds = JsonConvert.serialize(dataSource);
            dataSources.push(JSON.parse(ds));
        });

        try {
            const response = await fetch(this._dataEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dashboardId: this.dashboard?.title,
                    dataSources: dataSources,
                    globalFilters: undefined, //todo: implement global filters
                    globalDateFilter: undefined, //todo: implement global date filter
                    maxCells: 100000,
                    refresh: false,
                    selectedWidget: JSON.parse(viz),
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${this._dataEndpoint}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    protected override async updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if (changedProperties.has("visualization") && this.visualization) {
            const data = await this.fetchData();
            console.log(data.value.Table);
            this.renderChart(data);
        }
    }

    private renderChart(data: any) {
        const container = this.shadowRoot?.querySelector(".chart-container");
        if (!container) return;

        // Clear any existing content
        container.innerHTML = "";

        //if it's a custom chart type, let's use the title as the chart type
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
        <div class="chart-container"></div>
        `;
    }
}
