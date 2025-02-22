import { IgcDataChartComponent, IgcItemLegendComponent, IgcItemLegendModule, IgcLegendComponent, LegendOrientation } from "igniteui-webcomponents-charts";
import { IChartRenderer } from "../chart-render-registry";
import { ModuleManager } from "igniteui-webcomponents-core";
import { RVChartTile } from "../chart-tile.component";
import { IVisualization } from "@revealbi/dom";

ModuleManager.register(IgcItemLegendModule);

export abstract class ChartRendererBase implements IChartRenderer {

    chart: any;

    dispose(): void {
        if (this.chart) this.chart = null;
    }

    filterUpdated(data: any, updateArgs: any): void {
        if (!data) { return; }
        if (!data.Table) { return; }
        if (!this.chart) { return; }
        this.chart.dataSource = this.transformData(data.Table);
    }

    protected abstract transformData(data: any): any;

    render(visualization: IVisualization, container: RVChartTile, data: any): void {
        if (!data) { return; }
        if (!data.Table) { return; }
        if (!container.chartHost) return;

        const table = data.Table;
        if (table.RowCount > 0) {
            const data = this.transformData(table);
            if (!data || data.length === 0) {
                container.chartHost.innerHTML = "<div>No data available</div>";
                return;
            }

            this.chart = this.createChart(visualization, data) as any;
            if (this.chart === null) {
                container.chartHost.innerHTML = "<div>No data available</div>";
                return;
            }

            this.chart.height = "100%";
            this.chart.width = "100%";

            const legend = this.createLegend();
            if (legend && container.legend) {
                if ('legend' in this.chart) {
                    this.chart.legend = legend;
                }
                container.legend.appendChild(legend);
            }

            if (container.toolbar) {
                if (this.chart instanceof IgcDataChartComponent) container.toolbar.target = this.chart;
            }

            this.setAdditionalChartProperties(this.chart, visualization);

            container.chartHost.appendChild(this.chart);
        } else {
            container.chartHost.innerHTML = "<div>No data available</div>";
        }
    }

    protected createLegend(): IgcItemLegendComponent | IgcLegendComponent | null {
        const legend = document.createElement("igc-item-legend") as IgcItemLegendComponent;
        legend.id = "legend";
        legend.style.fontSize = "12px";
        legend.orientation = LegendOrientation.Horizontal;
        return legend;
    }

    protected abstract createChart(visualization: IVisualization, data: any): HTMLElement | null;


    protected setAdditionalChartProperties(chart: any, visualization: IVisualization): void { };
}