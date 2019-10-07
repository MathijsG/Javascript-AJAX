// Doe dingen na het renderen
window.onload = function()
{
    
}

async function retrieveData(dataFeed)
{
    const response = await fetch(dataFeed);

    const myJson = await response.json();

   var output = JSON.parse(JSON.stringify(myJson));

   var person = new Person(output.results[0].name.first, output.results[0].name.last, output.results[0].picture.large);

   var image = document.querySelector("#picture");
   var firstName = document.querySelector(".firstName");
   var lastName = document.querySelector(".lastName");

   image.src = person.profilePicture;
   firstName.textContent = person.firstName;
   lastName.textContent = person.lastName;
   
   
}