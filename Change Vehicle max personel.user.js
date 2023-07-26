// ==UserScript==
// @name         Change Vehicle max personel
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Change the vehicle max allowed personal in one Building with one button click
// @author       Silberfighter
// @include      https://www.leitstellenspiel.de/buildings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(async function() {

    //Anleitung:
    // mit diesem Skript kann die maximale Personenanzahl für alle Fahrzeuge in einem Gebäude mit einem Knopfdruck geändert werden

    // Füge dazu die Einträge im unten markierten Bereich ein 
    // Beispiel:     [50,1],     Fahrzeuge mit der VehicleId 50 (GruKw) werden auf maximal eine Person gesetzt
    // Beispiel:     [50,2],[51,3],     Fahrzeuge mit der VehicleId 50 (GruKw) werden auf maximal 2 Personen gesetzt, Fahrzeuge mit der VehicleId 51 (FüKw) werden auf maximal 3 Personen gesetzt

    //Die bereits vorhandenen Einträge dienen als Beispiel und können rausgelöscht werden
    
    var vehicleTypeIdToClassName = [
    //---------------- Einträge unterhalb hiervon einfügen ----------------  
        [35, 1],
        [50, 1],
        [72, 1],
        [79, 1],
        [80, 1],
        [81, 1],
        [82, 1],
        [94, 1],
        [52, 1],
    //---------------- Einträge oberhalb hiervon einfügen ----------------  
    ];


    $("#vehicle_table")
        .before(`<a class="btn btn-success btn-xs" id="changeMaxPerson">
                    ändern der max Personen
                </a>`);

    $("#changeMaxPerson").on("click", function() {
        getRelevantVehicles();
    });

    async function getRelevantVehicles(){
        var vehicleList = Array.prototype.slice.call($("#vehicle_table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr"));

        for(var i = 0; i < vehicleList.length; i++){
            var result = isVehicleIdInArray(getVehicleTypeID(vehicleList[i]));
            if(result && getCurMaxPer(vehicleList[i]) != result){
                console.log("vehicle "+ getVehicleID(vehicleList[i]) + " " + result);
                $.post("/vehicles/" + getVehicleID(vehicleList[i]), { "vehicle": { "personal_max": result }, "_method": "put", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
                await delay(500);
            }
        }

        $("#changeMaxPerson")[0].innerHTML = "Anzahl Personen wurden geändert";
        window.location.reload();

    }

    function isVehicleIdInArray(vehId){
        var result = vehicleTypeIdToClassName.filter((e) => e[0] == vehId);
        if(result.length > 0){
            return result[0][1];
        }
    }

    function getVehicleTypeID(e){
        return e.getElementsByTagName("td")[0].getElementsByTagName("img")[0].getAttribute("vehicle_type_id");
    }

    function getVehicleID(e){
        return e.getElementsByTagName("td")[1].getElementsByTagName("a")[0].getAttribute("href").replace(/[A-Za-z0-9]+/, "").replaceAll("/","");
    }

    function getCurMaxPer(e){
        return parseInt(e.getElementsByTagName("td")[5].innerHTML);
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
})();
