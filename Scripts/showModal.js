var myModal = document.getElementById('reportBirdModal')
var myInput = document.getElementById('birdModalTrigger')

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})