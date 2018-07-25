var $peopleContainer = $('#people-container');
var $people = $('.people');
var $blocks = $('.block');
var contentHeight = $('.content').height();// 获取容器高度
var backgroundHeight = $('.background').height();// 获取background的高度



// 动作常量
var actionFrameMap = {
  static: 0,
  act1: 1,
  // act2: 2,
  // act3: 3,
  act4: 4,
  // act5: 5,
  // act6: 6,
  act7: 7,
};

var Act = {
  init: function() {
    this.direction = 'right';
    this.oneFrameSize = 300; // 每个动作图片的尺寸
    this.oneFrameDuration = 400; // 每个动作的间隔
    this.peopleLeftEdge = 140;// 人物左手距离边界距离
    this.peopleRightEdge = 200;// 人物右手距离边界距离
    this.jumpBuffer = 80;// 跳跃高度差
  },
  /**
   * 更新方向
   * @param {Number} distant 滚动位移大小
   */
  setDirection: function(distant) {//通过滚轮滚前后滚朝向决定人物面向。当distant的值>0时，滚轮朝后滚，反之朝前滚。
    if(distant > 0) {
      this.direction = 'right';
      $people.css('top', 0);//赋值给人物元素里的top属性为0，即人物右朝向
    }else{
      this.direction = 'left';
      $people.css('top', '-300px');//赋值给人物元素里的top属性为-300，即人物左朝向
    }
  },

  /**
   * 设置帧图片
   */
  setFrame: function (action) {
    var nextFrameLeft = -actionFrameMap[action] * this.oneFrameSize;
    $people.css({
      left: nextFrameLeft,
    })
  },

  /**
   * 切换人物动作帧
   */
  switchFrames: function(frames, callback) {
    var self = this;

    // 如果没有下一帧
    if (frames.length === 0 || !frames[0] ) {
      callback();
      return;
    }
    
    // 获取下一帧
    var nextAction = frames.shift();
    // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
    this.setFrame(nextAction);
    // 间隔后，切换下一个
    this.shiftFrameTimer = setTimeout(function() {
      self.switchFrames(frames, callback);
    }, this.oneFrameDuration); 
    // setTimeout(code,millisec) code:要调用的函数后要执行的 JavaScript 代码串。millisec:在执行代码前需等待的毫秒数。
  },

  /**
   * 人物行走
   * 触发walk（）的时候判断人物是否在moving
   * 如果在moving或者Jumping，就直接back，否则，将状态设置为没有在走moving= false，同时接下来调用函数switchframes（），做一套动作[静止，走动，站立]。
   */
  walk: function() {
    var self = this;
    // 如果已经移动，则不添加
    if(this.isJumping || this.isMoving) {
      return;
    }
    this.isMoving = true;
    // 设置一帧动作
    var nextFrames = ['static', 'act1'];
    this.switchFrames(nextFrames, function() {//调用switchFrames，并把nextFrames赋值给frames
      self.isMoving = false;
    });
  },

  /**
   * 人物跳跃
   */
  jump: function(item, downBlock) {
    var self = this;
    this.isJumping = true; // 把状态设置为正在跳跃
    var bottom = contentHeight - item.offsetTop + this.jumpBuffer;
    
    //  人物需要跳跃的高度 = 容器的高度 - block距离容器顶部的高度 + 自定义的一点高度。
    $peopleContainer.stop().animate({ // animate() 方法执行 CSS 属性集的自定义动画。
      bottom: bottom
    }, 401, function() {//这里的401非常关键，必须大于等于this.oneFrameDuration，否则会与switchFrames冲突，造成动作闪烁切换
      console.log('跳跃');
      self.setFrame('act4');// 把人物动作设置为跳跃动作
      downBlock && self.downBlock(item);
    });
  },

  /**
   * 降落到指定障碍物
   */
  downBlock: function(item) {
    var self = this;
    // 下降高度，需要注意图片的边距，这里需要多减，但飞行姿态要保持一定高度
    var bottom = contentHeight - item.offsetTop - 10;
    $peopleContainer.stop().animate({
      bottom: bottom
    }, 400, function() {
      //切换状态
      self.setFrame('act7');// 恢复站立状态
      console.log('降落到指定障碍物成功');
    });
   },


  /**
   * 从障碍物落下
   */
  drop: function(item) {
    var self = this;
    this.setFrame('act4');
    this.isJumping = true;
    var bottom = backgroundHeight - 16;
    $peopleContainer.stop().animate({
      bottom: bottom,
    }, 400, function() {
      self.setFrame('static');
      self.isJumping = false;
    });
  },


  /**
   * 判断是否即将接触到障碍物
   */
  checkJump: function(curPosition, prePosition) {
    var self = this;

    // 遍历所有的障碍物，判断是否需要跳跃
    for (var i = 0, len = $blocks.length; i < len; i++) {
      var item = $blocks[i];
      // 获取元素的位置和宽度
      var itemX = item.offsetLeft; 
      var itemWidth = item.offsetWidth;

      //判断是否需要跳
      var rightNeedJump = (prePosition + this.peopleRightEdge <= itemX) && (curPosition + this.peopleRightEdge > itemX);
      var leftNeedJump = (prePosition + this.peopleLeftEdge >= itemX + itemWidth) && (curPosition + this.peopleLeftEdge < itemX + itemWidth);
    
      //如果需要跳跃
      
      if(rightNeedJump || leftNeedJump) {
        //判断是否会落在障碍物
        var needDownBlock = (curPosition + this.peopleRightEdge > itemX) && (curPosition + this.peopleLeftEdge < itemX + itemWidth);
        console.log(needDownBlock);
        this.jump(item, needDownBlock);
      }

      //判断是否跳下来
      var rightNeedFall = (prePosition + this.peopleLeftEdge <= itemX + itemWidth) && (curPosition + this.peopleLeftEdge > itemX + itemWidth);
      var leftNeedFall = (prePosition + this.peopleRightEdge > itemX) && (curPosition + this.peopleRightEdge <= itemX);
      if (rightNeedFall || leftNeedFall) {
        this.drop(item);
      }
    }
  }
};