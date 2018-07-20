import wx from 'wx'
import Fly from 'flyio'
const request = new Fly()

// 定义公共headers
request.config.headers = {'content-type': 'application/json'}
// 设置超时
request.config.timeout = 30000
// 设置请求基地址
request.config.baseURL = 'https://easy-mock.com/mock/5aa890739674a054fd78bc41/example'

request.interceptors.request.use((request) => {
  // 在当前页面显示导航条加载动画
  // wx.showNavigationBarLoading()
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    // 隐藏导航条加载动画
    // wx.hideNavigationBarLoading()
    if (response.data.code === 200) {
      return promise.resolve(response.data)
    } else {
      if (response.data.code === 400) {
        wx.showToast({
          title: response.data.msg,
          icon: 'none'
        })
        return
      }
      if (response.data.code === 405) {
        // 未登录  或 token过期
        wx.removeStorageSync('token')
        wx.removeStorageSync('userInfo')
        // 跳转登录页面
        wx.navigateTo({
          url: `/pages/login/main`
        })
      }
    }
  },
  (err, promise) => {
    // 隐藏导航条加载动画
    // wx.hideNavigationBarLoading()
    // 错误信息
    wx.showToast({
      title: err.message,
      icon: 'none'
    })
    return promise.resolve()
  }
)

export default request
