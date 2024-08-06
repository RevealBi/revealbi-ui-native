import { IgcItemLegendComponent, IgcItemLegendModule, IgcLegendComponent, LegendOrientation } from "igniteui-webcomponents-charts";
import { IChartRenderer } from "../chart-render-registry";
import { ModuleManager } from "igniteui-webcomponents-core";
import { RVChartTile } from "../chart-tile.component";
import { IVisualization } from "@revealbi/dom";
import { IgcToolbarComponent } from "igniteui-webcomponents-layouts";

ModuleManager.register(IgcItemLegendModule);

export abstract class ChartRendererBase implements IChartRenderer {
    
    protected abstract transformData(data: any): any;

    render(visualization: IVisualization, container: RVChartTile, data: any) {
        if (!data.Table) { return; }
        if (!container.chartHost) return;

        //in the future we do not want to recreate the chart every time, we want to update it.
        if (container.toolbar) container.toolbar.innerHTML = "";
        if (container.legend) container.legend.innerHTML = "";
        container.chartHost.innerHTML = "";

        const table = data.Table;
        if (table.RowCount > 0) {
            const chart = this.createChart(visualization, this.transformData(table)) as any;
            chart.height = "100%";
            chart.width = "100%";

            const legend = this.createLegend();
            if (legend && container.legend) {
                if ('legend' in chart) {                
                    chart.legend = legend;
                }
                container.legend.appendChild(legend);
            }

            const toolbar = this.createToolbar();
            if (toolbar && container.toolbar) {
                toolbar.target = chart;
                container.toolbar.appendChild(toolbar);
            }

            this.setAdditionalChartProperties(chart, visualization);
            
            container.chartHost.appendChild(chart);
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

    protected abstract createChart(visualization: IVisualization, data: any): HTMLElement;

    protected createToolbar(): IgcToolbarComponent | undefined | null {
        return undefined;
    }

    protected setAdditionalChartProperties(chart: any, visualization: IVisualization): void { };
}