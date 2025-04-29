$(document).ready(function () {

    const token = localStorage.getItem('jwt_token');

    if (!token) {
        alert(false, "You're not logged in!");
    } else {
        alert(true, "You are logged in")
    }

    $.ajax({
        url: 'http://localhost:3000/api/products',
        type: 'get',
        dataType: 'JSON',
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
        .done(function (response) {
            let data = response.data;
            let status = response.status;

            if (status) {
                createTbody(data);
            } else {
                alert(false, 'Πρόβλημα στην αναζήτηση των προϊόντων (' + data.message + ')');
            }
        });

    $('.row').off('click', '.btnSubmit').on('click', '.btnSubmit', function () {

        let product = $("#product").val();
        let cost = $("#cost").val();
        let description = $("#description").val();
        let quantity = $("#quantity").val();

        const item = {
            'product': product,
            'cost': cost,
            'description': description,
            'quantity': quantity
        }

        console.log($('.btnSubmit').val(), item);
        $.ajax({
            url: "http://localhost:3000/api/products",
            type: "post",
            data: item,
            dataType: "JSON",
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .done(function (response) {

                let data = response.data;
                let status = response.status

                if (status) {
                    console.log(true, 'Επιτυχής εισαγωγή του προϊόντος');
                    alert(true, 'Επιτυχής εισαγωγή του προϊόντος');
                    $('#frmProducts')[0].reset();
                    window.location.replace("http://localhost:3000/products/find.html")
                } else {
                    console.log(false, 'Πρόβλημα στην εισαγωγή του προϊόντος (' + data.message + ')');
                    alert(false, 'Πρόβλημα στην εισαγωγή του προϊόντος (' + data.message + ')');
                    $('#frmProducts')[0].reset();
                }
            })
            .fail(function (err) {
                console.log("Error>>", err.responseJSON.message);
                alert(false, err.responseJSON.message);
            });;

        return false
    });

});

function createTbody(data) {

    $("#productsTable > tbody").empty();

    const len = data.length;
    for (let i = 0; i < len; i++) {
        let product = data[i].product;
        let cost = data[i].cost;
        let description = data[i].description;
        let quantity = data[i].quantity;

        let tr_str = "<tr>" +
            "<td>" + product + "</td>" +
            "<td>" + cost + "</td>" +
            "<td>" + description + "</td>" +
            "<td>" + quantity + "</td>" +
            "<td>" +
            "<button class='btnUpdate btn btn-primary' value=\'" + product + "\'>Update</button> " +
            "<button class='btnDelete btn btn-danger' value=\'" + product + "\'>Delete</button>" +
            "</td>" +
            "</tr>";

        $("#productsTable tbody").append(tr_str);
    }
}

function alert(status, message) {
    if (status) {
        $('.alert').addClass('alert-success');
        $('.alert').removeClass('alert-danger');
    } else {
        $('.alert').addClass('alert-danger');
        $('.alert').removeClass('alert-success');
    }
    $('.alert').html(message);
}