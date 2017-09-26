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
                "to" : "storage",
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "iron", "quantity" : 10000, "planetRessource" : true}
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
                "to" : "storage",
                "require" : [
                                {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                                {"name" : "copper", "quantity" : 10000, "planetRessource" : true}
                            ]
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
                "to" : "planet",
                "require" : [
                                {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                                {"name" : "carbon", "quantity" : 50, "planetRessource" : true}
                            ]
            }

        }
    ]
;