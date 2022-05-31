const modalCurrentCountry = document.getElementById('modalCurrentCountry'); // модальное окно текущей страны
const twoCodeCurrentCountry = modalCurrentCountry.querySelector('#twoCodeName');
const bankCurrentCountry = modalCurrentCountry.querySelector('#bank');
const upgradeCostCurrentCountry = modalCurrentCountry.querySelector('#upgradeCost');
const buttonPumpCountry = document.getElementById('buttonPumpCountry'); // кнопка прокачки страны в модальном окне
const buttonUpgradeCountry = document.getElementById('buttonUpgradeCountry'); // кнопка улучшения страны в модальном окне
let prevCountry = null;

const countriesData = {"RU":"Russia", "AL":"Albania", "GL":"Greenland","AM":"Armenia","AT":"Austria","AZ": "Azerbaijan", "BY":"Belarus","BE":"Belgium","BA":"Bosniaand Herzegovina","BG":"Bulgaria","HR":"Croatia","CY":"Cyprus","CZ":"Czech Republic","DK": "Denmark", "EE":"Estonia","FI":"Finland","FR":"France","GB": "Great Britain", "GE":"Georgia","DE":"Germany","GR":"Greece","HU":"Hungary","IS":"Iceland","IE":"Ireland","IT":"Italy", "XK":"Kosovo","LV":"Latvia","LT":"Lithuania","LU":"Luxembourg","MK":"Macedonia","MT": "Malta","MD":"Moldova","ME":"Montenegro","NL": "Netherlands", "TR": "Turkey", "NO": "Norway","PL":"Poland","PT":"Portugal","RO":"Romania","RS":"Serbia","SK":"Slovakia","SI":"Slovenia","ES":"Spain","SE":"Sweden","CH":"Switzerland","UA":"Ukraine"};
// страны в JSON

let countryList = []; // полные страны с класса Country в бд
let changedCountryList = []; // страны которые были изменены

class Country {
    constructor(countryName, twoCodeName) {
        this.countryName = countryName;
        this.twoCodeName = twoCodeName;
        this.bank = 0;
        this.upgrades = 0;
        this.nextUpgradeCost = 5;
    }

    pumpBank(n = 1) {
        this.bank += n;
    }
    autoPumpBank() {
      this.refreshData();
      if(!this.pumpingIsRun) {
        this.pumpingIsRun = true;
        setInterval(() => {
          this.pumpBank(this.upgrades)
          if(this.bank >= this.nextUpgradeCost)
            this.checkCountryToUpgrade();
        }, 200);
        this.autoRefreshData();
      }
    }
    upgradeCountry() {
      if (this.bank < this.nextUpgradeCost)
        return;
      this.bank -= this.nextUpgradeCost;
      this.upgrades += 1;
      this.nextUpgradeCost *= 2;
      this.autoPumpBank();
    }
    refreshData() {
      this.lazyData = false;
      twoCodeCurrentCountry.innerHTML = this.countryName;
      this.refreshUpgradeCost();
      this.refreshBank();
      this.checkCountryToUpgrade();
    }
    refreshBank() {
      bankCurrentCountry.innerHTML = this.bank;
    }
    refreshUpgradeCost() {
      upgradeCostCurrentCountry.innerHTML = this.nextUpgradeCost;
    }
    autoRefreshData() {
      if (!this.upgrades)
        return;
      prevCountry = this;
      this.autoRefreshDataTimer = setInterval(() => {
        this.refreshBank();
      }, 200);
    }
    stopRefreshData() {
      this.lazyData = true;
      clearInterval(this.autoRefreshDataTimer);
    }
    checkCountryToUpgrade() {
      const placementsCountry = document.querySelectorAll(`#${this.twoCodeName}`);
      if (this.bank >= this.nextUpgradeCost) {
          for (let i = 0; i < placementsCountry.length; i++) {
              placementsCountry[i].style.fill = "yellowgreen";
              if (!this.lazyData)
                this.enableButtonUpgrade()
          }
      } else {
          for (let i = 0; i < placementsCountry.length; i++) {
              placementsCountry[i].style.fill = "#c0c0c0";
              if (!this.lazyData)
                this.disabledButtonUpgrade()
          }
      }
    }
    enableButtonUpgrade() {
      buttonUpgradeCountry.disabled = false;
    }
    disabledButtonUpgrade() {
      buttonUpgradeCountry.disabled = true;
    }
}

function createCountryPlacement(twoCodeName) {
    const placementCountry = document.getElementById(twoCodeName);
    placementCountry.onclick = () => {
        deactivedCountryList();
        showCurrentCountry(twoCodeName);
        setModalCountry(twoCodeName);
    };
}
function deactivedCountryList() {
    countryList.forEach(country => {
        let placementsCountry = document.querySelectorAll(`#${country.twoCodeName}`);
        for(let i = 0; i < placementsCountry.length; i++) {
            placementsCountry[i].classList.remove('select-country');
        }
    })
}
function showCurrentCountry(twoCodeName) {
    const currentCountry = document.querySelectorAll(`#${twoCodeName}`);
    for(let i = 0; i < currentCountry.length; i++) {
        currentCountry[i].classList.add('select-country');
    }
}
function setModalCountry(twoCodeName) {
    prevCountry && prevCountry.stopRefreshData()
    const placementCountry = document.getElementById(twoCodeName);
    centeringModalCountry(placementCountry);
    let currentCountry = countryList.find(country => country.twoCodeName === twoCodeName);
    currentCountry.refreshData();
    currentCountry.autoRefreshData();
    buttonPumpCountry.onclick = () => {
        currentCountry.pumpBank();
        currentCountry.refreshBank();
        currentCountry.checkCountryToUpgrade();
    }
    buttonUpgradeCountry.onclick = () => {
      currentCountry.upgradeCountry();
      currentCountry.refreshBank();
    }
}
function centeringModalCountry(placementCountry) {
    const { top, left, width, height } = placementCountry.getBoundingClientRect();
    const countryCenterX = width / 2.25 + left;
    const countryCenterY = height / 2.35 + top;

    modalCurrentCountry.style.display = 'block';
    modalCurrentCountry.style.top = countryCenterY + 'px';
    modalCurrentCountry.style.left = countryCenterX + 'px';
}
function startGame() {
  for (let twoCodeName in countriesData) {
    let countryName = countriesData[twoCodeName];
    let country = new Country(countryName, twoCodeName);
    countryList.push(country);
    createCountryPlacement(twoCodeName);
  }
}

startGame();