// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], //导航标签数据
        navId: '', //导航标签id
        videoList: [], //视频列表
        videoId: '', //video标识
        videoUpdateTime:[]//记录实时播放的时长
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getVideoGroupList()
    },
    //获取导航标签数据
    async getVideoGroupList() {
        let result = await request('/video/group/list')
        this.setData({
            videoGroupList: result.data.slice(0, 14),
            navId: result.data[0].id
        })
        this.getVideoList(this.data.navId)
    },

    //获取视频列表
    async getVideoList(navId) {
        let videoListData = await request('/video/group', {
            id: navId
        })
        // console.log(videoListData);

        //为数组每一项增加一个索引值，方便后面遍历作为key值
        let index = 0
        let videoList = videoListData.datas.map(item => {
            item.id = index++
            return item
        })
        //隐藏正在加载提示
        wx.hideLoading()
        this.setData({
            videoList
        })
    },

    //导航切换点击事件
    changeNav(event) {
        let navId = event.currentTarget.dataset.id

        //修改navId
        this.setData({
            navId: navId >>> 0,
            videoList: []
        })
        //显示正在加载
        wx.showLoading({
            title: '正在加载',
        })
        //获取视频列表数据
        this.getVideoList(this.data.navId)
    },

    //点击播放视频的回调
    handlePlay(event) {
        let vid = event.currentTarget.id
        //解决多个视频同时播放
        // this.vid !== vid && this.videoContext && this.videoContext.stop()
        this.vid = vid
        this.setData({
            videoId: vid
        })
        this.videoContext = wx.createVideoContext(vid)
        //判断当前视频是否有播放记录
        let {videoUpdateTime}=this.data
        //查找一下当前视频是否已经有播放记录
        let videoItem=videoUpdateTime.find(item=>item.vid===vid)
        //如果找到了  跳转至之前的播放位置
        if(videoItem){
            this.videoContext.seek(videoItem.currentTime)
        }

        //播放当前视频
        this.videoContext.play()
    },
    //视频播放进度实时变化的回调
    handleTimeUpdate(event){
        // console.log(event);
        //定义一个存储当前视频id和播放时间的对象
        let videoTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime}
        //从数据中结构出videoUpdateTime数组
        let {videoUpdateTime} =this.data
        //查找数组中是否已经有过记录
        let videoItem=videoUpdateTime.find(item=>item.vid===event.currentTarget.id)
        if(videoItem){  
            //如果找到了   更新时间即可
            videoItem.currentTime=event.detail.currentTime
        }else{
            //如果没找到直接push进数组
            videoUpdateTime.push(videoTimeObj)
        }
        //需要重新更新数组
        this.setData({
            videoUpdateTime
        })
    },

    //视频播放结束的回调
    handleEnded(event){
        let {videoUpdateTime}=this.data
        //将当前视频的播放记录移除掉
        videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id),1)
        this.setData({
            videoUpdateTime
        })
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