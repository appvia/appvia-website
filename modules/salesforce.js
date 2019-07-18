const jsforce = require('jsforce');

const sfUser = process.env.SF_USER;
const sfPass = process.env.SF_PW;
const sfToken = process.env.SF_TOKEN;

let conn;

async function createConnection() {
  console.log('Creating salesforce connection and logging in');
  conn = new jsforce.Connection();
  await conn.login(sfUser, sfPass + sfToken);
}

async function isContact(contactOrLead) {
  if (!conn || !conn.userInfo) {
    await createConnection();
  }

  try {
    const contactQueryResult = await conn.query(`SELECT Id, Email FROM Contact WHERE Email='${contactOrLead.email}'`);
    console.log(`Successfully queried contacts for: ${contactOrLead.email}, totalSize === ${contactQueryResult['totalSize']}`);
    if (contactQueryResult['totalSize'] > 0) {
      console.log(`Salesforce contact found: ${contactOrLead.email}`);
      return true;
    }

    const leadQueryResult = await conn.query(`SELECT Id, Name, Email FROM Lead WHERE Email = '${contactOrLead.email}'`);
    console.log('leadQueryResult', leadQueryResult);
    console.log(`Successfully queried leads for: ${contactOrLead.email}, totalSize === ${leadQueryResult['totalSize']}`);

    if (leadQueryResult['totalSize'] === 0) {
      const createLeadResult = await conn.sobject("Lead").create(
        {
          FirstName: contactOrLead.firstName,
          LastName: contactOrLead.lastName,
          Email: contactOrLead.email,
          Company: contactOrLead.companyName,
          Title: contactOrLead.role,
          NumberOfEmployees: contactOrLead.companySize
        }
      );
      console.log(`Successfully created lead for ${contactOrLead.email}`, createLeadResult);
    }
    return false;
  } catch (error) {
    console.error('Error querying salesforce', error);
    if (typeof error === 'string' && error.indexOf('INVALID_SESSION_ID') >= 0) {
      console.error('INVALID_SESSION_ID found, resetting connection and trying again');
      conn = null;
      return isContact(contactOrLead);
    }
    return Promise.reject(error);
  }
}

module.exports = { isContact };
