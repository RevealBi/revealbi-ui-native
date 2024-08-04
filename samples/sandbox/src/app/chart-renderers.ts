import { ChartType } from "@revealbi/dom";
import { ChartRegistry, IChartRenderer } from "@revealbi/ui-native";
declare let Highcharts: any;

class StackedColumnChartRenderer implements IChartRenderer {
    render(visualization: any, container: Element, data: any) {
        Highcharts.chart(container, {
            chart: {
                type: 'column'
            },
            title: {
                text: '',
            },

            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count trophies'
                },
                stackLabels: {
                    enabled: true
                }
            },
            legend: {
                align: 'left',
                x: 70,
                verticalAlign: 'top',
                y: 70,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'BPL',
                data: [3, 5, 1, 13]
            }, {
                name: 'FA Cup',
                data: [14, 8, 8, 12]
            }, {
                name: 'CL',
                data: [0, 2, 6, 3]
            }]
        });
    }
}

class SplineAreaChartRenderer implements IChartRenderer {
    render(visualization: any, container: Element, data: any) {
        Highcharts.chart(container, {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: '',
            },

            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 120,
                y: 70,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            xAxis: {
                // Highlight the last years where moose hunting quickly deminishes
                plotBands: [{
                    from: 2020,
                    to: 2023,
                    color: 'rgba(68, 170, 213, .2)'
                }]
            },
            yAxis: {
                title: {
                    text: 'Quantity'
                }
            },
            tooltip: {
                shared: true,
                headerFormat: '<b>Hunting season starting autumn {point.x}</b><br>'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    pointStart: 2000
                },
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Moose',
                data:
                    [
                        38000,
                        37300,
                        37892,
                        38564,
                        36770,
                        36026,
                        34978,
                        35657,
                        35620,
                        35971,
                        36409,
                        36435,
                        34643,
                        34956,
                        33199,
                        31136,
                        30835,
                        31611,
                        30666,
                        30319,
                        31766,
                        29278,
                        27487,
                        26007
                    ]
            }, {
                name: 'Deer',
                data:
                    [
                        22534,
                        23599,
                        24533,
                        25195,
                        25896,
                        27635,
                        29173,
                        32646,
                        35686,
                        37709,
                        39143,
                        36829,
                        35031,
                        36202,
                        35140,
                        33718,
                        37773,
                        42556,
                        43820,
                        46445,
                        50048,
                        52804,
                        49317,
                        52490
                    ]
            }]
        });
    }
}

class LineChartRenderer implements IChartRenderer {
    render(visualization: any, container: Element, data: any) {
        Highcharts.chart(container, {

            title: {
                text: '',
            },

            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },

            yAxis: {
                title: {
                    text: 'Number of Employees'
                }
            },

            xAxis: {
                accessibility: {
                    rangeDescription: 'Range: 2010 to 2022'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
            },

            series: [{
                name: 'Installation & Developers',
                data: [
                    43934, 48656, 65165, 81827, 112143, 142383,
                    171533, 165174, 155157, 161454, 154610, 168960, 171558
                ]
            }, {
                name: 'Manufacturing',
                data: [
                    24916, 37941, 29742, 29851, 32490, 30282,
                    38121, 36885, 33726, 34243, 31050, 33099, 33473
                ]
            }, {
                name: 'Sales & Distribution',
                data: [
                    11744, 30000, 16005, 19771, 20185, 24377,
                    32147, 30912, 29243, 29213, 25663, 28978, 30618
                ]
            }, {
                name: 'Operations & Maintenance',
                data: [
                    null, null, null, null, null, null, null,
                    null, 11164, 11218, 10077, 12530, 16585
                ]
            }, {
                name: 'Other',
                data: [
                    21908, 5548, 8105, 11248, 8989, 11816, 18274,
                    17300, 13053, 11906, 10073, 11471, 11648
                ]
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });
    }
}

class KpiChartRenderer implements IChartRenderer {

    render(visualization: any, container: Element, data: any) {

        const trackColors = Highcharts.getOptions().colors.map((color: any) =>
            new Highcharts.Color(color).setOpacity(0.3).get()
        );

        Highcharts.chart(container, {

            chart: {
                type: 'solidgauge',
                height: 'calc(100% - 250px)',
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
                // positioner: function (labelWidth: any) {
                //     return {
                //         x: (this.chart.chartWidth - labelWidth) / 2,
                //         y: (this.chart.plotHeight / 2) + 15
                //     };
                // }
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
    ChartRegistry.registerChartRenderer(ChartType.StackedColumn, StackedColumnChartRenderer);
    ChartRegistry.registerChartRenderer(ChartType.SplineArea, SplineAreaChartRenderer);
    ChartRegistry.registerChartRenderer(ChartType.Line, LineChartRenderer);
    ChartRegistry.registerChartRenderer(ChartType.KpiTime, KpiChartRenderer);
    ChartRegistry.registerChartRenderer(ChartType.KpiTarget, KpiChartRenderer);
}