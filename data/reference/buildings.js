aos.buildings = [
        {
            "type" : "mine",
            "name" : "metal Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "metal",
                "product" : "metal",
                "quantity" : 1000,
                "to" : "storage",
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "metal", "quantity" : 1000, "planetRessource" : true}
                ]
            },
            "storage" : 10000
        },
        {
            "type" : "mine",
            "name" : "coal Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "material",
                "product" : "carbon",
                "quantity" : 1000,
                "to" : "storage",
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "carbon", "quantity" : 500, "planetRessource" : true}
                ]
            },
            "storage" : 10000
        },
        {
            "type" : "mine",
            "name" : "fissile material Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 500
                    }
                ]
            },
            "produce" : {
                "type" : "material",
                "product" : "fissile material",
                "quantity" : 1000,
                "to" : "storage",
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "fissile material", "quantity" : 50, "planetRessource" : true}
                ]
            },
            "storage" : 10000
        },
        {
            "type" : "habitation",
            "name" : "house",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "population",
                "product" : "humans",
                "quantity" : 100,
                "to" : "storage",
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false, "remove" : true},
                    {"name" : "metal", "quantity" : 100, "planetRessource" : true , "remove" : true}
                ],
                "conditions" : [
                    {"name" : "oxygen", "percent" : 70, "planetRessource" : true}
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
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : "energy",
                "quantity" : 50
            },
            "storage" : 10000
        },
        {
            "type" : "plant",
            "name" : "coal plant",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 300
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : "energy",
                "quantity" : 100,
                "require" : [
                    { "name" : "carbon", "quantity" : "500"}
                ]
            },
            "storage" : 10000
        },
        {
            "type" : "plant",
            "name" : "nuclear plant",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 500
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : "energy",
                "quantity" : 200,
                "require" : [
                    { "name" : "fissile material", "quantity" : "300"}
                ]
            },
            "storage" : 10000
        },
        {
            "type" : "epurateur",
            "name" : "CO2 epuration",
            "require" : {
                "space" :10,
                "materials":[{"name" : "metal","quantity":50}]
            },
            "produce" : {
                "type" : "air",
                "product" : "oxygen",
                "quantity" : 100,
                "to" : "planet",
                "require" : [
                                {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                                {"name" : "oxocarbon", "quantity" : 50, "planetRessource" : true}
                            ]
            }
        },
        {
            "type" : "epurateur",
            "name" : "inert gaz epuration",
            "require" : {
                "space" :10,
                "materials":[{"name" : "metal","quantity":50}]
            },
            "produce" : {
                "type" : "air",
                "product" : "oxygen",
                "quantity" : 100,
                "to" : "planet",
                "require" : [
                                {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                                {"name" : "inert gases", "quantity" : 50, "planetRessource" : true},
                                {"name" : "fissile material", "quantity" : 50, "planetRessource" : false}
                            ]
            }
        }
    ]
;