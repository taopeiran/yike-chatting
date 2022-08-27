import {request} from '@/utils/request.js'

//登录
export const signIn = params => {
	return request('/signin/match',"POST",params)
};


//注册
//判断用户名和邮箱是否占用
export const judgeUser = params => {
	return request('/signup/judge',"POST",params)
};

//注册
export const addUser = params => {
	return request('/signup/add',"POST",params)
};

//搜索页面
export const searchUser = params => {
	return request('/search/user',"POST",params)
};

export const isFriend = params => {
	return request('/search/isfriend',"POST",params)
};

//详情页
export const getDetail = params => {
	return request('/user/detail',"POST",params)
};

export const getmarkname = params => {
	return request('/user/getmarkname',"POST",params)
};

export const update = params => {
	return request('/user/update',"POST",params)
};

//好友操作
export const applyfriend = params => {
	return request('/friend/applyfriend',"POST",params)
};

export const updatemarkname = params => {
	return request('/user/updatemarkname',"POST",params)
};

export const updatefriendstate = params => {
	return request('/friend/updatefriendstate',"POST",params)
};

//主页
export const getfriend = params => {
	return request('/index/getfriend',"POST",params)
};

export const getlastmsg = params => {
	return request('/index/getlastmsg',"POST",params)
};

export const unreadmsg = params => {
	return request('/index/unreadmsg',"POST",params)
};

export const deletefriend = params => {
	return request('/friend/deletefriend',"POST",params)
};

//消息
export const updatemsg = params => {
	return request('/index/updatemsg',"POST",params)
};

export const chatmsg = params => {
	return request('/chatroom/chatmsg',"POST",params)
};

export const insertmsg = params => {
	return request('/chatroom/insertmsg',"POST",params)
};