// Fixtures for the live vote feed (get_live_vote_results).
// FINISHED_FEED and NOT_STARTED_FEED are trimmed copies of the real VoteInfo files
// for 2026-06-14 and 2026-09-27: four cantons per vote, no districts or communes.
// COUNTING_FEED is synthetic: no in-progress file was available when this was
// written, so it is the not-started file with numbers filled in the way the
// finished one shows them. Re-check it against a real file from a voting Sunday.

export const FINISHED_FEED = {
  "abstimmtag": "20260614",
  "timestamp": "2026-06-23T15:50:54",
  "schweiz": {
    "geoLevelnummer": 0,
    "geoLevelname": "Schweiz",
    "nochKeineInformation": false,
    "vorlagen": [
      {
        "vorlagenId": 6860,
        "reihenfolgeAnzeige": 6860,
        "vorlagenTitel": [
          {
            "langKey": "de",
            "text": "Volksinitiative «Keine 10-Millionen-Schweiz! (Nachhaltigkeitsinitiative)»"
          },
          {
            "langKey": "fr",
            "text": "Initiative populaire «Pas de Suisse à 10 millions ! (initiative pour la durabilité)»"
          },
          {
            "langKey": "en",
            "text": "Popular initiative: 'No to Switzerland of 10 million! (Sustainability Initiative)'"
          }
        ],
        "vorlageBeendet": true,
        "provisorisch": true,
        "vorlageAngenommen": false,
        "vorlagenArtId": 3,
        "hauptvorlagenId": null,
        "reserveInfoText": null,
        "doppeltesMehr": true,
        "staende": {
          "jaStaendeGanz": 8,
          "neinStaendeGanz": 12,
          "anzahlStaendeGanz": 20,
          "jaStaendeHalb": 4,
          "neinStaendeHalb": 2,
          "anzahlStaendeHalb": 6
        },
        "resultat": {
          "gebietAusgezaehlt": true,
          "jaStimmenInProzent": 45.209280268,
          "jaStimmenAbsolut": 1492857,
          "neinStimmenAbsolut": 1809246,
          "stimmbeteiligungInProzent": 58.859948637,
          "eingelegteStimmzettel": 3336837,
          "anzahlStimmberechtigte": 5669113,
          "gueltigeStimmen": 3302103
        },
        "kantone": [
          {
            "geoLevelnummer": "1",
            "geoLevelname": "Zürich",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 39.971638109,
              "jaStimmenAbsolut": 238179,
              "neinStimmenAbsolut": 357691,
              "stimmbeteiligungInProzent": 61.018680766,
              "eingelegteStimmzettel": 599644,
              "anzahlStimmberechtigte": 982722,
              "gueltigeStimmen": 595870
            }
          },
          {
            "geoLevelnummer": "2",
            "geoLevelname": "Bern / Berne",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 44.60321522,
              "jaStimmenAbsolut": 198710,
              "neinStimmenAbsolut": 246796,
              "stimmbeteiligungInProzent": 59.937889444,
              "eingelegteStimmzettel": 448348,
              "anzahlStimmberechtigte": 748021,
              "gueltigeStimmen": 445506
            }
          },
          {
            "geoLevelnummer": "3",
            "geoLevelname": "Luzern",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 49.010203192,
              "jaStimmenAbsolut": 89920,
              "neinStimmenAbsolut": 93552,
              "stimmbeteiligungInProzent": 64.129871565,
              "eingelegteStimmzettel": 185647,
              "anzahlStimmberechtigte": 289486,
              "gueltigeStimmen": 183472
            }
          },
          {
            "geoLevelnummer": "4",
            "geoLevelname": "Uri",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 59.902787538,
              "jaStimmenAbsolut": 10229,
              "neinStimmenAbsolut": 6847,
              "stimmbeteiligungInProzent": 63.496549699,
              "eingelegteStimmzettel": 17299,
              "anzahlStimmberechtigte": 27244,
              "gueltigeStimmen": 17076
            }
          }
        ]
      },
      {
        "vorlagenId": 6870,
        "reihenfolgeAnzeige": 6870,
        "vorlagenTitel": [
          {
            "langKey": "de",
            "text": "Änderung des Bundesgesetzes über den zivilen Ersatzdienst (Zivildienstgesetz, ZDG)"
          },
          {
            "langKey": "fr",
            "text": "Modification de la loi fédérale sur le service civil (LSC)"
          },
          {
            "langKey": "en",
            "text": "Amendment to the Civilian Service Act"
          }
        ],
        "vorlageBeendet": true,
        "provisorisch": true,
        "vorlageAngenommen": true,
        "vorlagenArtId": 2,
        "hauptvorlagenId": null,
        "reserveInfoText": null,
        "doppeltesMehr": false,
        "staende": {
          "jaStaendeGanz": 15,
          "neinStaendeGanz": 5,
          "anzahlStaendeGanz": 20,
          "jaStaendeHalb": 5,
          "neinStaendeHalb": 1,
          "anzahlStaendeHalb": 6
        },
        "resultat": {
          "gebietAusgezaehlt": true,
          "jaStimmenInProzent": 52.458466009,
          "jaStimmenAbsolut": 1690622,
          "neinStimmenAbsolut": 1532160,
          "stimmbeteiligungInProzent": 58.264493934,
          "eingelegteStimmzettel": 3303080,
          "anzahlStimmberechtigte": 5669113,
          "gueltigeStimmen": 3222782
        },
        "kantone": [
          {
            "geoLevelnummer": "1",
            "geoLevelname": "Zürich",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 49.80705194,
              "jaStimmenAbsolut": 288081,
              "neinStimmenAbsolut": 290313,
              "stimmbeteiligungInProzent": 60.072533229,
              "eingelegteStimmzettel": 590346,
              "anzahlStimmberechtigte": 982722,
              "gueltigeStimmen": 578394
            }
          },
          {
            "geoLevelnummer": "2",
            "geoLevelname": "Bern / Berne",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 50.189213247,
              "jaStimmenAbsolut": 219894,
              "neinStimmenAbsolut": 218236,
              "stimmbeteiligungInProzent": 59.92131237,
              "eingelegteStimmzettel": 448224,
              "anzahlStimmberechtigte": 748021,
              "gueltigeStimmen": 438130
            }
          },
          {
            "geoLevelnummer": "3",
            "geoLevelname": "Luzern",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 56.876531194,
              "jaStimmenAbsolut": 101685,
              "neinStimmenAbsolut": 77097,
              "stimmbeteiligungInProzent": 63.148131516,
              "eingelegteStimmzettel": 182805,
              "anzahlStimmberechtigte": 289486,
              "gueltigeStimmen": 178782
            }
          },
          {
            "geoLevelnummer": "4",
            "geoLevelname": "Uri",
            "resultat": {
              "vorlageBeendet": true,
              "gebietAusgezaehlt": true,
              "jaStimmenInProzent": 56.941563987,
              "jaStimmenAbsolut": 9335,
              "neinStimmenAbsolut": 7059,
              "stimmbeteiligungInProzent": 61.57686096,
              "eingelegteStimmzettel": 16776,
              "anzahlStimmberechtigte": 27244,
              "gueltigeStimmen": 16394
            }
          }
        ]
      }
    ]
  }
};

export const NOT_STARTED_FEED = {
  "abstimmtag": "20260927",
  "timestamp": "2026-08-24T12:10:57",
  "schweiz": {
    "geoLevelnummer": 0,
    "geoLevelname": "Schweiz",
    "nochKeineInformation": false,
    "vorlagen": [
      {
        "vorlagenId": 6880,
        "reihenfolgeAnzeige": 6880,
        "vorlagenTitel": [
          {
            "langKey": "de",
            "text": "Volksinitiative «Wahrung der schweizerischen Neutralität (Neutralitätsinitiative)»"
          },
          {
            "langKey": "fr",
            "text": "Initiative populaire « Sauvegarder la neutralité suisse (initiative sur la neutralité) »"
          },
          {
            "langKey": "en",
            "text": "Popular Initiative 'Safeguard Swiss neutrality (Neutrality Initiative)'"
          }
        ],
        "vorlageBeendet": false,
        "provisorisch": true,
        "vorlageAngenommen": null,
        "vorlagenArtId": 3,
        "hauptvorlagenId": null,
        "reserveInfoText": null,
        "doppeltesMehr": true,
        "staende": {
          "jaStaendeGanz": null,
          "neinStaendeGanz": null,
          "anzahlStaendeGanz": null,
          "jaStaendeHalb": null,
          "neinStaendeHalb": null,
          "anzahlStaendeHalb": null
        },
        "resultat": {
          "gebietAusgezaehlt": false,
          "jaStimmenInProzent": null,
          "jaStimmenAbsolut": null,
          "neinStimmenAbsolut": null,
          "stimmbeteiligungInProzent": null,
          "eingelegteStimmzettel": null,
          "anzahlStimmberechtigte": null,
          "gueltigeStimmen": null
        },
        "kantone": [
          {
            "geoLevelnummer": "1",
            "geoLevelname": "Zürich",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          },
          {
            "geoLevelnummer": "2",
            "geoLevelname": "Bern / Berne",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          },
          {
            "geoLevelnummer": "3",
            "geoLevelname": "Luzern",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          },
          {
            "geoLevelnummer": "4",
            "geoLevelname": "Uri",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          }
        ]
      },
      {
        "vorlagenId": 6890,
        "reihenfolgeAnzeige": 6890,
        "vorlagenTitel": [
          {
            "langKey": "de",
            "text": "Volksinitiative «Für eine sichere Ernährung – durch Stärkung einer nachhaltigen inländischen Produktion, mehr pflanzliche Lebensmittel und sauberes Trinkwasser (Ernährungsinitiative)»"
          },
          {
            "langKey": "fr",
            "text": "Initiative populaire « Pour une alimentation sûre – grâce au renforcement de la protection indigène durable, à davantage de denrées alimentaires végétales et à une eau potable propre (initiative sur l’alimentation) »"
          },
          {
            "langKey": "en",
            "text": "Popular Initiative 'For food security – through increased sustainable domestic production, more plant-based food and clean drinking water (Food Initiative)'"
          }
        ],
        "vorlageBeendet": false,
        "provisorisch": true,
        "vorlageAngenommen": null,
        "vorlagenArtId": 3,
        "hauptvorlagenId": null,
        "reserveInfoText": null,
        "doppeltesMehr": true,
        "staende": {
          "jaStaendeGanz": null,
          "neinStaendeGanz": null,
          "anzahlStaendeGanz": null,
          "jaStaendeHalb": null,
          "neinStaendeHalb": null,
          "anzahlStaendeHalb": null
        },
        "resultat": {
          "gebietAusgezaehlt": false,
          "jaStimmenInProzent": null,
          "jaStimmenAbsolut": null,
          "neinStimmenAbsolut": null,
          "stimmbeteiligungInProzent": null,
          "eingelegteStimmzettel": null,
          "anzahlStimmberechtigte": null,
          "gueltigeStimmen": null
        },
        "kantone": [
          {
            "geoLevelnummer": "1",
            "geoLevelname": "Zürich",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          },
          {
            "geoLevelnummer": "2",
            "geoLevelname": "Bern / Berne",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          },
          {
            "geoLevelnummer": "3",
            "geoLevelname": "Luzern",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          },
          {
            "geoLevelnummer": "4",
            "geoLevelname": "Uri",
            "resultat": {
              "vorlageBeendet": false,
              "gebietAusgezaehlt": false,
              "jaStimmenInProzent": null,
              "jaStimmenAbsolut": null,
              "neinStimmenAbsolut": null,
              "stimmbeteiligungInProzent": null,
              "eingelegteStimmzettel": null,
              "anzahlStimmberechtigte": null,
              "gueltigeStimmen": null
            }
          }
        ]
      }
    ]
  }
};

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const counted = (yes: number, no: number, eligible: number): Json => ({
  vorlageBeendet: false,
  gebietAusgezaehlt: true,
  jaStimmenInProzent: (100 * yes) / (yes + no),
  jaStimmenAbsolut: yes,
  neinStimmenAbsolut: no,
  stimmbeteiligungInProzent: (100 * (yes + no)) / eligible,
  anzahlStimmberechtigte: eligible,
});

/**
 * Mid-count: Zürich and Bern reported, Uri and Luzern not yet. The first vote
 * has cantonal tallies so far (Zürich no, Bern yes); the second is untouched.
 */
export const COUNTING_FEED: Json = (() => {
  const feed = JSON.parse(JSON.stringify(NOT_STARTED_FEED));
  const [first] = feed.schweiz.vorlagen;
  first.kantone[0].resultat = counted(200000, 300000, 900000);
  first.kantone[1].resultat = counted(250000, 200000, 700000);
  first.resultat = {
    gebietAusgezaehlt: false,
    jaStimmenAbsolut: 450000,
    neinStimmenAbsolut: 500000,
    jaStimmenInProzent: (100 * 450000) / 950000,
    stimmbeteiligungInProzent: 59.4,
  };
  first.staende = {
    jaStaendeGanz: 1,
    neinStaendeGanz: 1,
    jaStaendeHalb: 0,
    neinStaendeHalb: 0,
  };
  feed.timestamp = "2026-09-27T12:45:10";
  return feed;
})();

const resource = (day: string, host = "ogd-static.voteinfo-app.ch") => ({
  download_url: `https://${host}/v1/ogd/sd-t-17-02-${day}-eidgAbstimmung.json`,
});

/** The opendata.swiss dataset: three VoteInfo days and an old BFS-hosted one. */
export const CKAN_PACKAGE = {
  success: true,
  result: {
    resources: [
      resource("20260927"),
      resource("20260614"),
      resource("20260308"),
      {
        download_url:
          "https://dam-api.bfs.admin.ch/hub/api/dam/assets/12345/master",
      },
    ],
  },
};

export const FEED_URLS = {
  "2026-09-27": "https://ogd-static.voteinfo-app.ch/v1/ogd/sd-t-17-02-20260927-eidgAbstimmung.json",
  "2026-06-14": "https://ogd-static.voteinfo-app.ch/v1/ogd/sd-t-17-02-20260614-eidgAbstimmung.json",
  "2026-03-08": "https://ogd-static.voteinfo-app.ch/v1/ogd/sd-t-17-02-20260308-eidgAbstimmung.json",
} as const;
