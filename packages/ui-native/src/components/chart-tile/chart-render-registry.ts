import { ChartType, IVisualization } from "@revealbi/dom";
import { PieChartRenderer } from "./chart-renderers/pie-chart-renderer";
import { DoughnutChartRenderer } from "./chart-renderers/doughnut-chart-renderer";
import { DataChartRenderer } from "./chart-renderers/data-chart-renderer";
import { FunnelChartRenderer } from "./chart-renderers/funnel-chart-renderer";
import { RVChartTile } from "./chart-tile.component";

export interface IChartRenderer {
    render(visualization: IVisualization, container: RVChartTile, data: any): void;
}

export class ChartRegistry {
    static registry = new Map<ChartType | string, { new(): IChartRenderer }>();

    static {
        ChartRegistry.registry.set(ChartType.Column, DataChartRenderer);
        ChartRegistry.registry.set(ChartType.Doughnut, DoughnutChartRenderer);
        ChartRegistry.registry.set(ChartType.Funnel, FunnelChartRenderer);
        ChartRegistry.registry.set(ChartType.Line, DataChartRenderer);
        ChartRegistry.registry.set(ChartType.Pie, PieChartRenderer);
        ChartRegistry.registry.set(ChartType.SplineArea, DataChartRenderer);
        ChartRegistry.registry.set(ChartType.StackedColumn, DataChartRenderer);
    }

    static getChartRenderer(chartType: ChartType | string): IChartRenderer | undefined {
        const RendererClass = ChartRegistry.registry.get(chartType);
        if (RendererClass) {
            return new RendererClass();
        }
        return undefined;
    }

    static registerChartRenderer(chartType: ChartType | string, renderer: { new(): IChartRenderer }) {
        ChartRegistry.registry.set(chartType, renderer);
    }
}