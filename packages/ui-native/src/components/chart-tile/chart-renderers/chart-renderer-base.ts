import { IgcDataChartComponent, IgcItemLegendComponent, IgcItemLegendModule, IgcLegendComponent, LegendOrientation } from "igniteui-webcomponents-charts";
import { IChartRenderer } from "../chart-render-registry";
import { ModuleManager } from "igniteui-webcomponents-core";
import { RVChartTile } from "../chart-tile.component";
import { IVisualization } from "@revealbi/dom";
import { IgcToolActionIconButtonComponent, IgcToolbarComponent } from "igniteui-webcomponents-layouts";

ModuleManager.register(IgcItemLegendModule);

export abstract class ChartRendererBase implements IChartRenderer {

    chart: any;
    private maximized = false;

    filterUpdated(data: any, updateArgs: any): void {
        if (!data.Table) { return; }
        if (!this.chart) { return; }
        this.chart.dataSource = this.transformData(data.Table);
    }

    protected abstract transformData(data: any): any;

    render(visualization: IVisualization, container: RVChartTile, data: any): void {
        if (!data.Table) { return; }
        if (!container.chartHost) return;

        //in the future we do not want to recreate the chart every time, we want to update it.
        if (container.toolbar) container.toolbar.innerHTML = "";
        if (container.legend) container.legend.innerHTML = "";
        container.chartHost.innerHTML = "";

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

            const toolbar = this.createToolbar();
            if (toolbar && container.toolbar) {
                if (this.chart instanceof IgcDataChartComponent) toolbar.target = this.chart;
                container.toolbar.appendChild(toolbar);
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

    protected createToolbar(): IgcToolbarComponent {
        const toolbar = document.createElement("igc-toolbar") as IgcToolbarComponent;

        toolbar.registerIconFromText(
            "Custom",
            "Maximize",
            `<svg fill="#000000" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 362.667 362.667" xml:space="preserve" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="17.408015999999996"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M352,341.333H36.373l323.2-323.093c4.053-4.267,3.947-10.987-0.213-15.04c-4.16-3.947-10.667-3.947-14.827,0 l-323.2,323.093V10.667C21.333,4.8,16.533,0,10.667,0C4.8,0,0,4.8,0,10.667V352c0,5.867,4.8,10.667,10.667,10.667H352 c5.867,0,10.667-4.8,10.667-10.667C362.667,346.133,357.867,341.333,352,341.333z"></path> </g> </g> </g></svg>`
        );
        toolbar.registerIconFromText(
            "Custom",
            "Minimize",
            `<svg fill="#000000" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 362.667 362.667" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M352,341.333H36.373l323.2-323.093c4.053-4.267,3.947-10.987-0.213-15.04c-4.16-3.947-10.667-3.947-14.827,0 l-323.2,323.093V10.667C21.333,4.8,16.533,0,10.667,0C4.8,0,0,4.8,0,10.667V352c0,5.867,4.8,10.667,10.667,10.667H352 c5.867,0,10.667-4.8,10.667-10.667C362.667,346.133,357.867,341.333,352,341.333z"></path> </g> </g> </g></svg>`
        );

        let filterToggle = document.createElement("igc-tool-action-icon-button") as IgcToolActionIconButtonComponent;
        filterToggle.iconCollectionName = "Custom";
        filterToggle.iconName = this.maximized ? "Minimize" : "Maximize";
        filterToggle.performed = (o: any, e: any) => {
            this.maximized = !this.maximized;
            toolbar.dispatchEvent(new CustomEvent("rv-tile-maximize-changed", {
                detail: { maximized: this.maximized },
                bubbles: true,
                composed: true
            }));
            filterToggle.iconName = this.maximized ? "Minimize" : "Maximize";
        };
        toolbar.actions.add(filterToggle);
        return toolbar;
    }

    protected setAdditionalChartProperties(chart: any, visualization: IVisualization): void { };
}