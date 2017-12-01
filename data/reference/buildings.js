var aos = aos || {};

aos.buildings = [
    {
        "type": "mine",
        "name": "Metal mine",
        "svgCode": "M365.906 60.844C347.218 62.03 327.732 73.3 307.72 87.5c-20.814 14.77-41.852 32.27-64.626 41.875a8 8 0 0 1-9.125-2.125c-15.01-17.31-38.15-30.55-73.22-27.28-19.124 1.78-32.252 10.625-43.688 23.655-5.264 6-9.998 12.975-14.53 20.375h322.624c-15.21-29.846-29.05-64.182-59.25-83.156zM40 160v44h416v-44H40zm18.375 60l49.344 186.563H118c3.087-6.592 7.31-12.684 12.563-17.938 11.916-11.916 28.63-18.906 45.843-18.906 17.214 0 33.897 6.99 45.813 18.905 5.252 5.254 9.467 11.346 12.56 17.938h42.97c3.104-6.47 7.282-12.44 12.406-17.563 11.927-11.926 28.384-18.75 45.25-18.75 16.867 0 33.324 6.824 45.25 18.75 5.124 5.124 9.303 11.092 12.406 17.563h6.032L438.156 220H58.376zM426.22 355l-6.064 29H456v-29h-29.78zm-249.814 31.563c-11.69 0-23.728 4.915-32.25 13.437-8.522 8.522-13.75 21.002-13.75 33.344 0 12.34 5.228 24.82 13.75 33.344 8.522 8.522 20.56 13.437 32.25 13.437 11.69 0 23.697-4.915 32.22-13.438 8.52-8.522 13.78-21.002 13.78-33.343 0-12.342-5.26-24.822-13.78-33.344-8.523-8.522-20.53-13.438-32.22-13.438zm159 1.28c-12.037 0-24.3 5.083-32.812 13.594C294.082 409.95 289 422.212 289 434.25c0 12.038 5.082 24.3 13.594 32.813 8.512 8.51 20.775 13.593 32.812 13.593 12.038 0 24.3-5.082 32.813-13.594 8.51-8.51 13.592-20.774 13.592-32.812 0-12.038-5.08-24.3-13.593-32.813-8.513-8.51-20.776-13.593-32.814-13.593z",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "metal",
                    "quantity": 1000,
                    "to": "storage"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 100,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "metal",
                    "quantity": 1000,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "mine",
        "name": "Fissile Material mine",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "fissile material",
                    "quantity": 1000,
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "fissile material",
                    "quantity": 50,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "Factory",
        "name": "Bacteria factory",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "bacteria",
                    "quantity": 1000,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "water",
                    "quantity": 1000,
                    "planetResource": true
                },
                {
                    "name": "mineral",
                    "quantity": 1000,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "water" }]
    },
    {
        "type": "habitation",
        "name": "House",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "humans",
                    "quantity": 100,
                    "to": "planet"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 500,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true,
                    "remove": true
                },
                {
                    "name": "metal",
                    "quantity": 100,
                    "planetResource": true,
                    "remove": true
                }
            ],
            "conditions": [
                {
                    "name": "oxygen",
                    "percent": 70,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "habitation",
        "name": "Floating house",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "humans",
                    "quantity": 50,
                    "to": "planet"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 300,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 200,
                    "planetResource": true,
                    "remove": true
                },
                {
                    "name": "metal",
                    "quantity": 100,
                    "planetResource": true,
                    "remove": true
                }
            ],
            "conditions": [
                {
                    "name": "oxygen",
                    "percent": 70,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "water" }]
    },
    {
        "type": "plant",
        "name": "Solar plant",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "to": "planet"
                }
            ]
        },
        "location": [
            { "name": "ground" },
            { "name": "water" }
        ]
    },
    {
        "type": "plant",
        "name": "Nuclear plant",
        "svgCode": "M13.447 18l4.826 20.656c17.47 32.683 68.819 20.747 94.545-1.635-14.136 38.399-65.72 49.25-95.964 26.354-.794 11.045 1.01 18.688 4.326 23.547 4.729 6.93 13.658 10.949 30.021 11.203l12.475.193-4.12 11.778c-5.347 15.288-4.928 23.375-1.91 28.478 1.975 3.337 6.034 6.533 12.678 9.545 40.193-8.27 83.572-9.067 121.676-9.119 28.214 0 56.41 1.001 79.78 3.033 23.37 2.032 41.025 4.306 52.245 9.916 10.816 5.781 25.574 5.525 36.207 3.994 9.222-1.415 16.325-4.613 21.387-10.853 3.954-4.874 7.015-12.152 7.9-23.31-33.606 4.231-67.935-8.9-76.294-47.872 40.54 37.963 82.92 42.849 131.005 16.412 11.444-6.49 18.25-14.805 20.485-27.605l1.392-7.975 8.079.543c7.79.524 14.336.366 19.814-.267V18h-21.979c-20.534 43.036-74.988 67.68-115.3 21.922 29.23 13.223 71.841 14.87 94.744-21.922H13.447zm270.645 29.957c-7.744 21.146-22.92 44.73-47.414 51.688-26.23 34.754-92.726 38.651-119.86-17.305 20.443 24.144 61.662 34.958 91.328 17.668-27.204-8.009-48.057-46.875-46.736-47.535 0 2.077 41.737 29.713 57.897 29.654 25.989.029 43.257-14.207 64.785-34.17zM494 72.945c-4.196.368-8.676.507-13.467.412-4.623 14.341-14.644 25.372-27.422 32.62-12.914 7.325-28.605 11.249-45.64 13.244-.675 15.828-4.645 28.298-11.873 37.209-8.483 10.457-20.558 15.453-32.637 17.306-12.578 1.93-25.722.924-37.504-.76a236.7 236.7 0 0 0-4.86 21.258C338.19 192.74 359.193 192 380.23 192c21.401 0 42.782.76 60.555 2.309 16.293 1.419 28.797 2.843 37.914 6.648 5.832-1.888 11.047-3.878 15.301-6.03v-22.613c-24.68 10.243-52.42 3.068-67.861-28.8 16.333 12.485 44.326 23.76 67.861 8.746V72.945zM192 157c-40.75 1.88-77.826-.767-116.965 8.832 28.05 96.266-1.687 216.838-32.195 309.791 11.247 5.175 30.635 10.198 53.91 13.465C124.683 493.008 158.353 495 192 495s67.317-1.992 95.25-5.912c23.275-3.267 42.663-8.29 53.91-13.465-30.508-92.953-60.246-213.525-32.195-309.791-8.367-2.095-22.342-4.439-38.744-5.865C247.59 157.999 219.786 157 192 157zm188.23 53c-20.97 0-41.962.757-58.994 2.24-1.125.098-2.22.207-3.308.317-8.896 79.06 12.998 172.267 37.445 248.76 8.189.323 16.517.501 24.857.501 25.373 0 50.765-1.507 71.762-4.459 16.35-2.298 30.045-5.83 38.403-9.298-22.686-69.604-44.617-159.096-24.422-231.875-6.263-1.396-15.673-2.981-26.748-3.946-17.032-1.483-38.023-2.24-58.995-2.24zm-141.335 28.21c29.289 17.126 45.21 48.33 44.464 80.056l-61.252-6c-.43-7.908-4.625-15.474-11.837-19.84l28.625-54.215zm-92.956 1.12l27.79 52.514a24.504 24.504 0 0 0-9.616 9.347 24.489 24.489 0 0 0-3.258 11.075l-57.384 6c-.42-16.048 3.166-32.448 11.78-47.37 7.723-13.372 18.408-23.987 30.688-31.566zm45.895 64.092c3.515.034 5.522.778 7.762 2.07a16.161 16.161 0 0 1 5.933 22.162 16.144 16.144 0 0 1-22.146 5.934 16.165 16.165 0 0 1-5.947-22.162c2.815-4.876 8.244-7.778 12.794-7.975a30.402 30.402 0 0 1 1.604-.03zm12.478 43.203l31.467 48.578c-13.778 7.362-29.255 11.298-44.92 10.89-14.368-.372-28.682-4.176-42.029-11.782l30.828-47.12c7.95 4.349 17.346 3.852 24.655-.566z",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "energy",
                    "quantity": 200,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "fissile material",
                    "quantity": "300"
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "epurateur",
        "name": "CO2 epuration",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 50
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "oxygen",
                    "quantity": 300,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "oxocarbon",
                    "quantity": 50,
                    "planetResource": true
                }
            ]
        },
        "location": [
            { "name": "ground" },
            { "name": "water" }
        ]
    },
    {
        "type": "farm",
        "name": "Crops farm",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 50
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "plants",
                    "quantity": 100,
                    "to": "planet"
                },
                {
                    "name": "oxygen",
                    "quantity": 300,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "oxocarbon",
                    "quantity": 10,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "ship",
        "name": "Colonization shuttle",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 50
            }
        ],
        "produce": {
            "product": [
                {
                    "name": "ship",
                    "quantity": 0,
                }
            ],
            "require": [
            ]
        },
        "location": [{ "name": "ground" }]
    }
];
