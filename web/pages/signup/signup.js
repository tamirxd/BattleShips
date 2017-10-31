$(document).ready(function () //Setting up on Document to Ready Function
{
    $("#signButton").click(function (event) {
        var btn = $(this);
        btn.prop("disabled", true);
        var userName = document.getElementById("userNameInput").value;
        $.ajax({
            url: "../../usersignup",
            method: "GET",
            data: {userName: userName},
            dataType:'json',
            success: function (returnString) {
                debugger;
                if (returnString.localeCompare("Success") === 0) {
                    window.location.href = "../lobby/gamelobby.html";
                } else {
                    document.getElementById("signResult").innerText = returnString;
                    btn.prop("disabled", false);
                }
            },
            error: function (errorString) {
                debugger;
                document.getElementById("signResult").innerText = errorString;
                btn.prop("disabled", false);
            }
        });
    });
});