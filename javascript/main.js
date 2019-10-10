// Doe dingen na het renderen
window.onload = function()
{
    document.querySelector("#generator").addEventListener('click', function() {retrieveData('https://randomuser.me/api/');});
    document.querySelector("#genderField").addEventListener('change', function() { selectedGender(this.value);});
}

// Maak asynchrone functie die JSON ophaalt
async function retrieveData(dataFeed)
{
    //flush earlier results op een tijdelijke manier
    document.querySelector("#tableOutput").innerHTML ="";

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
    
    
    let person = [];
    for (let i = 0; i < myJson.results.length; i++)
    {
        let output = JSON.parse(JSON.stringify(myJson.results[i]));

        person[i] = new Person(output.name.first, output.name.last, output.picture.large, output.dob.date, output.gender, output.location.city, output.location.country, output.location.coordinates.latitude, output.location.coordinates.longitude);
        addRow("tableOutput",i, person[i].profilePicture, person[i].latitude, person[i].longitude, person[i].firstName, person[i].lastName, person[i].gender, person[i].birthDate, person[i].city, person[i].country);
    }
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

    // Kaart-cel
    let mapCell = [];
    let newMap = [];
    let myMap = [];
    mapCell = newRow.insertCell(-1);
    newMap = document.createElement("div");
    newMap.id = "geoMap-" + counter;
    newMap.classList.add("geoMap");
    mapCell.appendChild(newMap);

    // Daadwerkelijke kaart-genereer-functie
    renderMap(myMap, counter, latitude, longitude);
}

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
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibXNnYmlnaG91c2UiLCJhIjoiY2sxaHdrY214MDZkbDNoanpwNW9rcjRsOSJ9.YXMtqR_k0YWeKNnAZHmhdg'
    })
    .addTo(myMap[counter]);
}

function renderFullMap(latitude, longitude)
{
    fullMap = L.map('fullMap').setView([latitude, longitude], 4);
    L.marker([latitude, longitude]).addTo(fullMap);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibXNnYmlnaG91c2UiLCJhIjoiY2sxaHdrY214MDZkbDNoanpwNW9rcjRsOSJ9.YXMtqR_k0YWeKNnAZHmhdg'
    })
    .addTo(fullMap);
}