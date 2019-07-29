const expect = require('chai').expect;

const demo = require('../../modules/demo');

describe('modules/demo', function() {

  describe('#getDemoDetails()', function() {
    it('should return object of details', function() {
      const demoDetails = demo.getDemoDetails('dave.thompson@appvia.io');
      expect(demoDetails).to.deep.equal({
        "company": [ "appvia" ],
        "demoName": "davethompson-appvia",
        "demoURL": "https://davethompson-appvia.hub.appvia.io/",
        "email": "dave.thompson@appvia.io",
        "name": "davethompson"
      });
    });
  });

});
