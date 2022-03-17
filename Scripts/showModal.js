const myModal = document.getElementById('reportBirdModal');
const myInput = document.getElementById('birdModalTrigger');


$('myModal').on('shown.bs.modal', function() {
  $('myInput').trigger('focus');
});
