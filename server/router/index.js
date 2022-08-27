var dbserver = require('../dao/dbserver')

var {emailSignUp} = require('../dao/emailserver')

var signup = require('../service/signup')

var signin = require('../service/signin')

var search = require('../service/search')

var user = require('../service/userdetail')

var friend = require('../service/friend')

var index = require('../service/index')

var chatroom = require('../service/chatroom')

module.exports = function(app){
  
  app.get('/test',(req,res)=>{
    dbserver.findUser(res)
    res.send('test')
  })

  app.post('/mail',(req,res)=>{
    let mail = req.body.mail;
    emailSignUp(mail,res)
  })
  


//注册页面
  //注册
  app.post('/signup/add',(req,res)=>{
    signup.signUp(req,res);
  })

  //用户或邮箱是否占用判断
  app.post('/signup/judge',(req,res)=>{
    signup.judgeValue(req,res)
  })

 //登录页面 
  //登录
  app.post('/signin/match',(req,res)=>{
    signin.signIn(req,res)
  })



 //搜索页面
  //搜索用户
  app.post('/search/user',(req,res)=>{
    search.searchUser(req,res)
  })

  //判断是否为好友
  app.post('/search/isfriend',(req,res)=>{
    search.isFriend(req,res)
  })

  //搜索用户
  app.post('/search/group',(req,res)=>{
    search.searchGroup(req,res)
  })

  //搜索用户
  app.post('/search/isingroup',(req,res)=>{
    search.isInGroup(req,res)
  })
 


 //用户详情
  //详情
  app.post('/user/detail',(req,res)=>{
    user.userDetail(req,res)   
  })
  
  //修改用户信息
  app.post('/user/update',(req,res)=>{
    user.userUpdate(req,res)   
  })

  //修改好友昵称
  app.post('/user/updatemarkname',(req,res)=>{
    user.updateMarkName(req,res)   
  })

  //获取好友昵称
  app.post('/user/getmarkname',(req,res)=>{
    user.getMarkName(req,res)   
  })


//好友操作
  //申请好友
  app.post('/friend/applyfriend',(req,res)=>{
    friend.applyFriend(req,res)
  })

  //同意请求
  app.post('/friend/updatefriendstate',(req,res)=>{
    friend.updateFriendState(req,res)
  })

  //删除或拒绝好友
  app.post('/friend/deletefriend',(req,res)=>{
    friend.deleteFriend(req,res)
  })


//主页
  //获取好友列表
  app.post('/index/getfriend',(req,res)=>{
    index.getFriend(req,res)
  })

  //获取最后消息时间
  app.post('/index/getlastmsg',(req,res)=>{
    index.getLastMsg(req,res)
  })

  //获取未读消息数
  app.post('/index/unreadmsg',(req,res)=>{
    index.unreadMsg(req,res)
  })

  //一对一消息修改为已读状态
  app.post('/index/updatemsg',(req,res)=>{
    index.updateMsg(req,res)
  })

  app.post('/chatroom/chatmsg',(req,res)=>{
    chatroom.chatmsg(req,res)
  })

  app.post('/chatroom/insertmsg',(req,res)=>{
    chatroom.insertMsg(req,res)
  })
}

