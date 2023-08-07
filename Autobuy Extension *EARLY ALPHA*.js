// ==UserScript==
// @name         Autobuy Extension **********EARLY ALPHA**********
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create different settings for extension build
// @author       You
// @include      https://www.leitstellenspiel.de/buildings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(async function() {


    const extensionsConfigurations = [

        /*

        **********EARLY ALPHA**********

        ANLEITUNG


        **WIRD NOCH GEUPDATET**

        buildingID: ID des Gebäudes
           ANMERKUNG: Verwende für Kleinwachen die Gebäude-ID der entsprechenden "normalgroßen" Wache!!!!

        stufe: Gebäude-stufe auf welches es ausgebaut werden soll

        ausbauten: ID der Ausbauten eintragen, in wessen Reihenfolge es gebaut werden soll

        spezialisierung: ID der Spezialisierung, in wessen Reihenfolge es gebaut werden soll
                0 steht für Werkfeuerwehr
                1 steht für Flughafen
                2 steht für Wasserrettung

         lager:  ID der Lager, in wessen Reihenfolge es gebaut werden soll
                0 steht für initiales Lager
                1 steht für erstes Zusatzlager
                2 steht für zweites Zustazlager und so weiter

        falls z.B. kein Lager gebaut werden soll, lasst die Klammern leer. Das selbe gilt für Ausbauten und Spezialisierung


        */

        //------- FÜGE EINTRÄGE UNTERHALB EIN -------

        {
            buildingID: 0,
            displayName: "Standardwache",
            stufe: 1,
            ausbauten:[0,1,2,3,4,5],
            spezialisierung:[0],
            lager:[0],
        },

        {
            buildingID: 11,
            displayName: "1. Einsatzhundertschaft",
            stufe: 1,
            ausbauten:[0,1,2,3,4,5],
            spezialisierung:[0],
            lager:[0],
        },

        {
            buildingID: 21,
            displayName: "Rettungshunde",
            stufe: 1,
            extension:[]
        },

        //------- FÜGE EINTRÄGE OBERHALB EIN -------
    ];


    let buildingId = window.location.href;
    buildingId = buildingId.replace("https://www.leitstellenspiel.de/buildings/","");


    let titleDiv = Array.from(document.getElementsByTagName("h1"));
    titleDiv = titleDiv.filter(e => e.getAttribute("building_type") != undefined);


    if(titleDiv.length == 0){
        return;
    }

    titleDiv = titleDiv[0];

    let buildingTypeID = Number(titleDiv.getAttribute("building_type"));




    let allBtn = Array.from(document.getElementsByTagName("a"));
    allBtn = allBtn.filter(e => e.innerText.includes(" Credits"));

    //console.log(allBtn);

    let searchFor = "Gebäudekomplexbasis";

    for(let i = 0; i < allBtn.length; i++){
        let allTD = allBtn[i].parentNode.parentNode.parentNode;
        allTD = Array.from(allTD.getElementsByTagName("td"));
        console.log(allTD[0]);

        allTD = allTD.filter(e => e.innerText.includes(searchFor));

        if(allTD.length > 0){
            console.log(allTD[0]);
        }
    }


    let wrapperDIV = document.createElement("div");
    wrapperDIV.innerText = "Ausbau-Configs:";
    wrapperDIV.style.padding = "15px 5px 15px 5px";
    titleDiv.parentNode.parentNode.insertBefore(wrapperDIV, titleDiv.parentNode.nextSibling);


    for(let i = 0; i < extensionsConfigurations.length; i++){
        if(extensionsConfigurations[i].buildingID == buildingTypeID){
            let btn = document.createElement("a");
            btn.className = "btn btn-success btn-xs autoExtensionBuy";
            btn.setAttribute("config_id", i);
            btn.innerText = extensionsConfigurations[i].displayName;
            btn.style.margin = "5px 5px 5px 5px";
            wrapperDIV.appendChild(btn);
        }
    }

    let hintText = document.createElement("div");
    hintText.innerText = "drücke auf eine Knopf, um das Gebäude entsprechend auszubauen.";
    wrapperDIV.appendChild(hintText);

    // Add event listener to each element
    document.querySelectorAll('.autoExtensionBuy').forEach(function(element) {
        element.addEventListener('click', function() {
            extendBuilding(element);
        });
    });


    async function extendBuilding(btnPressed){

        let messageText;

        if(document.getElementById("autoBuyExtensionMessagetTxt")){
            messageText = document.getElementById("autoBuyExtensionMessagetTxt");
        }else{
            messageText = document.createElement("div");
            messageText.id = "autoBuyExtensionMessagetTxt";
            messageText.style.fontSize = "x-large";
            messageText.style.fontWeight = "900";
            wrapperDIV.appendChild(messageText);
        }

        messageText.innerText = "Bitte warten. Ausbauten werden gekauft";


        let extensionsBought = false;
        let extensionsConfig = extensionsConfigurations[btnPressed.getAttribute("config_id")];
        //console.log(vehicleConfig);

        //https://www.leitstellenspiel.de/buildings/18084503/expand_do/credits?level=0
        await $.post("https://www.leitstellenspiel.de/buildings/" + buildingId + "/expand_do/credits?level=" + (extensionsConfig.stufe-1), {"_method": "get", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
        //console.log("https://www.leitstellenspiel.de/buildings/" + buildingId + "/expand_do/credits?level=" + (extensionsConfig.stufe-1))

        if(extensionsConfig.ausbauten != null){
            for(let i = 0; i < extensionsConfig.ausbauten.length; i++){
                //https://www.leitstellenspiel.de/buildings/15868377/extension/credits/0?redirect_building_id=15868377
                await $.post("https://www.leitstellenspiel.de/buildings/" + buildingId + "/extension/credits/" + extensionsConfig.ausbauten[i] + "?redirect_building_id=" + buildingId, {"_method": "get", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
                //console.log("https://www.leitstellenspiel.de/buildings/" + buildingId + "/extension/credits/" + extensionsConfig.ausbauten[i] + "?redirect_building_id=" + buildingId);
                await delay(100);
                extensionsBought = true;
            }
        }

        if(extensionsConfig.spezialisierung != null){
            for(let i = 0; i < extensionsConfig.spezialisierung.length; i++){
                //https://www.leitstellenspiel.de/building_specializations?building_id=16967739&pay_with=credits&type=factory_fire_brigade   //Werkfeuerwehr
                //https://www.leitstellenspiel.de/building_specializations?building_id=16149107&pay_with=credits&type=airport                //Airport
                //https://www.leitstellenspiel.de/building_specializations?building_id=7648242&pay_with=credits&type=water_rescue            //Wasserrettung

                let specialisation = -1;
                switch(extensionsConfig.spezialisierung[i]){
                    case 0: specialisation = "factory_fire_brigade"; break;
                    case 1: specialisation = "airport"; break;
                    case 2: specialisation = "water_rescue"; break;
                }

                await $.post("https://www.leitstellenspiel.de/building_specializations?building_id=" + buildingId + "&pay_with=credits&type=" + specialisation, {"_method": "get", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
                //console.log("https://www.leitstellenspiel.de/building_specializations?building_id=" + buildingId + "&pay_with=credits&type=" + specialisation);
                await delay(100);
                extensionsBought = true;
            }
        }

        if(extensionsConfig.lager != null){
            for(let i = 0; i < extensionsConfig.lager.length; i++){
                //https://www.leitstellenspiel.de/buildings/1473365/storage_upgrade/credits/initial_containers?redirect_building_id=1473365
                //https://www.leitstellenspiel.de/buildings/14285784/storage_upgrade/credits/additional_containers_1?redirect_building_id=14285784


                let storage_name = "";
                if(extensionsConfig.lager[i]==0){
                    storage_name = "initial_containers";
                } else{
                    storage_name = "additional_containers_"+extensionsConfig.lager[i];
                }

                await $.post("https://www.leitstellenspiel.de/buildings/" + buildingId + "/storage_upgrade/credits/" + storage_name + "?redirect_building_id=" + buildingId, {"_method": "get", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
                //console.log("https://www.leitstellenspiel.de/buildings/" + buildingId + "/storage_upgrade/credits/" + storage_name + "?redirect_building_id=" + buildingId);
                await delay(100);
                extensionsBought = true;
            }
        }


        if(extensionsBought){
            location.reload();
        }
        /*else{
            if(allVehiclesBought){
                messageText.innerText = "Alle Fahrzeuge vorhanden";
            }else{
                messageText.innerText = "Fahrzeuge fehlen";
            }
        }*/
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
})();
