
$(document).ready(function() {

  $("#select-tribo").bind( "change", function(event, ui) {
    var x = $(this).find(":selected").val();
    selecaoTribo(x);

  });


});
function selecaoTribo(tribo){
    tribo = parseInt(tribo);
    var div = document.getElementById( 'coresTribo' );

    switch(tribo) {
        case 1:
            div.style.backgroundColor =  "#880019";
            
        break;
        case 2:
            div.style.backgroundColor = "#fff200";
            
        break;
        default:
            div.style.backgroundColor = "#f3f3f3";
            
    }
    
}       

