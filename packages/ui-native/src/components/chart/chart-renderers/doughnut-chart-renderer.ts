import { PieChartRenderer } from "./pie-chart-renderer";

export class DoughnutChartRenderer extends PieChartRenderer {
    override setAdditionalChartProperties(chart: any, visualization: any): void {
        chart.innerExtent = 0.7;
    }
}