var dbmodel = require("../model/dbmodel");
var bcrypt = require("../dao/bcrypt");
var User = dbmodel.model("User");
var Friend = dbmodel.model("Friend");
var Group = dbmodel.model("Group");
var GroupMember = dbmodel.model("GroupMember");
var Message = dbmodel.model("Message");
var jwt = require("./jwt");

//新建用户
exports.buildUser = function (name, mail, pwd, res) {
  //密码加密
  let password = bcrypt.encryption(pwd);
  let data = {
    name: name,
    email: mail,
    psw: password,
    gmt_created: new Date(),
    gmt_modified: new Date(),
    phone: new Date()
  };
  let user = new User(data);

  user.save((err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

//匹配用户表元素个数
exports.countUserValue = function (data, type, res) {
  let wherestr = {};
  wherestr[type] = data;
  User.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, data: result });
    }
  });
};

//用户验证是否有效
exports.userMath = function (data, pwd, res) {
  let wherestr = { $or: [{ name: data }, { email: data }] };
  let out = { name: 1, imgurl: 1, psw: 1 };
  User.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result == "") {
        res.send({ status: 400 });
      }
      result.map((x) => {
        const pwdMatch = bcrypt.verification(pwd, x.psw);
        if (pwdMatch) {
          let token = jwt.generateToken(x._id);
          let back = {
            id: x._id,
            name: x.name,
            imgurl: x.imgurl,
            token: token,
          };
          res.send({
            status: 200,
            data: back,
          });
        } else {
          res.send({ status: 400 });
        }
      });
    }
  });
};

//搜索用户
exports.searchUser = function (data, res) {
  let wherestr;
  if (data == "yike") {
    wherestr = {};
  } else {
    // 模糊查询
    wherestr = {
      $or: [{ name: { $regex: data } }, { email: { $regex: data } }],
    };
  }
  let out = {
    name: 1,
    email: 1,
    imgurl: 1,
  };
  User.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, data: result });
    }
  });
};

//用户匹配，判断是否为好友
exports.isFriend = function (uid, fid, res) {
  let wherestr = { user_id: uid, friend_id: fid, state: 0 };
  Friend.findOne(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result) {
        // 是好友
        res.send({ status: 200 });
      } else {
        // 不是好友
        res.send({ status: 400 });
      }
    }
  });
};

//搜索群
exports.searchGroup = function (data, res) {
  let wherestr;
  if (data == "yike") {
    wherestr = {};
  } else {
    // 模糊查询
    wherestr = { name: { $regex: data } };
  }
  let out = {
    name: 1,
    imgurl: 1,
  };
  Group.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, data: result });
    }
  });
};

//判断是否在群内
exports.isInGroup = function (uid, gid, res) {
  let wherestr = { user_id: uid, group_id: gid };
  GroupMember.findOne(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result) {
        // 是在群内
        res.send({ status: 200 });
      } else {
        // 不在群内
        res.send({ status: 400 });
      }
    }
  });
};

//用户详情
exports.userDetail = function (id, res) {
  let wherestr = { _id: id };
  let out = { psw: 0 };
  User.findOne(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, data: result });
    }
  });
};

function update(data, update, res) {
  User.findByIdAndUpdate(data, update, (err, resu) => {
    if (err) {
      //修改失败
      res.send({ status: 500 });
    } else {
      //修改成功
      res.send({ status: 200 });
    }
  });
}

//用户信息修改
exports.userUpdate = function (data, res) {
  let updatestr = {};
  //判断是否有密码项
  if (typeof data.pwd != "undefined") {
    User.find({ _id: data.id }, { psw: 1 }, (err, result) => {
      if (err) {
        res.send({ status: 500 });
      } else {
        if (res == "") {
          res.send({ status: 400 });
        }
        result.map((x) => {
          const pwdMatch = bcrypt.verification(data.pwd, x.psw);
          if (pwdMatch) {
            //如果修改密码
            if (data.type == "psw") {
              let password = bcrypt.encryption(data.data);
              updatestr[data.type] = password;
              update(data.id, updatestr, res);
            } else {
              //邮箱匹配
              updatestr[data.type] = data.data;
              User.countDocuments(updatestr, (err, result) => {
                if (err) {
                  res.send({ status: 500 });
                } else {
                  //没有匹配项可以修改
                  if (result == 0) {
                    update(data.id, updatestr, res);
                  } else {
                    //已经有了
                    res.send({ status: 300 });
                  }
                }
              });
            }
          } else {
            //密码匹配失败
            res.send({ status: 400 });
          }
        });
      }
    });
  } else if (data.type == "name") {
    //用户名匹配
    updatestr[data.type] = data.data;
    User.countDocuments(updatestr, (err, result) => {
      if (err) {
        res.send({ status: 500 });
      } else {
        //没有匹配项可以修改
        if (result == 0) {
          update(data.id, updatestr, res);
        } else {
          //已经有了
          res.send({ status: 300 });
        }
      }
    });
  } else {
    //一般项修改
    updatestr[data.type] = data.data;
    update(data.id, updatestr, res);
  }
};

//好友昵称修改
exports.updateMarkName = function (data, res) {
  let wherestr = { user_id: data.uid, friend_id: data.fid };
  let updatestr = { mark_name: data.name };
  Friend.updateOne(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

//获取好友昵称
exports.getMarkName = function (data, res) {
  let wherestr = { user_id: data.uid, friend_id: data.fid };
  let out = { mark_name: 1 };
  Friend.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, data: result });
    }
  });
};

//好友请求
//添加好友表
exports.buildFriend = function (uid, fid, state, res) {
  let data = {
    user_id: uid,
    friend_id: fid,
    state: state,
    created_time: new Date(),
    last_date: new Date(),
  };

  let friend = new Friend(data);

  friend.save(function (err, result) {
    if (err) {
      // res.send({ status: 500 });
      console.log('好友表出错');
    } else {
      // res.send({ status: 200 });
    }
  });
};

//好友最后通讯时间
exports.upFriendLastTime = function(data){
  let wherestr = {$or:[{'user_id':data.uid,'friend_id':data.fid},{'user_id':data.fid,'friend_id':data.uid}]}
  let updatestr = {
    'last_time':new Date()
  }

  Friend.updateMany(wherestr,updatestr,(err,result)=>{
    if (err) {
      console.log('更新好友最后通讯时间出错');
    } else {
      // res.send({ status: 200 });
    }
  })
}

//添加一对一消息
exports.insertMsg = function (uid,fid,msg,type, res) {
  let data = {
    user_id: uid,
    friend_id: fid,
    message: msg,
    type: type,
    gmt_created: new Date(),
    state: 1,
  };

  let message = new Message(data);

  message.save((err, ressult) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

//好友申请
exports.applyFriend = function (data, res) {
  //判断是否为已经申请过
  let wherestr = {
    'user_id':data.uid,
    'friend_id':data.fid
  }

  Friend.countDocuments(wherestr,(err,result)=>{
    if(err){
      res.send({ status: 500});
    }else{
      if(result == 0){
        //初次申请
        this.buildFriend(data.uid,data.fid,2)
        this.buildFriend(data.fid,data.uid,1)
      }else{
        //已经申请过好友
        this.upFriendLastTime(data)
      }
      this.insertMsg(data.uid,data.fid,data.msg,0,res)
    }
  })
};


//更新同意好友状态
exports.updateFriendState = function(data,res){
  //修改项
  let wherestr = {$or:[{'user_id':data.uid,'friend_id':data.fid},{'user_id':data.fid,'friend_id':data.uid}]}
  Friend.updateMany(wherestr,{'state':0},(err,result)=>{
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  })

}

//拒绝或删除好友
exports.deleteFriend = function(data,res){
  //修改项
  let wherestr = {$or:[{'user_id':data.uid,'friend_id':data.fid},{'user_id':data.fid,'friend_id':data.uid}]}
  Friend.deleteMany(wherestr,(err,result)=>{
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  })
}

//按需求获取用户好友列表
exports.getUsers = function(uid,state,res){
  let query = Friend.find({})
  //查询条件
  query.where({'user_id':uid,'state':state})
  //查找friend_id关联的User对象
  query.populate('friend_id')
  //排序
  query.sort({'last_time':-1})
  //查询结果
  query.exec().then((e)=>{
    let result = e.map((x)=>{
      return {
        id: x.friend_id._id,
        name: x.friend_id.name,
        markName: x.mark_name,
        imgUrl: x.friend_id.imgurl,
        lastTime: x.last_time
      }
    })
    res.send({status:200,data:result})
  }).catch(e=>{
    res.send({status:500})
  })
}


//获取最后消息
exports.getOneMsg = function(uid,fid,res){
  let query = Message.findOne({})
  //查询条件
  query.where({$or:[{'user_id':uid,'friend_id':fid},{'user_id':fid,'friend_id':uid}]})
  //排序
  query.sort({'gmt_created':-1})
  //查询结果
  query.exec().then((e)=>{
      let result = {
        message: e.message,
        time:e.gmt_created,
        type:e.type
      }
    res.send({status:200,data:result})
  }).catch(e=>{
    res.send({status:500})
  })
}

//获取一对一未读消息数
exports.unreadMsg = function(data,res){
  let wherestr = {
    'user_id':data.uid,
    'friend_id':data.fid,
    'state': 1
  }

  Message.countDocuments(wherestr,(err,result)=>{
    if(err){
      res.send({ status: 500});
    }else{
      res.send({status:200,data:result})
    }
  })
}

//一对一消息修改为已读状态
exports.updateMsg = function(data,res){
  let wherestr = {$or:[{'user_id':data.uid,'friend_id':data.fid,state:1},{'user_id':data.fid,'friend_id':data.uid,state:1}]}
  
  let updatestr = {'state':0}

  Message.updateMany(wherestr,updatestr,(err,result)=>{
    if(err){
      res.send({ status: 500});
    }else{
      res.send({status:200})
    }
  })
}

exports.chatmsg = function(data,res){
  let wherestr = {$or:[{'user_id':data.uid,'friend_id':data.fid},{'user_id':data.fid,'friend_id':data.uid}]}
  let out = {
    user_id:1,
    friend_id:1,
    message:1,
    type:1,
    gmt_created:1
  }
  Message.find(wherestr, out,{sort:{gmt_created:-1}}, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, data: result });
    }
  });
}