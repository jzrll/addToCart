// firebase libraries
// https://firebase.google.com/docs/web/learn-more#libraries-cdn

// importing functions from firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js"

// object
const appSettings = {
    // url to my firebase realtime db
    databaseURL: "https://addtocart-eb6ca-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

// setup for the db
const app = initializeApp(appSettings)
const database = getDatabase(app)
// reference to be used in push(inserting), remove(delete)
const itemsInDB = ref(database, "items")

// html elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingList = document.getElementById("item-list")

// onValue returns the list using snapshot.val()
// using the reference, then function from firebase // onValue(reference, func)
// gets from the database

onValue(itemsInDB, function(snapshot) {
    // check if db is empty
    if (snapshot.exists()){
        // clear the list before appending
        clearShoppingList()

        //Object.entries = [key,value
        //Object.keys or Object.values
        let itemsss = Object.entries(snapshot.val())
        
        // appends items to the list
        for (let i = 0; i < itemsss.length; i++) {
            appendToList(itemsss[i])
        }
    } else {
        shoppingList.innerHTML = "No items here...yet"
        return
    }
    
})

// onclick
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    // write to the db push()
    push(itemsInDB, inputValue)
    clearInputFieldEl()
})

function clearShoppingList() {
    shoppingList.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendToList(item) {
    let curItemID = item[0]
    let curItem = item[1]

    // create new element
    let newElement = document.createElement("li")
    // assigning an id
    // newElement.setAttribute("id", itemId);
    newElement.id = curItemID
    // assign value
    newElement.textContent = curItem

    // eventlistener for deleteing in the db
    newElement.addEventListener("click", function() {
        let locationInDB = ref(database, `items/${curItemID}`)
        remove(locationInDB)
    })

    //append to the parent which is shoppingList (where to put the new element)
    shoppingList.append(newElement)
}
