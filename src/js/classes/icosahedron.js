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
    this.tessellatedTriangles = [];
    this.modelMatrix = null;
    this.frustumMatrix = null;
    this.cameraMatrix = null;
    this.rotateY1 = null;
    this.rotateY1r = null;
    this.rotates = true;
    this.hoveredTriangle = -1;
    this.mousePosition = [0, 0];
    this.cameraXrotate = 0;
};


aos.Icosahedron.prototype = {

    initialize: function () {
        // start with identity; we'll rotate that matrix along the Y axis later, to simulate planetary revolution
        this.modelMatrix = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
        ]);

        // http://www.songho.ca/opengl/gl_projectionmatrix.html
        const right = 0.2;
        const top = 0.2;
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
        // per openGL doc, the camera starts in (0, 0, 0), is oriented along the Z axis, and is looking into the direction of negative Z
        // to maintain a "lookAt" (0, 0, 0) we have to rotate it first along the X axis, then translate it backwards along the Z axis
        // rotation is 0 during init, we just translate
        const tx = 0;
        const ty = 0;
        const tz = 6;
        this.cameraMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ]);
        this.cameraXrotate = 0;

        // these constants are used for planetary revolution along its polar axis (always Y, in the model space)
        const cos1 = Math.cos(Math.PI / 500);
        const sin1 = Math.sin(Math.PI / 500);
        this.rotateY1 = new Float32Array([
            cos1, 0, -sin1, 0,
            0, 1, 0, 0,
            sin1, 0, cos1, 0,
            0, 0, 0, 1
        ]);
        this.rotateY1r = new Float32Array([
            cos1, 0, sin1, 0,
            0, 1, 0, 0,
            -sin1, 0, cos1, 0,
            0, 0, 0, 1
        ]);

        const invphi = 2 / (1 + Math.sqrt(5));
        const radius = Math.sqrt(1 + invphi * invphi);

        // Vertices coordinates: [Xworld, Yworld, Zworld, Zmodel]
        // Zmodel is re-calculated for each frame during render
        // source for coordinates is: https://en.wikipedia.org/wiki/Platonic_solid#Cartesian_coordinates
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
        // This array should not be sorrted
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

        this.triangles.forEach(function (tri, idx) {
            // Tessellated triangles arrays: [vertex1, vertex2, vertex3, Z-buffer (distance to camera), parent triangle]
            const v1 = this.vertices[tri[0]];
            const v2 = this.vertices[tri[1]];
            const v3 = this.vertices[tri[2]];
            const m12 = aos.Math.normalizeVector3(new Float32Array([(v1[0] + v2[0]) * 0.5, (v1[1] + v2[1]) * 0.5, (v1[2] + v2[2]) * 0.5]));
            const m23 = aos.Math.normalizeVector3(new Float32Array([(v2[0] + v3[0]) * 0.5, (v2[1] + v3[1]) * 0.5, (v2[2] + v3[2]) * 0.5]));
            const m31 = aos.Math.normalizeVector3(new Float32Array([(v3[0] + v1[0]) * 0.5, (v3[1] + v1[1]) * 0.5, (v3[2] + v1[2]) * 0.5]));
            this.vertices.push(new Float32Array([m12[0] * radius, m12[1] * radius, m12[2] * radius, 0]));
            this.vertices.push(new Float32Array([m23[0] * radius, m23[1] * radius, m23[2] * radius, 0]));
            this.vertices.push(new Float32Array([m31[0] * radius, m31[1] * radius, m31[2] * radius, 0]));
            this.tessellatedTriangles.push([tri[0], this.vertices.length - 3, this.vertices.length - 1, 0, idx]);
            this.tessellatedTriangles.push([tri[1], this.vertices.length - 3, this.vertices.length - 2, 0, idx]);
            this.tessellatedTriangles.push([tri[2], this.vertices.length - 2, this.vertices.length - 1, 0, idx]);
            this.tessellatedTriangles.push([this.vertices.length - 3, this.vertices.length - 2, this.vertices.length - 1, 0, idx]);
        }, this);


        window.addEventListener('animationTick', function (e) {
            const canvas = document.getElementById('planetTestCanvas');
            const halfWidth = canvas.clientWidth / 2;
            const halfHeight = canvas.clientHeight / 2;
            const ctx = canvas.getContext("2d");

            ctx.save();
            ctx.translate(halfWidth, halfHeight);
            ctx.scale(halfWidth, halfHeight);

            if (this.rotates) {
                const newModel = aos.Math.multiply4x4(this.rotateY1, this.modelMatrix);
                this.modelMatrix = newModel;
                if (this.cameraXrotate !== 0) {
                    this.cameraXrotate *= 0.9;
                    if (Math.abs(this.cameraXrotate) < 0.01) {
                        this.cameraXrotate = 0;
                        this.cameraMatrix = new Float32Array([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        tx, ty, tz, 1
                        ]);

                    }
                }
            }
            else {
                if (this.mousePosition[0] < 80) {
                    const newModel1 = aos.Math.multiply4x4(this.rotateY1, this.modelMatrix);
                    const newModel2 = aos.Math.multiply4x4(this.rotateY1, newModel1);
                    const newModel3 = aos.Math.multiply4x4(this.rotateY1, newModel2);
                    const newModel4 = aos.Math.multiply4x4(this.rotateY1, newModel3);
                    this.modelMatrix = newModel4;
                } else if (this.mousePosition[0] < 160) {
                    const newModel1 = aos.Math.multiply4x4(this.rotateY1, this.modelMatrix);
                    const newModel2 = aos.Math.multiply4x4(this.rotateY1, newModel1);
                    this.modelMatrix = newModel2;
                } else if (this.mousePosition[0] < 340) {
                    // No rotation
                } else if (this.mousePosition[0] < 420) {
                    const newModel1 = aos.Math.multiply4x4(this.rotateY1r, this.modelMatrix);
                    const newModel2 = aos.Math.multiply4x4(this.rotateY1r, newModel1);
                    this.modelMatrix = newModel2;
                } else {
                    const newModel1 = aos.Math.multiply4x4(this.rotateY1r, this.modelMatrix);
                    const newModel2 = aos.Math.multiply4x4(this.rotateY1r, newModel1);
                    const newModel3 = aos.Math.multiply4x4(this.rotateY1r, newModel2);
                    const newModel4 = aos.Math.multiply4x4(this.rotateY1r, newModel3);
                    this.modelMatrix = newModel4;
                }
                const yWish = (this.mousePosition[1] - 250) / 60;
                this.cameraXrotate = 0.9 * this.cameraXrotate + 0.1 * yWish; // LERP
            }
            // rotate along X axis
            if (this.cameraXrotate !== 0) {
                const cos10 = Math.cos(Math.atan2(this.cameraXrotate, 6));
                const sin10 = Math.sin(Math.atan2(this.cameraXrotate, 6));
                this.cameraMatrix = aos.Math.multiply4x4(new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 6, 1
                ]), new Float32Array([
                    1, 0, 0, 0,
                    0, cos10, sin10, 0,
                    0, -sin10, cos10, 0,
                    0, 0, 0, 1
                ]));
            }

            const vm = aos.Math.multiply4x4(this.cameraMatrix, this.modelMatrix);
            const pvm = aos.Math.multiply4x4(this.frustumMatrix, vm);

            ctx.fillStyle = "#444";
            ctx.fillRect(-1, -1, 2, 2);

            const screenPoints = [];
            this.vertices.forEach(function (vec3) {
                const screenPoint = aos.Math.transformVector3(vec3, pvm);
                screenPoints.push(screenPoint);
                const modelPoint = aos.Math.transformVector3(vec3, this.modelMatrix);
                vec3[3] = (6 - modelPoint[2]) * (6 - modelPoint[2]) + (this.cameraXrotate - modelPoint[1]) * (this.cameraXrotate - modelPoint[1]);
            }, this);
            //document.getElementById('debug').innerHTML = '' + maxX;
            this.tessellatedTriangles.forEach(function (tri) {
                tri[3] = this.vertices[tri[0]][3] + this.vertices[tri[1]][3] + this.vertices[tri[2]][3];
            }, this);
            this.tessellatedTriangles.sort(function (a, b) {
                return a[3] - b[3];
            });
            let selectedTriangle = -1;
            this.tessellatedTriangles.forEach(function (tri) {
                ctx.beginPath();
                ctx.moveTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                ctx.lineTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                ctx.closePath();
                if (!this.rotates && ctx.isPointInPath(this.mousePosition[0], this.mousePosition[1])) {
                    selectedTriangle = tri[4];
                }
            }, this);
            this.tessellatedTriangles.forEach(function (tri, idx) {
                const parentTri = this.triangles[tri[4]];
                ctx.beginPath();
                ctx.fillStyle = 'rgb(' + (parentTri[1] * 20) + ', ' + (parentTri[0] * 20) + ', ' + (parentTri[2] * 20) + ')';
                ctx.moveTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                ctx.lineTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                ctx.closePath();
                if (selectedTriangle === tri[4]) {
                    ctx.fillStyle = '#600';
                }
                ctx.fill();
                if (tri[0] < 12) {
                    ctx.lineWidth = 0.005; // 0.004 space units = 1 px on screen
                    ctx.strokeStyle = '#000';
                    ctx.beginPath();
                    ctx.moveTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                    ctx.lineTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                    ctx.lineTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.lineWidth = 0.001;
                    ctx.strokeStyle = '#888';
                    ctx.moveTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                    ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.lineWidth = 0.001;
                    ctx.strokeStyle = '#888';
                    ctx.moveTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                    ctx.lineTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                    ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                    ctx.closePath();
                    ctx.stroke();
                }
            }, this);

            ctx.restore();
        }.bind(this), false);

        document.getElementById('planetTestCanvas').addEventListener('mouseover', function (e) {
            this.rotates = false;
        }.bind(this), false);
        document.getElementById('planetTestCanvas').addEventListener('mouseout', function (e) {
            this.rotates = true;
        }.bind(this), false);

        document.getElementById('planetTestCanvas').addEventListener('mousemove', function (e) {
            e.preventDefault();
            const x = e.offsetX * 500 / document.getElementById('planetTestCanvas').offsetWidth;
            const y = e.offsetY * 500 / document.getElementById('planetTestCanvas').offsetWidth;
            this.mousePosition = [x, y];
        }.bind(this), false);
    },

};