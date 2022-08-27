var mongoose = require('mongoose')
var db = mongoose.createConnection('mongodb://localhost:27017/yike',{useNewUrlParser:true,useUnifiedTopology:true})
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',() => {
  console.log('connect to mongodb!!!')
})

module.exports = db