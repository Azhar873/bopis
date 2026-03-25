const getNextVersion = require('./scripts/webpack/get-next-version');

getNextVersion().then(version => {
    console.log('Next version:', version);
}).catch(err => {
    console.error('Error:', err);
});
