function isContact(contactOrLead) {
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
  .then(() => {
    return conn.query(`SELECT Id, Email FROM Contact WHERE Email='${contactOrLead.email}'`);
  })
  .then( res => {
    // receive resolved result from the promise,
    if (res['totalSize'] > 0) {
      console.log(`Salesforce contact found: ${contactOrLead.email}`);
      return true;
    }
    // not a contact, create next promise:
    return conn.query(`SELECT Id, Name, Email FROM Lead WHERE Email = '${contactOrLead.email}'`)
    .then(function(res) {
      console.log(`Successfully queried leads for: ${contactOrLead.email}, totalSize === ${res['totalSize']}`)

      // Not a contact, lets see if the lead exists:
      if (res['totalSize'] === 0) {
        // no lead, lets create one...
        return conn.sobject("Lead").create(
          {
            FirstName: contactOrLead.firstName,
            LastName: contactOrLead.lastName,
            Email: contactOrLead.email,
            Company: contactOrLead.companyName,
            Title: contactOrLead.role,
            NumberOfEmployees: contactOrLead.companySize
          }
        );
      }
      console.log(`Lead already exists: ${contactOrLead.email}, totalSize === ${res['totalSize']}`)
    })
    .then(function(ret) {
      console.log(`Successfully created lead for ${contactOrLead.email}, ret = ${JSON.stringify(ret)}`)
      return false;
    });
  });
}

// salesforce.js
// =============
module.exports = {
  // Return a Promise
  isContact: isContact
};
