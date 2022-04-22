const countriesUpgradeButtons = document.getElementById("countries-buttons--upgrade");
const modal = document.getElementById('modalCountry'); // modal
// краткие обозначения стран для игры, доступные страны
const countriesData = {"RU":"Russia", "AL":"Albania", "GL":"Greenland","AM":"Armenia","AT":"Austria","AZ": "Azerbaijan", "BY":"Belarus","BE":"Belgium","BA":"Bosniaand Herzegovina","BG":"Bulgaria","HR":"Croatia","CY":"Cyprus","CZ":"Czech Republic","DK": "Denmark", "EE":"Estonia","FI":"Finland","FR":"France","GB": "Great Britain", "GE":"Georgia","DE":"Germany","GR":"Greece","HU":"Hungary","IS":"Iceland","IE":"Ireland","IT":"Italy", "XK":"Kosovo","LV":"Latvia","LT":"Lithuania","LU":"Luxembourg","MK":"Macedonia","MT": "Malta","MD":"Moldova","ME":"Montenegro","NL": "Netherlands", "TR": "Turkey", "NO": "Norway","PL":"Poland","PT":"Portugal","RO":"Romania","RS":"Serbia","SK":"Slovakia","SI":"Slovenia","ES":"Spain","SE":"Sweden","CH":"Switzerland","UA":"Ukraine"};
let countryList = [];
let activatedCountryList = [];
// класс страны
class Country {
    fullName = "";
    shortName = "";
    money = 0;

    constructor(fullName, shortName) {
        this.fullName = fullName;
        this.shortName = shortName;
    }

    pumpCountry() {
        this.money += 1;
    }
    upgradeCountry() {
        this.money -= 20;
        setInterval(() => this.pumpCountry(), 1000);
    }
}
// привязка к каждой стране чтобы при клике работала
let intervaPumpCountry;
function createPumpPlacements(countryShortName) {
    const placementCountry = document.getElementById(countryShortName);
    placementCountry.onclick = function() {
        pumpCountry(countryShortName);
        setModalCountry(countryShortName);
        clearInterval(intervaPumpCountry);
        intervaPumpCountry = setInterval(function() { refreshModalCountry(countryShortName) }, 1000);
    };
}
// прокачка денег в стране
function pumpCountry(countryShortName) {
    countryList.forEach(country => {
        if (country.shortName === countryShortName) {
            country.pumpCountry();
            checkCanBeCountryUpgrade(countryShortName);
            // 
            if (!activatedCountryList.find(activeCountry => activeCountry.shortName === country.shortName)) {
                activatedCountryList.push(country);
            }
        }
    });
}
// назначение модального окна стране
function setModalCountry(countryShortName) {
    const placementCountry = document.getElementById(countryShortName); // территория страны
    centeringModalCountry(placementCountry);

    countryList.forEach(country => {
        if (country.shortName === countryShortName) {
            modal.querySelector('#shortName').innerHTML = country.fullName;
            modal.querySelector('#bank').innerHTML = country.money;
        }
    })
}
// центрирование модального окна страны
function centeringModalCountry(placementCountry) {
    const { top, left, width, height } = placementCountry.getBoundingClientRect(); // positions target country
    const countryCenterX = width / 2.25 + left; // center target country
    const countryCenterY = height / 2.35 + top; // height target country

    modal.style.display = 'block';
    modal.style.top = countryCenterY + 'px';
    modal.style.left = countryCenterX + 'px';
}
//
function refreshModalCountry(countryShortName) {
    countryList.forEach(country => {
        if (country.shortName === countryShortName) {
            modal.querySelector('#shortName').innerHTML = country.fullName;
            modal.querySelector('#bank').innerHTML = country.money;
        }
    });
    checkCanBeAnyoneCountryUpgrade();
}
// создание кнопки для улучшения страны
function createUpgradeButton(countryShortName) {
    const countryUpgradeButton = document.createElement("button");
    countryUpgradeButton.setAttribute("id", `${countryShortName}-btn`)
    countryUpgradeButton.setAttribute("disabled", "disabled");
    countryUpgradeButton.appendChild(document.createTextNode(`Улучшить ${countryShortName} за 20 Coins`));
    countryUpgradeButton.onclick = function() { 
        countryList.forEach(country => {
            if (country.shortName === countryShortName) {
                if(country.money >= 20) {
                    country.upgradeCountry(); // улучшаем страну
                }
            }
        });
    };
    countriesUpgradeButtons.appendChild(countryUpgradeButton);
}
function checkCanBeCountryUpgrade(countryShortName){
    const currentCountry = document.querySelectorAll(`#${countryShortName}`);
    const currentCountryButton = document.getElementById(`${countryShortName}-btn`);
    countryList.forEach(country => {
        if (country.shortName === countryShortName) {
            for(let i = 0; i < currentCountry.length; i++) {
                if (country.money >= 20) {
                    currentCountry[i].style.fill = "yellowgreen";
                    currentCountryButton.disabled = false;
                } else {
                    currentCountry[i].style.fill = "#c0c0c0";
                    currentCountryButton.disabled = true;
                }
            }
        }
    })

}
// 
function checkCanBeAnyoneCountryUpgrade() {
    activatedCountryList.forEach(country => {
        checkCanBeCountryUpgrade(country.shortName);
    });
}
// создание всех стран
function startGame() {
    for (let countryShortName in countriesData) {
        let countryFullName = countriesData[countryShortName];
        let country = new Country(countryFullName, countryShortName);
        countryList.push(country);
        createPumpPlacements(countryShortName);
        createUpgradeButton(countryShortName);
    }
}

startGame(); // запуск игры 