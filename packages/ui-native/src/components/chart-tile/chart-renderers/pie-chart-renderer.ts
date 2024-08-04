import { IgcPieChartComponent, IgcPieChartModule } from "igniteui-webcomponents-charts";
import { ChartRendererBase } from "./chart-renderer-base";
import { ModuleManager } from "igniteui-webcomponents-core";

ModuleManager.register(IgcPieChartModule);

interface DataPoint {
    category: string;
    summary: string;
    value: number;
}

export class PieChartRenderer extends ChartRendererBase {

    override createChart(visualization: any, data: any): any {
        const chart = document.createElement("igc-pie-chart") as IgcPieChartComponent;
        chart.id = visualization.chartType + "-" + visualization.title;
        chart.legendLabelMemberPath = "category";
        chart.labelMemberPath = "summary";
        chart.labelsPosition = 3;
        chart.valueMemberPath = "value";
        chart.radiusFactor = 0.7;
        chart.startAngle = visualization.settings.startPosition ?? 0;       
        chart.dataSource = data;
        return chart;
    }

    //todo: create a service that handles the data transformation - this is probably wrong anyways
    transformData(table: any): any {
        const dataPoints: DataPoint[] = [];
        const labels = table.DataColumns[0].Labels;
        const values = table.DataColumns[1].Values;
    
        for (let i = 0; i < labels.length - 1; i++) { // Ignoring "Grand Total"
            dataPoints.push({
                category: labels[i],
                summary: table.DataColumns[1].Cells[i].FormattedValue,
                value: values[i]
            });
        }
    
        return dataPoints;
    }
}