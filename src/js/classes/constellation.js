/**
 * @file Constellation class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * Sub-class of Galaxy. Only technical.
 *
 * @class
 */
aos.Constellation = function () {
    /** @type {number} */
    this.reference = {}; // latin name of the constellation
    this.loreStarCount = 0;
    this.stars = [];
    this.edges = [];
    this.kruskalEdges = [];
};

aos.Constellation.prototype = {

    computeEdges: function () {
        this.stars.forEach(function (star, i) {
            this.stars.forEach(function (otherStar, j) {
                if (j > i) {
                    const deltaX = star.x - otherStar.x;
                    const deltaY = star.y - otherStar.y;
                    const dist = deltaX * deltaX + deltaY * deltaY;
                    this.edges.push({ i: i, j: j, dist: dist });
                }
            }, this);
        }, this);
        this.edges.sort(function (a, b) {
            return a.dist - b.dist;
        });
    },

    kruskal: function () {
        const edgesSave = this.edges.slice();
        let groupCount = this.stars.length;
        while (groupCount > 1) {
            if (this.edges.length === 0) {
                debugger;
            }
            const edge = this.edges.shift();
            if (this.stars[edge.i].group !== this.stars[edge.j].group) {
                groupCount--;
                this.kruskalEdges.push(edge);
                const newGroup = this.stars[edge.i].group;
                const oldGroup = this.stars[edge.j].group;
                this.stars.forEach(function (star) {
                    if (star.group === oldGroup) {
                        star.group = newGroup;
                    }
                }, this);
            }
        }
        this.edges = edgesSave;
    },

    render: function (highlight) {
        const canvas = document.getElementById('galaxyOverlayCanvas');
        const ctx = canvas.getContext('2d');

        // draw constellation edges
        ctx.strokeStyle = highlight ? '#777' : '#333';
        ctx.lineWidth = 1;
        this.kruskalEdges.forEach(function (edge) {
            const v1 = this.stars[edge.i];
            const v2 = this.stars[edge.j];
            ctx.beginPath();
            ctx.moveTo(600 + v1.x, 450 + v1.y);
            ctx.lineTo(600 + v2.x, 450 + v2.y);
            ctx.stroke();
        }, this);

        // circle around main stars
        // green for notable (15px radius)
        // red for common (10px radius)
        if (/*highlight*/ true) {
            this.stars.forEach(function (star) {
                ctx.beginPath();
                if (star.hasShip) {
                    ctx.strokeStyle = '#360';
                    ctx.lineWidth = 2;
                    ctx.arc(600 + star.x, 450 + star.y, 15, 0, 2 * Math.PI);
                } else {
                    //ctx.strokeStyle = '#600';
                    //ctx.lineWidth = 2;
                    //ctx.arc(600 + star.x, 450 + star.y, 10, 0, 2 * Math.PI);
                }
                ctx.stroke();
            });
        }

        // big white points for constellation stars
        ctx.fillStyle = '#fff';
        const pointSize = 20.0;
        this.stars.forEach(function (star) {
            //ctx.fillRect(star.x + 600.0 - pointSize / 2.0, star.y + 450.0 - pointSize / 2.0, pointSize, pointSize);
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(star.x + 600.0, star.y + 450.0, 0, star.x + 600.0, star.y + 450.0, highlight ? 3 + Math.log(star.radius) : 1.2 + 0.2 * Math.log(star.radius));
            const starColor = star.color;
            gradient.addColorStop(0, 'rgba(' + starColor.R + ', ' + starColor.G + ', ' + starColor.B + ', 1)');
            gradient.addColorStop(0.3, 'rgba(' + starColor.R + ', ' + starColor.G + ', ' + starColor.B + ', 0.8)');
            gradient.addColorStop(1, 'rgba(' + starColor.R + ', ' + starColor.G + ', ' + starColor.B + ', 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(star.x + 600.0 - pointSize / 2.0, star.y + 450.0 - pointSize / 2.0, pointSize, pointSize);
        });
    },
}