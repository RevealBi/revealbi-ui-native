import { IgcPieChartComponent, IgcPieChartModule } from "igniteui-webcomponents-charts";
import { ChartRendererBase } from "./chart-renderer-base";
import { ModuleManager } from "igniteui-webcomponents-core";
import { DataTransformationService } from "packages/ui-native/src/data/data-service";

ModuleManager.register(IgcPieChartModule);

export class PieChartRenderer extends ChartRendererBase {

    override createChart(visualization: any, data: any): HTMLElement {
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

    transformData(data: any): any {    
        return DataTransformationService.transformPieChartData(data);
    }
}