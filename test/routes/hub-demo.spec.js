const expect = require('chai').expect;
const sinon = require('sinon');

const gform = require('../../modules/gform');
const salesforce = require('../../modules/salesforce');
const slack = require('../../modules/slack');
const hubDemo = require('../../routes/hub-demo');

const demoRequestGformUrl = process.env.DEMO_REQUEST_GFORM_URL;
const demoFeedbackGformUrl = process.env.DEMO_FEEDBACK_GFORM_URL;
const slackWebhookUrl = process.env.SLACK_DEMOS_URL;

describe('routes/hub-demo', function() {
  let req;
  let res;
  beforeEach(function() {
    req = {};
    res = {
      render: sinon.spy(),
      redirect: sinon.spy()
    };
  });

  describe('#getRequestDemo()', function() {
    it('renders demo template with values from querystring', function() {
      const querystring = {
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe.bloggs@appvia.io',
        companyName: 'Appvia',
        companySize: '50',
        role: 'Software Engineer',
        github: 'joebloggs'
      };
      req.query = querystring;
      hubDemo.getRequestDemo(req, res);
      expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/demo.html', {
        ...querystring,
        errors: undefined,
        title: 'Appvia: Request a Hub Demo'
      });
    });
  });

  describe('#getRequestDemoSubmitted()', function () {
    it('renders demo submitted template', function() {
      hubDemo.getRequestDemoSubmitted(req, res);
      expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/request-submit.html', {
        title: 'Appvia: Thank you for your request'
      });
    });
  });

  describe('#postRequestDemoSubmitted()', function () {
    let gformAddRowToSheetStub;
    let salesforceIsContactStub;
    let slackMessageStub;

    beforeEach(function() {
      gformAddRowToSheetStub = sinon.stub(gform, 'addRowToSheet').resolves();
      salesforceIsContactStub = sinon.stub(salesforce, 'isContact').resolves(true);
      slackMessageStub = sinon.stub(slack, 'message').resolves();
      req.body = {
        email: 'joe.bloggs@appvia.io',
        companyName: 'Appvia'
      };
    });

    afterEach(function() {
      gformAddRowToSheetStub.restore();
      salesforceIsContactStub.restore();
      slackMessageStub.restore();
    });

    it('calls gform to add row to sheet', async function() {
      await hubDemo.postRequestDemoSubmitted(req, res);
      expect(gformAddRowToSheetStub).to.have.been.calledOnce.calledWith({
        demoName: 'joebloggs-appvia',
        email: 'joe.bloggs@appvia.io',
        companyName: 'Appvia'
      }, demoRequestGformUrl);
    });

    it('calls salesforce to check for contact', async function() {
      await hubDemo.postRequestDemoSubmitted(req, res);
      expect(salesforceIsContactStub).to.have.been.calledOnce.calledWith({
        demoName: 'joebloggs-appvia',
        email: 'joe.bloggs@appvia.io',
        companyName: 'Appvia'
      });
    });

    describe('when contact is found', function () {
      it('sends slack message', async function() {
        await hubDemo.postRequestDemoSubmitted(req, res);
        expect(slackMessageStub).to.have.been.calledOnce.calledWith(
          slackWebhookUrl,
          `Please create new demo https://joebloggs-appvia.hub.appvia.io/`,
          `*Qualified Customer* please create a new demo:
        URL: https://joebloggs-appvia.hub.appvia.io/
        Demo name: joebloggs-appvia
        Contact email: ${req.body.email}
        Company: ${req.body.companyName}
        Instructions - https://github.com/appvia/hub-demo-deployments#setup-a-demo-instance`
        );
      });

      it('redirect to request submitted page', async function() {
        await hubDemo.postRequestDemoSubmitted(req, res);
        expect(res.redirect).to.have.been.calledOnce.calledWith('/products/request-submit');
      });
    });

    describe('when contact is not found', function () {
      beforeEach(function() {
        salesforceIsContactStub.resolves(false);
      });

      it('does not send slack message', async function() {
        await hubDemo.postRequestDemoSubmitted(req, res);
        expect(slackMessageStub).to.not.have.been.called;
      });

      it('redirect to request pending page', async function() {
        await hubDemo.postRequestDemoSubmitted(req, res);
        expect(res.redirect).to.have.been.calledOnce.calledWith('/products/request-submit-pending');
      });
    });

    describe('on failure', function () {
      const errorObj = status => ({
        error: {},
        html_class: 'error',
        message: 'Oops, sorry, error recording details',
        status: status,
        title: 'Oops, sorry'
      });

      it('gform it renders error page', async function() {
        gformAddRowToSheetStub.rejects({ status: 'gform error' });
        await hubDemo.postRequestDemoSubmitted(req, res);
        expect(res.render).to.have.been.calledOnce.calledWith('error.html', errorObj('gform error'));
      });

      it('salesforce it renders error page', async function() {
        salesforceIsContactStub.rejects({ status: 'salesforce error' });
        await hubDemo.postRequestDemoSubmitted(req, res);
        expect(res.render).to.have.been.calledOnce.calledWith('error.html', errorObj('salesforce error'));
      });

      it('salesforce it renders error page', async function() {
        salesforceIsContactStub.rejects({ status: 'salesforce error' });
        await hubDemo.postRequestDemoSubmitted(req, res);
        expect(res.render).to.have.been.calledOnce.calledWith('error.html', errorObj('salesforce error'));
      });
    });
  });

  describe('#getRequestDemoSubmitPending()', function () {
    it('renders demo request submit pending template', function() {
      hubDemo.getRequestDemoSubmitPending(req, res);
      expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/request-submit-pending.html', {
        title: 'Appvia: Request Pending'
      });
    });
  });

  describe('#getMyDemo()', function () {
    let salesforceIsContactStub;

    beforeEach(function() {
      salesforceIsContactStub = sinon.stub(salesforce, 'isContact').resolves(true);
    });

    afterEach(function() {
      salesforceIsContactStub.restore();
    });

    describe('when email exists in querystring', function () {
      beforeEach(function() {
        req.query = { email: 'joe.bloggs@appvia.io' }
      });

      it('calls salesforce to check for contact', async function() {
        await hubDemo.getMyDemo(req, res);
        expect(salesforceIsContactStub).to.have.been.calledOnce.calledWith(req.query, false);
      });

      it('on salesforce failure it renders error page', async function() {
        salesforceIsContactStub.rejects({ status: 'salesforce error' });
        await hubDemo.getMyDemo(req, res);
        expect(res.render).to.have.been.calledOnce.calledWith('error.html', {
          error: {},
          html_class: 'error',
          message: 'Oops, sorry, error checking details',
          status: 'salesforce error',
          title: 'Oops, sorry'
        });
      });

      describe('when contact is found', function () {
        it('renders demo page with details', async function() {
          await hubDemo.getMyDemo(req, res);
          expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/my-demo.html', {
            demoURL: 'https://joebloggs-appvia.hub.appvia.io/',
            title: 'Appvia: My Demo'
          });
        });
      });

      describe('and contact is not found', function () {
        beforeEach(function() {
          salesforceIsContactStub.resolves(false);
        });

        it('redirects to request demo page', async function() {
          await hubDemo.getMyDemo(req, res);
          expect(res.redirect).to.have.been.calledOnce.calledWith('/products/hub-demo');
        });
      });
    });

    describe('when no email exists in querystring', function() {
      beforeEach(function() {
        req.query = {}
      });
      it('renders demo no email template', async function() {
        await hubDemo.getMyDemo(req, res);
        expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/my-demo-no-email.html', {
          title: 'Appvia: My Demo'
        });
      });
    });
  });

  describe('#getDemoIntegrationSetupAdminPages()', function () {
    it('renders demo admin integration setup template', function() {
      hubDemo.getDemoIntegrationSetupAdminPages(req, res);
      expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/integration-setup-admin-pages.html', {
        title: 'Appvia: Integration Setup Admin Pages'
      });
    });
  });

  describe('#getDemoFeedback()', function () {
    it('renders demo feedback template with email from querystring', function() {
      const email = 'joe.bloggs@appvia.io';
      req.query = { email };
      hubDemo.getDemoFeedback(req, res);
      expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/feedback.html', {
        title: 'Appvia: Hub Demo Feedback',
        email: email
      });
    });
  });

  describe('#postSubmitDemoFeedback()', function () {
    let gformAddRowToSheetStub;
    let slackMessageStub;

    beforeEach(function() {
      gformAddRowToSheetStub = sinon.stub(gform, 'addRowToSheet').resolves();
      slackMessageStub = sinon.stub(slack, 'message').resolves();
      req.body = {
        email: 'joe.bloggs@appvia.io',
        rating: 'Good (Would be happy to use now)',
        message: 'My message...',
        'application-types[]': ['Node', 'Java'],
        'cloud-providers[]': ['GCP', 'EC2'],
        'dev-teams-in-org': '4',
        'devs-in-my-team': '3',
        'features[]': ['Identity Teams and RBAC (across all services)', 'CI Status', 'Kubernetes Cloud Services'],
        'kube-offerings[]': ['GKE', 'EKS']
      }
    });

    afterEach(function() {
      gformAddRowToSheetStub.restore();
      slackMessageStub.restore();
    });

    it('calls gform to add row to sheet', async function() {
      await hubDemo.postSubmitDemoFeedback(req, res);
      expect(gformAddRowToSheetStub).to.have.been.calledOnce.calledWith({
        email: "joe.bloggs@appvia.io",
        rating: "Good (Would be happy to use now)",
        'application-types[]': "Node\nJava",
        'cloud-providers[]': "GCP\nEC2",
        'dev-teams-in-org': "4",
        'devs-in-my-team': "3",
        'features[]': "Identity Teams and RBAC (across all services)\nCI Status\nKubernetes Cloud Services",
        'kube-offerings[]': "GKE\nEKS",
        message: "My message..."
      }, demoFeedbackGformUrl);
    });

    it('sends slack message', async function() {
      await hubDemo.postSubmitDemoFeedback(req, res);
      expect(slackMessageStub).to.have.been.calledOnce.calledWith(
        slackWebhookUrl,
        `Feedback form submitted for: ${req.body.email}`,
        `FYI ${req.body.email} has provided feedback!!!`
      );
    });

    it('renders feedback submitted page', async function() {
      await hubDemo.postSubmitDemoFeedback(req, res);
      expect(res.render).to.have.been.calledOnce.calledWith('hub-demo/feedback-submit.html', {
        title: 'Appvia: Hub Demo Feedback'
      });
    });

    it('on gform failure it renders error page', async function() {
      gformAddRowToSheetStub.rejects({ status: 'gform error' });
      await hubDemo.postSubmitDemoFeedback(req, res);
      expect(res.render).to.have.been.calledOnce.calledWith('error.html', {
        error: {},
        html_class: 'error',
        message: 'Oops, sorry, error recording details',
        status: 'gform error',
        title: 'Oops, sorry'
      });
    });
  });
});
