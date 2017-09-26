/**
 * @file Planet class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * The planet is part of solar system. Player will try to colonize it, according to constraint like breathable air,....
 * Player will certainly need to terraform it.
 *
 * @class
 */
aos.Planet = function () {
    /** @type {number} 
     * in Million km2
    */
    this.size = 0;
    /** @type {aos.ressource} */
    this.ressources = [];
    /** @type {aos.ressource} */
    this.ressourcesStored = [];
    /** @type {number} */
    this.landSize = 0;
    /** @type {number} */
    this.population = 0;
    /** @type {number} 
     * Indicator calculated to estimate the viability of the planet. Population will grow or not depending of it.
     * 0 : population decreases deadly, 50 : population stagnation, 100 : population grows highly
    */
    this.healtingIndicator = 0;
    /** @type {aos.building} */
    this.buildings=[];
    /** @type {boolean} 
     * Planet must be scanned to show planet properties to Player
    */
    this.scanned = false;
};

aos.Planet.prototype = {

    generate: function () {
        this.size = Math.floor(Math.random() * 5 + 1);
        this.landSize = Math.random * this.size;
        this.generateAir();
        this.generateGround();
        this.generateLiquid();
        let b = new aos.Building();
        b.construct("iron Mine");
        this.buildings.push(b);
        b = new aos.Building();
        b.construct("copper Mine");
        //this.buildings.push(b);
        b = new aos.Building();
        b.construct("solar plant");
        this.buildings.push(b);
        
        b = new aos.Building();
        b.construct("CO2 epuration");
        //this.buildings.push(b);
        
    },

    generateAir : function(){
        var compositionPercent = 0;
        for(let i = 0 ; i < aos.ressources.length ; i++){   
            if( aos.ressources[i].category == "air"){
                let ressource = new aos.Ressource();
                ressource.type = "air";
                ressource.name = aos.ressources[i].name;
                if ( i == ( aos.ressources.length-1 )){
                    ressource.percent = 100-compositionPercent;
                    ressource.quantity = (100-compositionPercent) * this.size * aos.volumeRessources[ressource.type];
                }else{
                    let itAirPrcent = Math.floor(Math.random() * (100-compositionPercent))
                    ressource.quantity = itAirPrcent * this.size * aos.volumeRessources[ressource.type];
                    ressource.percent = itAirPrcent;    
                    compositionPercent += itAirPrcent;
                }
                this.ressources.push(ressource);
            }
        }
    },

    generateLiquid : function(){
        var compositionPercent = 0;
        for(let i = 0 ; i < aos.ressources.length ; i++){   
            if( aos.ressources[i].category == "liquid"){
                let ressource = new aos.Ressource();
                ressource.type = "liquid";
                ressource.name = aos.ressources[i].name;
                if ( i == ( aos.ressources.length-1 )){
                    ressource.quantity = (100-compositionPercent) * this.size * aos.volumeRessources[ressource.type];
                    ressource.percent = (100-compositionPercent) * this.size * aos.volumeRessources[ressource.type];
                }else{
                    let itPrcent = Math.floor(Math.random() * (100-compositionPercent))
                    ressource.quantity = itPrcent * this.size * aos.volumeRessources[ressource.type];
                    ressource.percent = itPrcent;
                    compositionPercent += itPrcent;
                }
                this.ressources.push(ressource);
            }
        }
    },

    generateMetal : function(prcent){
        var compositionPercent = 0;
        for( let i = 0 ; i < aos.ressources.length ; i++){   
            if( aos.ressources[i].category == "metal"){
                let ressource = new aos.Ressource();
                ressource.type = "metal";
                ressource.name = aos.ressources[i].name;
                if ( i == ( aos.ressources.length-1 )){
                    ressource.quantity = (prcent - compositionPercent) * this.size * aos.volumeRessources[ressource.type];
                    ressource.percent = prcent - compositionPercent;
                }else{
                    let itPrcent = Math.floor(Math.random() * (prcent-compositionPercent))
                    ressource.percent = itPrcent ;
                    ressource.quantity = ressource.percent * this.size * aos.volumeRessources[ressource.type];
                    compositionPercent += itPrcent;
                }
                this.ressources.push(ressource);
            }   
        }
    },

    generateGround : function(){
        var compositionPercent = 0;
        for( let i = 0 ; i < aos.ressources.length ; i++){   
            if( aos.ressources[i].category == "ground"){
                let ressource = new aos.Ressource();
                ressource.type = "ground";
                ressource.name = aos.ressources[i].name;
                if ( i == ( aos.ressources.length-1 )){
                    ressource.percent = 100 - compositionPercent;
                    ressource.quantity = ressource.percent * this.size * aos.volumeRessources[ressource.type];
                    this.ressources.push(ressource);
                }else{
                    let itPrcent = Math.floor(Math.random() * (100-compositionPercent))
                    if( aos.ressources[i].name == "metal" ){
                        this.generateMetal(itPrcent);
                    }else{
                        ressource.percent = itPrcent;
                        ressource.quantity = itPrcent * this.size * aos.volumeRessources[ressource.type];
                        this.ressources.push(ressource);
                    }
                    compositionPercent += itPrcent;
                }
            }
            
        }
    },

    calculateHealthIndicator: function(){
        this.healtingIndicator = 70;
    },

    populationGrowing : function(){
        if(this.healtingIndicator > 50){
            this.population += 100000;
        }else{
            this.population -= 100000;
        }
    },

    removeRessource : function(name, quantity,planetRessource){
        console.log("removeRessource " + name + "/" + quantity + ":" + planetRessource);
        let qtyRemoved = 0;
        if (planetRessource){
            for ( let itPlanetRes = 0 ; itPlanetRes < this.ressources.length ; itPlanetRes++ ){
                if ( this.ressources[itPlanetRes].name == name && this.ressources[itPlanetRes].quantity>=quantity){
//                    let newPercent = ((this.ressources[itPlanetRes].percent * this. size * aos.volumeRessources[this.ressources[itPlanetRes].type]) - quantity) / (100 * this. size * aos.volumeRessources[this.ressources[itPlanetRes].type]);
                    this.ressources[itPlanetRes].quantity -= quantity;
                    qtyRemoved = quantity;
                }
            }
        }else{
            for (let itRes = 0 ; itRes < this.ressourcesStored.length ; itRes++){
                if (this.ressourcesStored[itRes].name == name && this.ressourcesStored[itRes].quantity >= quantity ){
                    qtyRemoved = quantity;
                    this.ressourcesStored[itRes].quantity -= qtyRemoved;
                }
            }
        }
        console.log("RemoveREssource " + qtyRemoved);

        return qtyRemoved;
    },

    produce : function(typeProduct){
        for( let itBuilding = 0 ; itBuilding < this.buildings.length ; itBuilding++){
            let building = this.buildings[itBuilding];  
            if ( building.type == typeProduct || typeof typeProduct === "undefined" || typeProduct == "" || typeProduct == null){
                building.functional = true;
                if (typeof building.production.require !== "undefined"){
                    for ( let itProd = 0 ; itProd < building.production.require.length ; itProd++ ){
                        let removeRes = this.removeRessource(building.production.require[itProd].name,building.production.require[itProd].quantity,building.production.require[itProd].planetRessource);
                        if (removeRes != building.production.require[itProd].quantity) building.functional = false;
                    }
                }
                if ( building.functional){
                    for ( let itPlanetRes = 0 ; itPlanetRes < this.ressources.length ; itPlanetRes++ ){
                        if ( this.ressources[itPlanetRes].name == building.production.from && this.ressources[itPlanetRes].quantity >= building.production.quantity){
                            //let newPercent = ((this.ressources[itPlanetRes].percent * this. size * aos.volumeRessources[this.ressources[itPlanetRes].type]) - nbMined) / (100 * this. size * aos.volumeRessources[this.ressources[itPlanetRes].type]);
                            this.ressources[itPlanetRes].quantity -= building.production.quantity;
                            let findRes = null;
                            let storage = null;
                            
                            if ( building.production.to == "planet"){
                                storage = this.ressources;
                            }else{
                                storage = this.ressourcesStored;
                            }
                            for ( let itRes = 0 ; itRes < storage.length ; itRes ++){
                                if ( storage[itRes].name == building.production.product ){
                                    findRes = storage[itRes];
                                    break;
                                }
                            }
                            if ( findRes == null ){
                                findRes = new aos.Ressource();
                                findRes.name = building.production.product;
                                findRes.type = building.production.type;
                                findRes.quantity = building.production.quantity;
                                //findRes.percent = (nbMined) / (100 * this. size * aos.volumeRessources[findRes.type]) * 100;
                                storage.push(findRes);
                            }else{
                                findRes.quantity += building.production.quantity;
                                //findRes.percent = ((findRes.percent * this. size * aos.volumeRessources[findRes.type]) + nbMined) / (100 * this. size * aos.volumeRessources[findRes.type]) * 100;
                            }
                            
                            break;
                        }
                    }
                }
            }
        }
    },

    produceEnergy : function(){
      for ( let itBuilding = 0 ; itBuilding < this.buildings.length ; itBuilding++ ){
          let building = this.buildings[itBuilding];
          if ( building.type == "plant" ){
            let findRes = null;
            for ( let itRes = 0 ; itRes < this.ressourcesStored.length ; itRes ++){
                if ( this.ressourcesStored[itRes].name == building.production.product ){
                    findRes = this.ressourcesStored[itRes];
                    break;
                }
            }
            if ( findRes == null ){
                findRes = new aos.Ressource();
                findRes.name = building.production.product;
                findRes.type = building.production.type;
                findRes.quantity = building.production.quantity;
                this.ressourcesStored.push(findRes);
            }else{
                findRes.quantity += building.production.quantity;
            }
          }
      }  
    },

    

    run : function(speedTick){

        this.calculateHealthIndicator();
        this.populationGrowing();
        this.produceEnergy();
        //this.produce("mine");
        //this.produce("epurateur");
        this.produce();
        this.showStats();
    },

    showPlanetRessources: function(){
        for( let i = 0; i < this.ressources.length ; i++){
            if (this.ressources[i].type == "metal"){
                document.getElementById('p' + this.ressources[i].name + 'Text').innerHTML = Math.floor(this.ressources[i].percent * this. size * aos.volumeRessources["metal"]);            
            }else if (this.ressources[i].name == "water"){
                document.getElementById('p' + this.ressources[i].name + 'Text').innerHTML = Math.floor(this.ressources[i].percent * this. size * aos.volumeRessources["liquid"]);            
            }

        }
    },

    showStoredRessources : function(){
        for ( let i = 0 ; i < this.ressourcesStored.length ; i++){
            let htmlVar = document.getElementById( this.ressourcesStored[i].name + 'Text');
            if ( htmlVar != null && typeof htmlVar !== "undefined"){
                htmlVar.innerHTML = this.ressourcesStored[i].quantity;
            }
        }
    },

    showStatsAir : function(){
        for( let i = 0; i < this.ressources.length ; i++){
            if ( this.ressources[i].type == "air"){
                document.getElementById('air' + this.ressources[i].name + 'Text').innerHTML = Math.floor(this.ressources[i].percent) + "%";            
            }
        }
    },


    showStatsLiquid : function(){
        for( let i = 0; i < this.ressources.length ; i++){
            if ( this.ressources[i].type == "liquid"){
                document.getElementById('liquid' + this.ressources[i].name + 'Text').innerHTML = Math.floor(this.ressources[i].percent) + "%";            
            }
        }
    },


    showStatsGround : function(){
        var metal=0;
        for( let i = 0; i < this.ressources.length ; i++){
            if ( this.ressources[i].type == "ground"){
                document.getElementById('ground' + this.ressources[i].name + 'Text').innerHTML = Math.floor(this.ressources[i].percent) + "%";            
            }else if ( this.ressources[i].type == "metal") metal += this.ressources[i].percent;
        }
        document.getElementById('groundmetalText').innerHTML = Math.floor(metal) + "%";            
    },

    showBuildings : function(){
        let buildingCount= {};
        for ( var i = 0 ; i < this.buildings.length ; i++){
            if (typeof buildingCount[this.buildings[i].name] === "undefined"){
                buildingCount[this.buildings[i].name] = { "building" : this.buildings[i], "count" : 1};    
            }else{
                buildingCount[this.buildings[i].name].count += 1;
            }
        }

        for (let elt in buildingCount){
            let table = document.getElementById(buildingCount[elt].building.type + "Buildings");
            let nbRows = table.rows.length;
            let found = null;
            for (let i =0 ; i <nbRows ; i++){
                if ( table.rows[i].cells[0].innerHTML == buildingCount[elt].building.name){
                    found = table.rows[i];
                    break;
                }
            }

            if (found == null){
                let row = table.insertRow(nbRows);
                let cell1 = row.insertCell(0);
                cell1.innerHTML = buildingCount[elt].building.name;
                let cell2 = row.insertCell(1);
                cell2.innerHTML = buildingCount[elt].count;
                let cell3 = row.insertCell(2);
                cell3.innerHTML = buildingCount[elt].building.functional ? "Enable" : "Disable";
                let cell4 = row.insertCell(3);
                cell4.innerHTML = buildingCount[elt].building.production.quantity;
            }else{
                found.cells[1].innerHTML = buildingCount[elt].count;
            }
        }
    },

    recalculatePercent : function(){
        for ( let i = 0 ; i < this.ressources.length ; i++){
            console.log(this.ressources[i].name + "//" + this.ressources[i].percent);
            this.ressources[i].percent = (  this.ressources[i].quantity) / ( 100* this. size * aos.volumeRessources[this.ressources[i].type]) * 100;
        }
        

    },


    showStats : function(){
        document.getElementById('populationTxt').innerHTML = this.population + " colons";    
        document.getElementById('healthingTxt').innerHTML = this.healtingIndicator + " %";    
        this.recalculatePercent();
        this.showPlanetRessources();
        this.showStoredRessources();
        this.showStatsAir();
        this.showStatsGround();
        this.showStatsLiquid();
        this.showBuildings();
    }

    
};
var instance = null;
window.onload = function () {
    instance = new aos.Planet();
    instance.generate();
};

window.setInterval(function(){
    instance.run(1);
},500);