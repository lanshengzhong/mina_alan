import request from './request'
import config from '@/utils/config'

// 暂时这么处理  每次都写一遍公共参数
const api = {
  // 登录
  login: (params) => request.post('sign_in', {...params,
    ...{
      channel: config.channel
    }}),
  // 首页控制显示红枣FM封面广告
  getFmFlag: (params) => request.post('control/ad', {...params,
    ...{
      channel: config.channel
    }}),
  // 今日是否打卡
  getClockFlag: (params) => request.post('is_sign', {...params,
    ...{
      token: wx.getStorageSync('token'),
      channel: config.channel
    }}),
  // 打卡信息
  getClockInfo: (params) => request.post('sign', {...params,
    ...{
      token: wx.getStorageSync('token'),
      channel: config.channel
    }}),
  // 打卡排行帮列表
  getClockList: (params) => request.post('sign/rank', {...params,
    ...{
      channel: config.channel
    }}),
  // 获取节目评论列表
  getCommentList: (params) => request.post('comment/list', {...params,
    ...{
      channel: config.channel
    }}),
  // 发表评论
  createComment: (params) => request.post('comment/create', {...params,
    ...{
      token: wx.getStorageSync('token'),
      channel: config.channel
    }})
}

export default api
