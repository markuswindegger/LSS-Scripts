// ==UserScript==
// @name         Pumpkin-Beep
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Will play a sound, when an pumpkin or egg is nearby!
// @author       Silberfighter
// @match        https://www.leitstellenspiel.de/missions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //------- you can change this variables -------

    var volume = 0.15; //volume of beep. Minimum 0, Maximum 1. recommended 0.15
    var showVisual = true; //enables or disables the visual hint.    true   for enable,   false   for disable
    var blink_speed = 850;  //blinkingspeed.  1000 is equals to 1 second
    var clickBeep = true; //enables or disables beeping at every click.    true   for enable,   false   for disable

    //------- after here change only stuff if you know what you are doing -------


    function play() {
        var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
        audio.volume = volume;
        audio.play();
    }

    if(document.getElementById("easter-egg-link")){
        play();

        $(document).mouseup(function(e) {
            //check if Egg is hidden
            if(clickBeep && !document.getElementById("easter-egg-link").getAttribute("style")){
                play();
            }
        });

        $(document).keyup(function(e) {
            //check if Egg is hidden
            if(clickBeep && !document.getElementById("easter-egg-link").getAttribute("style")){
                play();
            }
        });

        if(showVisual){
            //let the message window blink
            var t = setInterval(function () {
                var ele = document.getElementById('myBlinkingDiv');
                if(ele){
                    ele.style.visibility = (ele.style.visibility == '' ? 'hidden' : '');
                } else {
                    clearInterval(t);
                }
            }, blink_speed);


            var a = document.createElement("span");

            a.setAttribute("style","border-top:thick red solid;border-bottom:thick red solid;border-left:thick red solid; border-right:thick red solid;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px;");
            a.setAttribute("class","alert alert-danger alert-missing-vehicles");
            a.setAttribute("id","myBlinkingDiv");
            a.innerHTML = "Collect me!!!";

            document.getElementById("easter-egg-link").append(a);

            setTimeout(()=>{document.getElementById("easter-egg-link").click()}, 1800);
        }
    }
})();
