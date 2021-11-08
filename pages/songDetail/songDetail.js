import request from '../../utils/request'
import PubSub from 'pubsub-js'
let appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //标识是否播放
        song: {}, //歌曲详情对象
        musicId: '' //音乐标识
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let musicId = options.musicId
        //保存音乐id，获取播放音频时候用到
        this.setData({
            musicId
        })
        this.getmusicInfo(musicId)

        //判断当前页面的音乐是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            //音乐在播放,修改播放状态为true
            this.setData({
                isPlay: true
            })
        }


           //订阅recommendSong页面发布的消息 ： musicId
           PubSub.subscribe('musicId', (msg, musicId) => {
            // console.log('来自recommend页面的消息', musicId);
            //获取最新的音乐详情
            this.getmusicInfo(musicId)

            //自动播放当前音乐
            this.musicControl(true,musicId)
        })
     
    },


    //点击播放/暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        this.setData({
            isPlay
        })
        let {
            musicId
        } = this.data
        this.musicControl(isPlay, musicId)

    },

    //控制音乐的播放与暂停
    async musicControl(isPlay, musicId) {
        //生成背景音频实例
        let backgroundAudioManager = wx.getBackgroundAudioManager()
        if (isPlay) {
            // 获取音乐播放地址
            let musicLinkData = await request('/song/url', {
                id: musicId
            })
            let musicLink = musicLinkData.data[0].url
            backgroundAudioManager.src = musicLink
            backgroundAudioManager.title = this.data.song.name
            //修改全局的播放状态
            appInstance.globalData.isMusicPlay = true
            appInstance.globalData.musicId = musicId
        } else {
            backgroundAudioManager.pause()
            //修改全局的播放状态
            appInstance.globalData.isMusicPlay = false

        }
    },

    //根据传过来的id获取音乐详情
    async getmusicInfo(musicId) {
        let songData = await request('/song/detail', {
            ids: musicId
        })
        this.setData({
            song: songData.songs[0]
        })
        //动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name,
        })
    },

    //点击切换歌曲的回调
    handleSwitch(event) {
        //获取切换歌曲的类型
        let type = event.currentTarget.id

      
        //使用发布订阅将点击切换的类型发给recommend页面
        PubSub.publish('switchType', type)
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})