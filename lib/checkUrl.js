var https = require('https');

exports.check = function(url, onSuccess, onFailure) {

    https.get(url, function(res) {
        if (res.statusCode == 200) {
            onSuccess.call(this);
        } else {
            onFailure.call(this);
        }
    }).on('error', onFailure);

};

