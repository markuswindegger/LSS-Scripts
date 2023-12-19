// ==UserScript==
// @name         Missionsliste-Funktionen
// @namespace    http://tampermonkey.net/
// @version      2023-12-13
// @description  Verschiedene Funktionen für die Missionsliste
// @author       Silberfighter, Sebi1531
// @match        https://www.leitstellenspiel.de/einsaetze
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(function() {
    var newWindow = document.createElement("div");
    newWindow.innerHTML = `
            <a class="btn btn-success btn-xs" id="deleteBtn">
                Alle erreichten Missionen löschen
            </a>
            <a class="btn btn-success btn-xs" id="sortBtnUp">
                Missionen nach 1. Voraussetzung aufsteigend sortieren
            </a>
            <a class="btn btn-success btn-xs" id="sortBtnDown">
                Missionen nach 1. Voraussetzung absteigend sortieren
            </a>`;

    $("#sort_options_panel")[0].after(newWindow);

    $("#deleteBtn").on("click", function() {
        deleteMissions();
    })

    $("#sortBtnUp").on("click", function() {
        sortMissions(1);
    });

    $("#sortBtnDown").on("click", function() {
        sortMissions(-1);
    });

    let element = document.getElementById("sort_options_panel").children[3].querySelector(".filter-option");
    let observer = new MutationObserver(checkSelection);
    observer.observe(element, {childList: true} );
    checkSelection();
})();

function checkSelection() {
    let txt = document.getElementById("sort_options_panel").children[3].querySelector(".filter-option").innerHTML;
    let btnIdArr = ["sortBtnUp", "sortBtnDown"];
    let btn = document.getElementById(btnIdArr[0]);
    if (txt === "Voraussetzungen") {
        for (let id of btnIdArr) {
            let btn = document.getElementById(id);
            btn.setAttribute("disabled","disabled");
            btn.classList.add("btn-default");
            btn.classList.remove("btn-success");
            btn.innerHTML = "Gesperrt - Keine Voraussetzung ausgewählt";
        }
    } else if (txt !== "Voraussetzungen"){
        btn.innerHTML = "Missionen nach 1. Voraussetzung aufsteigend sortieren";
        for (let id of btnIdArr) {
            btn = document.getElementById(id);
            btn.removeAttribute("disabled");
            btn.classList.add("btn-success");
            btn.classList.remove("btn-default");
        }
        btn.innerHTML = "Missionen nach 1. Voraussetzung absteigend sortieren";
    }
}

function deleteMissions() {
    let parent = document.getElementById("possible_missions_table").children[1];
    let targets = parent.querySelectorAll('.success');
    for (let obj of targets) {
        obj.style.display = "none";
    }
}

function sortMissions(direction) {

    // Suchkriterium ermitteln

    let hashmap = new Map();
    hashmap.set('BePo: Gefangenenkraftwagen', 'Gefangenenkraftwagen');
    hashmap.set('BePo: Wasserwerfer', 'Wasserwerfer');
    hashmap.set('BePo: Züge der 1. Hundertschaft', 'Hundertschaft');
    hashmap.set('Bereitschaftspolizei', 'Bereitschaftspolizeiwache');
    hashmap.set('Betreuungs- und Verpflegungsdienst-Erweiterungen', 'Betreuungs- und Verpflegungsdienst-Erweiterung');
    hashmap.set('Dienstgruppenleitung-Erweiterung', 'Dienstgruppenleitung-Erweiterung');
    hashmap.set('Diensthundestaffel', 'Diensthundestaffel');
    hashmap.set('Drohnen-Erweiterung (FW', 'Drohnen-Erweiterung');
    hashmap.set('Feuerwache', 'Feuerwache');
    hashmap.set('Kriminalpolizei-Erweiterung', 'Kriminalpolizei-Erweiterung');
    hashmap.set('Lüfter-Erweiterungen', 'Lüfter-Erweiterung');
    hashmap.set('MEK-Wachen', 'MEK-Wache');
    hashmap.set('NEA200-Erweiterungen', 'NEA200-Erweiterung');
    hashmap.set('NEA50-Erweiterungen', 'NEA50-Erweiterung');
    hashmap.set('Polizei-Motorradstaffel', 'Polizei-Motorradstaffel');
    hashmap.set('Polizeihubschrauberstation', 'Polizeihubschrauberstation');
    hashmap.set('Polizeiwache', 'Polizeiwache');
    hashmap.set('Rettungshundestaffel', 'Rettungshundestaffel');
    hashmap.set('Rettungswache', 'Rettungswache');
    hashmap.set('SEK-Wachen', 'SEK-Wache');
    hashmap.set('Schnelleinsatzgruppe (SEG)', 'SEG-Wache');
    hashmap.set('THW-Wachen', 'THW-Ortsverb');
    hashmap.set('THW-Zugtrupps', 'THW: Zugtrupp');
    hashmap.set('THW: 2. Technische Züge', ['THW: Technischer Zug', 'THW: Technische Züge']);
    hashmap.set('THW: Fachgruppe Wasserschaden/Pumpen', 'Wasserschaden/Pumpen Erweiterung');
    hashmap.set('THW: Fachgruppen N', 'Notversorgung');
    hashmap.set('THW: Fachgruppen Räumen', 'Räumen');
    hashmap.set('THW: Fachgruppen SB', ['THW: Fachgruppe SB', 'THW: Fachgruppen SB']);
    hashmap.set('Wasserrettung', 'Wasserrettungswache');
    hashmap.set('Werkfeuerwehren', 'Werkfeuerwehr');

    let temp = document.getElementById("sort_options_panel").children[3].querySelector(".filter-option").innerHTML;
    let select = temp.split(',')[0];
    let searched = hashmap.get(select);

    // Nicht-anzeigte Missionen nach hinten schieben

    let missionListObj = document.getElementById('possible_missions_table').children[1];
    let pointer = 0;
    for (let i = 0; i < missionListObj.children.length; i++) {
        let aMission = missionListObj.children[pointer];
        if (aMission.style.display === "none") {
            missionListObj.appendChild(aMission);
        } else {
            pointer++;
        }
    }

    // Missionen sortieren

    missionListObj = document.getElementById('possible_missions_table').children[1];
    let posArr = [];
    let amountMap = new Map();
    let objMap = new Map();
    for (let i = 0; i < missionListObj.children.length; i++) {
        let aMission = missionListObj.children[i];
        let id = aMission.children[0].getAttribute('data-sort-value');
        posArr.push(id);
        objMap.set(id, aMission);

        // Sortierung - Menge bestimmen & speichern
        let reqList = aMission.children[4].children[0];
        let amount = 0;
        for (let aReq of reqList.children) {
            let txt = aReq.innerHTML;
            if (txt.indexOf(searched) !== -1) {
                amount = parseInt(txt.split(' ')[0]);
                break;
            }
        }
        amountMap.set(id, amount);

        // Sortierung - Neue Position bestimmen
        let j;
        for (j = i - 1; j > -1; j--) {
            let sndAmount = amountMap.get(posArr[j]);
            if ((direction === 1 && amount < sndAmount) || (direction === -1 && amount > sndAmount)) {
                posArr[j + 1] = posArr[j];
                posArr[j] = id;
            } else {
                break;
            }
        }
        j++;

        // Sortierung - Mission umpositionieren
        if (j !== i) {
            missionListObj.insertBefore(aMission, objMap.get(posArr[j + 1]));
        }
    }

    alert ('Die Missionen werden nun ' + (direction == 1 ? 'aufsteigend' : 'absteigend') + ' nach dem Kriterium "' + searched + '" sortiert. Es kann sein, dass der Prozess einige Sekunden benötigt.');
}
