
$(document).ready(function() {
  $('.search-select-basic-single').select2();
});
window.addEventListener('load', () => {
  // eslint-disable-next-line max-len
  document.getElementById('search-submitBird').addEventListener('click', function(e) {
    e.preventDefault();
    if (document.getElementById('birdName').value == '0' && document.getElementById('speciesSearch').value == "" ) {
      return;
    }
    recordBird();
  });
});
