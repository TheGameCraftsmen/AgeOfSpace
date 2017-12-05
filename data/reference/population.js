var aos = aos || {};

aos.resources = 
[
    {
        "name" : "bacteria",
        "population" : 1000,
        "food" : [{"name" : "oxocarbon","quantity":500,"planetResource": true}],
        "yield" : [{"name":"oxygen","quantity":1000,"to":"planet"}],
        "survival" : [{"name":"fresh water","quantity":300,"planetResource": true}],
        "growth" : [{"name":"luminosity","quantity":70,"planetResource": true}]
    }
]