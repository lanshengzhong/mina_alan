/* eslint-disable */

/*
  新版小程序一些配置文件
*/
import data from '@/data/data'

export default {
  title: '儿童传统文化故事',
  appid: 'wx69e607a2eaaf867d',
  channel: 'etctwhgs',
  shareinfo: {
    title: '国学启蒙，德才兼备！',
    imageUrl: data[1-1].album.share_cover
  },
  cacheTime: 1 // 缓存时间  用于图片缓存
}

/*
[
  {
	title: '古文观止',
	appid: 'wx80be4d31aa38849e',
	channel: 'gwgz',
	shareinfo: {
	  title: '古今佳作，开卷有益！',
	  imageUrl: data[2-1].album.share_cover
    },
	cacheTime: 1 // 缓存时间  用于图片缓存
  },
  {
      title: '经络穴位学堂',
	  appid: 'wx63e610317cc821ab',
	  channel: 'jlxwxt',
	  shareinfo: {
		title: '为你揭秘经络穴位的奥秘',
		imageUrl: data[2-1].album.share_cover
	  },
	  cacheTime: 1 // 缓存时间  用于图片缓存
  },
  {
	  title: '原始点学堂',
	  appid: '	wxdd8dc7db3e44f098',
	  channel: 'ysdxt',
	  shareinfo: {
		title: '原始点人共同的家园',
		imageUrl: data[1-1].album.share_cover
	  },
	  cacheTime: 1 // 缓存时间  用于图片缓存
  },
  {
	  title: '刮痧拔罐艾灸学堂',
	  appid: 'wx88cb6c0c001ea8bd',
	  channel: 'gsbgajxt',
	  shareinfo: {
		title: '共研中医传统保健方式',
		imageUrl: data[5-1].album.share_cover
	  },
	  cacheTime: 1 // 缓存时间  用于图片缓存
  }
]
{
  title: '上下五千年赏析',
  appid: 'wx1a4e4e5454394a6e',
  channel: 'sswjsx',
  shareinfo: {
    title: '让历史变成一部活生生的生活故事',
    imageUrl: data[2-1].album.share_cover
  },
  cacheTime: 1 // 缓存时间  用于图片缓存
}
*/
