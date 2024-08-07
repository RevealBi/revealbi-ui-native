import { html, LitElement, PropertyValueMap, PropertyValues } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ChartType, type IVisualization, RdashDocument } from "@revealbi/dom";
import { ChartRegistry, IChartRenderer } from "./chart-render-registry";
import styles from "./chart-tile.styles";
import { DataService } from "../../data/data-service";
import { ModuleManager } from "igniteui-webcomponents-core";
import { IgcToolActionIconButtonComponent, IgcToolbarComponent, IgcToolbarModule } from "igniteui-webcomponents-layouts";

ModuleManager.register(IgcToolbarModule);

@customElement("rv-chart-tile")
export class RVChartTile extends LitElement {
    static override styles = styles;

    @property({ type: Object }) dashboard!: RdashDocument;
    @property({ type: Object }) visualization!: IVisualization;
    @property({ type: Boolean }) showToolbar: boolean = true;
    @property({ type: Boolean }) showLegend: boolean = true;
    @property({ type: Boolean, reflect: true }) maximized = false;

    private chartRenderer: IChartRenderer | undefined;

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

    protected override firstUpdated(_changedProperties: PropertyValues): void {
        this.configureToolbar(); //todo: is this the right place to call this?
    }

    private configureToolbar() {
        const toolbar = this.toolbar as IgcToolbarComponent;
        if (!toolbar) {
            return;
        }

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
            this.dispatchEvent(new CustomEvent("rv-tile-maximize-changed", {
                detail: { maximized: this.maximized },
                bubbles: true,
                composed: true
            }));
            filterToggle.iconName = this.maximized ? "Minimize" : "Maximize";
        };
        toolbar.actions.add(filterToggle);
    }

    protected override async updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if (changedProperties.has("visualization") && this.visualization) {
            this.initializeRenderer();
            const data = await DataService.fetchVisualizationData(this.dashboard, this.visualization, null);             
            this.renderChart(data);                      
        }        
    }

    private async handleFilterChanged(e: any) {
        //todo: we need to check to see if the viz has a binding to the filter
        const data = await DataService.fetchVisualizationData(this.dashboard as RdashDocument, this.visualization, { filter: e.detail.filter, selectedValue: e.detail.selectedValue });
        this.updateChart(data, e.detail);        
    }

    private initializeRenderer() {
        if (!this.chartRenderer) {
            const chartType: ChartType | string = this.visualization.chartType === ChartType.Custom ? this.visualization.title ?? "" : this.visualization.chartType;
            this.chartRenderer = ChartRegistry.getChartRenderer(chartType);
        }
    }

    private renderChart(data: any) {
        if (this.chartRenderer) {
            this.chartRenderer.render(this.visualization, this, data ? data.value : null);
            this.showToolbar = !!this.toolbar?.children.length;
            this.showLegend = !!this.legend?.children.length;
        } else {
            if (this.chartHost) {
                this.chartHost.innerHTML = `<div>Unsupported chart type: ${this.visualization.chartType}</div>`;
            }
        }
    }

    private updateChart(data: any, updateArgs: any) {
        if (this.chartRenderer) {
            this.chartRenderer.filterUpdated(data ? data.value : null, updateArgs);
            this.showToolbar = !!this.toolbar?.children.length;
            this.showLegend = !!this.legend?.children.length;
        } else {
            if (this.chartHost) {
                this.chartHost.innerHTML = `<div>Unsupported chart type: ${this.visualization.chartType}</div>`;
            }
        }
    }

    override render() {
        return html`
            <div class="header">
                <div class="header-title">${this.visualization.title}</div>
                ${this.showToolbar ? html`<div class="toolbar"><igc-toolbar id="toolbar-${this.visualization.id}"></igc-toolbar></div>` : ''}
            </div>
            ${this.showLegend ? html`<div id="legend-${this.visualization.id}" class="legend"></div>` : ''}
            <div id="chart-host-${this.visualization.id}" class="chart-host"></div>
        `;
    }
}
