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
        { label: 'xx', value: 123.0, color: '#800' },
        { label: 'yy', value: 50.0, color: '#880' },
        { label: 'zz', value: 20.0, color: '#080' },
        { label: 'aa', value: 70.0, color: '#088' },
        { label: 'bb', value: 0.0, color: '#008' },
        { label: 'cc', value: 100.0, color: '#808' },
    ];
    this.innerText = '';
    this.htmlElement = null;
};

aos.PieChart.prototype = {

    render: function () {
        const total = this.calcRatio();
        let svgCode = '<svg width="150" height="150" viewBox="-20 -20 40 40""><g transform="rotate(-90)">';
        this.content.forEach(function (chartSlice) {
            svgCode += '<circle cx="0" cy="0" r="15.9154943092" fill="transparent" stroke="' + chartSlice.color
                + '" stroke-width="4" stroke-dasharray="0 ' + (chartSlice.offset / total) + ' ' + (chartSlice.value / total) + ' 100"></circle>';
        }, this);
        svgCode += '</g><text font-size="0.3em" text-anchor="middle" x="0" y="0" fill="#ccc" transform="translate(0 1)">' + this.innerText + '</text>';
        svgCode += '</svg>';
        this.htmlElement.innerHTML = svgCode;
    },

    update: function () {
        const total = this.calcRatio();
        this.content.forEach(function (chartSlice, i) {
            this.htmlElement.firstChild.firstChild.childNodes[i].setAttribute('stroke-dasharray', '0 ' + (chartSlice.offset / total) + ' ' + (chartSlice.value / total) + ' 100');
        }, this);
    },

    calcRatio: function () {
        let total = 0;
        this.content.forEach(function (chartSlice) {
            chartSlice.offset = total;
            total += chartSlice.value;
        }, this);
        if (total === 0) {
            total = 1; // Prevent division by 0 later
        }
        total /= 100.0;
        return total;
    },

};
