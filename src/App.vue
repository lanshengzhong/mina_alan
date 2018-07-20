<script>
import { mapMutations } from 'vuex'
// import api from '@/utils/api'
import data from '@/data/data'

export default {
  mounted() {
    // 获取专辑列表
    this.getAlbumList()
  },
  onShow(res) {
    // 如果存在appid 说明是从其它小程序跳转过来的
    if (res.referrerInfo && res.referrerInfo.appId) {
      this.setJumpFlag(1)
    } else {
      this.setJumpFlag(0)
    }
  },
  methods: {
    ...mapMutations({
      setAlbumList: 'SET_ALBUM_LIST',
      setJumpFlag: 'setJumpFlag'
    }),
    async getAlbumList() {
      // 专辑列表
      // const list = await api.getAlbumList()
      // if (!list) return
      this.setAlbumList(data)
      // 如果从分享进来 跳转页面
      if (this.$root.$mp.query) {
        this.shareFrom()
      }
    },
    shareFrom() {
      const params = this.$root.$mp.query
      // 从专辑页分享进来的的
      if (params && params.id) {
        wx.navigateTo({
          url: `/pages/album/main?index=${params.index}&id=${params.id}`
        })
        return false
      }
    }
  }
}
</script>

<style lang="scss">
  ::-webkit-scrollbar{
    width: 0;
    height: 0;
    color: transparent;
  }
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .padding-30 {
    padding: 0 30rpx;
  }
  .border-16 {
    border-bottom: 16rpx solid #f3f4f5;
  }
</style>
