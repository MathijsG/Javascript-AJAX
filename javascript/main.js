// Doe dingen na het renderen
window.onload = function()
{
    document.querySelector("#generator").addEventListener('click', function() {retrieveData('https://randomuser.me/api/');});
}

// Maak asynchrone functie die JSON ophaalt
async function retrieveData(dataFeed, amount)
{
    // Gebruik amount voor ophalen van hoeveelheid personen
    amount = document.querySelector("#amount").value;
    
    // Gooi de hoeveelheid als parameter in de API-URL
    dataFeed += "?results=" + amount;

    // Ophalen van de JSON
    const response = await fetch(dataFeed);
    const myJson = await response.json();
    
    
    let person = [];
    for (let i = 0; i < myJson.results.length; i++)
    {
        let output = JSON.parse(JSON.stringify(myJson.results[i]));

        person[i] = new Person(output.name.first, output.name.last, output.picture.large, output.dob.date, output.gender, output.location.city, output.location.country);

        let image = document.querySelector("#picture");
        let firstName = document.querySelector(".firstName");
        let lastName = document.querySelector(".lastName");

        // image.src = person[i].profilePicture;
        // firstName.textContent = person[i].firstName;
        // lastName.textContent = person[i].lastName;

        addRow("tableOutput",i, person[i].profilePicture, person[i].firstName, person[i].lastName, person[i].gender, person[i].birthDate, person[i].city, person[i].country)
    }
}

function addRow(tableId, counter, profilePicture, firstName, lastName, gender, birthDate)
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
    newImage.src = profilePicture;
    imageCell.appendChild(newImage);   
    
    // Dynamische cellen in een for-loop
    let newCell = [];    
    let amountOfData = arguments.length - 3; // Haal eerste 3 argumenten uit de parameter qua telling
    
    for (let i = 0; i < amountOfData; i++) // Eerste argument wordt gebruikt voor tabelaanduiding maar niet voor output en tweede argument is de image, dus die moet buiten de for loop
    {
        newCell[i] = newRow.insertCell(-1);
        let newText = document.createTextNode(arguments[(i+3)]);
        newCell[i].appendChild(newText);
    }
}