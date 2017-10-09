aos.buildings = [
        {
            "type" : "mine",
            "name" : "metal Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "type" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "metal",
                "product" : "metal",
                "quantity" : 10000,
                "to" : "storage",
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "metal", "quantity" : 10000, "planetRessource" : true}
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
                        "type" :"metal",
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
                "materials":[{"type" : "metal","quantity":50}]
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