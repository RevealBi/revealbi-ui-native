import { JsonConvert, RdashDocument } from "@revealbi/dom";
import { RevealSdkSettings } from "../RevealSdkSettings";

export class DataService {
    static async fetchVisualizationData(dashboard: RdashDocument, visualization: any) {
        const dataEndpoint = `${RevealSdkSettings.serverUrl}dashboard/editor/widget/data`;
        const viz = JsonConvert.serialize(visualization);
        let dataSources: string[] = [];
        dashboard?.dataSources.forEach((dataSource) => {
            const ds = JsonConvert.serialize(dataSource);
            dataSources.push(JSON.parse(ds));
        });

        try {
            const response = await fetch(dataEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dashboardId: dashboard.title,
                    dataSources: dataSources,
                    globalFilters: undefined, //todo: implement global filters
                    globalDateFilter: undefined, //todo: implement global date filter
                    maxCells: 100000,
                    refresh: false,
                    selectedWidget: JSON.parse(viz),
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