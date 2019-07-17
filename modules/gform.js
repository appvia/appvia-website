var request = require('request');

function addContact(data) {
  /*
    Will post to google forms
  */
  return new Promise(function(resolve, reject) {
  	// Do async job
    var formsURL = process.env.GFORM_URL;
    request.get({ uri: formsURL, qs: data }, function(err, resp, body) {
      if (err) {
        reject(err);
      } else {
        // all good, as far as trying to post
        if (resp.body.result == 'error') {
          // An error in the user form?
          console.log('Request OK but error returned - something wrong with the form?');
          console.log('Data:' + data);
          reject(new Error(resp.body))
        } else {
          console.log('Google forms submission was successful.');
          resolve();
        }
      }
    })
  });
}

// gform.js
// ========
module.exports = {
  addContact: addContact
};
