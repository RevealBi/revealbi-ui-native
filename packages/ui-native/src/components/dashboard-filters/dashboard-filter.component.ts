import { DashboardDataFilter, DashboardDateFilter, DashboardFilter, RdashDocument } from "@revealbi/dom";
import { ConsolidatedItemsPosition } from "igniteui-webcomponents-charts";
import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DataService } from "../../data/data-service";
import { ModuleManager } from "igniteui-webcomponents-core";
import { IgcDatePickerModule } from "igniteui-webcomponents-inputs";

ModuleManager.register(IgcDatePickerModule);

//get data from - https://samples.revealbi.io/upmedia/reveal-api/Dashboard/editor/filters/global

@customElement("rv-dashboard-filter")
export class RvDashboardFilter extends LitElement {
    @property({ type: Object }) dashboard: RdashDocument = new RdashDocument();
    @property({ type: Object }) filter: DashboardDateFilter | DashboardDataFilter = new DashboardDataFilter();

    //reveal only allows one of these
    private dateFilter?: DashboardDateFilter;
    private datafilter?: DashboardDataFilter;

    static override styles = css`
        :host {
            display: grid;
            grid-template-columns: auto;
            grid-template-rows: auto auto;
            margin: 5px;
        }
    `;

    constructor() {
        super();     
    }

    protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if (changedProperties.has("filter") && this.filter) {
            if (this.filter.id === "_date") {
                this.dateFilter = this.filter as DashboardDateFilter;
                //console.log(this.dateFilter);
            } else {
                this.datafilter = this.filter as DashboardDataFilter;
                //console.log(this.datafilter);
            }

            this.renderFilter();
        }
    }

    cache: any = null;

    renderFilter() {

        const editorHost = this.shadowRoot?.getElementById("editorHost");

        if (this.dateFilter) {
            const editor = document.createElement("igc-date-picker");
            editor.style.width = "125px";
            editorHost?.appendChild(editor);
        } else {
            const editor = document.createElement("select");
            editor.innerHTML = `<option value="All">All</option>`;
            editor.style.width = "125px";
            editorHost?.appendChild(editor);

            const loadDataIntoSelect = async () => {
                if (!this.cache) {
                    const data = await DataService.fetchFilterData(this.dashboard, this.datafilter as DashboardDataFilter);
                    if (data && data.filter && data.filter.Values) {
                        this.cache = data.filter.Values;
                    }
                }

                // Clear existing options except the first one
                while (editor.options.length > 1) {
                    editor.remove(1);
                }

                //Populate the select element with new options
                this.cache.forEach((item: any) => {
                    const option = document.createElement("option");
                    option.value = item.Label;
                    option.text = item.Label;
                    editor.appendChild(option);
                });
            };

            editor.addEventListener("focus", loadDataIntoSelect);

            // Broadcast custom event on selection change
            editor.addEventListener("change", (args: any) => {
                const event = new CustomEvent("rv-dashboard-filter-changed", {
                    detail: {
                        filter: this.datafilter,
                        selectedValue: editor.value
                    }
                });
                document.dispatchEvent(event);
            });
        }
    }

    override render() {
        return html`
            <div>${this.filter?.title}</div>
            <div id="editorHost"></div>
        `
    }
}
