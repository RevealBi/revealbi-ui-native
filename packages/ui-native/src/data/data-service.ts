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

export class DashboardService {
    static async getById(id: string) {
        const response = await fetch(`${RevealSdkSettings.serverUrl}DashboardFile/${id}`);
        if (response.ok) {
            const result = await response.json();
            return RdashDocument.loadFromJson(result["model"]);
        }
        throw new Error(`Failed to fetch dashboard ${id}`);
    }
}