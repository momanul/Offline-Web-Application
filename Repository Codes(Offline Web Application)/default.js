var db = openDatabase('myProject', '1.0', 'My Project Database', 2 * 1024 * 1024);
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Customers(id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Address TEXT, Phone TEXT)');
});
function insertData() {
    db.transaction(function (tx) {
        if (document.getElementById('name').value == '') {
            document.getElementById('nameValidationCheck').innerText = " *Please enter a user name!";
        }
        else{
            document.getElementById('nameValidationCheck').innerText = "";
        }
        if (document.getElementById('phoneNumber').value == '') {
            document.getElementById('phoneNumberValidationCheck').innerText = " *Please enter a user phone number!";
        }
        else{
            document.getElementById('phoneNumberValidationCheck').innerText = '';
        }
        if (document.getElementById('postcode').value == '' && document.getElementById('division').value == 'Division' &&
            document.getElementById('district').value == '') {
            document.getElementById('addressValidationCheck').innerText = " *Please enter user address!";
        }
        else{
            document.getElementById('addressValidationCheck').innerText = "";
            var name = document.getElementById('name').value;
            var phoneNumber = document.getElementById('phoneNumber').value;
            var postCode = document.getElementById('postcode').value;
            var district = document.getElementById('district').value;
            var division = document.getElementById('division').value;
            var Add = postCode + ', ' + district + ', ' + division;
            tx.executeSql('INSERT INTO Customers(Name, Address, Phone) VALUES("' + name + '", "' + Add + '", "' + phoneNumber + '")');
            document.location.reload();
        }
    });
}
var deletedUserNmae;
function deleteData() {
    var deleteId = document.getElementById('id').value;
    if (deleteId != '') {
        var con = confirm("Are you sure to delete?");
        if (con) {
            db.transaction(function (e) {
                var s = document.getElementById('id').value;
                e.executeSql('DELETE FROM Customers WHERE id=' + s, [], deletedName);
                alert(deletedUserNmae + " has been deleted form user list");
                document.location.reload();
            });
        }
        else {
            alert("You didn't delete the user!");
        }
    }
    else {
        alert("Please Enter a valid userid!")
    }
}
function s() {
    db.transaction(function (e) {
        e.executeSql('SELECT * FROM Customers', [], function (e, result) {
            for (var i = 0; i < result.rows.length; i++) {
                var s = result.rows.item(i).id;
                $('#tbody').append('<tr>' + '<td>' + s + '</td>'
                    + '<td class="tdSize">' + result.rows.item(i).Name + '</td>'
                    + '<td class="tdSize">' + result.rows.item(i).Address + '</td>'
                    + '<td class="tdSize">' + result.rows.item(i).Phone + '</td></tr > ');
            }
        });
    });
}
s();
function deletedName(e, result) {
    for (var i = 0; i < result.rows.length; i++) {
        deletedUserNmae = result.rows.item(i).Name;
    }
}
function load(e, result) {
    for (var i = 0; i < result.rows.length; i++) {
        document.getElementById('id').value = result.rows.item(i).id;
        document.getElementById('name').value = result.rows.item(i).Name;
        document.getElementById('phoneNumber').value = result.rows.item(i).Phone;
        var address = result.rows.item(i).Address;
        document.getElementById('postcode').value = address.substring(0, address.indexOf(','));
        document.getElementById('district').value = address.substring(address.indexOf(',') + 1, address.lastIndexOf(','));
        document.getElementById('division').value = address.substring(address.lastIndexOf(',')+ 2, address.length);
    }
}
function updateData() {
    var deleteId = document.getElementById('id').value;
    if (deleteId != '') {
        db.transaction(function (tx) {
            var s = document.getElementById('id').value;
            tx.executeSql('SELECT * FROM Customers WHERE id=' + s, [], load);
            $('<button id="saveUpdateBtn" onclick="saveData();">Save Update</button>').appendTo($('#saveChange'));
        });
    }
    else {
        alert("Please Enter a valid userid!")
    }
}
function saveData() {
    db.transaction(function (tx) {
        var n = document.getElementById('name').value;
        var p = document.getElementById('phoneNumber').value;
        var i = document.getElementById('id').value;
        var postCode = document.getElementById('postcode').value;
        var district = document.getElementById('district').value;
        var division = document.getElementById('division').value;
        var Add = postCode + ', ' + district + ', ' + division;
        tx.executeSql('UPDATE Customers SET Name="' + n + '", Phone = "'+p+'", Address ="'+Add+'"WHERE id= '+ i);
        document.location.reload();
    });
}
$(document).ready(function () {
    var realFile = $('#upload');
    var btnFile = $('#uploadFile');
    var textFile = $('#textFile');
    btnFile.click(function () {
        realFile.click();
    });
    realFile.change(function () {
        if (realFile.val()) {
            textFile.html(realFile.val());
        }
        else {
            textFile.html("No file");
        }
    });
});
