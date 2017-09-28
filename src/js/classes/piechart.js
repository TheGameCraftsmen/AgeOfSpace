/**
 * @file PieChart class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * This is an utility class.
 * Use it to render a pie chart, based on an array of ressources
 *
 * @class
 */
aos.PieChart = function () {
    // expected elements inside this array:
    // {label:'xx', value:123.0, color:'#fff'}
    this.content = [
        { label: 'xx', value: 123.0, color: '#f00' },
        { label: 'yy', value: 50.0, color: '#ff0' },
        { label: 'zz', value: 20.0, color: '#0f0' },
        { label: 'aa', value: 70.0, color: '#0ff' },
        { label: 'bb', value: 7.0, color: '#00f' },
        { label: 'cc', value: 100.0, color: '#f0f' },
    ];
};

aos.PieChart.prototype = {

    render: function (htmlElement) {
        let total = 0;
        this.content.forEach(function (chartSlice) {
            chartSlice.offset = total;
            total += chartSlice.value;
        }, this);
        total /= 100.0;
        let svgCode = '<svg width="300" height="300" viewBox="-20 -20 40 40""><g transform="rotate(-90)">';
        this.content.forEach(function (chartSlice) {
            svgCode += '<circle cx="0" cy="0" r="15.9154943092" fill="transparent" stroke="' + chartSlice.color
                + '" stroke-width="3" stroke-dasharray="0 ' + (chartSlice.offset / total) + ' ' + (chartSlice.value / total) + ' 100"></circle>';
        }, this);
        svgCode += '</g><text font-size="0.3em" text-anchor="middle" x="0" y="0" fill="#ccc" transform="translate(0 1)">Air</text>';
        // TODO: Air, Oceans, Soil
        svgCode += '</svg>';
        htmlElement.innerHTML += svgCode;
    },

};
