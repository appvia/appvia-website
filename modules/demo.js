function getDemoDetails(email) {
  const bits = email.split("@");
  const name = bits[0].replace(/[\W_-]/g, '');
  const company = bits[1].split(".", 1);
  const demoName = `${name}-${company}`;
  const demoURL = `https://${demoName}.hub.appvia.io/`;
  return { email, demoURL, demoName, company, name }
}

module.exports = { getDemoDetails };
