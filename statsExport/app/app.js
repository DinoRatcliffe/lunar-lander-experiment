var user = require('./api/user/user.model');

var data = [];

user.getAll(0, function(err, res) {
    var pages = Math.ceil(res.hits.total / res.hits.hits.length);
    var step = res.hits.hits.length;
    res.hits.hits.forEach(processUser);
    var f = 1;

    for (i = 1; i < pages; i++) {
        user.getAll(i*step, function(err, res) {
            res.hits.hits.forEach(processUser);
            f++;
            if (f === pages) {
                convertToCSV(data);
            }
        });
    }

});

function processUser(user) {
    var user = user._source;
    var userData = [];
    userData.push(user.id);
    userData.push((user.playTime ? user.playTime: 0) +
                  (user.currentLevel && user.currentLevel.playTime ? user.currentLevel.playTime : 0));
    userData.push(user.currentLevel && user.currentLevel.number ? user.currentLevel.number : 0);
    userData.push(user.difficulty);
    userData.push(user.revisits ? user.revisits : 0);
    data.push(userData);
}

function convertToCSV(data) {
    console.log('ID,PLAYTIME,LEVEL,TYPE,REVISITS');
    data.forEach(function(data) {
        console.log(data[0] + "," + data[1] + "," + data[2] + "," + data[3] + "," + data[4]);
    });
}
