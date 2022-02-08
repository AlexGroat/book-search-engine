const mongoose = require('mongoose');
console.log('mongoose start')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

console.log('mongoose end')
module.exports = mongoose.connection;
