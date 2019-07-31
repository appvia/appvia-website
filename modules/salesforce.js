const jsforce = require('jsforce');
const logger = require('../logger');

const sfUser = process.env.SF_USER;
const sfPass = process.env.SF_PW;
const sfToken = process.env.SF_TOKEN;

let conn;

async function createConnection() {
  logger.info('Creating salesforce connection and logging in');
  conn = new jsforce.Connection();
  await conn.login(sfUser, sfPass + sfToken);
}

async function isContact(contactOrLead, createLead = true) {
  if (!conn || !conn.userInfo) {
    await createConnection();
  }

  try {
    const contactQueryResult = await conn.query(`SELECT Id, Email FROM Contact WHERE Email='${contactOrLead.email}'`);
    logger.info(`Successfully queried contacts for: ${contactOrLead.email}, totalSize === ${contactQueryResult['totalSize']}`);
    if (contactQueryResult['totalSize'] > 0) {
      logger.info(`Salesforce contact found: ${contactOrLead.email}`);
      return true;
    }

    if (createLead) {
      const leadQueryResult = await conn.query(`SELECT Id, Name, Email FROM Lead WHERE Email = '${contactOrLead.email}'`);
      logger.info(`Successfully queried leads for: ${contactOrLead.email}, totalSize === ${leadQueryResult['totalSize']}`);

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
        logger.info(`Successfully created lead for ${contactOrLead.email}`, createLeadResult);
      }
    }
    return false;
  } catch (error) {
    logger.error('Error querying salesforce: %j', error);
    if (typeof error === 'string' && error.indexOf('INVALID_SESSION_ID') >= 0) {
      logger.error('INVALID_SESSION_ID found, resetting connection and trying again');
      conn = null;
      return isContact(contactOrLead);
    }
    return Promise.reject(error);
  }
}

module.exports = { isContact };
