import { ChartType, IVisualization } from "@revealbi/dom";
import { ChartRegistry, IChartRenderer, RVChartTile } from "@revealbi/ui-native";
declare let Highcharts: any;

class HighChartRenderer implements IChartRenderer {
    protected container: RVChartTile | null = null;
    protected chartInstance: any;
    protected originalHeight: number = 0;
    protected originalWidth: number = 0;

    dispose(): void {
        this.chartInstance = null;
        if (this.container) {
            this.container.removeEventListener('rv-tile-maximized-changed', this.handleResize.bind(this));
            this.container = null;
        }
    }

    filterUpdated(data: any, updateArgs: any): void {
        
    }
    
    render(visualization: IVisualization, container: RVChartTile, data: any): void {
        this.container = container;
        this.container.showLegend = false;

        this.originalHeight = container.chartHost.clientHeight;
        this.originalWidth = container.chartHost.clientWidth;

        this.container.addEventListener('rv-tile-maximized-changed', this.handleResize.bind(this));
    }

    private handleResize(event: any) {
        if (this.chartInstance) {
            if (event.detail.maximized) {
                this.chartInstance.setSize(window.innerWidth, window.innerHeight - 40, false);
            } else {
                this.chartInstance.setSize(this.originalWidth, this.originalHeight, false);
            }
        }
    }

}

class KpiChartRenderer extends HighChartRenderer {

    override render(visualization: IVisualization, container: RVChartTile, data: any) {
        super.render(visualization, container, data);

        const trackColors = Highcharts.getOptions().colors.map((color: any) =>
            new Highcharts.Color(color).setOpacity(0.3).get()
        );

        this.chartInstance = Highcharts.chart(container.chartHost, {

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

class CircularGaugeRenderer extends HighChartRenderer {

    override render(visualization: IVisualization, container: RVChartTile, data: any) {
        super.render(visualization, container, data);

        this.chartInstance = Highcharts.chart(container.chartHost, {
            colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
            chart: {
                type: 'column',
                inverted: true,
                polar: true
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
                outside: true
            },
            pane: {
                size: '85%',
                innerSize: '20%',
                endAngle: 270
            },
            xAxis: {
                tickInterval: 1,
                labels: {
                    align: 'right',
                    useHTML: true,
                    allowOverlap: true,
                    step: 1,
                    y: 3,
                    style: {
                        fontSize: '13px'
                    }
                },
                lineWidth: 0,
                gridLineWidth: 0,
                categories: [
                    'Norway <span class="f16"><span id="flag" class="flag no">' +
                    '</span></span>',
                    'United States <span class="f16"><span id="flag" class="flag us">' +
                    '</span></span>',
                    'Germany <span class="f16"><span id="flag" class="flag de">' +
                    '</span></span>',
                    'Austria <span class="f16"><span id="flag" class="flag at">' +
                    '</span></span>',
                    'Canada <span class="f16"><span id="flag" class="flag ca">' +
                    '</span></span>'
                ]
            },
            yAxis: {
                lineWidth: 0,
                tickInterval: 25,
                reversedStacks: false,
                endOnTick: true,
                showLastLabel: true,
                gridLineWidth: 0
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    borderWidth: 0,
                    pointPadding: 0,
                    groupPadding: 0.15,
                    borderRadius: '50%'
                }
            },
            series: [{
                name: 'Gold medals',
                data: [148, 113, 104, 71, 77]
            }, {
                name: 'Silver medals',
                data: [113, 122, 98, 88, 72]
            }, {
                name: 'Bronze medals',
                data: [124, 95, 65, 91, 76]
            }]
        });
    }
}

export function registerChartRenderers() {
    ChartRegistry.registerChartRenderer(ChartType.KpiTime, KpiChartRenderer);
    ChartRegistry.registerChartRenderer(ChartType.KpiTarget, KpiChartRenderer);
    ChartRegistry.registerChartRenderer(ChartType.CircularGauge, CircularGaugeRenderer);
}