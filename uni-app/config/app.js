
module.exports = {
	// 请求域名 格式： https://您的域名
	// #ifdef MP
	HTTP_REQUEST_URL:'https://www.ipinhai1.com',
	HTTP_REQUEST_URL_NEW:'https://store.aichaoxuan.com/h5api/',
	HTTP_REQUEST_URL_TEST:'https://youpin.xiaosongzhixue.com',
	APP_ID:'wx72ab3a22dc7b00f9',
	// #endif
	
	// #ifdef H5
		//H5接口是浏览器地址
		//HTTP_REQUEST_URL: window.location.protocol+"//"+window.location.host,
		HTTP_REQUEST_URL:'https://www.ipinhai1.com',
		HTTP_REQUEST_URL_NEW:'https://store.aichaoxuan.com/h5api/',
		HTTP_REQUEST_URL_TEST:'https://youpin.xiaosongzhixue.com',
		APP_ID:'wx72ab3a22dc7b00f9',
	// #endif
	HOST:'https://store.aichaoxuan.com',
	
	HEADER:{
		'content-type': 'application/json'
	},
	// 会话密钥名称 请勿修改此配置
	TOKENNAME: 'Authori-zation',
	// 缓存时间 0 永久
	EXPIRE:0,
};
