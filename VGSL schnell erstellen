// ==UserScript==
// @name         VGSL schnell erstellen
// @namespace    http://tampermonkey.net/
// @version      1
// @description  macht das Erstellen einer VGSL einfacher
// @author       Silberfighter
// @match        https://www.leitstellenspiel.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //*********************************************************

    //unten im markierten Bereich die Namen der VGSL reinkopieren für welche Buttons generiert werden sollen
    //falls nach dem namen der VGSL in Runden Klammern der Spielername steht, muss dieser ebenfalls mitkopiert werden

    //Der Namen muss in Anführungszeichen geschrieben sein und danach muss ein Komma folgen
    //der Eintrag sollte dann z.B. wie folgt aussehen:    "Name des GSL (Spielername)",
    //der Eintrag sollte dann z.B. wie folgt aussehen:    "Name des GSL",

    //dies kann für beliebig viele Einsätze wiederholt werden

    //*********************************************************

    var missionNameList = [
        //-------- ab hier Einträge einfügen --------
        "tGSL: Großfeuer Lagerhalle (Smokejumper-Micha)",
        "VerrückterSaarländer rd live55"
        //-------- bis hier Einträge einfügen --------
    ];



    var newWindowParent = document.createElement("div");
    newWindowParent.innerHTML = `<p style="font-size:20px">VGSL erstellen</p>
            <a class="btn btn-default btn-xs building_ajax hidden" id="create-VGSL" style="background-image: linear-gradient(to bottom, #5cb85c 0, #419641 100%);">Einsatz starten (10 Coins)</a>
        `;
    newWindowParent.setAttribute("style",'margin-bottom:20px');

    document.getElementById("missions").parentNode.parentNode.before(newWindowParent);

    for(let i = 0; i < missionNameList.length; i++){
        var newWindow = document.createElement("a");
        newWindow.innerHTML = missionNameList[i];
        newWindow.setAttribute("class","btn btn-default btn-xs building_ajax");
        newWindow.setAttribute("id","open-VGSL " + missionNameList[i]);

        $("#create-VGSL").after(newWindow);

        newWindow.addEventListener("click", async function() {
            openVGSLWindow(missionNameList[i]);
        });
    }

    async function openVGSLWindow(missionName) {
        $('#btn-alliance-new-mission').click();
        while($('#mission_position_mission_type_id_-1')[0] == undefined){
            await delay(100);
        }


        $('#mission_position_mission_type_id_-1')[0].click();

        var result = Array.prototype.slice.call(document.getElementsByClassName("mission_custom_saved_restore")).filter(e => missionName == e.innerText.trim().replace(/\s\s+/g, ' '));

        if(result.length == 0){
            if(document.getElementById("saveVGE") != null){
                result = Array.prototype.slice.call(document.getElementById("saveVGE").getElementsByTagName("a")).filter(e => e.getAttribute("data-value") && missionName == e.getAttribute("data-value").trim().replace(/\s\s+/g, ' '));
            }
        }

        if(result.length > 0){
            result[0].click();
            $('#create-VGSL')[0].setAttribute("class","btn btn-default btn-xs building_ajax");
        } else {
            alert('Mission "' + missionName + '" konnte nicht gefunden werden!');
        }
    }


    $("#create-VGSL").on("click", function() {
        var btn = Array.prototype.slice.call(document.getElementsByClassName("btn-success btn alliance_mission_coins")).filter(e => e.innerText == "Einsatz starten (10 Coins)");

        if(btn.length > 0){
            console.log(btn);
            btn[0].click();
            $('#create-VGSL')[0].setAttribute("class","btn btn-default btn-xs building_ajax hidden");
        }
    });

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
})();
