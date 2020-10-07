let firstTime = true;


// Koppel events aan bepaalde elementen
window.onload = function()
{
    document.querySelector("#generator").addEventListener('click', function() {retrieveData('https://randomuser.me/api/');});
    document.querySelector("#genderField").addEventListener('change', function() { selectedGender(this.value);});
    
    
    // Maak de fullMap eerst onzichtbaar
    document.querySelector("#fullMap").style.display = 'none';
}

// Parameters-functionaliteit maken
function appendParametersToUrl(url)
{
    url = new URL('https://example.com?foo=1&bar=2');
    let params = new URLSearchParams(url.search.slice(1));

    //Add a second foo parameter.
    params.append('foo', 4);
    //Query string is now: 'foo=1&bar=2&foo=4'
}

// Maak asynchrone functie die JSON ophaalt
async function retrieveData(dataFeed)
{
    //flush earlier results op een tijdelijke manier
    document.querySelector("#tableOutput").innerHTML = "";

    // Gebruik amount voor ophalen van hoeveelheid personen
    amount = document.querySelector("#amount").value;
    // Gooi de hoeveelheid als parameter in de API-URL
    dataFeed += "?results=" + amount;

    // Gender als optie voor de data-feed
    gender = document.querySelector("#genderField").value;
    
    switch(gender)
    {
        case 'male':
            // Gooi gender als parameter in de API-URL
            dataFeed+= "&gender=" + gender;
            break;

        case 'female':
            dataFeed+= "&gender=" + gender;
            break;
    }

    // Ophalen van de JSON
    const response = await fetch(dataFeed);
    const myJson = await response.json();
    

    if (firstTime == false)
    {
        fullMap.off();
        fullMap.remove();
    }

    // Initializeren van de hoofdkaart
    fullMap = L.map('fullMap').setView([51.505, -0.09], 4);
    L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 18,
        id: 'mapbox.streets'
    })
    .addTo(fullMap);
    let arrayOfLatLngs = []; // Array met coordinaten
    var bounds = new L.LatLngBounds(arrayOfLatLngs);
    // Itereer door de JSON-resultaten en sla de gegevens op in een array van persoonsobjecten
    for (let i = 0; i < myJson.results.length; i++)
    {
        let output = JSON.parse(JSON.stringify(myJson.results[i]));

        // Koppel bepaalde gegevens van de JSON-feed aan persoonobjecten
        let person = new Person(output.name.first, output.name.last, output.picture.large, output.dob.date, output.gender, output.location.city, output.location.country, output.location.coordinates.latitude, output.location.coordinates.longitude, giveRandomCrime());
        addRow("tableOutput",i, person.profilePicture, person.latitude, person.longitude, person.firstName, person.lastName, person.gender, person.birthDate, person.city, person.country);
        
        // Voeg de markers iteratief toe
        var marker = L.marker([person.latitude, person.longitude]).addTo(fullMap);
        // Popup van kaart-items
        var popup = marker.bindPopup(person.firstName + ' ' + person.lastName + '<br><img src="' + person.profilePicture + '"><br>Gezocht voor:<br><span> ' + person.crime + '</span>');
        
        // Voeg latitude en longitude van elke user in een array voor map-centrering
        arrayOfLatLngs[i] = [person.latitude, person.longitude];
        //arrayOfLatLngs.push(...[person.latitude, person.longitude]); werkt niet
    }
    // Laat fullmap zien
    document.querySelector("#fullMap").style.display = 'block';
    fullMap.invalidateSize(); // Forceer het herrenderen van leaflet
    // Zoom map op alle markers
    fullMap.fitBounds([arrayOfLatLngs]);
}

function addRow(tableId, counter, profilePicture, latitude, longitude, firstName, lastName, gender, birthDate)
{
    let table = document.querySelector("#" + tableId);
    birthDate = new Date(birthDate);
    birthDate = birthDate.toDateString();
    // Maak een nieuwe rij
    let newRow = table.insertRow(-1); // -1 is einde van de tabel
    
    // Incrementall Cell
    let incrementCell = newRow.insertCell(-1);
    let incrementalData = document.createTextNode(counter + 1);
    incrementCell.appendChild(incrementalData);
    // Gooi responsive classes aan cellen die weg moeten bij klein scherm
    incrementCell.classList.add("d-none", "d-sm-table-cell");
    
    // Afbeeldingscel
    let imageCell = newRow.insertCell(-1);
    let newImage = document.createElement("img");
    newImage.classList.add("profilePicture");
    newImage.src = profilePicture;
    imageCell.appendChild(newImage);
    
    // Dynamische cellen in een for-loop
    let newCell = [];    
    let amountOfData = arguments.length - 5; // Haal eerste 5 argumenten uit de parameter qua telling
    
    // Eerste argument wordt gebruikt voor tabelaanduiding maar niet voor output en tweede argument is de image, dus die moet buiten de for loop.
    // Daarnaast moeten de laatste twee parameters worden gebruikt voor de kaart, en niet in de dynamische loop
    for (let i = 0; i < amountOfData; i++)
    {
        newCell[i] = newRow.insertCell(-1);
        let newText = document.createTextNode(arguments[(i+5)]); // Gebruik de parameter-data vanaf de 5e positie
        newCell[i].appendChild(newText);
    }

    // Toevoegen van responsive-klassen aan bepaalde cellen
    newCell[2].classList.add("d-none", "d-sm-table-cell"); // Geslacht-cell
    newCell[3].classList.add("d-none", "d-sm-table-cell"); // Geboortedatum-cell

    // Kaart-cel
    let mapCell = [];
    let newMap = [];
    let myMap = [];
    mapCell = newRow.insertCell(-1);
    newMap = document.createElement("div");
    newMap.id = "geoMap-" + counter;
    newMap.classList.add("geoMap","d-none", "d-sm-table-cell", "shadow");
    mapCell.appendChild(newMap);

    // Daadwerkelijke kaart-genereer-functie
    renderMap(myMap, counter, latitude, longitude);

    firstTime = false; // boolean om te checken of het hoofdkaart-element eerst verwijderd moet worden, als deze al een keer geladen is.
}

// Functie voor het wisselen van de gender
function selectedGender(gender)
{
    if (!!gender) // NOT NOT operator
    {
        return gender;
    }
}

function renderMap(myMap, counter, latitude, longitude)
{
    myMap[counter] = L.map('geoMap-' + counter).setView([latitude, longitude], 4);
    L.marker([latitude, longitude]).addTo(myMap[counter]);
    L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 18,
        id: 'mapbox.streets'
    })
    .addTo(myMap[counter]);
}

function addMarker(mapName, latitude, longitude)
{
    L.marker([latitude, longitude]).addTo(mapName);
}

function giveRandomCrime()
{
    let crime = ["Dragen van sokken in slippers", "Neusknijpen", "Luisteren naar Celine Dion", "Beledigen ambtenaar", "PVV stemmen", "Richtingaanwijzer niet gebruiken", "Smakken", "Korsten niet opeten", "Boter terugsmeren", "Nagelbijten", "Verticaal filmen"];
    let random = Math.floor(Math.random() * crime.length);
    return crime[random];
}