/**
 * @file Star class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * Star is a solar sytem. It will contains several planet
 *
 * @class
 */
aos.Star = function () {
    /** @type {aos.Planet} */
    this.planets = {};
};

aos.Star.prototype = {

    generate: function () {
        const nbPlanets = Math.floor(Math.random() * 10);        
    },

    generateName: function () {
        const greekLetters = [
{ id: 1, maj: 'Α', min: 'α', name: 'alpha' },
{ id: 2, maj: 'Β', min: 'β', name: 'bêta' },
{ id: 3, maj: 'Γ', min: 'γ', name: 'gamma' },
{ id: 4, maj: 'Δ', min: 'δ', name: 'delta' },
{ id: 5, maj: 'Ε', min: 'ε', name: 'epsilon' },
{ id: 6, maj: 'Ζ', min: 'ζ', name: 'zêta' },
{ id: 7, maj: 'Η', min: 'η', name: 'êta' },
{ id: 8, maj: 'Θ', min: 'θ', name: 'thêta' },
{ id: 9, maj: 'Ι', min: 'ι', name: 'iota' },
{ id: 10, maj: 'Κ', min: 'κ', name: 'kappa' },
{ id: 11, maj: 'Λ', min: 'λ', name: 'lambda' },
{ id: 12, maj: 'Μ', min: 'μ', name: 'mu' },
{ id: 13, maj: 'Ν', min: 'ν', name: 'nu' },
{ id: 14, maj: 'Ξ', min: 'ξ', name: 'ksi/xi' },
{ id: 15, maj: 'Ο', min: 'ο', name: 'omicron' },
{ id: 16, maj: 'Π', min: 'π', name: 'pi' },
{ id: 17, maj: 'Ρ', min: 'ρ', name: 'rhô' },
{ id: 18, maj: 'Σ', min: 'σ', name: 'sigma' },
{ id: 19, maj: 'Τ', min: 'τ', name: 'tau' },
{ id: 20, maj: 'Υ', min: 'υ', name: 'upsilon' },
{ id: 21, maj: 'Φ', min: 'ϕ', name: 'phi' },
{ id: 22, maj: 'Χ', min: 'χ', name: 'khi/chi' },
{ id: 23, maj: 'Ψ', min: 'ψ', name: 'psi' },
{ id: 24, maj: 'Ω', min: 'ω', name: 'oméga' },
        ];

    }
};



