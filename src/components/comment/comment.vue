<template>
    <!--评论列表  -->
    <div class="comment">
        <div class="comment-list" v-for="(comment,index) in commentlist" :key="index">
            <div class="header">
                <div class="user" :user-id="comment.id">
                    <img :src="comment.avatar" mode="aspectFill" alt="">
                    <p class="name">{{comment.nickname}}</p>
                </div>
            </div>
            <div class="content">
                <p class="desc">
					{{comment.content}}
				</p>
            </div>
        </div>        
    </div>
</template>

<script>
export default {
  props: {
    commentlist: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss">
    .comment {
		background-color: #fff;
        .comment-list {
            .header {
                padding: 30rpx 0 12rpx 0;
				display: flex;
				align-items: center;
                .user {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					img {
						width: 70rpx;
						height:70rpx;
						border: 1rpx solid #eee;
						border-radius: 50%;
					}
					.name {
						line-height: 70rpx;
						font-size: 28rpx;
						color: #888;
						margin: 0 20rpx;
					}
				}
            }
            .content {
				margin-left: 90rpx;
				padding-bottom: 30rpx;
				border-bottom: 1rpx solid #f3f3f3;
				.desc {
					color: #333;
					font-size: 32rpx;
					line-height: 48rpx;
					word-wrap: break-word;
				}
            }   
            &:last-child {
                .content {
                    border-bottom: none!important;
                }
            } 
        }
    }
</style>
