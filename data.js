/* San-Van: jeden zdroj údajov pre všetky stránky (D-023). Na webe ich bude dodávať CMS. */
window.SANVAN = {
  lessons: [
    {
      "id": "pil",
      "name": "Pilates",
      "trainer": "Magda",
      "with": "s Magdou",
      "price": "3,50 €",
      "priceChanged": "2026-02-01",
      "minutes": 60,
      "card": {
        "photo": "assets/gal-16.jpg",
        "alt": "Cvičenie v telocvični fitclubu"
      },
      "slots": [
        [
          "mo",
          "17:00"
        ],
        [
          "we",
          "17:00"
        ]
      ],
      "desc": "Pomáha zbaviť sa bolesti chrbta a posilňuje chrbát, brucho a svaly panvového dna. Prináša ohybné telo, rovný chrbát a dobrý pocit z pohybu."
    },
    {
      "id": "cyc",
      "name": "Indoor cycling",
      "trainer": "Gabika",
      "with": "s Gabikou",
      "price": "3,50 €",
      "priceChanged": "2026-02-01",
      "minutes": 60,
      "card": {
        "photo": "assets/fit-18.jpg",
        "alt": "Skupinová lekcia indoor cyclingu vo fitclube"
      },
      "slots": [
        [
          "tu",
          "17:00"
        ],
        [
          "th",
          "17:00"
        ]
      ],
      "desc": "Skupinová jazda na stacionárnych bicykloch v rytme hudby. Záťaž si nastavujete sami, takže tempo zvládnu začiatočníci aj pokročilí."
    },
    {
      "id": "kal",
      "name": "Kalanetika",
      "trainer": "Janka",
      "with": "s Jankou",
      "price": "3,50 €",
      "priceChanged": "2026-02-01",
      "minutes": 60,
      "card": {
        "photo": "assets/gal-17.jpg",
        "alt": "Skupinové cvičenie v telocvični fitclubu"
      },
      "slots": [
        [
          "tu",
          "8:15"
        ],
        [
          "fr",
          "8:15"
        ]
      ],
      "desc": "Pomalé a presné cviky s malým rozsahom pohybu. Posilňujú hlboké svaly brucha, stehien a zadku a sú šetrné ku kĺbom."
    },
    {
      "id": "seb",
      "name": "Sebaobrana",
      "legend": "Kurz sebaobrany",
      "trainer": "Braňo",
      "with": "s Braňom",
      "price": "10 €",
      "priceChanged": "2026-02-01",
      "minutes": 90,
      "unit": "1 lekcia",
      "card": {},
      "slots": [
        [
          "mo",
          "18:15"
        ],
        [
          "we",
          "18:15"
        ]
      ],
      "desc": "Boj neprebieha len na ulici, ale aj v živote. Kurz spája bojové techniky, silový tréning, čínsku filozofiu a modernú psychológiu."
    },
    {
      "id": "box",
      "name": "Box",
      "with": "s trénerom",
      "phone": "0905 787 930",
      "card": {
        "photo": "assets/lekcia-box.jpg",
        "alt": "Miestnosť na box vo fitclube"
      },
      "slots": [],
      "desc": "Individuálny tréning boxu s trénerom. Termín si dohodnete priamo s ním po telefóne."
    }
  ],
  hours: {
    "fitclub": {
      "days": {
        "mo": [
          [
            "8:00",
            "12:00"
          ],
          [
            "13:00",
            "20:00"
          ]
        ],
        "tu": [
          [
            "8:00",
            "12:00"
          ],
          [
            "13:00",
            "20:00"
          ]
        ],
        "we": [
          [
            "8:00",
            "12:00"
          ],
          [
            "13:00",
            "20:00"
          ]
        ],
        "th": [
          [
            "8:00",
            "12:00"
          ],
          [
            "13:00",
            "20:00"
          ]
        ],
        "fr": [
          [
            "8:00",
            "12:00"
          ],
          [
            "13:00",
            "20:00"
          ]
        ],
        "sa": [
          [
            "9:00",
            "12:00"
          ]
        ],
        "su": []
      },
      "holiday": [
        [
          "9:00",
          "12:00"
        ],
        [
          "15:00",
          "19:00"
        ]
      ],
      "notes": [
        "Obedňajšia prestávka 12:00–13:00.",
        "Posledný vstup 50 minút pred zatvorením."
      ]
    },
    "sauna": {
      "seasons": [
        {
          "name": "Letný režim",
          "short": "Leto",
          "from": "07-01",
          "to": "09-02",
          "days": {
            "mo": [],
            "tu": [],
            "we": [],
            "th": [
              [
                "15:00",
                "21:00",
                "mix"
              ]
            ],
            "fr": [],
            "sa": [],
            "su": [
              [
                "17:00",
                "21:00",
                "mix"
              ]
            ]
          }
        },
        {
          "name": "Zimný režim",
          "short": "Zima",
          "from": "09-03",
          "to": "06-30",
          "days": {
            "mo": "res",
            "tu": "res",
            "we": "res",
            "th": [
              [
                "15:00",
                "21:00",
                "mix"
              ]
            ],
            "fr": [
              [
                "15:00",
                "21:00",
                "ženy"
              ]
            ],
            "sa": [
              [
                "15:00",
                "21:00",
                "mix"
              ]
            ],
            "su": [
              [
                "15:00",
                "21:00",
                "mix"
              ]
            ]
          }
        }
      ],
      "notes": [
        "Posledný vstup 90 minút pred zatvorením."
      ]
    }
  },
  /* Cenník fitclubu. Každá cena má dátum poslednej zmeny (changed); „Platí od" na webe je najnovší z nich
     (vrátane cien lekcií vyššie). Dátum 1. 2. 2026 je zo súčasného webu a platí pre celý cenník. */
  prices: {
    fitclub: {
      /* vypínač „Som študent alebo dôchodca" v cenníku; for = cena pre skupinu (stu študenti, sen dôchodcovia): { price } pevná cena, { pct } zľava v percentách.
         Študenti = držitelia ISIC, ITIC, EYCA. Že −10 % pre nich platí na obe 6-mesačné permanentky (30 aj 50 vstupov),
         je predpoklad: súčasný web píše „z vybraných permanentiek s platnosťou 6 mesiacov" (OQ-31). */
      discount: { label: "Som študent alebo dôchodca" },
      club: { name: "Klubový preukaz", price: 2, changed: "2026-02-01", for: { stu: { price: 0 } } },
      plans: [
        { name: "Jednorazový vstup", price: 3.5, changed: "2026-02-01", per: "1 vstup", items: ["Max. 2 h + 15 min", "Pri prvom vstupe doklad", "Bez klubového preukazu"], cta: "Prísť zacvičiť" },
        { name: "10 vstupov", price: 33, changed: "2026-02-01", entries: 10, hint: "Lacnejšie ako jednotlivé vstupy", items: ["Platí 3 mesiace", "Max. 2 h + 15 min na vstup", "Potrebný klubový preukaz"], cta: "Kúpiť na recepcii" },
        { name: "Mesačná", price: 38, changed: "2026-02-01", tag: "Favorit", hot: true, student: { price: 31, changed: "2026-02-01" }, for: { stu: { price: 31 } }, items: ["Platí 1 mesiac", "Max. 2 h + 15 min na vstup", "Potrebný klubový preukaz"], cta: "Kúpiť na recepcii" },
        { name: "50 vstupov", price: 100, changed: "2026-02-01", entries: 50, for: { stu: { pct: 10 }, sen: { pct: 10 } }, items: ["Platí 6 mesiacov", "Max. 2 h + 15 min na vstup", "Potrebný klubový preukaz"], cta: "Kúpiť na recepcii" }
      ],
      rows: [
        [
          { name: "Klubový preukaz", note: "potrebný na permanentky", ref: "club" },
          { name: "20 vstupov", note: "platí 3 mesiace", price: 55, changed: "2026-02-01" },
          { name: "30 vstupov", note: "platí 6 mesiacov", price: 73, changed: "2026-02-01", for: { stu: { pct: 10 }, sen: { pct: 10 } } }
        ],
        [
          { name: "Štvrťročná permanentka", price: 65, changed: "2026-02-01" }
        ]
      ]
    },
    /* Cenník sauny (D-023). Zdroj: sauna.sanvan.sk/cennik.php. Dátum platnosti cien zatiaľ neznámy, preto bez „Platí od". */
    sauna: {
      discount: { label: "Som dôchodca" },
      single: 16,
      groups: [
        { title: "Vstupy", rows: [
          { name: "Vstup do sauny", note: "2 hodiny", price: 16 },
          { name: "Predĺženie o 2 hodiny", note: "účtuje sa už pri začatej hodine navyše", price: 6 },
          { name: "Dieťa do 10 rokov", price: 5 },
          { name: "10 vstupov", note: "platí 3 mesiace", price: 110, entries: 10, for: { sen: { pct: 10 } } }
        ] },
        { title: "Masáže", rows: [
          { name: "Masáž 30 minút", note: "klasická, relaxačná alebo banková", price: 15 },
          { name: "Masáž 45 minút", price: 21 },
          { name: "Masáž 60 minút", price: 25 }
        ] },
        { title: "Požičanie", rows: [
          { name: "Osuška alebo plachta", price: 2 }
        ] }
      ],
      group: { price: 90, hours: 2, max: 20 }
    }
  }
};
