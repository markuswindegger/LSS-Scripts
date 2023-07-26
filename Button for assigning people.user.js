// ==UserScript==
// @name         Button for assigning people
// @namespace    empty
// @version      0.1
// @description  assign People with a button push
// @author       Silberfighter
// @match        https://www.leitstellenspiel.de/vehicles/*/zuweisung
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    //------- you can change this variables -------
    //Anleitung

    //für Fahrzeuge in dieser Liste können Personen per Knopfdruck zugewiesen werden.
    //erstes Feld: Fahrzeug ID z.B. "35"

    //zweites Feld: Lehrgang der zuzuweisenden Person. Kopiere dazu die Bezeichung des Lehrgangs aus dem Fenster raus, in welchem du die Personen dem Fahrzeug zuweisen würdest und NICHT den Namen des Lehrgangs.
    //richtig wäre: "GW-Gefahrgut"    falsch wäre: "GW-Gefahrgut Lehrgang".
    //z.B. "Zugführer (leBefKw)" oder "" für Leute ohne Lehrgänge

    //drittes Feld: Anzahl der Personen. z.B. 1 oder 3 oder 4

    //somit sollte die Zeile unten drunter z.B. so aussehen:        var list = [["35","Zugführer (leBefKw)",1],["50","",1],["29","Notarzt",2]];
    //beim NAW müssen zwei verschiedene Personengruppen zugewiesen werden. Einmal mit Notarzt-Ausbildung und einmal ohne.
    //Dafür einfach zwei Einträge in der Liste erstellen.

    var list = [
        ["35","Zugführer (leBefKw)",1],
        ["50","",1],
        ["29","",1],
        ["29","Notarzt",1],
        ["74","",2],
        ["74","Notarzt",1],
    ];


    //pause between button presses. z.B. 1000 for 1 second pause between presses. 750 for 0.75 seconds pause between presses
    var pressDelay = 750;


    //------- after here change only stuff if you know what you are doing -------

    await $.getScript("https://api.lss-cockpit.de/lib/utf16convert.js");

    if (!sessionStorage.cVehicles || JSON.parse(sessionStorage.cVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.cVehicles).userId != user_id) {
        await $.getJSON('/api/vehicles').done(data => sessionStorage.setItem('cVehicles', JSON.stringify({ lastUpdate: new Date().getTime(), value: LZString.compressToUTF16(JSON.stringify(data)), userId: user_id })));
    }
    var cVehicles = JSON.parse(LZString.decompressFromUTF16(JSON.parse(sessionStorage.cVehicles).value));

    var vehicleID = (window.location.href.split("/")[4]);
    var vehicle = cVehicles.filter(b => b.id == vehicleID)[0];
    var personGoal = list.filter(b => b[0] == vehicle.vehicle_type);

    if (vehicleID && vehicle && personGoal.length > 0 && window.location.href == "https://www.leitstellenspiel.de/vehicles/" + vehicleID + "/zuweisung"){

        var allMsg = Array.prototype.slice.call(document.getElementsByClassName("vehicles-education-filter-box"))[0];
        console.log(personGoal);

        var newWindow = document.createElement("div");
        newWindow.innerHTML = `
                <a id="btnAssign" class="btn btn-success">Auswählen</a>
        `;

        newWindow.innerHTML += `<div><p id="msgToPlayer" style="display: inline-block">`
        for(var n = 0; n < personGoal.length; n++){
            newWindow.innerHTML += `Anzahl Personen: ` + personGoal[n][2] + `   Lehrgang: ` + personGoal[n][1] + `</br>`
        }
        newWindow.innerHTML += `</p></div>`

        newWindow.setAttribute("class","navbar-text");
        newWindow.setAttribute("style","width:100%");

        allMsg.parentNode.insertBefore(newWindow, allMsg);

        $('#btnAssign').on('click', async function() {
            var allPeople = Array.prototype.slice.call($('#personal_table')[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr"));

            var curSelected = Array(personGoal.length).fill(0);
            for (let i = 0; i < allPeople.length; i++) {
                let index = GetIndexOfRelevantTraining(allPeople[i]);
                if(IsPeopleAssignedToThisVeh(allPeople[i])){
                    curSelected[index] += 1;
                }

                if(IsPeopleAssignedToThisVeh(allPeople[i]) && !HasRelevantTraining(allPeople[i])){
                    await UnselectPeople(allPeople[i]);
                    curSelected[index] -= 1;
                }
            }

            var maxPerVehicle = personGoal.map(e => e[2]);

            for (let i = 0; i < allPeople.length; i++) {
                var index = GetIndexOfRelevantTraining(allPeople[i]);
                console.log(allPeople[i]);
                if(curSelected[index] < maxPerVehicle[index] && HasRelevantTraining(allPeople[i]) && IsPeopleFreeToAssigne(allPeople[i])){
                    await SelectPeople(allPeople[i]);
                    curSelected[index] += 1;
                }

                if(curSelected[index] > maxPerVehicle[index] && IsPeopleAssignedToThisVeh(allPeople[i])){
                    await UnselectPeople(allPeople[i]);
                    curSelected[index] -= 1;
                }
            }

            $('#msgToPlayer')[0].innerHTML = "";
            var peopleMissing = false;

            for (let i = 0; i < curSelected.length; i++) {
                if(curSelected[i] != maxPerVehicle[i]){
                    peopleMissing = true;
                }
            }

            if(peopleMissing){
                $('#msgToPlayer')[0].innerHTML =  "Leute fehlen!";
            }else{
                $('#msgToPlayer')[0].innerHTML = "Done";
            }
        });

        await delay(500);
        $('#btnAssign').click();
    }

    function HasRelevantTraining(entry){
        for(var n = 0; n < personGoal.length; n++){
            if((personGoal[n][1] != "" && GetTraining(entry).indexOf(personGoal[n][1]) >= 0 || personGoal[n][1] == "" && GetTraining(entry) == "")){
                return true;
            }
        }
        return false;
    }

    function GetIndexOfRelevantTraining(entry){
        for(var n = 0; n < personGoal.length; n++){
            if((personGoal[n][1] != "" && GetTraining(entry).indexOf(personGoal[n][1]) >= 0 || personGoal[n][1] == "" && GetTraining(entry) == "")){
                return n;
            }
        }
        return -1;
    }

    function IsPeopleAssignedToThisVeh(entry){
        return entry.getElementsByTagName("td")[3].getElementsByClassName("btn btn-default btn-assigned").length > 0;
    }

    function IsPeopleFreeToAssigne(entry){
        console.log(entry.getElementsByTagName("td")[2].innerText.indexOf("Im Unterricht"));
        return entry.getElementsByTagName("td")[3].getElementsByClassName("btn btn-success").length > 0 && entry.getElementsByTagName("td")[2].innerText.indexOf("Im Unterricht") == -1;
    }

    async function SelectPeople(entry){
        await delay(pressDelay);
        return entry.getElementsByTagName("td")[3].getElementsByClassName("btn btn-success")[0].click();
    }

    async function UnselectPeople(entry){
        await delay(pressDelay);
        entry.getElementsByTagName("td")[3].getElementsByClassName("btn btn-default btn-assigned")[0].click();
    }

    function GetTraining(entry){
        return new String(entry.getElementsByTagName("td")[1].innerHTML).valueOf().trim();
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
})();
