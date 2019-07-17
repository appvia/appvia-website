function isContact(email) {
  /*
    Need to 1. Check if we have existing **contact** for this email...
            2. If we do:
                a. Create user in sheet (as we don't have salesforce accounts)
                b. Setup Demo (slack)
                c. Tell user we'll create demo...
  */
  var jsforce = require('jsforce');
  var sfUser = process.env.SF_USER;
  var sfPass = process.env.SF_PW;
  var sfToken = process.env.SF_TOKEN;
  var conn = new jsforce.Connection();

  return conn.login(sfUser, sfPass + sfToken)
    .then(function() {
      return conn.query('SELECT Id, Email FROM Contact WHERE Email=\'' + email + '\'');
    })
    .then(function(res) {
      // receive resolved result from the promise,
      if (res['totalSize'] > 0) {
        console.log('Salesforce contact found:' + email);
        return true;
      }
      return false;
    }
  );
}

// salesforce.js
// =============
module.exports = {
  // Return a Promise
  IsContact: function(email) {
    return isContact(email);
  }
};
