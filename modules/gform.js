var request = require('request');

// salesforce.js
// =============
module.exports = {
  // Return a Promise
  AddContact: function(data) {
    return addContact(data);
  }
};

function addContact(data) {
  /*
    Will post to google forms
  */
  return new Promise(function(resolve, reject) {
  	// Do async job
    var formsURL = process.env.SF_USERGOOGLE_FORM_URL;
    request.get({ uri: formsURL, qs: data }, function(err, resp, body) {
      if (err) {
        reject(err);
      } else {
        // all good, as far as trying to post
        if(res.body.result == "error"){
          // An error in the user form?
          console.log('Request OK but error returned - something wrong with the form?');
          console.log('Data:' + res.body);
          reject(new Error(res.body))
        } else {
          console.log('Google forms submission was successful.');
          resolve();
        }
      }
    })
  });
}
