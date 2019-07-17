  var demoRequestForm = $('#demo-request');

  demoRequestForm.parsley();

  Parsley.addValidator('git', {
    validateString: function(value) {
      return $.ajax('https://api.github.com/users/' + value)
    },
    messages: {en: 'Must be a valid GitHub ID'}
  });

  var demoStartForm = $('#demo-start');
  demoStartForm.parsley();
