import { IgcItemLegendComponent, IgcItemLegendModule, IgcLegendComponent, LegendOrientation } from "igniteui-webcomponents-charts";
import { IChartRenderer } from "../chart-render-registry";
import { ModuleManager } from "igniteui-webcomponents-core";
import { RVChartTile } from "../chart-tile.component";
import { IVisualization } from "@revealbi/dom";

ModuleManager.register(IgcItemLegendModule);

export abstract class ChartRendererBase implements IChartRenderer {
    
    abstract transformData(data: any): any;

    render(visualization: IVisualization, container: RVChartTile, data: any) {
        if (!container.chartHost) return;

        const table = data.Table;
        if (table.RowCount > 0) {
            const legend = this.createLegend();
            const chart = this.createChart(visualization, this.transformData(table)) as any;
            chart.height = "100%";
            chart.width = "100%";
            if ('legend' in chart) {                
                chart.legend = legend;
            }
            this.setAdditionalChartProperties(chart, visualization);
            
            if (legend) container.legend.appendChild(legend);
            container.chartHost.appendChild(chart);
        } else {
            container.chartHost.innerHTML = "<div>No data available</div>";
        }
    }

    createLegend(): IgcItemLegendComponent | IgcLegendComponent | null {
        const legend = document.createElement("igc-item-legend") as IgcItemLegendComponent;
        legend.id = "legend";
        legend.style.fontSize = "12px";
        legend.orientation = LegendOrientation.Horizontal;        
        return legend;
    }

    protected abstract createChart(visualization: IVisualization, data: any): HTMLElement;

    protected setAdditionalChartProperties(chart: any, visualization: IVisualization): void { };
}