var NeedleAnnotation = TKChartPointAnnotation.extend({

    layoutInRect: function(bounds)
    {
        var xval = this.series.xAxis.numericValue(this.position.dataXValue);
        var x = TKChartSeriesRender.locationOfValueForAxisInRect(xval, this.series.xAxis, bounds);
        var yval = this.series.yAxis.numericValue(this.position.dataYValue);
        var y = TKChartSeriesRender.locationOfValueForAxisInRect(yval, this.series.yAxis, bounds);
        center = CGPointMake(x, y);
    },

    drawInContext: function(context)
    {
        CGContextBeginPath(context);
        CGContextMoveToPoint(context, center.x-20, center.y);
        CGContextAddLineToPoint(context, center.x+20, center.y+20);
        CGContextAddLineToPoint(context, center.x+20, center.y-20);
            
        CGContextSetRGBFillColor(context, 0, 0, 0, 1);
        CGContextFillPath(context);
    }
});

exports.NeedleAnnotation = NeedleAnnotation;