var bodyparser = require('body-parser')
var jwt = require('./dao/jwt')
var cors = require('cors')

const express = require('express')
const app = new express()
const port = 3000


//socket.io
var server = app.listen(8082)
var io = require('socket.io').listen(server);
require('./dao/socket')(io)


//处理跨域请求
app.use(cors())

//限制大小
app.use(bodyparser.urlencoded({limit:'50mb',extended:true}))
app.use(bodyparser.json({limit:'50mb'}))
app.use(express.static(__dirname + '/data'))

app.use(function(req,res,next){
  if(typeof(req.body.token)!='undefined'){
    //处理token匹配
    let token = req.body.token
    let tokenMatch = jwt.verifyToken(token)
    if(tokenMatch){
      //通过
      next()
    }else{
      //不通过
      res.send({status:300})
    }
  }else{
    next()
  }
})

require('./router/index')(app);
require('./router/files')(app);

//404页面
app.use((req,res,next)=>{
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

//500出现错误页面
app.use((err,req,res,next)=>{
  res.status(err.status || 500)
  res.send(err.massage)
})

app.listen(port,()=>{
  console.log('@@@app starts at port: ' + port);
})