var dbserver = require('../dao/dbserver')

//获取首页好友列表
exports.getFriend = function(req,res){
  let uid = req.body.uid
  let state = req.body.state
  dbserver.getUsers(uid,state,res)
}

//获取最后一条消息
exports.getLastMsg = function(req,res){
  let uid = req.body.uid
  let fid = req.body.fid
  dbserver.getOneMsg(uid,fid,res)
}

//获取一对一未读消息数
exports.unreadMsg = function(req,res){
  let data = req.body
  dbserver.unreadMsg(data,res)
}

//一对一消息修改为已读状态
exports.updateMsg = function(req,res){
  let data = req.body
  dbserver.updateMsg(data,res)
}