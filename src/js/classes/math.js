/**
 * @file Math class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * This class is a collection of static methods.
 *
 * @class
 */
aos.Math = {
    /**
     * Multiplies two 4x4 matrix.
     *
     * @static
     */
    multiply4x4: function (a, b) {
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a03 = a[3];
        const a10 = a[4];
        const a11 = a[5];
        const a12 = a[6];
        const a13 = a[7];
        const a20 = a[8];
        const a21 = a[9];
        const a22 = a[10];
        const a23 = a[11];
        const a30 = a[12];
        const a31 = a[13];
        const a32 = a[14];
        const a33 = a[15];

        const b00 = b[0];
        const b01 = b[1];
        const b02 = b[2];
        const b03 = b[3];
        const b10 = b[4];
        const b11 = b[5];
        const b12 = b[6];
        const b13 = b[7];
        const b20 = b[8];
        const b21 = b[9];
        const b22 = b[10];
        const b23 = b[11];
        const b30 = b[12];
        const b31 = b[13];
        const b32 = b[14];
        const b33 = b[15];

        return new Float32Array([
            a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03,
            a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03,
            a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03,
            a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03,
            a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13,
            a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13,
            a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13,
            a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13,
            a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23,
            a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23,
            a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23,
            a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23,
            a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33,
            a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33,
            a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33,
            a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33
        ]);
    },

    /**
     * Applies a transformation (represented by a 4x4 matrix) to a vector.
     *
     * @static
     */
    transformVector3: function (v, m) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        let w = m[3] * x + m[7] * y + m[11] * z + m[15];
        w = w || 1.0;
        return new Float32Array([
            (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
            (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
            (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
        ]);
    },

    /**
     * Normalizes a vector.
     *
     * @static
     */
    normalizeVector3: function (v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const length = Math.sqrt(x * x + y * y + z * z);
        return [
            x / length,
            y / length,
            z / length
        ];
    },
};


