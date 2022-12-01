// ==UserScript==
// @name         DailyButtonBlink
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Let the daily button blink
// @author       Silberfighter
// @match        https://www.leitstellenspiel.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// @namespace    https://https://github.com/floflo3299/LSS-Scripts/edit/main/DailyButtonBlink.user.js
// ==/UserScript==

(function() {
    'use strict';

    //------- you can change this variables -------

    var blink_speed = 850;  //blinkingspeed.  1000 is equals to 1 second

    //------- after here change only stuff if you know what you are doing -------

    if(document.getElementById("menu_daily_rewards")){
        document.getElementById("menu_daily_rewards").click();

        var t = setInterval(function () {
            if(document.getElementById("daily-bonus").parentElement.getAttribute("style")){
                document.getElementById("daily-bonus").parentElement.setAttribute("style","");
            } else {
                document.getElementById("daily-bonus").parentElement.setAttribute("style","background-color:green;");
            }
        }, blink_speed);
    }
})();
