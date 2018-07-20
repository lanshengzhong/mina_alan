import * as types from './mutation-types'
import { Base64 } from 'js-base64'
import api from '@/utils/api'
import { toast, showLoading, hideLoading } from '@/utils'

const actions = {
  // 用户允许
  gotInfo({dispatch, commit}, info) {
    commit(types.SET_USER_INFO, info.userInfo)
    wx.setStorageSync('userInfo', info.userInfo)
    // 每次都要重新登录
    dispatch('login', info)
  },
  // 登录 获取token
  login({dispatch, commit, state}, user) {
    wx.login({
      success: res => {
        if (res.code) {
          dispatch('loginCode', {
            code: res.code,
            user
          })
        }
      }
    })
  },
  // 存入token
  async loginCode({dispatch, commit, state}, user) {
    const info = await api.login({
      code: user.code,
      user_info: user.user.userInfo,
      encrypt_data: Base64.encode(user.user.encryptedData),
      iv: Base64.encode(user.user.iv)
    })
    // 失败
    if (!info.data.token) {
      toast('登录失败，请重试')
      return false
    }
    // 登录成功存入token
    if (info.data.token) {
      wx.setStorageSync('token', info.data.token)
      // 关闭当前页
      toast('登录成功')
      // 隐藏loading
      hideLoading()
      // 返回页面
      wx.navigateBack()
    }
  },
  // 音频播放监听 各种事件处理
  audioAction({dispatch, commit, state}) {
    // 音频加载中事件
    wx.getBackgroundAudioManager().onWaiting(() => {
      console.log('音频加载中事件')
      showLoading('音频加载中')
    })
    // 音频进入可以播放状态，但不保证后面可以流畅播放
    wx.getBackgroundAudioManager().onCanplay(() => {
      console.log('音频进入可以播放状态，但不保证后面可以流畅播放')
      hideLoading()
    })
    // 监听播放
    wx.getBackgroundAudioManager().onPlay(() => {
      console.log('监听播放')
      dispatch('audioPlay')
      hideLoading()
    })
    // 音频播放进度更新事件
    let num = 0
    wx.getBackgroundAudioManager().onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      let currentTime = wx.getBackgroundAudioManager().currentTime
      if (parseInt(currentTime) !== Number(num)) {
        num = parseInt(currentTime)
        commit(types.SET_CURRENT_TIME, num)
      }
    })
    // 音频自然播放结束事件
    wx.getBackgroundAudioManager().onEnded(() => {
      console.log('音频自然播放结束事件')
      // 是否购买
      dispatch('audioPayFlag', 1).then((res) => {
        if (!res) {
          /*
            在第三集 未购买 不能播放
            1. 播放状态置为暂停
            2. 用户点击播放重新开始播放（暂未实现）
          */
          if (state.playinfo.index === 2) {
            // 暂停
            dispatch('audioPause')
          }
          return false
        } else {
          // 播放下一曲
          dispatch('audioNext')
        }
      })
    })
    // 监听暂停
    wx.getBackgroundAudioManager().onPause(() => {
      console.log('监听暂停')
      dispatch('audioPause')
      hideLoading()
    })
    // 监听停止
    wx.getBackgroundAudioManager().onStop(() => {
      console.log('已经停止')
      hideLoading()
    })
    // 背景音频播放错误事件
    wx.getBackgroundAudioManager().onError((res) => {
      console.log(res)
      console.log('背景音频播放错误事件')
      hideLoading()
    })
    // 用户在系统音乐播放面板点击上一曲事件（iOS only）
    wx.getBackgroundAudioManager().onPrev(() => {
      // 播放上一曲
      console.log('上一曲')
      dispatch('audioPrev')
    })
    // 用户在系统音乐播放面板点击下一曲事件（iOS only）
    wx.getBackgroundAudioManager().onNext(() => {
      // 播放下一曲
      console.log('下一曲')
      dispatch('audioNext')
    })
  },
  // 专辑详情页 点击节目播放
  selectPlay({dispatch, commit, state}, {isbought, programlist, index}) {
    // 如果点击的是当前节目
    if (state.activeid !== programlist.program[index].id) {
      // 改变全局是否购买字段
      commit(types.SET_ISBOUGHT, isbought)
      // 底部播放栏的显示
      commit(types.SET_PLAY_FLAG, true)
      // 播放状态 播放
      commit(types.SET_PLAY_STATUS, true)
      // 正在播放的节目id
      commit(types.SET_ACTIVE_ID, programlist.program[index].id)
      // 节目列表
      commit(types.SET_PROGRAM_LIST, programlist)
      // 播放信息
      commit(types.SET_PLAY_INFO, programlist.program[index])
      // 设置背景播放信息 用于播放
      commit('setAudioInfo')
      // 播放
      dispatch('audioPlay')
    }
  },
  // 音频播放
  audioPlay({dispatch, commit, state}) {
    wx.getBackgroundAudioManager().play()
    // 播放状态 播放
    commit(types.SET_PLAY_STATUS, 1)
  },
  // 音频暂停
  audioPause({dispatch, commit, state}) {
    wx.getBackgroundAudioManager().pause()
    // 播放状态 暂停
    commit(types.SET_PLAY_STATUS, 0)
  },
  // 音频跳到指定时间
  audioSeek({dispatch, commit, state}, time) {
    wx.getBackgroundAudioManager().seek(time)
  },
  // 音频是否购买
  audioPayFlag({dispatch, commit, state}, control) {
    // control 字段： 判断是触发上一曲还是下一曲 0上一曲 1下一曲
    // control ? state.playinfo.index >= 2 : state.playinfo.index === 0
    /*
      判断是否购买这个专辑
      1.是否购买
      2.当前播放的节目索引
      3.当前是第三集的时候自然播放结束停止播放下一曲未购买的时候 不跳转，暂停播放 按钮置为暂停状态
    */
    if (!state.isbought && (control ? state.playinfo.index >= 2 : state.playinfo.index === 0)) {
      wx.showToast({
        title: '未购买,请先购买后重试',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  },
  // 下一曲
  audioNext({dispatch, commit, state}) {
    // 是否购买
    dispatch('audioPayFlag', 1).then((res) => {
      if (!res) {
        // 不作处理 继续播放当前的节目
        return false
      } else {
        // 播放下一曲
        // 当前播放的节目所在节目列表数组索引
        let _now = state.playinfo.index
        // 当前播放的节目列表数组的长度
        let _total = state.programlist.program.length
        // 如果在播放最后一集 跳转到第一集
        if (_now === (_total - 1)) {
          dispatch('nextInfo', 0)
        } else {
          dispatch('nextInfo', _now + 1)
        }
      }
    })
  },
  // 上一曲
  audioPrev({dispatch, commit, state}) {
    // 是否购买
    dispatch('audioPayFlag', 0).then((res) => {
      if (!res) {
        // 不作处理 继续播放当前的节目
        return false
      } else {
        // 播放上一曲
        // 当前播放的节目所在节目列表数组索引
        let _now = state.playinfo.index
        // 当前播放的节目列表数组的长度
        let _total = state.programlist.program.length
        // 如果在播放第一集 跳转到最后一集
        if (_now === 0) {
          dispatch('nextInfo', _total - 1)
        } else {
          dispatch('nextInfo', _now - 1)
        }
      }
    })
  },
  // 设置上、下一曲的信息
  nextInfo({dispatch, commit, state}, index) {
    // 播放状态 播放
    commit(types.SET_PLAY_STATUS, true)
    // 正在播放的节目id
    commit(types.SET_ACTIVE_ID, state.programlist.program[index].id)
    // 播放信息
    commit(types.SET_PLAY_INFO, state.programlist.program[index])
    // 设置背景播放信息 用于播放
    commit('setAudioInfo')
    // 播放
    dispatch('audioPlay')
  }
}

export default actions
