const expect = require('chai').expect;
const nock = require('nock');

const gform = require('../../modules/gform');

describe('modules/gform', function() {

  describe('#flattenDataWithOther()', function() {
    let destObj;
    beforeEach(function() {
      destObj = {
        'existing-1': 'data',
        'existing-2': 'data'
      };
    });
    it('adds source data to destination for simple type', function() {
      const sourceObj = {
        'field-1': 'value-1'
      };
      gform.flattenDataWithOther(sourceObj, destObj, 'field-1');
      expect(destObj).to.deep.equal({
        'existing-1': 'data',
        'existing-2': 'data',
        'field-1': 'value-1'
      });
    });
    it('adds source data to destination for array type', function() {
      const sourceObj = {
        'field-1': ['value-1', 'value-2']
      };
      gform.flattenDataWithOther(sourceObj, destObj, 'field-1');
      expect(destObj).to.deep.equal({
        'existing-1': 'data',
        'existing-2': 'data',
        'field-1': 'value-1\nvalue-2'
      });
    });
    it('adds source data to destination for array type and other option', function() {
      const sourceObj = {
        'field-1': ['value-1', 'value-2'],
        'other-field-1': 'other-value'
      };
      gform.flattenDataWithOther(sourceObj, destObj, 'field-1', 'other-field-1');
      expect(destObj).to.deep.equal({
        'existing-1': 'data',
        'existing-2': 'data',
        'field-1': 'value-1\nvalue-2\nother-value'
      });
    });
  });

  describe('#addRowToSheet()', function() {
    const gformUrl = 'https://forms.google.com';
    const nockSetup = (qs, statusCode, body) => {
      return nock(gformUrl)
        .get('/')
        .query(qs)
        .reply(statusCode, body);
    };
    it('resolves when successful', async function() {
      const formData = { 'field-1': 'value-1' };
      nockSetup(formData, 200, { result: 'ok' });
      return expect(gform.addRowToSheet(formData, gformUrl)).to.eventually.be.fulfilled;
    });
    it('successfully makes the call to google forms', async function() {
      const formData = { 'field-1': 'value-1' };
      const scope = nockSetup(formData, 200, { result: 'ok' });
      await gform.addRowToSheet(formData, gformUrl);
      expect(scope.isDone()).to.be.true;
    });
    it('rejects when an error is found in body, even if 200', async function() {
      const formData = { 'field-1': 'value-1' };
      nockSetup(formData, 200, { result: 'error' });
      return expect(gform.addRowToSheet(formData, gformUrl)).to.eventually.be.rejected;
    });
    it('rejects when request fails', async function() {
      const formData = { 'field-1': 'value-1' };
      nockSetup(formData, 500, 'server error');
      return expect(gform.addRowToSheet(formData, gformUrl)).to.eventually.be.rejectedWith('server error');
    });
  });

});
