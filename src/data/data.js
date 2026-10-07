const stack = [
    {
        id: 1,
        title: "Frontend",
        items: ["React", "JavaScript", "CSS", "Tailwind", "Bootstrap", "Vite"]
    },
    {
        id: 2,
        title: "Backend",
        items: ["Node", "Express", "Php", "Laravel", "Rest API"]
    },
    {
        id: 3,
        title: "Database",
        items: ["Mysql", "Sqlite"]
    },
    {
        id: 4,
        title: "Cms",
        items: ["Wordpress"]
    },
]

const formazione = [
    {
        id: 1,
        title: "Boolean",
        items: ["Web Development", "Online", "2026"]
    },
    {
        id: 2,
        title: "Isgmd Design Academy",
        items: ["Graphic Design", "Lecco", "2010 2012"]
    },
    {
        id: 3,
        title: "Accademia di Brera",
        items: ["Scultura", "Milano", "2007 2009"]
    },
    {
        id: 4,
        title: "Liceo Artistico",
        items: ["Architettura", "Lecco", "2002 2006"]
    },
]

const esperienza = [
    {
        id: 1,
        title: "Agostani Caffè",
        items: ["Graphic designer", "Frontend developer", "Molteno", "2022 2025"]
    },
    {
        id: 2,
        title: "Studiolabo",
        items: ["Frontend developer", "Milano", "2020 2022"]
    },
    {
        id: 3,
        title: "Ardesia Studio",
        items: ["Co Founder", "Graphic Designer", "Bergamo", "2014 2019"]
    },
    {
        id: 4,
        title: "Office Milano",
        items: ["Graphic Designer", "Milano", "2012"]
    },
    {
        id: 5,
        title: "Oikos",
        items: ["Graphic Designer", "Monza", "2011"]
    },
]

const work = [
    {
        id: 1,
        title: "Websites",
        items: [
            {
                id: 1,
                title: "run-club.dev",
                description: `
                Applicazione full stack con frontend in React e backend in Laravel, comunicanti tramite API RESTful.Ho implementato l'autenticazione degli utenti con Laravel Sanctum, progettato lo schema relazionale su MySQL e gestito migrazioni e relazioni tra entità con Eloquent ORM, strutturando gli endpoint secondo un'architettura MVC.
                `,
                url: "https://github.com/odon-airoldi/run-club-api"
            },
            {
                id: 2,
                title: "tuttocialde.it",
                description: `
                Redesign UI di un e-commerce basato su nopCommerce. Ho sviluppato i template frontend in HTML e CSS e li ho integrati nelle view Razor della piattaforma, adattando il layout ai componenti nativi di catalogo, carrello e checkout.
                `,
                url: "https://github.com/odon-airoldi/run-club-api"
            },
            {
                id: 3,
                title: "caffeagostani.com",
                description: `
                Sviluppo frontend da zero di un e-commerce su nopCommerce. Ho convertito il design in template HTML e CSS responsive e li ho integrati nelle view Razor, collegandoli ai componenti e ai dati gestiti dalla piattaforma.        `,
                url: "https://github.com/odon-airoldi/run-club-api"
            },
            {
                id: 4,
                title: "geomont.com",
                description: `
                Sito corporate su WordPress con tema custom sviluppato da zero. Ho strutturato i template secondo la template hierarchy di WordPress e implementato in JavaScript un layout a griglia dinamico per la presentazione grafica dei contenuti.
                `,
                url: "https://github.com/odon-airoldi/run-club-api"
            },
            {
                id: 5,
                title: "essense-mag.com",
                description: `
                Portale editoriale su WordPress con tema custom sviluppato da zero. Ho implementato i template per articoli, categorie e archivi secondo la template hierarchy, ottimizzando la presentazione dei contenuti e l'integrazione con il flusso editoriale del CMS.
                `,
                url: "https://github.com/odon-airoldi/run-club-api"
            },
            {
                id: 6,
                title: "studiolops.it",
                description: `
                Sito per uno studio fotografico su WordPress con tema custom sviluppato da zero. Ho realizzato template dedicati alla presentazione di gallerie e contenuti visivi, con layout responsive e gestione delle immagini integrata nel CMS.
                `,
                url: "https://github.com/odon-airoldi/run-club-api"
            }
        ]
    },
    {
        id: 2,
        title: "Designs",
        items: [
            {
                id: 11,
                title: "Tenuta Casa Virginia",
                description: "description 1",
                gallery: [
                    "https://placehold.co/960x480?text=uno",
                    "https://placehold.co/960x480?text=due",
                    "https://placehold.co/960x480?text=tre"
                ]
            },
            {
                id: 12,
                title: "Le Corne",
                description: "description 2",
                gallery: [
                    "https://placehold.co/960x480?text=uno",
                    "https://placehold.co/960x480?text=due",
                    "https://placehold.co/960x480?text=tre"
                ]
            },
            {
                id: 13,
                title: "Nove Lune",
                description: "description 3",
                gallery: [
                    "https://placehold.co/960x480?text=uno",
                    "https://placehold.co/960x480?text=due",
                    "https://placehold.co/960x480?text=tre"
                ]
            },
            {
                id: 14,
                title: "Bergamo Sposi",
                description: "description 4",
                gallery: [
                    "https://placehold.co/960x480?text=uno",
                    "https://placehold.co/960x480?text=due",
                    "https://placehold.co/960x480?text=tre"
                ]
            },
            {
                id: 15,
                title: "Ca Alta",
                description: "description 5",
                gallery: [
                    "https://placehold.co/960x480?text=uno",
                    "https://placehold.co/960x480?text=due",
                    "https://placehold.co/960x480?text=tre"
                ]
            },
        ]
    },
]

export { stack, formazione, esperienza, work }
