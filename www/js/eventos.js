
$(document).ready(function() {
  $("#select-tribo").bind( "change", function(event, ui) {
    var x = $(this).find(":selected").val();
    selecaoTribo(x);
  });
});



