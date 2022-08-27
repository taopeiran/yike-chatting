module.exports=function(io){
  //保存所有进入的用户
  var users={}
  //当有用户连接进来时会建立一个自己的socket对象，保存每个socket对象的id
  io.on('connection',(socket)=>{
    // console.log('a user connected')
    //用户进入
    socket.on('login',(id)=>{
      console.log(socket.id+'加入')
      socket.emit('msg',socket.id)
      socket.name = id
      users[id] = socket.id
      console.log(users)
    })
    //用户离开，删除该用户socket——id
    socket.on('disconnecting',()=>{
      if(users.hasOwnProperty(socket.name)){
        // console.log(users)
        delete users[socket.name]
        console.log(socket.id+'离开')
        // console.log(users)
      }
    })
// 监听msg，发送给指定用户
    socket.on('msg',(msg,uid,fid)=>{
      console.log(msg,uid,fid);
      console.log(users)
      socket.to(users[fid]).emit('msg',msg)
    })
  })
}