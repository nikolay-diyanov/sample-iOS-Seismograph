var needleAnnotation = require("./needle-annotation");
var NeedleAnnotation = needleAnnotation.NeedleAnnotation;

var coefficient = 1000;
var motionManager = new CMMotionManager();
var dataPoints = [];
var center;
var chart;

function onPageLoaded(args) {
    motionManager.accelerometerUpdateInterval = 0.2;

    startOperations();
}

function creatingChart(args) {
    chart = TKChart.new();
    args.view = chart;
}

function startOperations() {
    if(motionManager.accelerometerAvailable)
    {
        motionManager.startAccelerometerUpdatesToQueueWithHandler(NSOperationQueue.currentQueue(),
            function (accelerometerData, error) {
                var acceleration = accelerometerData.acceleration;

                buildChartWithPoints(acceleration.x*coefficient);
            }
        );
    }
}

function buildChartWithPoints(point) {
    chart.removeAllData();
    chart.removeAllAnnotations();

    var dataPoint = TKChartDataPoint.alloc().initWithXY(NSDate.date(), point);

    dataPoints.push(dataPoint);

    if (dataPoints.length > 25) {
        dataPoints.shift();
    }

    var yAxis = TKChartNumericAxis.alloc().initWithMinimumAndMaximum(-coefficient, coefficient);
    yAxis.position = TKChartAxisPosition.Left;
    yAxis.majorTickInterval = 200;
    yAxis.minorTickInterval = 1;
    yAxis.offset = 0;
    yAxis.baseline = 0;
    yAxis.style.labelStyle.fitMode = TKChartAxisLabelFitMode.Rotate;
    yAxis.style.labelStyle.firstLabelTextAlignment = TKChartAxisLabelAlignment.Left;
    chart.yAxis = yAxis;

    var lineSeries = TKChartLineSeries.alloc().initWithItems(dataPoints);
    lineSeries.style.palette = new TKChartPalette();
    var strokeRed = TKStroke.strokeWithColor(UIColor.colorWithRedGreenBlueAlpha(1, 0, 0, 1));
    strokeRed.width = 1.5;
    lineSeries.style.palette.addPaletteItem(TKChartPaletteItem.paletteItemWithDrawables([strokeRed]));
    chart.addSeries(lineSeries);

    var axisColor = TKStroke.strokeWithColor(UIColor.blackColor());
    axisColor.width = 1;
    chart.xAxis.style.lineStroke = axisColor;
    chart.xAxis.style.majorTickStyle.ticksHidden = true;
    chart.xAxis.style.labelStyle.textHidden = true;

    var dashStroke = TKStroke.strokeWithColor(UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, 0.5));
    dashStroke.dashPattern = ([6, 1]);
    dashStroke.width = 0.5;

    var annotationBandRed = TKChartBandAnnotation.alloc().initWithRangeForAxis(TKRange.alloc().initWithMinimumAndMaximum(-1000, 1000), chart.yAxis);
    annotationBandRed.style.fill = TKSolidFill.solidFillWithColor(UIColor.colorWithRedGreenBlueAlpha(255/255.0, 149/255.0, 149/255.0, 0.7));
    chart.addAnnotation(annotationBandRed);

    var annotationBandYellow = TKChartBandAnnotation.alloc().initWithRangeForAxis(TKRange.alloc().initWithMinimumAndMaximum(-500, 500), chart.yAxis);
    annotationBandYellow.style.fill = TKSolidFill.solidFillWithColor(UIColor.colorWithRedGreenBlueAlpha(252/255.0, 255/255.0, 138/255.0, 0.7));
    chart.addAnnotation(annotationBandYellow);

    var annotationBandGreen = TKChartBandAnnotation.alloc().initWithRangeForAxis(TKRange.alloc().initWithMinimumAndMaximum(-300, 300), chart.yAxis);
    annotationBandGreen.style.fill = TKSolidFill.solidFillWithColor(UIColor.colorWithRedGreenBlueAlpha(152/255.0, 255/255.0, 149/255.0, 1));
    chart.addAnnotation(annotationBandGreen);

    var positiveDashAnnotation = TKChartGridLineAnnotation.alloc().initWithValueForAxis(150, chart.yAxis);
    positiveDashAnnotation.style.stroke = dashStroke;
    chart.addAnnotation(positiveDashAnnotation);

    var negativeDashAnnotation = TKChartGridLineAnnotation.alloc().initWithValueForAxis(-150, chart.yAxis);
    negativeDashAnnotation.style.stroke = dashStroke;
    chart.addAnnotation(negativeDashAnnotation);

    if(dataPoints.length > 1) {
        var needle = NeedleAnnotation.alloc().initWithXYForSeries(dataPoint.dataXValue, dataPoint.dataYValue, lineSeries);
        needle.zPosition = TKChartAnnotationZPosition.AboveSeries;
        chart.addAnnotation(needle);
    }
}

function tapStart() {
    startOperations();
}

function tapStop() {
    motionManager.stopAccelerometerUpdates();
    NSOperationQueue.currentQueue().cancelAllOperations();
}

function tapReset() {
    chart.removeAllData();
    while(dataPoints.length > 0)
    {
        dataPoints.pop();
    }

    buildChartWithPoints(0);
}

exports.creatingChart = creatingChart;
exports.onPageLoaded = onPageLoaded;
exports.startOperations = startOperations;
exports.tapStart = tapStart;
exports.tapStop = tapStop;
exports.tapReset = tapReset;