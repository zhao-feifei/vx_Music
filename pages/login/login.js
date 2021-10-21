// pages/login/login.js

import request from  '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '', //手机号
        password: '' //密码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    handleInput(event) {
        console.log(event);
        let type = event.currentTarget.id
        this.setData({
            [type]: event.detail.value
        })
    },
    //登录按钮绑定事件
  async  login() {
        //前端验证
        let {
            phone,
            password
        } = this.data
        //手机号与密码验证
        if (!phone) {
            wx.showToast({
                title: '手机号不能为空！',
                icon: "error",
            })
            return
        }
        let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!phoneReg.test(phone)) {
            wx.showToast({
                title: '手机号格式错误！',
                icon: "error",
            })
            return
        }
        if (!password) {
            wx.showToast({
                title: '密码不能为空！',
                icon: "error",
            })
            return
        }

        //后端验证
        let result=await request("/login/cellphone",{phone,password})
        if(result.code==200){
            wx.showToast({
                title: '登陆成功!',
                icon: "success",
            })
            console.log(result);
            wx.setStorageSync('userInfo', result.profile)
            // wx.navigateBack({
            //   delta: 0,            
            // })
            wx.reLaunch({
                url: '/pages/personal/personal',
            })
        }else if(result.code==400){
            wx.showToast({
                title: '手机号错误!',
                icon: "error",
            })
        }else if(result.code==502){
            wx.showToast({
                title: '密码错误!',
                icon: "error",
            })
        }else{
            wx.showToast({
                title: '网络繁忙!',
                icon: "error",
            })
        }
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