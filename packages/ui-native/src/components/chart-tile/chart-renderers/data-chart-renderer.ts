import { ChartType, IVisualization } from "@revealbi/dom";
import { ChartRendererBase } from "./chart-renderer-base";
import { DataTransformationService } from "packages/ui-native/src/services/data-service";
import { AutoMarginsAndAngleUpdateMode, IgcCalloutLayerModule, IgcCategoryXAxisComponent, IgcDataChartAnnotationModule, IgcDataChartCategoryCoreModule, IgcDataChartCategoryModule, IgcDataChartComponent, IgcDataChartCoreModule, IgcDataChartExtendedAxesModule, IgcDataChartInteractivityModule, IgcDataChartToolbarModule, IgcDataToolTipLayerComponent, IgcHorizontalAnchoredCategorySeriesComponent, IgcLegendComponent, IgcLegendModule, IgcNumberAbbreviatorModule, IgcNumericYAxisComponent, IgcOrdinalTimeXAxisComponent, LegendOrientation, SeriesHighlightedValuesDisplayMode, SeriesHighlightingBehavior, SeriesHighlightingMode } from "igniteui-webcomponents-charts";
import { ModuleManager } from "igniteui-webcomponents-core";
import { IgcToolbarModule } from "igniteui-webcomponents-layouts";

ModuleManager.register(
    IgcDataChartCoreModule,
    IgcDataChartCategoryCoreModule,
    IgcDataChartCategoryModule,
    IgcDataChartInteractivityModule,
    IgcDataChartAnnotationModule,
    IgcCalloutLayerModule,
    IgcNumberAbbreviatorModule,
    IgcDataChartExtendedAxesModule,
    IgcLegendModule,
    IgcDataChartToolbarModule,
    IgcToolbarModule
);

export class DataChartRenderer extends ChartRendererBase {

    protected override transformData(data: any) {
        return data;
    }

    protected override createLegend() {
        const legend = document.createElement("igc-legend") as IgcLegendComponent;
        legend.id = "legend";
        legend.style.fontSize = "12px";
        legend.orientation = LegendOrientation.Horizontal;
        return legend;
    }

    override filterUpdated(data: any, updateArgs: any): void {
        const processedData = DataTransformationService.transformData_TEST(data.Table);
        const chart = this.chart as IgcDataChartComponent;
        if (chart) {
            for (let i = 0; i < this.chart.series.count; i++) {
                let currSeries = this.chart.series.item(i);
                if (updateArgs.removeFilter) {
                    currSeries.shouldRemoveHighlightedDataOnLayerHidden = true;
                    currSeries.highlightedValuesDisplayMode = SeriesHighlightedValuesDisplayMode.Hidden;
                } else {
                    currSeries.shouldRemoveHighlightedDataOnLayerHidden = false;
                    currSeries.highlightedDataSource = processedData;
                    currSeries.highlightedValuesDisplayMode = SeriesHighlightedValuesDisplayMode.Overlay;
                }
            }
        }
    }

    protected override createChart(visualization: IVisualization, data: any): HTMLElement | null {
        const processedData = DataTransformationService.transformData_TEST(data);
        if (!processedData || processedData.length == 0) {
            return null;
        }

        const chart = document.createElement("igc-data-chart") as IgcDataChartComponent;
        chart.shouldAutoExpandMarginForInitialLabels = true;
        chart.shouldConsiderAutoRotationForInitialLabels = true;
        chart.isHorizontalZoomEnabled = true;
        chart.isVerticalZoomEnabled = true;
        chart.highlightingMode = SeriesHighlightingMode.FadeOthersSpecific;
        chart.highlightingBehavior = SeriesHighlightingBehavior.NearestItemsAndSeries;
        chart.autoMarginAndAngleUpdateMode = AutoMarginsAndAngleUpdateMode.SizeChanging;

        let createdXAxis = false;
        let xAxis = null;
        for (var i = 0; i < data.DataColumns.length; i++) {
            if (!createdXAxis) {
                if (data.DataColumns[i].Type == "Date") {
                    createdXAxis = true;
                    xAxis = this.createXAxis(data.DataColumns[i].Name, true);
                } else if (data.DataColumns[i].Type == "String") {
                    createdXAxis = true;
                    xAxis = this.createXAxis(data.DataColumns[i].Name, false);
                }
            }
        }

        if (xAxis) {
            xAxis.dataSource = processedData;
            chart.axes.add(xAxis);
        }

        const yAxis = this.createYAxis();
        chart.axes.add(yAxis);

        for (var i = 0; i < data.DataColumns.length; i++) {
            if (data.DataColumns[i].Type == "Number") {
                const series = this.createSeries(visualization.chartType, data.DataColumns[i].Name);
                if (xAxis) series.xAxis = xAxis;
                series.yAxis = yAxis;
                series.dataSource = processedData;
                chart.series.add(series);
            }
        }

        const tooltip = this.createTooltip();
        chart.series.add(tooltip);

        return chart;
    }

    public createXAxis(fieldName: string, isDate: boolean) {
        if (isDate) {
            let xAxis = document.createElement("igc-ordinal-time-x-axis") as IgcOrdinalTimeXAxisComponent;
            xAxis.useEnhancedIntervalManagement = true;
            xAxis.dateTimeMemberPath = fieldName;
            return xAxis;
        } else {
            let xAxis = document.createElement("igc-category-x-axis") as IgcCategoryXAxisComponent;
            xAxis.useEnhancedIntervalManagement = true;
            xAxis.enhancedIntervalPreferMoreCategoryLabels = true;
            xAxis.label = fieldName;
            return xAxis;
        }
    }


    public createYAxis() {
        const yAxis = document.createElement("igc-numeric-y-axis") as IgcNumericYAxisComponent;
        yAxis.abbreviateLargeNumbers = true;
        return yAxis;
    }


    public createSeries(type: ChartType, fieldName: string) {
        const series = document.createElement(this.createSeriesName(type)) as IgcHorizontalAnchoredCategorySeriesComponent;
        series.title = fieldName;
        series.valueMemberPath = fieldName;
        series.isTransitionInEnabled = true;
        return series;

    }

    public createTooltip(): IgcDataToolTipLayerComponent {
        return document.createElement("igc-data-tool-tip-layer") as IgcDataToolTipLayerComponent;
    }

    createSeriesName(type: ChartType) {
        switch (type) {
            case ChartType.Area:
                return "igc-area-series";
            case ChartType.Column:
                return "igc-column-series";
            case ChartType.Line:
                return "igc-line-series";
            case ChartType.SplineArea:
                return "igc-spline-area-series";
            case ChartType.StackedColumn:
                return "igc-column-series"; //"todo: igc-stacked-column-series"; - not working
            default:
                throw new Error("Unsupported chart type");
        }
    }
}