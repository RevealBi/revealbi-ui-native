import { IgcFunnelChartComponent, IgcFunnelChartModule } from "igniteui-webcomponents-charts";
import { ChartRendererBase } from "./chart-renderer-base";
import { ModuleManager } from "igniteui-webcomponents-core";
import { DataTransformationService } from "packages/ui-native/src/data/data-service";
import { IVisualization } from "@revealbi/dom";

ModuleManager.register(IgcFunnelChartModule);

export class FunnelChartRenderer extends ChartRendererBase {

    override createChart(visualization: IVisualization, data: any): HTMLElement {
        const chart = document.createElement("igc-funnel-chart") as IgcFunnelChartComponent;
        chart.id = visualization.chartType + "-" + visualization.title;
        chart.outerLabelMemberPath = "category";
        chart.innerLabelMemberPath = "summary";
        chart.useOuterLabelsForLegend = true;
        chart.valueMemberPath = "value";    
        chart.dataSource = data;
        return chart;
    }

    transformData(data: any): any {    
        return DataTransformationService.transformPieChartData(data);
    }

    protected override setAdditionalChartProperties(chart: any, visualization: any): void { 
        chart.style.height = "calc(100% - 85px)";
        chart.style.marginTop = "35px";
    };
}