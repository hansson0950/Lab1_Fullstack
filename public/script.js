// Initialize table with users
const table = document.querySelector("#table")

window.onload = function initialize() {
    fetch("api/users", { method: "GET" })
    .then(res => res.json())
    .then(response => {    
        JSON.stringify(response); 
        for (var i = 0; i < response.length; i++) {
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);

            cell1.innerHTML = response[i].name;
            cell2.innerHTML = response[i].age;

            var button1 = document.createElement("input");
            button1.value = "Details";
            button1.className = "submit";
            button1.id = "button1" + i;
            button1.type = "button";
            cell3.appendChild(button1);

            var button2 = document.createElement("input");
            button2.value = "Update";
            button2.className = "submit";
            button2.id = "button2" + i;
            button2.type = "button";
            cell4.appendChild(button2);

            var button3 = document.createElement("input");
            button3.value = "Delete";
            button3.className = "submit";
            button3.id = "button3" + i;
            button3.type = "button";
            cell5.appendChild(button3);
        }
    });
};

// Find out what button was pressed
table.addEventListener("click", e => {
    var element = e.target;
    if (!element.type == "button") return;

    var rowNumber = element.id.charAt(7)
    var action = element.id.charAt(6)

    if (action == "1") {
        showDetails(rowNumber);
    }
    if (action == "2") {
        updateUser(rowNumber);
    }
    if (action == "3") {
        deleteUser(rowNumber);
    }
})

// Show details of a user
const detailsPopup = document.querySelector("#detailsPopup");
const userID = document.querySelector("#userID");
const userName = document.querySelector("#userName");
const userAge = document.querySelector("#userAge");
const userJoinDate = document.querySelector("#userJoinDate");

function showDetails(rowNumber) {
    detailsPopup.style.visibility = "visible";
    fetch("api/users", { method: "GET" })
    .then(res => res.json())
    .then(response => {
        JSON.stringify(response);
        userID.innerHTML = response[rowNumber]._id;
        userName.innerHTML = response[rowNumber].name;
        userAge.innerHTML = response[rowNumber].age;
        userJoinDate.innerHTML = response[rowNumber].joinDate;
    });
}

function closeDetails() {
    detailsPopup.style.visibility = "hidden";
}

// Update a user
const updateName = document.querySelector("#updateName");
const updateAge = document.querySelector("#updateAge");
const updateError = document.querySelector("#updateError");

function updateUser(rowNumber) {
    fetch("api/users", { method: "GET" })
    .then(res => res.json())
    .then(response => {
        JSON.stringify(response);
        var id = response[rowNumber]._id;
        var updateDetails;

        if (updateName.value == "") {
            updateDetails = { age: updateAge.value }
        } else if (updateAge.value == "") {
            updateDetails = { name: updateName.value }
        } else {
            updateDetails = {
                name: updateName.value,
                age: updateAge.value
            }
        }
        fetch("api/users/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateDetails)
        })
        .then(response => {
            if (!response.ok) return updateError.innerHTML = "Error";
            location.reload();
        });
    });
}

// Delete a user
function deleteUser(rowNumber) {
    if (!confirm("Are you sure you want to delete this user?")) return; 

    fetch("api/users", { method: "GET" })
    .then(res => res.json())
    .then(response => {
        JSON.stringify(response);
        var id = response[rowNumber]._id;
        fetch("api/users/" + id, { method: "DELETE" })
        .then(response => {
            if (!response.ok) return;
            location.reload();
        });
    });    
}

// Register a new user
const registerUser = document.querySelector("#registerUser");
const registerName = document.querySelector("#registerName");
const registerAge = document.querySelector("#registerAge");
const registerError = document.querySelector("#registerError");

registerUser.addEventListener("submit", e => {
    e.preventDefault();
    const registerDetails = {
        name: registerName.value,
        age: registerAge.value
    };
    fetch("api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerDetails)
    })
    .then(response => {
        if (!response.ok) return registerError.innerHTML = "Error";
        location.reload();
    });
});