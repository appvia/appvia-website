function getDemoDetails(email) {
  // transform to object:
  var bits = email.split("@");
  var name = bits[0];
  var company = bits[1].split(".", 1)
  return {
    email: email,
    demoURL: `https://${name}-${company}.hub.appvia.io/`,
    company: company,
    name: name
  }
}

module.exports = { getDemoDetails };
