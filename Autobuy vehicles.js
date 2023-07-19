// ==UserScript==
// @name         Autobuy vehicles
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Create different settings for vehicle purchases
// @author       Silberfighter
// @include      https://www.leitstellenspiel.de/buildings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(async function() {


    const vehicleConfigurations = [

        /*
        ANLEITUNG

        1. kopiere folgenden Eintrag in dem sich unterhalb dieser Anleitung markierten Bereich:



        {
            buildingID: 11,
            displayName: "",
            vehicles:[
                [50,9],
                [35,3],
                [51,1],
                [52,1],
            ]
        },



        Die sich am Anfang darin befindenden Einträge können rausgelöscht werden. Sie dienen als Veranschaulichung, wie ein beispielhafter Eitnrag aussehen kann.


        2. tausche die 11 in folgender Zeile    buildingID: 11,     durch die Gebäude-ID, für welche ein Eintrag erstellt werden soll. Lösche nicht das Komma am Ende!!!

        3. trage in folgender Zeile     displayName: "",     zwischen die beiden Gänsefüßchen den Namen der Konfiguration ein. Dieser Name wird auf den klickbaren Knopf angezeigt. Lösche nicht das Komma am Ende!!!

        4. ersetze die 4 folgenden Einträge

                [50,9],
                [35,3],
                [51,1],
                [52,1],

        durch die Fahrzeuge, die gekauft werden sollen. Die erste Zahl ist die Fahrzeug-ID. Die zweite Zahl gibt an, wie viele Fahrzeuge in der Wache vorhanden sein sollen.
        z.B. der Eintrag    [50,9],   bewirkt, dass das Fahrzeug mit der ID 50 (GruKw) am Ende 9 mal in der Wache vorhanden sein wird, NICHT 9 mal gekauft wird. Dies ist relevant, wenn bereits GruKw in der Wache vorhanden sind.
        Wenn z.B. bereits 3 GruKw vorhanden sind, werden nur 6 weitere gekauft, sodass am Ende 9 vorhanden sind


        */

        //------- FÜGE EINTRÄGE UNTERHALB EIN -------

        {
            buildingID: 11,
            displayName: "1. Einsatzhundertschaft",
            vehicles:[
                [50,9],   //GruKw
                [35,3],   //lBefKw
                [51,1],   //FüKW
                [52,1],   //GefKw
            ]
        },

        {
            buildingID: 11,
            displayName: "voll besetzt",
            vehicles:[
                [50,9],   //GruKw
                [35,4],   //lBefKw
                [51,5],   //FüKW
                [52,1],   //GefKw
                [72,3],   //WaWe
                [79,6],   //SEK - ZF
                [80,2],   //SEK - MTF
                [81,6],   //MEK - ZF
                [82,2],   //MEK - MTF
                [94,3],   //DHuFüKw
            ]
        },

        {
            buildingID: 11,
            displayName: "voll besetzt ohne FüKW",
            vehicles:[
                [50,9],   //GruKw
                [35,4],   //lBefKw
                [52,1],   //GefKw
                [72,3],   //WaWe
                [79,6],   //SEK - ZF
                [80,2],   //SEK - MTF
                [81,6],   //MEK - ZF
                [82,2],   //MEK - MTF
                [94,3],   //DHuFüKw
            ]
        },

        {
            buildingID: 0,
            displayName: "Standardwache",
            vehicles:[
                [30,5],   //HLF20
                [23,1],   //TLF 16/45
                [14,1],   //SW 2000
                [2,1],   //DLK 23
                [3,1],   //ELW 1
                [5,1],   //GW-A
                [10,1],   //GW-Öl
                [12,1],   //GW-Mess
                [27,1],   //GW-Gefahrgut
                [33,1],   //GW-H
                [34,1],   //ELW 2
                [53,1],   //Dekon-P
                [57,1],   //FwK
            ]
        },

        //------- FÜGE EINTRÄGE OBERHALB EIN -------
    ];


    const buildingsIDToIgnore = [4,7,1,3,8,10];


    let buildingId = window.location.href;
    buildingId = buildingId.replace("https://www.leitstellenspiel.de/buildings/","");


    let titleDiv = Array.from(document.getElementsByTagName("h1"));
    titleDiv = titleDiv.filter(e => e.getAttribute("building_type") != undefined);


    if(titleDiv.length == 0){
        return;
    }

    titleDiv = titleDiv[0];

    let buildingTypeID = Number(titleDiv.getAttribute("building_type"));

    if(buildingsIDToIgnore.indexOf(buildingTypeID) >= 0){
        return;
    }

    let allVehicles;
    updateAllVehicles();


    let wrapperDIV = document.createElement("div");
    wrapperDIV.innerText = "Vehicle-Configs:";
    wrapperDIV.style.padding = "15px 5px 15px 5px";
    titleDiv.parentNode.parentNode.insertBefore(wrapperDIV, titleDiv.parentNode.nextSibling);


    for(let i = 0; i < vehicleConfigurations.length; i++){
        if(vehicleConfigurations[i].buildingID == buildingTypeID){
            let btn = document.createElement("a");
            btn.className = "btn btn-success btn-xs autoVehicleBuy";
            btn.setAttribute("config_id", i);
            btn.innerText = vehicleConfigurations[i].displayName;
            btn.style.margin = "5px 5px 5px 5px";
            wrapperDIV.appendChild(btn);
        }
    }

    let hintText = document.createElement("div");
    hintText.innerText = "drücke auf eine Knopf, um die Fahrzeuge zu kaufen. Falls kein Fahrzeuge gekauft werden konnte, erscheint eine Nachricht ob alle Fahrzeuge vorhanden sind oder nicht";
    wrapperDIV.appendChild(hintText);


    // Add event listener to each element
    document.querySelectorAll('.autoVehicleBuy').forEach(function(element) {
        element.addEventListener('click', function() {
            buyVehicles(element);
        });
    });


    async function buyVehicles(btnPressed){

        let messageText;

        if(document.getElementById("autoBuyVehiclesMessagetTxt")){
            messageText = document.getElementById("autoBuyVehiclesMessagetTxt");
        }else{
            messageText = document.createElement("div");
            messageText.id = "autoBuyVehiclesMessagetTxt";
            messageText.style.fontSize = "x-large";
            messageText.style.fontWeight = "900";
            wrapperDIV.appendChild(messageText);
        }

        messageText.innerText = "Bitte warten. Fahrzeuge werden gekauft";


        let vehicleBought = false;
        let vehicleConfig = vehicleConfigurations[btnPressed.getAttribute("config_id")];
        //console.log(vehicleConfig);

        for(let i = 0; i < vehicleConfig.vehicles.length; i++){
            let numberCurrentVehicles = allVehicles.filter(e => e.getAttribute("vehicle_type_id") == vehicleConfig.vehicles[i][0]).length;
            //console.log(numberCurrentVehicles);

            for(let n = numberCurrentVehicles; n < parseInt(vehicleConfig.vehicles[i][1]); n++){
                await $.post("https://www.leitstellenspiel.de/buildings/" + buildingId + "/vehicle/" + buildingId + "/" + vehicleConfig.vehicles[i][0] + "/credits?building=" + buildingId, {"_method": "get", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
                await delay(100);
                vehicleBought = true;
            }
        }

        updateAllVehicles();
        let allVehiclesBought = true;

        for(let i = 0; i < vehicleConfig.vehicles.length; i++){
            let numberCurrentVehicles = allVehicles.filter(e => e.getAttribute("vehicle_type_id") == vehicleConfig.vehicles[i][0]).length;

            if(numberCurrentVehicles < parseInt(vehicleConfig.vehicles[i][1])){
                allVehiclesBought = false;
                break;
            }
        }


        if(vehicleBought){
            location.reload();
        }else{
            if(allVehiclesBought){
                messageText.innerText = "Alle Fahrzeuge vorhanden";
            }else{
                messageText.innerText = "Fahrzeuge fehlen";
            }
        }
    }

    function updateAllVehicles(time) {
        allVehicles = Array.from(document.getElementsByTagName("img"));
        allVehicles = allVehicles.filter(e => e.getAttribute("vehicle_type_id") != undefined);
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
})();
