import { ChartType } from "@revealbi/dom";
import { PieChartRenderer } from "./chart-renderers/pie-chart-renderer";
import { DoughnutChartRenderer } from "./chart-renderers/doughnut-chart-renderer";

export interface IChartRenderer {
    render(visualization: any, container: Element, data: any): void;
}

export class ChartRegistry {
    static registry = new Map<ChartType | string, { new(): IChartRenderer }>();

    static {
        ChartRegistry.registry.set(ChartType.Doughnut, DoughnutChartRenderer);
        ChartRegistry.registry.set(ChartType.Pie, PieChartRenderer);
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