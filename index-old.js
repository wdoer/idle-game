const panelCountries = document.querySelector('.panel-countries'); // панель всех стран
const modalCurrentCountry = document.getElementById('modalCurrentCountry'); // модальное окно текущей страны
const buttonPumpCountry = document.getElementById('buttonPumpCountry'); // кнопка прокачки страны в модальном окне
const buttonUpgradeCountry = document.getElementById('buttonUpgradeCountry'); // кнопка улучшения страны в модальном окне

const countriesData = {"RU":"Russia", "AL":"Albania", "GL":"Greenland","AM":"Armenia","AT":"Austria","AZ": "Azerbaijan", "BY":"Belarus","BE":"Belgium","BA":"Bosniaand Herzegovina","BG":"Bulgaria","HR":"Croatia","CY":"Cyprus","CZ":"Czech Republic","DK": "Denmark", "EE":"Estonia","FI":"Finland","FR":"France","GB": "Great Britain", "GE":"Georgia","DE":"Germany","GR":"Greece","HU":"Hungary","IS":"Iceland","IE":"Ireland","IT":"Italy", "XK":"Kosovo","LV":"Latvia","LT":"Lithuania","LU":"Luxembourg","MK":"Macedonia","MT": "Malta","MD":"Moldova","ME":"Montenegro","NL": "Netherlands", "TR": "Turkey", "NO": "Norway","PL":"Poland","PT":"Portugal","RO":"Romania","RS":"Serbia","SK":"Slovakia","SI":"Slovenia","ES":"Spain","SE":"Sweden","CH":"Switzerland","UA":"Ukraine"};
// страны в JSON
let countryList = []; // страны в базе данных
let activatedCountryList = []; // страны которые были изменены

// класс страны
class Country {
    // fullName = ""; // полное имя страны
    // shortName = ""; // краткое имя страны
    // money = 0; // банк страны

    constructor(countryName, twoCodeName) {
        this.countryName = countryName;
        this.twoCodeName = twoCodeName;
        this.money = 0;
        this.invervals = null;
    }

    pumpCountry() {
        this.money += 1;
    }
    upgradeCountry() {
        this.money -= 20;
        setInterval(() => { this.pumpCountry(); }, 1000);
    }
    refreshCountryInModal() {
        setInterval(() => { refreshModalCountry(this.twoCodeName); }, 1000);
    }
}

// функция чтобы сделать => при клике на территорию страны открывать модальное окно
function createCountryPlacement(twoCodeName) {
    const placementCountry = document.getElementById(twoCodeName);
    placementCountry.onclick = () => {
        // тз://
        // получить данные про страну, фул, шорт имя и бабки
        // привязать функции к кнопкам прокачки
        // привязать функции к кнопке улучшения
        clearInformationFromModal();
        showCurrentCountry(twoCodeName);
        setModalCountry(twoCodeName);
        // clearInterval(intervaPumpCountry); [code1]
        // intervaPumpCountry = setInterval(function() { refreshModalCountry(twoCodeName) }, 100); [code1]
    };
}
//
function clearInformationFromModal() {
    countryList.forEach(country => {
        let placementsCountry = document.querySelectorAll(`#${country.shortName}`);
        for(let i = 0; i < placementsCountry.length; i++) {
            placementsCountry[i].classList.remove('select-country');
        }
    }) // удаляем обводку
        // modalCurrentCountry.querySelector('#shortName').innerHTML = 'ShortName';
        // modalCurrentCountry.querySelector('#bank').innerHTML = '0'; // очищаем текстовые поля
    buttonUpgradeCountry.disabled = true; // выключаем улучшение по умолчанию
}
// показать текущую страну
function showCurrentCountry(twoCodeName) {
    // удаление выделений со всех стран
    // countryList.forEach(country => {
    //     let placementsCountry = document.querySelectorAll(`#${country.shortName}`);
    //     for(let i = 0; i < placementsCountry.length; i++) {
    //         placementsCountry[i].classList.remove('select-country');
    //     }
    // })
    // добавления выделения на текущую страну
    const currentCountry = document.querySelectorAll(`#${twoCodeName}`);
    for(let i = 0; i < currentCountry.length; i++) {
        currentCountry[i].classList.add('select-country');
    }
}
// прокачка денег в стране
// function pumpCountry(twoCodeName) {
//     countryList.forEach(country => {
//         if (country.shortName === twoCodeName) {
//             country.pumpCountry();
//             checkCanBeCountryUpgrade(twoCodeName);
//             // 
//             if (!activatedCountryList.find(activeCountry => activeCountry.shortName === country.shortName)) {
//                 activatedCountryList.push(country);
//             }
//         }
//     });
// }
// назначение модального окна стране
function setModalCountry(twoCodeName) {
    let currentPlacesCountry = document.querySelectorAll(`#${twoCodeName}`);
    for(let i = 0; i < currentPlacesCountry.length; i++) {
        currentPlacesCountry[i].classList.add('select-country');
    } // выделение территорий всей страны

    const placementCountry = document.getElementById(twoCodeName); // территория страны
    centeringModalCountry(placementCountry); // центрирование модалки по территории страны
    
    // console.log(country);
    let currentCountry = countryList.find(country => country.twoCodeName === twoCodeName);
    modalCurrentCountry.querySelector('#shortName').innerHTML = currentCountry.countryName;
    modalCurrentCountry.querySelector('#bank').innerHTML = currentCountry.money;
    buttonPumpCountry.onclick = () => {
        currentCountry.pumpCountry();
        refreshModalCountry(twoCodeName);
        checkCanBeCountryUpgrade(twoCodeName);
        //
        if (!activatedCountryList.find(activeCountry => activeCountry.shortName === twoCodeName)) {
            activatedCountryList.push(currentCountry);
        }
    }
    buttonUpgradeCountry.onclick = () => {
        if(currentCountry.money >= 20) {
            currentCountry.upgradeCountry(); // улучшаем страну
            currentCountry.refreshCountryInModal(this.twoCodeName)
        }
    }
}
// центрирование модального окна страны
function centeringModalCountry(placementCountry) {
    const { top, left, width, height } = placementCountry.getBoundingClientRect(); // positions target country
    const countryCenterX = width / 2.25 + left; // center target country
    const countryCenterY = height / 2.35 + top; // height target country

    modalCurrentCountry.style.display = 'block';
    modalCurrentCountry.style.top = countryCenterY + 'px';
    modalCurrentCountry.style.left = countryCenterX + 'px';
}
//
function refreshModalCountry(twoCodeName) {
    const currentCountry = countryList.find(country => country.twoCodeName === twoCodeName);
    modalCurrentCountry.querySelector('#shortName').innerHTML = currentCountry.countryName;
    modalCurrentCountry.querySelector('#bank').innerHTML = currentCountry.money;
    checkCanBeAnyoneCountryUpgrade();
}
// создание кнопки для улучшения страны
// function createUpgradeButton(twoCodeName) {
//     const countryUpgradeButton = document.createElement("button");
//     countryUpgradeButton.setAttribute("id", `${twoCodeName}-btn`)
//     countryUpgradeButton.setAttribute("disabled", "disabled");
//     countryUpgradeButton.appendChild(document.createTextNode(`Улучшить ${twoCodeName} за 20 Coins`));
//     countryUpgradeButton.onclick = function() { 
//         countryList.forEach(country => {
//             if (country.shortName === twoCodeName) {
//                 if(country.money >= 20) {
//                     country.upgradeCountry(); // улучшаем страну
//                 }
//             }
//         });
//     };
//     // buttonsUpgradeCountries.appendChild(countryUpgradeButton);
// }
function checkCanBeCountryUpgrade(twoCodeName){
    const placementsCountry = document.querySelectorAll(`#${twoCodeName}`);
    const currentCountry = countryList.find(country => country.twoCodeName === twoCodeName);
    if (currentCountry.money >= 20) {
        for (let i = 0; i < placementsCountry.length; i++) {
            placementsCountry[i].style.fill = "yellowgreen";
            buttonUpgradeCountry.disabled = false;
        }
    } else {
        for (let i = 0; i < placementsCountry.length; i++) {
            placementsCountry[i].style.fill = "#c0c0c0";
            buttonUpgradeCountry.disabled = true;
        }
    }
}
// 
function checkCanBeAnyoneCountryUpgrade() {
    activatedCountryList.forEach(country => {
        checkCanBeCountryUpgrade(country.twoCodeName);
    });
}
// создание кнопочек для всех стран
function createCountryButtonsForPanel(countryFullName) {
    let elementCountry = document.createElement('li');
    let buttonCountry = document.createElement('button');
    buttonCountry.innerHTML = countryFullName;
    elementCountry.appendChild(buttonCountry);
    panelCountries.appendChild(elementCountry);
}
// создание всех стран
function startGame() {
    for (let twoCodeName in countriesData) {
        let countryName = countriesData[twoCodeName];
        let country = new Country(countryName, twoCodeName);
        countryList.push(country);
        createCountryPlacement(twoCodeName);
        createCountryButtonsForPanel(countryName);
    }
}

startGame(); // запуск игры 