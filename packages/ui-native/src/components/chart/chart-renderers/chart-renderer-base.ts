import { IgcItemLegendComponent, IgcItemLegendModule, LegendOrientation } from "igniteui-webcomponents-charts";
import { IChartRenderer } from "../chart-render-registry";
import { ModuleManager } from "igniteui-webcomponents-core";

ModuleManager.register(IgcItemLegendModule);

export abstract class ChartRendererBase implements IChartRenderer {
    legend?: IgcItemLegendComponent;

    //todo: create a service that handles the data transformation - this is probably wrong anyways
    abstract transformData(table: any): any;

    render(visualization: any, container: HTMLElement, data: any) {
        const table = data.Table;
        if (table.RowCount > 0) {
            this.legend = this.createLegend();
            container.appendChild(this.legend);
            const chart = this.createChart(visualization, this.transformData(table));
            if ('legend' in chart) {                
                chart.legend = this.legend;
                chart.style.height = "calc(100% - 30px)";
            }
            this.setAdditionalChartProperties(chart, visualization);
            
            container.appendChild(chart);
        } else {
            container.innerHTML = "<div>No data available</div>";
        }
    }

    private createLegend(): IgcItemLegendComponent {
        const legend = document.createElement("igc-item-legend") as IgcItemLegendComponent;
        legend.id = "legend";
        legend.orientation = LegendOrientation.Horizontal;
        legend.style.height = "30px";
        return legend;
    }

    protected abstract createChart(visualization: any, data: any): any;

    protected setAdditionalChartProperties(chart: any, visualization: any): void { };
}