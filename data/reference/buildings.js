aos.buildings = [
        {
            "type" : "mine",
            "name" : "iron Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "type" :"iron",
                        "quantity" : 100
                    },
                    {
                        "type" : "wood",
                        "quantity" : 30
                    }
                ]
            },
            "produce" : {
                "type" : "metal",
                "product" : "iron",
                "quantity" : 100,
                "from" : "iron",
                "to" : "storage",
                "require" : [
                    {"name":"energy", "quantity": 50, "planetRessource" : false},
                    {"name":"iron", "quantity": 100, "planetRessource" : true}
                ]
            },
            "storage" : 10000
        },
        {
            "type" : "mine",
            "name" : "copper Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "type" :"iron",
                        "quantity" : 100
                    },
                    {
                        "type" : "wood",
                        "quantity" : 30
                    }
                ]
            },
            "produce" : {
                "type" : "metal",
                "product" : "copper",
                "quantity" : 100,
                "from" : "copper",
                "to" : "storage",
                "require" : [{"name":"energy", "quantity":"50", "planetRessource" : false}]
            },
            "storage" : 10000
        },
        {
            "type" : "plant",
            "name" : "solar plant",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "type" :"iron",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : "energy",
                "quantity" : 100
            },
            "storage" : 10000
        },
        {
            "type" : "spatioport",
            "name" : "spatioport",
            "require" : {
                "space" : 50,
                "materials" : [
                    {"type" : "iron", "quantity" : 1000}
                ]
            },
            "produce" : [
                {
                    "type" : "transport",
                    "name" : "transport SpaceShip",
                    "require" : {
                        "materials" : { "type":"iron","quantity" : 300}
                    }
                },
                {
                    "type" : "colon",
                    "name" : "colon SpaceShip",
                    "require" : {
                        "materials" : { "type" : "iron", "quantity" : 400}
                    }
                }
            ]
        },{
            "type" : "habitation",
            "name" : "habitation",
            "require" : {
                "space" :10,
                "materials":[{"type" : "iron","quantity":50},{"type": "wood","quantity":20}]
            },
            "produce":{"people" : 300000}

        },
        {
            "type" : "epurateur",
            "name" : "CO2 epuration",
            "require" : {
                "space" :10,
                "materials":[{"type" : "iron","quantity":50},{"type": "wood","quantity":20}]
            },
            "produce" : {
                "type" : "air",
                "product" : "oxygen",
                "quantity" : 100,
                "from" : "carbon",
                "to" : "planet",
                "require" : [{"name":"energy", "quantity":"50", "planetRessource" : false}]
            }

        }
    ]
;