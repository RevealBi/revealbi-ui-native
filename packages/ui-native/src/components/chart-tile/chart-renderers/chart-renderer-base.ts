import { IgcItemLegendComponent, IgcItemLegendModule, LegendOrientation } from "igniteui-webcomponents-charts";
import { IChartRenderer } from "../chart-render-registry";
import { ModuleManager } from "igniteui-webcomponents-core";
import { RVChartTile } from "../chart-tile.component";
import { IVisualization } from "@revealbi/dom";

ModuleManager.register(IgcItemLegendModule);

export abstract class ChartRendererBase implements IChartRenderer {
    protected legend?: IgcItemLegendComponent | null;

    abstract transformData(data: any): any;

    render(visualization: IVisualization, container: RVChartTile, data: any) {
        if (!container.chartHost) return;

        const table = data.Table;
        if (table.RowCount > 0) {
            this.legend = this.createLegend();
            if (this.legend) container.chartHost.appendChild(this.legend);
            const chart = this.createChart(visualization, this.transformData(table)) as any;
            chart.height = "100%";
            chart.width = "100%";
            if ('legend' in chart) {                
                chart.legend = this.legend;
                chart.height = `calc(100% - ${this.legend?.clientHeight}px`;
            }
            this.setAdditionalChartProperties(chart, visualization);
            
            container.chartHost.appendChild(chart);
        } else {
            container.chartHost.innerHTML = "<div>No data available</div>";
        }
    }

    createLegend(): IgcItemLegendComponent | null {
        const legend = document.createElement("igc-item-legend") as IgcItemLegendComponent;
        legend.id = "legend";
        legend.orientation = LegendOrientation.Horizontal;
        return legend;
    }

    protected abstract createChart(visualization: any, data: any): HTMLElement;

    protected setAdditionalChartProperties(chart: any, visualization: any): void { };
}