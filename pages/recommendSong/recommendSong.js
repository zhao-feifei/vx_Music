// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        recommedList: [], //推荐歌曲列表
        index:0 //点击的歌曲下标  暂时存起来方便前后切换歌曲
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //动态设置当前日期
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })
        this.getRecommendList()
        console.log(this.data.recommedList);
        //订阅songDetail发布的type消息
        PubSub.subscribe('switchType', (msg, switchType) => {
            let {recommedList,index}=this.data
            if(switchType==='pre'){ //点击了上一首
                index-=1
            }else{
                index+=1
            }
            console.log(recommedList);
            let musicId=recommedList[index].id
            //将切换后的musicId发送给songDetail页面
            PubSub.publish('musicId',musicId)
        })
    },

    //获取每日推荐的功能函数
    async getRecommendList() {
        let recommendListData = await request('/recommend/songs')
        console.log(recommendListData);
        // 更新数据
        this.setData({
            recommendList: recommendListData.recommend
        })

    },

    //跳转至歌曲详情的回调
    toSongDetail(event) {
        // console.log(event.currentTarget.dataset);
        let {id,index }= event.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/pages/songDetail/songDetail?musicId=' + id,
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