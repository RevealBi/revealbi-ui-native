import { ChartType, IVisualization } from "@revealbi/dom";
import { ChartRegistry, IChartRenderer, RVChartTile } from "@revealbi/ui-native";
declare let Highcharts: any;

class KpiChartRenderer implements IChartRenderer {
    filterUpdated(data: any): void {
        console.log("update not implemented");
    }

    render(visualization: IVisualization, container: RVChartTile, data: any) {
        const trackColors = Highcharts.getOptions().colors.map((color: any) =>
            new Highcharts.Color(color).setOpacity(0.3).get()
        );

        Highcharts.chart(container.chartHost, {

            chart: {
                type: 'solidgauge',                
            },

            title: {
                text: '',
            },

            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },

            tooltip: {
                borderWidth: 0,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '16px'
                },
                valueSuffix: '%',
                pointFormat: '{series.name}<br>' +
                    '<span style="font-size: 2em; color: {point.color}; ' +
                    'font-weight: bold">{point.y}</span>',
            },

            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Conversion
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: trackColors[0],
                    borderWidth: 0
                }, { // Track for Engagement
                    outerRadius: '87%',
                    innerRadius: '63%',
                    backgroundColor: trackColors[1],
                    borderWidth: 0
                }, { // Track for Feedback
                    outerRadius: '62%',
                    innerRadius: '38%',
                    backgroundColor: trackColors[2],
                    borderWidth: 0
                }]
            },

            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false,
                    rounded: true
                }
            },

            series: [{
                name: 'Conversion',
                data: [{
                    color: Highcharts.getOptions().colors[0],
                    radius: '112%',
                    innerRadius: '88%',
                    y: 80
                }],
                custom: {
                    icon: 'filter',
                    iconColor: '#303030'
                }
            }, {
                name: 'Engagement',
                data: [{
                    color: Highcharts.getOptions().colors[1],
                    radius: '87%',
                    innerRadius: '63%',
                    y: 65
                }],
                custom: {
                    icon: 'comments-o',
                    iconColor: '#ffffff'
                }
            }, {
                name: 'Feedback',
                data: [{
                    color: Highcharts.getOptions().colors[2],
                    radius: '62%',
                    innerRadius: '38%',
                    y: 50
                }],
                custom: {
                    icon: 'commenting-o',
                    iconColor: '#303030'
                }
            }]
        });
    }
}

export function registerChartRenderers() {
    ChartRegistry.registerChartRenderer(ChartType.KpiTime, KpiChartRenderer);
    ChartRegistry.registerChartRenderer(ChartType.KpiTarget, KpiChartRenderer);
}