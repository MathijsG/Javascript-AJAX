class Person
{
    constructor(firstName, lastName, profilePicture)
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this._profilePicture = profilePicture;
    }
    get profilePicture()
    {
        return this._profilePicture;
    }
}