var requestPromise = require('request-promise');

function flattenDataWithOther(sourceObj, destObj, fieldName, otherFieldName = undefined) {
  source = sourceObj[fieldName];
  if ( Array.isArray(source) ) {
    array = source
  } else {
    array = [ source ];
  }
  if ( otherFieldName != undefined ) {
    if ( sourceObj[otherFieldName] != undefined ) {
      array.push(sourceObj[otherFieldName]);
    }
  }
  destObj[fieldName] = array.join('\n');
}

function addRowToSheet(data, formsURL) {
  /*
    Will post to google forms
  */
	// Do async job
  return requestPromise.get({ uri: formsURL, qs: data, resolveWithFullResponse: true })
  .then((resp) => {
    if (resp.body.result == 'error') {
      // An error in the user form?
      console.log('Request OK but error returned - something wrong with the form?');
      console.log(`Data: ${data}`);
      Promise.reject(new Error(resp.body))
    } else {
      console.log('Google forms submission was successful.');
    }
  })
  .catch(err => {
    return Promise.reject(err);
  });
}

// gform.js
// ========
module.exports = {
  addRowToSheet: addRowToSheet,
  flattenDataWithOther: flattenDataWithOther
};
