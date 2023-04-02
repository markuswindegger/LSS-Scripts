// ==UserScript==
// @name         filter Missions by zip code
// @namespace    http://tampermonkey.net/
// @version      1
// @description  filter all missions by zip-code
// @author       Silberfighter
// @match        https://www.leitstellenspiel.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if(document.getElementById('btn-group-mission-select')){
        var from = -1;
        var to = -1;


        var newWindow = document.createElement("div");

        text = `bis: <input style="display:inline-block; color: #000; width:80px;" type="number" id="bisPLZ" min="1" value=""></input>`;
        newWindow.innerHTML = text;

        $('#btn-group-mission-select').after(newWindow);


        newWindow = document.createElement("div");

        text = `von: <input style="display:inline-block; color: #000; width:80px;" type="number" id="vonPLZ" min="1" value=""></input>`;
        newWindow.innerHTML = text;

        $('#btn-group-mission-select').after(newWindow);

        newWindow = document.createElement("div");

        var text = `Einsätze anhand valider PLZ's filtern`;
        newWindow.innerHTML = text;

        $('#btn-group-mission-select').after(newWindow);


        setInterval(
            function filterMission(){

                from = parseInt(document.getElementById('vonPLZ').value);
                to = parseInt(document.getElementById('bisPLZ').value);

                var allMissions = document.getElementsByClassName('missionSideBarEntry missionSideBarEntrySearchable');

                for(var i = 0; i < allMissions.length; i++){
                    var place = allMissions[i].getAttribute("search_attribute").search(/\d{5,5}/);

                    if(!isNaN(from) && !isNaN(to)){
                        if(place >= 0){
                            var plz = parseInt(allMissions[i].getAttribute("search_attribute").substring(place,place + 5));

                            if(from <= plz && plz <= to){
                                allMissions[i].setAttribute("class", "missionSideBarEntry missionSideBarEntrySearchable");
                            } else {
                                allMissions[i].setAttribute("class", "missionSideBarEntry missionSideBarEntrySearchable hidden");
                            }
                        } else {
                            allMissions[i].setAttribute("class", "missionSideBarEntry missionSideBarEntrySearchable hidden");
                        }
                    } else {
                        allMissions[i].setAttribute("class", "missionSideBarEntry missionSideBarEntrySearchable");
                    }
                }
            },3000);
    }
})();
