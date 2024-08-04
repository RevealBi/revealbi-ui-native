import { IgcItemLegendComponent, IgcItemLegendModule, LegendOrientation } from "igniteui-webcomponents-charts";
import { IChartRenderer } from "../chart-render-registry";
import { ModuleManager } from "igniteui-webcomponents-core";

ModuleManager.register(IgcItemLegendModule);

export abstract class ChartRendererBase implements IChartRenderer {
    protected legend?: IgcItemLegendComponent | null;

    abstract transformData(data: any): any;

    render(visualization: any, container: HTMLElement, data: any) {
        const host = container.querySelector(`#chart-host-${visualization.id}`) as HTMLElement;    

        const table = data.Table;
        if (table.RowCount > 0) {
            this.legend = this.createLegend();
            if (this.legend) host.appendChild(this.legend);
            const chart = this.createChart(visualization, this.transformData(table));
            if ('legend' in chart) {                
                chart.legend = this.legend;
                chart.style.height = "calc(100% - 30px)";
            }
            this.setAdditionalChartProperties(chart, visualization);
            
            host.appendChild(chart);
        } else {
            host.innerHTML = "<div>No data available</div>";
        }
    }

    createLegend(): IgcItemLegendComponent | null {
        const legend = document.createElement("igc-item-legend") as IgcItemLegendComponent;
        legend.id = "legend";
        legend.orientation = LegendOrientation.Horizontal;
        legend.style.height = "30px";
        return legend;
    }

    protected abstract createChart(visualization: any, data: any): HTMLElement;

    protected setAdditionalChartProperties(chart: any, visualization: any): void { };
}