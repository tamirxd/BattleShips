var refreshRate = 2000; //mili seconds


function updateLobbyLists() {
    ajaxUsersList();
    ajaxRoomsList();
}

$(function () {
    getUserName();
    setInterval(updateLobbyLists, refreshRate);
});

function getUserName() {
    $.ajax({
        url: "../../lobbyactions/username",
        success: function (username) {
            updateUserNameInLobby(username);

        }
    });
}

function updateUserNameInLobby(name) {
    var nameDiv = document.getElementById("playerName");
    nameDiv.innerText = "Welcome, " + name;
}


function ajaxUsersList() {

    $.ajax({
        url: "../../PlayersList",
        success: function (users) {
            updateListOfPlayers(users);

        }
    });
}


function addUserToRoom(roomName) {

    return function (event) {
        $.ajax({
            url: "../../lobbyactions/addPlayerToRoom",
            data: {roomToEnter: roomName},
            success: function () {
                window.location.href = "../game/gameroom.html"
            },
            error: function () {
            }

        });
    };
}

function removeRoom(roomName) {
    return function (event) {
        var table = document.getElementById("roomTable");
        clearTable(table);
        $.ajax({
            url: "../../lobbyactions/removeroom",
            data: {roomToRemove: roomName},
            type: "POST",
            success: function () {
                ajaxRoomsList()
            }
        });
    };
}

function updateListOfRooms(rooms) {

    if (rooms != undefined) {
        if (rooms != null) {
            var table = document.getElementById("roomTable");
            clearTable(table);
            for (i = 0; i < rooms.length; i++) {
                var row = document.createElement('tr');
                var row = table.insertRow(i);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);//delete game
                row.getElementsByTagName('td')[0].width = "20%";
                row.getElementsByTagName('td')[1].width = "15%";
                row.getElementsByTagName('td')[2].width = "10%";
                row.getElementsByTagName('td')[3].width = "15%";
                row.getElementsByTagName('td')[4].width = "10%";
                row.getElementsByTagName('td')[5].width = "15%";
                row.getElementsByTagName('td')[6].width = "15%";

                var userWaiting = isUserWaiting(rooms[i].m_WaitingList);
                switch (userWaiting) {

                    case("User is Waiting"):
                        row.getElementsByTagName('td')[3].style.color = "#28ff2b";
                        break;
                    case("No user is waiting"):
                        row.getElementsByTagName('td')[3].style.color = "#ffdf46";
                        break;
                    case("The room is busy"):
                        row.getElementsByTagName('td')[3].style.color = "#ff1e08";
                        break;

                }
                cell1.textContent = rooms[i].m_Name;
                cell2.textContent = rooms[i].m_Uploader;
                cell3.textContent = rooms[i].m_BoardSize;
                cell4.textContent = userWaiting;
                cell5.textContent = rooms[i].m_GameType;
                var roomName = rooms[i].m_Name;

                var startGameBtn = document.createElement('BUTTON');
                startGameBtn.className = "button";
                startGameBtn.setIdAttribute = "startGameButton";
                startGameBtn.style.width = "80%";
                startGameBtn.style.height = "50px";
                startGameBtn.textContent = "Enter Game";
                cell6.appendChild(startGameBtn);
                startGameBtn.addEventListener('click', addUserToRoom(roomName));

                var DeleteRoomButton = document.createElement('BUTTON');
                DeleteRoomButton.className = "button";
                DeleteRoomButton.setIdAttribute = "deleteRoomButton";
                DeleteRoomButton.style.width = "80%";
                DeleteRoomButton.style.height = "50px";
                DeleteRoomButton.textContent = "Delete room";

                cell7.appendChild(DeleteRoomButton);
                DeleteRoomButton.addEventListener('click', removeRoom(roomName));


                if (rooms[i].m_IsActive == true) {
                    startGameBtn.disabled = true;
                    DeleteRoomButton.disable = true;
                }
                else {
                    startGameBtn.disabled = false;
                    DeleteRoomButton.disable = true;

                }
            }
        }
    }
}

function isUserWaiting(waitList) {

    var userWaiting;
    if (waitList.length == 1) {
        userWaiting = "User is Waiting";
    }
    else if (waitList.length == 0) {
        userWaiting = "No user is waiting";
    }
    else {
        userWaiting = "The room is busy";
    }

    return userWaiting;
}

function ajaxRoomsList() {

    $.ajax({
        url: "../../lobbyactions/roomlist",
        success: function (rooms) {

            updateListOfRooms(rooms);
        }
    });
}

function clearTable(table) {
    if (table.rows != undefined) {
        for (var i = table.rows.length - 1; i >= 0; i--) {
            table.deleteRow(i);
        }
    }
}

var currentPlayers;

function updateListOfPlayers(Players) {
    if (Players != undefined) {
        if (Players != null && currentPlayers == null || (currentPlayers && Players.length != currentPlayers.length)) {
            currentPlayers = Players;
            var table = document.getElementById("listOfPlayersTable");
            clearTable(table);
            for (i = 0; i < Players.length; i++) {
                var row = table.insertRow(i);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.textContent = i + 1;
                cell2.textContent = Players[i];
                cell1.width = "50%";
                cell2.width = "50%";
            }
        }
    }
}

function enableSubmit() {
    if (document.getElementById("chooseGameFile").value != 0) {
        document.getElementById("submitChooseGameFile").disabled = false;
    }
}

$(document).ready(function () {
    $("input[type=file]").change(function (e) {

        if (e.target.files[0] != undefined) {
            var fileName = e.target.files[0].name;
        } else {
            fileName = "Choose a file";
        }

        var fileInput = document.getElementById("chooseGameFile");
        var fileLabel = fileInput.nextElementSibling;

        if (fileName != undefined) {
            fileLabel.innerText = fileName;
            document.getElementById("submitChooseGameFile").disabled = false;
        }
    });
});


$(document).ready(function () //Setting up on Document to Ready Function
{
    $("#submitChooseGameFile").click(function (event) {
        //getting form into Jquery Wrapper Instance to enable JQuery Functions on form
        var form = $("#uploadFileForm");

        //Serializing all For Input Values (not files!) in an Array Collection
        var params = form.serializeArray();

        //Getting Files Collection
        var files = $("#chooseGameFile")[0].files;

        var formData = new FormData();

        for (var i = 0; i < files.length; i++) {
            formData.append(files[i].name, files[i]);
        }

        // appends all form values ( room name and the xml file )
        $(params).each(function (index, element) {
            formData.append(element.name, element.value);
        });

        //disabling upload Button so that user cannot press upload multiple times
        var btn = $(this);
        btn.val("Uploading....."); // so the button size wont change dramaticly during the upload
        btn.prop("disabled", true);

        $.ajax({
            url: "../../gamefiles/upload",
            method: "post",
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (returnString) {
                btn.prop("disabled", false);
                btn.val("Upload game file");
                document.getElementById("chooseGameFile").nextElementSibling.innerText = "Choose a file";
                document.getElementById("uploadResult").innerText = returnString;
            },
        });
    });
});