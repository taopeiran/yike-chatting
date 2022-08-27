var dbserver = require('../dao/dbserver')

//获取消息
exports.chatmsg = function(req,res){
  let data = req.body
  dbserver.chatmsg(data,res)
}

exports.insertMsg = function(req,res){
  let data = req.body
  let uid = data.uid
  let fid = data.fid
  let msg = data.msg
  let type = data.type
  dbserver.insertMsg(uid,fid,msg,type,res)
}