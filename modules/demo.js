function getDemoDetails(email) {
  // transform to object:
  var bits = email.split("@");
  var name = bits[0];
  // Make the name domain safe
  name = name.replace(/[\W_-]/g, '');
  var company = bits[1].split(".", 1);
  var demoName = `${name}-${company}`;
  return {
    email: email,
    demoURL: `https://${demoName}.hub.appvia.io/`,
    demoName: demoName,
    company: company,
    name: name
  }
}

module.exports = { getDemoDetails };
