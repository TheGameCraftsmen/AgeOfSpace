/**
 * @file Icosahedron class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * This class is used to render a planet with an icosahedron.
 *
 * @class
 */
aos.Icosahedron = function () {
    this.vertices = [];
    this.triangles = [];
    this.modelMatrix = null;
    this.frustumMatrix = null;
    this.cameraMatrix = null;
    this.rotateY1 = null;
};


aos.Icosahedron.prototype = {

    initialize: function () {
        //identity
        this.modelMatrix = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
        ]);

        // http://www.songho.ca/opengl/gl_projectionmatrix.html
        const right = 0.268;
        const top = 0.268;
        const near = 1;
        const far = 100;
        const nf = 1 / (near - far);
        this.frustumMatrix = new Float32Array([
            near / right, 0, 0, 0,
            0, near / top, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ]);

        // http://www.songho.ca/opengl/gl_camera.html#lookat
        // translate (0, 0, 5)
        const tx = 0;
        const ty = 0;
        const tz = 5;
        this.cameraMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ]);

        const cos1 = Math.cos(Math.PI / 180);
        const sin1 = Math.sin(Math.PI / 180);
        this.rotateY1 = new Float32Array([
            cos1, 0, -sin1, 0,
            0, 1, 0, 0,
            sin1, 0, cos1, 0,
            0, 0, 0, 1
        ]);

        const invphi = 2 / (1 + Math.sqrt(5));

        // Vertices coordinates: [Xworld, Yworld, Zworld, Zmodel]
        this.vertices.push(new Float32Array([1, invphi, 0, 0]));    // 0
        this.vertices.push(new Float32Array([1, -invphi, 0, 0]));    // 1
        this.vertices.push(new Float32Array([-1, invphi, 0, 0]));    // 2
        this.vertices.push(new Float32Array([-1, -invphi, 0, 0]));    // 3
        this.vertices.push(new Float32Array([0, 1, invphi, 0]));    // 4
        this.vertices.push(new Float32Array([0, 1, -invphi, 0]));    // 5
        this.vertices.push(new Float32Array([0, -1, invphi, 0]));    // 6
        this.vertices.push(new Float32Array([0, -1, -invphi, 0]));    // 7
        this.vertices.push(new Float32Array([invphi, 0, 1, 0]));    // 8
        this.vertices.push(new Float32Array([-invphi, 0, 1, 0]));    // 9
        this.vertices.push(new Float32Array([invphi, 0, -1, 0]));    // 10
        this.vertices.push(new Float32Array([-invphi, 0, -1, 0]));    // 11

        // Triangles arrays: [vertex1, vertex2, vertex3, average Zmodel]
        this.triangles.push([4, 5, 0, 0]);
        this.triangles.push([4, 5, 2, 0]);
        this.triangles.push([6, 7, 1, 0]);
        this.triangles.push([6, 7, 3, 0]);
        this.triangles.push([0, 1, 8, 0]);
        this.triangles.push([0, 1, 10, 0]);
        this.triangles.push([2, 3, 9, 0]);
        this.triangles.push([2, 3, 11, 0]);
        this.triangles.push([8, 9, 4, 0]);
        this.triangles.push([8, 9, 6, 0]);
        this.triangles.push([10, 11, 5, 0]);
        this.triangles.push([10, 11, 7, 0]);
        this.triangles.push([0, 4, 8, 0]); // +++
        this.triangles.push([0, 5, 10, 0]); // ++-
        this.triangles.push([1, 6, 8, 0]); // +-+
        this.triangles.push([1, 7, 10, 0]); // +--
        this.triangles.push([2, 4, 9, 0]); // -++
        this.triangles.push([2, 5, 11, 0]); // -+-
        this.triangles.push([3, 6, 9, 0]); // --+
        this.triangles.push([3, 7, 11, 0]); // ---


        window.addEventListener('animationTick', function (e) {
            const canvas = document.getElementById('planetTestCanvas');
            const ctx = canvas.getContext("2d");

            const newModel = aos.Math.multiply4x4(this.rotateY1, this.modelMatrix);
            this.modelMatrix = newModel;
            const vm = aos.Math.multiply4x4(this.cameraMatrix, this.modelMatrix);
            const pvm = aos.Math.multiply4x4(this.frustumMatrix, vm);

            const halfWidth = canvas.clientWidth / 2;
            const halfHeight = canvas.clientHeight / 2;

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            const screenPoints = [];
            this.vertices.forEach(function (vec3) {
                const screenPoint = aos.Math.transformVector3(vec3, pvm);
                screenPoints.push(screenPoint);
                ctx.fillStyle = "#fff";
                ctx.fillRect(screenPoint[0] * halfWidth + halfWidth, screenPoint[1] * halfHeight + halfHeight, 1, 1);
                const modelPoint = aos.Math.transformVector3(vec3, this.modelMatrix);
                vec3[3] = modelPoint[2];
            }, this);
            this.triangles.forEach(function (tri) {
                tri[3] = this.vertices[tri[0]][3] + this.vertices[tri[1]][3] + this.vertices[tri[2]][3];
            }, this);
            this.triangles.sort(function (a, b) {
                return b[3] - a[3];
            });
            this.triangles.forEach(function (tri) {
                ctx.beginPath();
                ctx.fillStyle = 'rgb(' + (tri[0] * 20) + ', ' + (tri[1] * 20) + ', ' + (tri[2] * 20) + ')';
                ctx.moveTo(screenPoints[tri[0]][0] * halfWidth + halfWidth, screenPoints[tri[0]][1] * halfHeight + halfHeight);
                ctx.lineTo(screenPoints[tri[1]][0] * halfWidth + halfWidth, screenPoints[tri[1]][1] * halfHeight + halfHeight);
                ctx.lineTo(screenPoints[tri[2]][0] * halfWidth + halfWidth, screenPoints[tri[2]][1] * halfHeight + halfHeight);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineTo(screenPoints[tri[1]][0] * halfWidth + halfWidth, screenPoints[tri[1]][1] * halfHeight + halfHeight);
                ctx.lineTo(screenPoints[tri[2]][0] * halfWidth + halfWidth, screenPoints[tri[2]][1] * halfHeight + halfHeight);
                ctx.closePath();
                ctx.stroke();
            }, this);
        }.bind(this), false);
    },
};