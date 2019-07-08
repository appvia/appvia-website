  var frm = $('#demo-request');

  frm.parsley();

  Parsley.addValidator('git', {
    validateString: function(value) {
      return $.ajax('https://api.github.com/users/' + value)
    },
    messages: {en: 'Must be a valid GitHub ID'}
  });

  frm.submit(function (e) {

      e.preventDefault();

      $.ajax({
          type: 'GET',
          url: 'https://script.google.com/macros/s/AKfycbxJPPNe42h65xA8nQEkTNAMiXxuZp6qLCzo-bqTnVpJHmf4xFKX/exec',
          data: frm.serializeObject(),
          dataType: "json",
          success: function (data) {
              if(data.result == "error"){
                console.log(data)
              }else{
                console.log('Submission was successful.');
                window.location.href = '/products/request-submit';
              }
          },
          error: function (data) {
              console.log('An error occurred.');
              console.log(data);
          },
      });
  });
