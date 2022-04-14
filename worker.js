// import {
//   Worker
// } from 'bullmq';
// import 'dotenv/config'

const bullmq = require('bullmq')

// const worker = new Worker('queue', async job => {
//   // Will print { foo: 'bar'} for the first job
//   // and { qux: 'baz' } for the second.
//   console.log(job.data);
// });
const workerOptions = {
  connection: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
  }
}
const spotifyWorker = new bullmq.Worker('spotify worker', async (job) => {
  console.log(job.up)

}, workerOptions);