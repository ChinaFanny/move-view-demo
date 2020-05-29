//index.js
//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片移动相关
    x: 0,
    y: 0,
    hidden: true,
    flag: false,
    disabled: true,
    beginIndex: 0,
    moveImgUrl: '',
    elements: [], // 图片组件元素数组1
    elements1: [], // 图片组件元素数组2
    elements3: [], // 图片组件元素数组3
    moveKey: '', // img:图片1；img1:图片2；img2：图片3

    // 图片数据
    images: [{
      id: 1,
      url: '/assets/images/lufei.jpg'
    }, {
      id: 2,
      url: '/assets/images/suoluo.jpg'
    }],

    images1: [{
      id: 3,
      url: '/assets/images/namei.jpg'
    }, {
      id: 4,
      url: '/assets/images/luobin.jpg'
    }],

    images2: [ // image2是多个图片数组组成的数组
      [{
        id: 5,
        url: '/assets/images/qiaoba.jpg'
      }, {
        id: 6,
        url: '/assets/images/wusuopu.jpg'
      }],
      [{
        id: 7,
        url: '/assets/images/shanzhi.jpg'
      }, {
        id: 8,
        url: '/assets/images/shenping.jpg'
      }, {
        id: 9,
        url: '/assets/images/fulanqi.jpg'
      }, {
        id: 10,
        url: '/assets/images/buluke.jpg'
      }]
    ],

    files: [],
    files1: [],
    files2: [], // files2是多个图片url数组组成的数组
    ids: [],
    ids1: [],
    ids2: [], // ids2是多个图片id数组组成的数组

    imgWidth: 100 // 图片宽高
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData('img')
    this.initData('img1')
    this.initData('img2')
  },

  initData: function (type) {
    var images = []
    var ids = []
    var files = []
    switch (type) {
      case 'img': {
        images = this.data.images
        for (var i = 0; i < images.length; i++) {
          var image = images[i]
          ids.push(image.id)
          files.push(image.url)
        }
        this.setData({
          files: files,
          ids: ids
        })
        break
      }
      case 'img1': {
        images = this.data.images1
        for (var i = 0; i < images.length; i++) {
          var image = images[i]
          ids.push(image.id)
          files.push(image.url)
        }
        this.setData({
          files1: files,
          ids1: ids
        })
        break
      }
      case 'img2': {
        images = this.data.images2
        for (var i = 0; i < images.length; i++) {
          var imgArr = images[i]
          var fileArr = []
          var idArr = []
          for (var j = 0; j < imgArr.length; j++) {
            fileArr.push(imgArr[j].url)
            idArr.push(imgArr[j].id)
          }
          files.push(fileArr)
          ids.push(idArr)
        }
        console.log(files)
        console.log(ids)
        this.setData({
          files2: files,
          ids2: ids
        })
        break
      }
    }
  },

  /**
   * 浏览图片
   */
  onPreview: function (e) {
    var type = e.currentTarget.dataset.key
    var url = e.currentTarget.dataset.id
    if (url.indexOf('http') === -1) {
      wx.showToast({
        title: '本地图片不支持预览',
        icon: 'none'
      })
      return
    }
    var itemIndex = e.currentTarget.dataset.itemindex
    var files = []
    switch (type) {
      case 'img': {
        files = this.data.files
        break
      }
      case 'img1': {
        files = this.data.files1
        break
      }
      case 'img2': {
        files = this.data.files2[itemIndex]
        break
      }
    }

    var tmpfiles = []
    for (var i = 0; i < files.length; i++) {
      var item = files[i]
      if (item.indexOf('http') > -1) {
        tmpfiles.push(item)
      }
    }

    wx.previewImage({
      current: url,
      urls: tmpfiles,
    })
  },
  /**
   * 上传头图
   */
  onChooseImage: function (e) {
    var type = e.currentTarget.dataset.key
    var that = this
    var files = []
    var ids = []
    var itemIndex = e.currentTarget.dataset.itemindex
    switch (type) {
      case 'img': {
        files = this.data.files
        ids = this.data.ids
        break
      }
      case 'img1': {
        files = this.data.files1
        ids = this.data.ids1
        break
      }
      case 'img2': {
        if (itemIndex != undefined) {
          files = this.data.files2[itemIndex]
          ids = this.data.ids2[itemIndex]
        }

        break
      }
    }

    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        if (res) {
          console.log(res.tempFilePaths)
          var lastId = 0
          if ( ids.length > 0) {
            lastId = ids[ids.length - 1]
          } else {
            lastId = that.data.ids.length + that.data.ids1.length
            for (var k = 0; k < that.data.ids2.length; k++) {
              var idArr = that.data.ids2[k]
              lastId += idArr.length
            }
          }
          console.log('lastId:', lastId)
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            var imgUrl = res.tempFilePaths[i]
            lastId = lastId + 1
            files.push(imgUrl)
            ids.push(lastId)
          }
          switch (type) {
            case 'img': {
              that.setData({
                files: files,
                ids: ids
              })
              break
            }
            case 'img1': {
              that.setData({
                files1: files,
                ids1: ids
              })
              break
            }
            case 'img2': {
              var files2 = that.data.files2
              var ids2 = that.data.ids2
              if (itemIndex != undefined) {
                files2.splice(itemIndex, 1, files)
                ids2.splice(itemIndex, 1, ids)
              } else {
                files2.push(files)
                ids2.push(ids)
              }

              that.setData({
                files2: files2,
                ids2: ids2
              })
              break
            }
          }
        }
      }
    })
  },

  /**
   * 删除头图、活动图片\视频
   */
  onDelete: function (e) {
    var that = this
    var type = e.currentTarget.dataset.key
    var index = e.currentTarget.dataset.index
    var itemIndex = e.currentTarget.dataset.itemindex

    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var files = []
          var ids = []
          switch (type) {
            case 'img': {
              files = that.data.files
              ids = that.data.ids
              files.splice(index, 1)
              ids.splice(index, 1)
              that.setData({
                files: files,
                ids: ids
              })
              break
            }
            case 'img1': {
              files = that.data.files1
              ids = that.data.ids1
              files.splice(index, 1)
              ids.splice(index, 1)
              that.setData({
                files1: files,
                ids1: ids
              })
              break
            }
            case 'img2': {
              files = that.data.files2
              ids = that.data.ids2
              var fileItems = files[itemIndex]
              var idItems = ids[itemIndex]
              fileItems.splice(index, 1)
              idItems.splice(index, 1)
              files.splice(itemIndex, 1, fileItems)
              ids.splice(itemIndex, 1, idItems)
              that.setData({
                files2: files,
                ids2: ids
              })
              break
            }
          }
        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  /*************封面图片拖拽关事件*****************/
  /**
   * 获取封面图片image元素
   */
  getImageViews: function (key, index) {
    var query = wx.createSelectorQuery()
    var nodesRef = null
    switch (key) {
      case 'img': {
        nodesRef = query.selectAll(".image-view")
        break
      }
      case 'img1': {
        nodesRef = query.selectAll(".image1-view")
        break
      }
      case 'img2': {
        nodesRef = query.selectAll(`.image2-view-${index}`)
        break
      }
    }

    nodesRef.fields({
      dataset: true,
      rect: true
    }, (result) => {
      switch (key) {
        case 'img': {
          this.setData({
            elements: result
          })
          break
        }
        case 'img1': {
          this.setData({
            elements1: result
          })
          break
        }
        case 'img2': {
          this.setData({
            elements2: result
          })
          break
        }
      }
    }).exec()
  },

  onPageScroll: function (e) {
    /**
     * 页面滚动时，重新计算elements
     */
    // if (this.data.files.length > 1) {
    //   this.getImageViews('img', 0)
    // }
    // if (this.data.files1.length > 1) {
    //   this.getImageViews('img1', 0)
    // }
  },
  //长按
  onLongtap: function (e) {
    console.log(e)
    var that = this
    var key = e.currentTarget.dataset.key
    this.setData({
      moveKey: key
    })
    const detail = e.detail;
    console.log(`detail:${detail}`)
    console.log(`detail.x:${detail.x}, detail.y:${detail.y}`)
    console.log(`onLongtap---x:${e.currentTarget.offsetLeft}，y:${e.currentTarget.offsetTop}`)
    this.setData({
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })

    that.setData({
      hidden: false,
      flag: true
    })
  },
  //触摸开始
  touchs: function (e) {
    var beginIndex = e.currentTarget.dataset.index
    console.log(`beginIndex:${beginIndex}`)
    var itemIndex = e.currentTarget.dataset.itemindex
    var key = e.currentTarget.dataset.key
    var moveImgUrl = ''
    switch (key) {
      case 'img': {
        moveImgUrl = this.data.files[beginIndex]
        break
      }
      case 'img1': {
        moveImgUrl = this.data.files1[beginIndex]
        break
      }
      case 'img2': {
        var files = this.data.files2
        moveImgUrl = files[itemIndex][beginIndex]
        break
      }
    }

    this.getImageViews(key, itemIndex)

    this.setData({
      beginIndex: beginIndex,
      moveImgUrl: moveImgUrl
    })
  },
  //触摸结束
  touchend: function (e) {
    if (!this.data.flag) {
      return;
    }

    // pageX, pageY	Number	距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
    // clientX, clientY	Number	距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
    // const x = e.changedTouches[0].pageX
    // const y = e.changedTouches[0].pageY
    console.log(`touchend---pageX:${e.changedTouches[0].pageX}，pageY:${e.changedTouches[0].pageY}`)
    const x = e.changedTouches[0].clientX
    const y = e.changedTouches[0].clientY
    console.log(`touchend---clientX:${x}，clientY:${y}`)
    var key = e.currentTarget.dataset.key
    var itemIndex = e.currentTarget.dataset.itemindex
    var list = []
    var data = []
    var files = []
    switch (key) {
      case 'img': {
        list = this.data.elements
        data = this.data.ids
        files = this.data.files
        break
      }
      case 'img1': {
        list = this.data.elements1
        data = this.data.ids1
        files = this.data.files1
        break
      }
      case 'img2': {
        list = this.data.elements2
        data = this.data.ids2[itemIndex]
        files = this.data.files2[itemIndex]
        break
      }
    }
    console.log(`移动前：${data}, ${files}`)
    for (var j = 0; j < list.length; j++) {
      const item = list[j];
      console.log(`item.left:${item.left},  x:${x}, item.right:${item.right}`)
      console.log(`item.top:${item.top}, y:${y}, item.bottom:${item.bottom}`)
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
        const endIndex = item.dataset.index;
        const beginIndex = this.data.beginIndex;
        //向后移动
        if (beginIndex < endIndex) {
          let tem = data[beginIndex]
          let temImgUrl = files[beginIndex]
          for (let i = beginIndex; i < endIndex; i++) {
            data[i] = data[i + 1]
            files[i] = files[i + 1]
          }
          data[endIndex] = tem
          files[endIndex] = temImgUrl
        }
        //向前移动
        if (beginIndex > endIndex) {
          let tem = data[beginIndex]
          let temImgUrl = files[beginIndex]
          for (let i = beginIndex; i > endIndex; i--) {
            data[i] = data[i - 1]
            files[i] = files[i - 1]
          }
          data[endIndex] = tem
          files[endIndex] = temImgUrl
        }
        console.log(`移动后：${data}, ${files}`)
        switch (key) {
          case 'img': {
            this.setData({
              ids: data,
              files: files
            })
            break
          }
          case 'img1': {
            this.setData({
              ids1: data,
              files1: files
            })
            break
          }
          case 'img2': {
            var ids = this.data.ids2
            ids.splice(itemIndex, 1, data)
            var files2 = this.data.files2
            files2.splice(itemIndex, 1, files)
            this.setData({
              ids2: ids,
              files2: files2
            })
            break
          }
        }
      }
    }
    this.setData({
      hidden: true,
      flag: false
    })
  },
  //滑动
  touchm: function (e) {
    if (this.data.flag) {
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      // console.log(`touch move:x===${x}, y===${y}`)
      var key = e.currentTarget.dataset.key
      this.setData({
        x: x - this.data.imgWidth,
        y: y - this.data.imgWidth
      })
    }
  },
  /*************封面图片拖拽关事件End*****************/

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