//Eliminar banner de publicidad
$('a[title="CSS jQuery"]').remove();

$(function () {
    
    // When the user clicks on <span> (x), close the modal
    $("div .close").onclick = function () {
        $("#myModal").style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == $("#myModal")) {
            $("#myModal").style.display = "none";
        }
    }
});



function ventanaModal(elemento) {
    var id = $(elemento).attr("id");
    $("body #modal" + id + " .modal").css('display', 'block');
}
