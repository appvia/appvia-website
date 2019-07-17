var requestPromise = require('request-promise');

function addContact(data) {
  /*
    Will post to google forms
  */
	// Do async job
  var formsURL = process.env.GFORM_URL;
  return requestPromise.get({ uri: formsURL, qs: data, resolveWithFullResponse: true })
  .then((resp) => {
    if (resp.body.result == 'error') {
      // An error in the user form?
      console.log('Request OK but error returned - something wrong with the form?');
      console.log(`Data: ${data}`);
      Promise.reject(new Error(resp.body))
    } else {
      console.log('Google forms submission was successful.');
    }
  })
  .catch(err => {
    return Promise.reject(err);
  });
}

// gform.js
// ========
module.exports = {
  addContact: addContact
};
