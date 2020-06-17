import { HTTP_REQUEST_URL_NEW, HEADER, TOKENNAME} from '@/config/app';
import { toLogin, checkLogin } from '../libs/login';
import store from '../store';


/**
 * 发送请求
 */
function baseRequest_new(url, method, data, {noAuth = false, noVerify = false})
{
  let Url = HTTP_REQUEST_URL_NEW, header = HEADER;
  
  if (!noAuth) {
    //登录过期自动登录
	if(!store.state.app.token && !checkLogin()){
		toLogin();
		return Promise.reject({msg:'未登陆'});
	}
  }
  
  if (store.state.app.token) header[TOKENNAME] = 'Bearer ' + store.state.app.token;

  return new Promise((reslove, reject) => {
    uni.request({
      url: Url + '/h5api/web?r=' + url,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
        if (noVerify)
          reslove(res.data, res);
        else if (res.data.status == 200)
          reslove(res.data, res);
        else if ([410000, 410001, 410002].indexOf(res.data.status) !== -1) {
		  toLogin();
          reject(res.data);
        } else
          reject(res.data.msg || '系统错误');
      },
      fail: (msg) => {
        reject('请求失败');
      }
    })
  });
}

const request_new = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request_new[method] = (api, data, opt) => baseRequest_new(api, method, data, opt || {})
});



export default request_new;
