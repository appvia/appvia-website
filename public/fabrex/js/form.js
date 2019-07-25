Parsley.addValidator('git', {
  validateString: function(value) {
    return $.ajax('https://api.github.com/users/' + value)
  },
  messages: {en: 'Must be a valid GitHub ID'}
});

$('.conditionals').change(function() {
  if(this.checked) {
    $(this).closest('.form-check').find('.conditional-inputs').slideDown();
    $(this).closest('.form-check').find('.conditional-inputs :input').prop('required', true);
  }
  else{
    $(this).closest('.form-check').find('.conditional-inputs').slideUp();
    $(this).closest('.form-check').find('.conditional-inputs :input').prop('required', false).val('');
  }
});

$.listen('parsley:form:validated', function(e){
  if (e.validationResult) {
    $('button[type=submit]').attr('disabled', 'disabled');
  }
});
