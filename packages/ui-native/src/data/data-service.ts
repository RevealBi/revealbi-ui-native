import { DashboardDataFilter, DashboardDateFilter, FilterItem, JsonConvert, RdashDocument } from "@revealbi/dom";
import { RevealSdkSettings } from "../RevealSdkSettings";

export class DataService {
    static async fetchVisualizationData(dashboard: RdashDocument, visualization: any, filter: any) {
        const dataEndpoint = `${RevealSdkSettings.serverUrl}dashboard/editor/widget/data`;

        //we don't want to parse the entire dashboard, so let's just parse what we care about.
        const temp = new RdashDocument();
        temp.dataSources = dashboard.dataSources;
        temp.filters = dashboard.filters;
        temp.visualizations = [visualization];

        const json = JsonConvert.serialize(temp);
        const jsonObject = JSON.parse(json); 
        const dataSources = jsonObject.DataSources;
        const globalDateFilter = jsonObject.GlobalFilters.find((f: any) => f.Id === "_date");
        const selectedWidget = jsonObject.Widgets[0];

        const globalFilters: any = {};
        if (filter && filter.selectedValue !== "All") {
            const modifiedFilter = temp.filters.find((f: any) => f.id === filter.filter.id) as DashboardDataFilter;
            const fieldName = modifiedFilter.selectedFieldName ?? "";

            const filterItem = new FilterItem();
            filterItem.fieldValues = { [fieldName]:  filter.selectedValue };
            const convertedFilterItem = JSON.parse(JsonConvert.serialize(filterItem));

            globalFilters[filter.filter.id] = [ convertedFilterItem ]
        } else {
            dashboard.filters.forEach((f: any) => {
                if (f.id !== "_date"){
                    globalFilters[f.id] = [];
                }
            });
        }

        try {
            const response = await fetch(dataEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dashboardId: dashboard.title,
                    dataSources: dataSources,
                    globalFilters: globalFilters,
                    globalDateFilter: globalDateFilter,
                    maxCells: 100000,
                    refresh: false,
                    selectedWidget: selectedWidget,
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${dataEndpoint}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    static async fetchFilterData(dashboard: RdashDocument, filter: DashboardDateFilter | DashboardDataFilter) {
        const dataEndpoint = `${RevealSdkSettings.serverUrl}dashboard/editor/filters/global`;

        //we don't want to parse the entire dashboard, so let's just parse what we care about.
        const temp = new RdashDocument();
        temp.dataSources = dashboard.dataSources;
        temp.filters = dashboard.filters;
        
        const json = JsonConvert.serialize(temp);
        const jsonObject = JSON.parse(json); 
        const dataSources = jsonObject.DataSources;
        const globalFilters = jsonObject.GlobalFilters;
        const globalFilter = jsonObject.GlobalFilters.find((f: any) => f.Id === filter.id);     
        
        const requiredFields = [];
        const dataFilter = filter as DashboardDataFilter;
        if (dataFilter) {
            requiredFields.push(dataFilter.selectedFieldName);
        }        

        try {
            const response = await fetch(dataEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    CacheSettings: cacheSettings, //todo: don't know what this is or how to get it
                    Context: context, //todo: don't know what this is or how to get it
                    GlobalFilter: globalFilter, //this is the filter being passed in
                    dataSources: dataSources,
                    gloablFilters: globalFilters, //this is all filters
                    requiredFields: requiredFields, //todo: don't know what this is or how to get it
                    returnSelectedValuesOnly: false, //does this ever chn=ange?
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${dataEndpoint}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}

interface DataPoint {
    category: string;
    summary: string;
    value: number;
}

//maybe this shoud be a factory that can decide what to do based on the type of chart passed in
export class DataTransformationService {
    static transformPieChartData(data: any): DataPoint[] {
        const dataPoints: DataPoint[] = [];
        const labels = data.DataColumns[0].Labels;
        const values = data.DataColumns[1].Values;

        for (let i = 0; i < labels.length - 1; i++) { // Ignoring "Grand Total"
            dataPoints.push({
                category: labels[i],
                summary: data.DataColumns[1].Cells[i].FormattedValue,
                value: values[i]
            });
        }

        return dataPoints;
    }

    //todo: revisit and make sire this works like it's supposed to
    //this should probably return an object the defines the structure of the data including which xAxis and yAxis to create, along with what series, and the data
    static transformData_TEST(data: any): any {
        let ret: any[] = [];
        if (data.DataColumns) {
            for (var i = 0; i < data.DataColumns.length; i++) {
                let currColumn = data.DataColumns[i];
                let columnType = currColumn.Type;
                switch (columnType) {
                    case "Date":
                        this.processDateColumn(ret, currColumn);
                        break;
                    case "Number":
                        this.processNumberColumn(ret, currColumn);
                        break;
                    case "String":
                        this.processStringColumn(ret, currColumn);
                        break;
                }
            }
        }

        return ret;
    }
    static processDateColumn(arr: any[], currColumn: any) {
        let labels = currColumn.Labels;
        for (var i = 0; i < labels?.length - 1; i++) {
            let currLabel = labels[i];
            if (currLabel instanceof Object && currLabel._type == "date") {
                let dateVal = new Date(currLabel.value);
                if (!arr[i]) {
                    arr[i] = {};
                }
                arr[i][currColumn.Name] = dateVal;
            }
        }
    }
    static processNumberColumn(arr: any[], currColumn: any) {
        let values = currColumn.Values;
        for (var i = 0; i < values?.length - 1; i++) {
            let currValue = values[i];
            if (!arr[i]) {
                arr[i] = {};
            }
            arr[i][currColumn.Name] = currValue;
        }
    }
    static processStringColumn(arr: any[], currColumn: any) {
        let values = currColumn.Values;
        for (var i = 0; i < values?.length - 1; i++) {
            let currValue = values[i];
            if (!arr[i]) {
                arr[i] = {};
            }
            arr[i][currColumn.Name] = currValue;
        }
    }
}

export class DashboardService {
    static async getById(id: string): Promise<RdashDocument> {
        try {
            const response = await fetch(`${RevealSdkSettings.serverUrl}DashboardFile/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch dashboard ${id}`);
            }
            const result = await response.json();
            return RdashDocument.loadFromJson(result["model"]);

        } catch (error: any) {
            console.error("Error fetching dashboard:", error);
            throw new Error(`Error fetching dashboard ${id}: ${error.message}`);
        }
    }
}



//todo: need to build up the filter data structure like this
//no filer applied looks like "51c8175b-2982-4d62-0022-19779e54cb0c": []
const test = {
    "51c8175b-2982-4d62-0022-19779e54cb0c": [
        {
            "FieldValues": {
                "CampaignID": "Amethyst"
            },
            "ExpansionPath": []
        }
    ]
}

//todo: where do I get this damn things
const cacheSettings = {
    "SkipCache": false,
    "SkipDataCache": false,
    "SkipDatasetCache": false,
    "SkipResourceCache": false,
    "NotOlderThan": {
        "_type": "date",
        "value": "2024-08-05T03:12:30.000Z"
    },
    "Refresh": false
}

//todo: where do I get this?
const context = {
    "_type": "GlobalFilterContextType",
    "UserTimeZone": "America/Denver",
    "GlobalFiltersContext": {},
    "GlobalVariablesContext": {},
    "DateGlobalFilter": {
        "_type": "DateGlobalFilterType",
        "Id": "_date",
        "Title": "Date Filter",
        "RuleType": "TrailingTwelveMonths",
        "IncludeToday": true
    }
}

