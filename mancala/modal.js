// Get the modal
var ins_modal = document.getElementById("insModal");

// Get the button that opens the modal
var ins_btn = document.getElementById("instructions");

// Get the <span> element that closes the modal
var ins_span = document.getElementsByClassName("close_ins")[0];

// When the user clicks on the button, open the modal
ins_btn.onclick = function() {
  ins_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
ins_span.onclick = function() {
  ins_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == ins_modal) {
    ins_modal.style.display = "none";
  }
}



// Get the modal
var class_modal = document.getElementById("classModal");

// Get the button that opens the modal
var class_btn = document.getElementById("classification");

// Get the <span> element that closes the modal
var class_span = document.getElementsByClassName("close_class")[0];

// When the user clicks on the button, open the modal
class_btn.onclick = function() {
  class_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
class_span.onclick = function() {
  class_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == class_modal) {
    class_modal.style.display = "none";
  }
}