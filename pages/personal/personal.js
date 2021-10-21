
import request from '../../utils/request'
// pages/personal/personal.js
let startY = 0 //手指起始坐标
let moveY = 0 //手指移动实时坐标
let moveDistance = 0 //手指移动的距离
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:'translateY(0)',
        coverTranstion:'',
        userInfo:{},//用户信息
        recentPlayList:[]//最近播放
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo=wx.getStorageSync('userInfo')
        if(userInfo){
            this.setData({
                userInfo
            })
        }
        this.getRecentPlayData(userInfo.userId)
    },

    //获取用户播放记录的函数
   async getRecentPlayData(userId){
        let result= await request('/user/record',{uid:userId,type:1})
        // console.log(result);
        let index=0
        //这里给数组中的每一项加入了一个id，方便后续遍历的时候设置id为Key值
        let recentPlayList=result.weekData.slice(0,10).map(item=>{
            item.id=index++
            return item
        })
        console.log(recentPlayList);
        this.setData({
            recentPlayList
        })
    },

    //手指点击事件
    handleTouchStart(event) {
        //清除之前的过渡效果
        this.setData({
         
            coverTranstion:''
        })
        startY = event.touches[0].clientY
    },
    //手指移动事件
    handleTouchMove(event) {
        moveY = event.touches[0].clientY
        moveDistance = moveY - startY
        // console.log(moveDistance);
        if(moveDistance<0){
            return
        }
        if(moveDistance>=80){
            moveDistance=80
        }
        this.setData({
            coverTransform:`translateY(${moveDistance}rpx)`
        })
    },
    //手指离开事件
    handleTouchEnd() {
        this.setData({
            coverTransform:`translateY(0)`,
            coverTranstion:'transform 1s linear'
        })
    },
    //跳转至登录页面
    toLogin(){
        if(this.data.userInfo.nickname){
            return
        }
        wx.navigateTo({
          url: '/pages/login/login',        
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