import { IVisualization } from "@revealbi/dom";
import { PieChartRenderer } from "./pie-chart-renderer";

export class DoughnutChartRenderer extends PieChartRenderer {
    override setAdditionalChartProperties(chart: any, visualization: IVisualization): void {
        chart.innerExtent = 0.7;
    }
}