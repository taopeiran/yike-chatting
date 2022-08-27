var mongoose = require('mongoose')
var db = require('../config/db')
var Schema = mongoose.Schema

//用户表
var UserSchema = new Schema({
  name:{type:String},                           //用户名
  psw:{type:String},                            //密码
  email:{type:String},                          //邮箱
  gender:{type:String,default:'asexual'},       //性别
  birth:{type:Date},                            //生日
  phone:{type:Number},                          //电话
  introduction:{type:String},                   //介绍
  imgurl:{type:String,default:'user.png'},      //头像
  gmt_created:{type:Date},                      //注册时间
  gmt_modified:{type:Date},                     //修改时间
})

//好友表
var FriendSchema = new Schema({
  user_id:{type:Schema.Types.ObjectId,ref:'User'},    //用户id
  friend_id:{type:Schema.Types.ObjectId,ref:'User'},  //好友id
  gmt_created:{type:Date},                            //生成时间
  state:{type:String},                                //通过状态（0表示已为好友，1表示申请中，2表示申请发送方）
  mark_name:{type:String},                            //昵称
  last_time:{type:Date}                               //最后通讯时间（后加入项目）
})

//一对一消息表
var MessageSchema = new Schema({
  user_id:{type:Schema.Types.ObjectId,ref:'User'},    //发送者id
  friend_id:{type:Schema.Types.ObjectId,ref:'User'},  //接收id
  message:{type:String},                              //发送内容
  type:{type:String},                                 //类型（0表示文字，1表示图片链接，2表示音频链接...）
  gmt_created:{type:Date},                            //发送时间
  state:{type:String}                                 //消息状态（0已读，1未读）
})

//群表
var GroupSchema = new Schema({
  manager_id:{type:Schema.Types.ObjectId,ref:'User'},    //群主id
  name:{type:String},                                 //群名称
  imgurl:{type:String,default:'group.png'},           //群头像
  notice:{type:String},                               //群公告
  gmt_created:{type:Date},                            //创建时间
})

//群成员表
var GroupMemberSchema = new Schema({
  group_id:{type:Schema.Types.ObjectId,ref:'Group'},  //群id
  user_id:{type:Schema.Types.ObjectId,ref:'User'},    //用户id
  name:{type:String},                                 //群内名称
  tip:{type:Number,default:0},                        //未读消息数
  gmt_created:{type:String},                          //加入时间
  gmt_modified:{type:Date},                           //修改时间
  shield:{type:Number},                               //是否屏蔽群消息（0，1表示屏蔽）
  last_time:{type:Date}                               //最后通讯时间（后加入项目）
})

//群消息表
var GroupMsgSchema = new Schema({
  user_id:{type:Schema.Types.ObjectId,ref:'User'},    //发送者id
  group_id:{type:Schema.Types.ObjectId,ref:'Group'},  //群id
  message:{type:String},                              //发送内容
  type:{type:String},                                 //类型（0表示文字，1表示图片链接，2表示音频链接...）
  gmt_created:{type:Date},                            //发送时间
})

module.exports = db.model('User',UserSchema)
module.exports = db.model('Friend',FriendSchema)
module.exports = db.model('Group',GroupSchema)
module.exports = db.model('Message',MessageSchema)
module.exports = db.model('GroupMember',GroupMemberSchema)
module.exports = db.model('GroupMsg',GroupMsgSchema)