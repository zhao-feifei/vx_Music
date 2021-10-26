import config from './config'
// 封装ajax请求函数
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url:config.host+url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').toString():''
      },
      success: (res) => {
        // console.log(res)
        if(data.isLogin){
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data)
      },
      fail: (err) => {
        console.log('请求失败！',err);
        reject(err)
      },
    })
  })
}