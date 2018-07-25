var $scenseHorizontal = $('.layer-horizontal');
var $stone = $scenseHorizontal.find('.stone');
var $space= $scenseHorizontal.find('.space');

// 场景对象Scense

var Scense = {
  computeWidth: function() {
    return $scenseHorizontal.width();
  },
  // 背景移动层次感

  move: function(currPos) {
    //整体场景向左移动
    $scenseHorizontal.css({
      left: -currPos
    });
    // 陨石的速度 1 - 0.5 = 0.5
    $stone.css({
      left: currPos * 0.5
    });
  },
}