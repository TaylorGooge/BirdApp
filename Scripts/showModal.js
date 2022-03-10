var myModal = document.getElementById('reportBirdModal')
var myInput = document.getElementById('birdModalTrigger')


$('myModal').on('shown.bs.modal', function () {
  $('myInput').trigger('focus')
})