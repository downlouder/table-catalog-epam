const appRoot = document.getElementById('app-root');

// write your code here
const form = document.createElement('form');
const divType = document.createElement('div');
const divQuery = document.createElement('div');
const divInput1 = document.createElement('div');
const divInput2 = document.createElement('div');
const divInputs = document.createElement('div');
const selectQuery = document.createElement('select');
const pDefault = document.createElement('p');
const table = document.createElement('table');
let arrayWords = ['Country name', 'Capital', 'World Region', 'Languages', 'Area', 'Flag'];
const regionListLength = externalService.getRegionsList().length;
const languagesListLength = externalService.getLanguagesList().length;
let options;

appRoot.innerHTML += '<header><h1>Countries Search</h1></header>';
form.id = 'applicationApplication'
appRoot.appendChild(form);

divType.textContent = 'Please choose type of search:';
divQuery.textContent = 'Please choose search query:';
form.appendChild(divType);
form.appendChild(divQuery);
divInput1.innerHTML += '<input type="radio" name="radio" id="region"><label for="region">By Region</label>';
divInput2.innerHTML += '<input type="radio" name="radio" id="language"><label for="language">By Language</label>';

divInput1.className = 'radioInput';
divInput2.className = 'radioInput';
divInputs.className = 'inputs';
divType.appendChild(divInputs);
divInputs.appendChild(divInput1);
divInputs.appendChild(divInput2);

selectQuery.disabled = true;
selectQuery.id = 'search';
selectQuery.setAttribute('name', 'search');
selectQuery.innerHTML += '<option value="selectValue">Select value</option>';
divQuery.appendChild(selectQuery);

pDefault.textContent = 'No items, please choose search query';
pDefault.hidden = true;
appRoot.appendChild(pDefault);

const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('change', function() {
        table.innerHTML = '';
        if (this.checked) {
            selectQuery.disabled = false;
        }
        if (this.id === 'region') {
            selectQuery.innerHTML = '<option value="selectValue">Select value</option>';
            for (let i = 0; i < regionListLength; i++) {
                selectQuery.innerHTML += `<option value="${externalService.getRegionsList()[i]}">
                ${externalService.getRegionsList()[i]}</option>`
            }
            pDefault.hidden = false;
            options = document.querySelectorAll('option');
        } else if (this.id === 'language') {
            selectQuery.innerHTML = '<option value="selectValue">Select value</option>';
            for (let i = 0; i < languagesListLength; i++) {
                selectQuery.innerHTML += `<option value="${externalService.getLanguagesList()[i]}">
                ${externalService.getLanguagesList()[i]}</option>`
            }
            pDefault.hidden = false;
            options = document.querySelectorAll('option');
        }
    });
});

//SELECT AND TABLE
selectQuery.addEventListener('change', function () {
    if (selectQuery.value === 'selectValue') {
        table.innerHTML = '';
        pDefault.hidden = false;
    } else {
        pDefault.hidden = true;
    }
    if (selectQuery.value !== 'selectValue') {
        createTable(selectQuery.value);
    }
})
//TABLE
table.hidden = true;
appRoot.appendChild(table);

function createTable(value) {
    const regionInput = document.getElementById('region');
    const languageInput = document.getElementById('language');
    let thName, thArea, choice;
    let nameSorting = '⇑';
    let areaSorting = '⇕';
    table.hidden = false;
    if (regionInput.checked) {
        choice = externalService.getCountryListByRegion(value);
        sorting(choice);
    } else if (languageInput.checked) {
        choice = externalService.getCountryListByLanguage(value); 
        sorting(choice);
    }
    function createCells(choice) {
        table.innerHTML = '';
        for (let i = 0; i < 1; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < arrayWords.length; j++) {
                tr.innerHTML += `<th>${arrayWords[j]}</th>`;
            }
            table.appendChild(tr);
        }
        thName = document.querySelector('tr th:nth-child(1)');
        thArea = document.querySelector('tr th:nth-child(5)');
        thName.setAttribute('data-after1', nameSorting);
        thArea.setAttribute('data-after2', areaSorting);
        for (let i = 0; i < choice.length; i++) {
            let tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${choice[i].name}</td>
            <td>${choice[i].capital}</td>
            <td>${choice[i].region}</td>
            <td>${Object.values(choice[i].languages).join(', ')}</td>
            <td>${choice[i].area}</td>
            <td><img src="${choice[i].flagURL}" alt="Flag"></td>
            `;
            table.appendChild(tr);
        }
        setArrows();
    }
    function setArrows() {
        thName.addEventListener('click', () => {
            if (thName.getAttribute('data-after1') === '⇑') {
                nameSorting = '⇓';
                thName.setAttribute('data-after1', nameSorting);
            } else {
                nameSorting = '⇑';
                thName.setAttribute('data-after1', nameSorting);
            }
            areaSorting = '⇕';
            thArea.setAttribute('data-after2', areaSorting);
            sorting(choice);
        });
        thArea.addEventListener('click', () => {
            if (thArea.getAttribute('data-after2') === '⇑') {
                areaSorting = '⇓';
                thArea.setAttribute('data-after2', areaSorting);
            } else {
                areaSorting = '⇑';
                thArea.setAttribute('data-after2', areaSorting);
            }
            nameSorting = '⇕';
            thName.setAttribute('data-after1', nameSorting);
            sorting(choice);
        });
    }
    function sorting(choice) {
        let changingChoice = choice;
        if (nameSorting === '⇕') {
            if (areaSorting === '⇑') {
                createCells(changingChoice.sort(byField('area')));
            } else {
                createCells(changingChoice.sort(byField('area')).reverse());
            }
        } else if (areaSorting === '⇕') {
            if (nameSorting === '⇑') {
                createCells(changingChoice.sort(byField('name')));
            } else {
                createCells(changingChoice.sort(byField('name')).reverse());
            }
        }
        function byField(field) {
            return (a, b) => a[field] > b[field] ? 1 : -1;
        }
    }
}

// list of all regions
// console.log(externalService.getRegionsList());
// list of all languages
// console.log(externalService.getLanguagesList());
// get countries list by language
// console.log(externalService.getCountryListByLanguage('Ukrainian'))
// get countries list by region
// console.log(externalService.getCountryListByRegion('Europe'))