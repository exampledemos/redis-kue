const kue = require('kue');
const queue = kue.createQueue();
//queue.watchStuckJobs(1000 * 10);

/*queue.on('ready', () => {
  console.info('Queue is ready!');
});

queue.on('error', (err) => {
  console.error('There was an error in the main queue!');
  console.error(err);
  console.error(err.stack);
});*/


// Set up UI
kue.app.listen(7000);
kue.app.set('title', 'Kue');

function createPayment(data) {
  queue.create('payment', data)
    .priority('critical')
    .attempts(8)
    .backoff(true)
    .removeOnComplete(true)
    .save(err => {
      if (err) {
        console.error(err);
        done(err);
      }
      if (!err) {
        console.log('Job', queue.id, 'with name', data.name, 'and amount ',data.amt, 'is done');
      }
    });
}

// Process up to 20 jobs concurrently
//queue.process('payment', 20, function(job, done){
queue.process('payment',  function(job, done){
  // other processing work here
  // ...
  // ...
console.log('processing jobs' + job.id);
  // Call done when finished
  done && done();
});

setInterval(function (){
  var data = {name: 'transaction', amt: '2000'};
  createPayment(data);
}, 3000);
