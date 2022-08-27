//token
var jwt = require('jsonwebtoken');
let secret = 'yike'
//生成token
exports.generateToken = function(id,res){
  let payload = {id:id,time:new Date()}
  let token = jwt.sign(payload,secret,{expiresIn:60*60*24})
  return token
}

//解密token
exports.verifyToken = function(e){
  let payload;
  jwt.verify(e,secret,function(err,result){
    if(err){
      payload = 0
    }else{
      payload = result
    }
  })
  return payload
}