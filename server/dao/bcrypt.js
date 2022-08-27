var bcrypt = require('bcryptjs');

//生成hash密码
exports.encryption = function(e){
  //随机盐值
  let salt = bcrypt.genSaltSync(10);

  let hash = bcrypt.hashSync(e,salt);

  return hash;
}

//解密
exports.verification = function(e,hash){
  let verify = bcrypt.compareSync(e,hash)
  return verify
}