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
    @property({ type: Boolean }) showToolbar: boolean = true;
    @property({ type: Boolean }) showLegend: boolean = true;

    get toolbar(): IgcToolbarComponent | null {
        return this.shadowRoot?.getElementById(`toolbar-${this.visualization.id}`) as IgcToolbarComponent
    }
    get legend(): HTMLElement {
        return this.shadowRoot?.getElementById(`legend-${this.visualization.id}`) as HTMLElement;
    }
    get chartHost(): HTMLElement {
        return this.shadowRoot?.getElementById(`chart-host-${this.visualization.id}`) as HTMLElement;
    }    

    protected override async updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if (changedProperties.has("visualization") && this.visualization) {
            const data = await DataService.fetchVisualizationData(this.dashboard as RdashDocument, this.visualization);
            this.renderChart(data);
        }
    }

    private renderChart(data: any) {
        //if it's a custom chart type, let's use the title as the key
        const chartType: ChartType | string = this.visualization.chartType === ChartType.Custom ? this.visualization.title ?? "" : this.visualization.chartType;

        // Reset visibility properties
        this.showToolbar = false;
        this.showLegend = false;

        const chartRenderer: IChartRenderer | undefined = ChartRegistry.getChartRenderer(chartType);
        if (chartRenderer) {
            chartRenderer.render(this.visualization, this, data ? data.value : null);
            // Update visibility based on renderer output
            this.showToolbar = !!this.toolbar?.children.length;
            this.showLegend = !!this.legend?.children.length;
        } else {
            if (this.chartHost) this.chartHost.innerHTML = `<div>Unsupported chart type: ${this.visualization.chartType}</div>`;
        }
    }

    override render() {
        return html`
            <div class="header">
                <div class="header-title">${this.visualization.title}</div>
                ${this.showToolbar ? html`<div id="toolbar-${this.visualization.id}" class="toolbar"></div>` : ''}
            </div>
            ${this.showLegend ? html`<div id="legend-${this.visualization.id}" class="legend"></div>` : ''}
            <div id="chart-host-${this.visualization.id}" class="chart-host"></div>
        `;
    }
}
