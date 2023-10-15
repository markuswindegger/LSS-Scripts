// ==UserScript==
// @name         Change Vehicle classes
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Change the vehicle classes of specific vehicles in one Building with one button click
// @author       Silberfighter
// @include      https://www.leitstellenspiel.de/buildings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(async function() {

    //------- you can change this variables -------

    // Beispiel:     [[50,"Test1"]]     Fahrzeuge mit der VehicleId 50 (GruKw) bekommen die eigene Fahrzeugklasse   Test1   zugewiesen
    // Beispiel:     [[50,"Test1"],[51,"Test2"]]     Fahrzeuge mit der VehicleId 50 (GruKw) bekommen die eigene Fahrzeugklasse   Test1   zugewiesen, Fahrzeuge mit der VehicleId 51 (FüKw) bekommen die eigene Fahrzeugklasse   Test2   zugewiesen,
    var vehicleTypeIdToClassName = vehicleTypeIdToClassName = [[50,"Test1"],[51,"Test2"]];

    //------- after here change only stuff if you know what you are doing -------

    $("#vehicle_table")
        .before(`<a class="btn btn-success btn-xs" id="renameAllVehicleClasses">
                    Umbennen der Fahrzeugklassen
                </a>`);

    $("#renameAllVehicleClasses").on("click", function() {
        getRelevantVehicles();
    });

    var vehicleList = Array.prototype.slice.call($("#vehicle_table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr"));
    async function getRelevantVehicles(){

        for(var i = 0; i < vehicleList.length; i++){
            var result = isVehicleIdInArray(getVehicleTypeID(vehicleList[i]));
            if(result != null){
                await $.post("/vehicles/" + getVehicleID(vehicleList[i]), { "vehicle": { "vehicle_type_caption": result }, "_method": "put", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
                await delay(100);
            }
        }

        $("#renameAllVehicleClasses")[0].innerHTML = "eigene Fahrzeugklassen wurden abgeändert";
    }

    function isVehicleIdInArray(vehId){
        var result = vehicleTypeIdToClassName.filter((e) => e[0] == vehId);
        if(result.length > 0){
            return result[0][1];
        }
        return null;
    }

    function getVehicleTypeID(e){
        return e.getElementsByTagName("img")[0].getAttribute("vehicle_type_id");
    }

    function getVehicleID(e){
        var links = e.getElementsByTagName("a");
        for(var n = 0; n < links.length; n++){
            if(links[n].getAttribute("href") && Number.isFinite(parseInt(links[n].getAttribute("href").replace("/vehicles/","").trim()))){
                return parseInt(links[n].getAttribute("href").replace("/vehicles/", ""));
            }
        }
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
})();









