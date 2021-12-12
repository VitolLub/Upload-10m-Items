;
var earningsGraph = (function($) {

    var earningsChart = null,
        graphData = null;

    function sendMessageToBg(args) {
        chrome.runtime.sendMessage(args);
    }

    function setupEarningsGraph() {
        // Set defaults for Chart
        Chart.defaults.global.scaleShowLabels = false;
        Chart.defaults.global.tooltipFontFamily = "'helvetica', 'arial', 'sans-serif', 'myriad'";
        Chart.defaults.global.tooltipFontSize = 11;
        Chart.defaults.global.tooltipTitleFontFamily = Chart.defaults.global.tooltipFontFamily;
        Chart.defaults.global.tooltipTitleFontSize = 11;
        Chart.defaults.global.tooltipYPadding = 4;
        Chart.defaults.global.tooltipXPadding = 4;
        Chart.defaults.global.tooltipTemplate = "<%= value %>";
        Chart.defaults.global.tooltipCaretSize = 4;
        Chart.defaults.global.tooltipCornerRadius = 3;

        var args = {'method':'getEarnings'};
        sendMessageToBg(args);
    }

    function showGraph(graphData) {
        resetHeight();
        if(graphData === null) { // error happened. Show error message
            document.getElementById("amzn-ext-earningsgraph-wait").style.display = "block";
            document.getElementById("amznps-chart").style.display = "none";
            document.getElementById("amzn-ext-earningsgraph-wait-icon").style.display = "none";
            document.getElementById("amzn-ext-earningsgraph-wait-msg").innerText = "Error occurred while getting latest daily earnings";
            document.getElementById("amzn-ext-earningsgraph-divider").style.display = "block";
        }
        else if(graphData.authorized === false) {
            document.getElementById("amzn-ext-earningsgraph-wait").style.display = "none";
            document.getElementById("amznps-chart").style.display = "none";
            document.getElementById("amzn-ext-earningsgraph-divider").style.display = "none";
        }
        else {
            document.getElementById("amzn-ext-earningsgraph-wait").style.display = "none";
            document.getElementById("amznps-chart").style.display = "block";
            document.getElementById("amznps-chart-date-range").innerText = graphData.startDate + " to " + graphData.endDate;
            document.getElementById("amznps-chart-date").innerText = "Last update: " + graphData.lastUpdate;
            document.getElementById("amzn-ext-earningsgraph-divider").style.display = "block";

            var wrapper = document.getElementById("amzn-ext-earningsgraph-wrapper");
            if(earningsChart !== null) {
                earningsChart.destroy();
                earningsChart = null;

                while(wrapper.firstChild) {
                    wrapper.removeChild(wrapper.firstChild);
                }
            }

            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'amzn-ext-earningsgraph');
            canvas.setAttribute('width', '185');
            canvas.setAttribute('height', '130');
            wrapper.appendChild(canvas);

            var ctx = canvas.getContext("2d");
            var chartData = {
                labels: [0,0,0,0,0,0,0],
                data: [0,0,0,0,0,0,0]
            };

            if(graphData) {
                chartData.labels = graphData.labels && graphData.labels.length > 0 ? graphData.labels : [0,0,0,0,0,0,0];
                chartData.data = graphData.data && graphData.data.length > 0 ? graphData.data : [0,0,0,0,0,0,0];
            }

            var lineChartData = {
                labels: chartData.labels,
                datasets: [
                    {
                        label: "Earnigs Report",
                        fillColor: "#fcefe2",
                        strokeColor: "#a8a8a8",
                        pointColor: "#9e9e9e",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#ee831b",
                        pointHighlightStroke: "#e47911",
                        data: chartData.data
                    }
                ]
            };

            earningsChart = new Chart(ctx).Line(lineChartData, null);
        }
    }

    function resetHeight() {
        settings.resetHeight();
    }

    document.addEventListener('DOMContentLoaded', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            setupEarningsGraph();
        });
    });

    var earningsGraph ={
        'earningsChart': null,
        'graphData': null
    };

    Object.defineProperties(earningsGraph, {
        'graphData': {
            'set':function(value) {
                graphData = value;
                showGraph(graphData);
            },
            'get':function() {
                return graphData;
            }
        }
    });

    return earningsGraph;

}(AmznJ));

