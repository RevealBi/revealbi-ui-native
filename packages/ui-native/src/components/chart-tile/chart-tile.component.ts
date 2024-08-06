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
    @property({ type: Boolean, reflect: true }) maximized = false;

    get toolbar(): IgcToolbarComponent | null {
        return this.shadowRoot?.getElementById(`toolbar-${this.visualization.id}`) as IgcToolbarComponent
    }
    get legend(): HTMLElement {
        return this.shadowRoot?.getElementById(`legend-${this.visualization.id}`) as HTMLElement;
    }
    get chartHost(): HTMLElement {
        return this.shadowRoot?.getElementById(`chart-host-${this.visualization.id}`) as HTMLElement;
    }  
    
    constructor() {
        super();
        this.handleFilterChanged = this.handleFilterChanged.bind(this);
    }

    override connectedCallback() {
        super.connectedCallback();
        document.addEventListener("rv-dashboard-filter-changed", this.handleFilterChanged);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("rv-dashboard-filter-changed", this.handleFilterChanged);
    }

    protected override async updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if (changedProperties.has("visualization") && this.visualization) {
            const data = await DataService.fetchVisualizationData(this.dashboard, this.visualization, null);
            this.renderChart(data);
        }
    }

    private async handleFilterChanged(e: any) {
        const data = await DataService.fetchVisualizationData(this.dashboard as RdashDocument, this.visualization, { filter: e.detail.filter, selectedValue: e.detail.selectedValue });
        this.renderChart(data);        
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

    private requestMaximize() {
        this.maximized = !this.maximized;
        this.dispatchEvent(new CustomEvent('rv-tile-maximize-changed', {
            detail: { maximized: this.maximized },
            bubbles: true,
            composed: true
        }));
    }

    override render() {
        return html`
            <div class="header">
                <div class="header-title">${this.visualization.title}</div>
                ${this.showToolbar ? html`<div id="toolbar-${this.visualization.id}" class="toolbar"></div>` : ''}
                <button class="maximize-button" @click=${this.requestMaximize}>
                    <span class="maximize-icon" title=${this.maximized ? "minimize" : "maximize"}></span>
                </button>
            </div>
            ${this.showLegend ? html`<div id="legend-${this.visualization.id}" class="legend"></div>` : ''}
            <div id="chart-host-${this.visualization.id}" class="chart-host"></div>
        `;
    }
}
