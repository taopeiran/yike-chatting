var nodemailer = require('nodemailer')

var certificate = require('../config/certificate').qq

//创建传输方式
let transporter = nodemailer.createTransport({
  service:'qq',
  auth: {
    user: certificate.user, // generated ethereal user
    pass: certificate.pass, // generated ethereal password
  }
});

//注册时发送邮件给用户
exports.emailSignUp = function(email,res){
  let options = {
    from:'2760053900@qq.com',
    to:email,
    subject:'感谢您的注册！',
    html:'<span>欢迎您的加入</span><a href="#">点击</a>'
  }
  //发送邮件
  transporter.sendMail(options,(err,msg)=>{
    if(err){
      res.send(err)
    }else{
      res.send('邮箱发送成功')
    }
  })
}