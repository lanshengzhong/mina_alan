
// 输入的内容验证
export const textvVerify = (val) => {
  if (val.length === 0 || val.match(/^\s+$/g)) {
    toast('输入为空，或都是空格')
    return false
  }
}
// 吐司
export const toast = (str, image) => {
  wx.showToast({
    title: str.toString(),
    image: image,
    icon: 'none',
    duration: 2000
  })
}

// 显示loading
export const showLoading = (str, mask = true) => {
  wx.showLoading({
    title: str.toString(),
    mask: mask
  })
}

// 隐藏loading
export const hideLoading = (str) => {
  wx.hideLoading()
}

// 单位字数转换为 万 12300转换为1.2万的方法
// 隐藏loading
export const numberSwitch = (num) => {
  return num > 9999 ? (Math.floor(num / 1000) / 10) + '万' : num
}

// 补0操作
function toDouble(_num) {
  return _num > 9 ? ('' + _num) : ('0' + _num)
}
// 格式化时间
export const formatDuration = (_time) => {
  _time = Math.ceil(_time)
  _time = parseInt(_time)
  var _minutes = _time / 60
  var _arr = _minutes.toString().split('.')
  return toDouble(_arr[0]) + ':' + toDouble(_time - _arr[0] * 60)
}
