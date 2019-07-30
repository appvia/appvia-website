const expect = require('chai').expect;
const sinon = require('sinon');
const jsforce = require('jsforce');

const salesforce = require('../../modules/salesforce');

describe('modules/salesforce', function() {
  let jsforceConnectionStub;
  let jsforceStub;
  let jsforceSObjectCreateStub;
  let consoleErrorStub;

  beforeEach(function() {
    jsforceSObjectCreateStub = sinon.spy();
    jsforceStub = {
      login: sinon.spy(),
      query: sinon.stub(),
      sobject: sinon.stub().returns({ create: jsforceSObjectCreateStub })
    };
    jsforceConnectionStub = sinon.stub(jsforce, 'Connection');
    jsforceConnectionStub.returns(jsforceStub);
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(function() {
    jsforceConnectionStub.restore();
    consoleErrorStub.restore();
  });

  describe('#isContact()', async function() {
    const contactOrLead = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      companyName: 'Example Ltd',
      role: 'Engineer',
      companySize: 10
    };
    it('returns true when contact exists', async function() {
      jsforceStub.query.onFirstCall().resolves({ totalSize: 1 });
      const isContact = await salesforce.isContact(contactOrLead);
      expect(jsforceStub.query).to.be.calledOnce.calledWith(`SELECT Id, Email FROM Contact WHERE Email='${contactOrLead.email}'`);
      expect(isContact).to.be.true;
    });
    it('attempts to create a lead when contact is not found', async function() {
      jsforceStub.query.onFirstCall().resolves({ totalSize: 0 }).onSecondCall().resolves({ totalSize: 0 });
      const isContact = await salesforce.isContact(contactOrLead);
      expect(jsforceStub.query).to.be.calledTwice;
      expect(jsforceStub.query.firstCall).to.be.calledWith(`SELECT Id, Email FROM Contact WHERE Email='${contactOrLead.email}'`);
      expect(jsforceStub.query.secondCall).to.be.calledWith(`SELECT Id, Name, Email FROM Lead WHERE Email = '${contactOrLead.email}'`);
      expect(jsforceStub.sobject).to.be.calledOnce.calledWith('Lead');
      expect(jsforceSObjectCreateStub).to.be.calledOnce.calledWith({
        Company: 'Example Ltd',
        Email: 'john.smith@example.com',
        FirstName: 'John',
        LastName: 'Smith',
        NumberOfEmployees: 10,
        Title: 'Engineer'
      });
      expect(isContact).to.be.false;
    });
    it('does not attempt to create a lead when one already exists', async function() {
      jsforceStub.query.onFirstCall().resolves({ totalSize: 0 }).onSecondCall().resolves({ totalSize: 1 });
      const isContact = await salesforce.isContact(contactOrLead);
      expect(jsforceStub.sobject).to.not.be.called;
      expect(isContact).to.be.false;
    });
    it('does not attempt to create a lead when disabled', async function() {
      jsforceStub.query.onFirstCall().resolves({ totalSize: 0 });
      const isContact = await salesforce.isContact(contactOrLead, false);
      expect(jsforceStub.sobject).to.not.be.called;
      expect(isContact).to.be.false;
    });
    it('rejects promise on failed requests', function() {
      jsforceStub.query.rejects('salesforce error');
      return expect(salesforce.isContact(contactOrLead)).to.eventually.be.rejected;
    });
    it('logs error on failed requests', async function() {
      jsforceStub.query.rejects('salesforce error');
      try {
        await salesforce.isContact(contactOrLead);
      } catch (error) {
        expect(consoleErrorStub).to.be.calledOnce.calledWith('Error querying salesforce', error);
      }
    });
  });

});
