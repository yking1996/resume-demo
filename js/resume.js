var $window = $(window);//监听浏览器滚动事件需要
var loading = $('.loading');//需要通过js隐藏loading
var me = $('.me');//需要通过js隐藏me
var containerPage = $('#page');//撑高整个页面滚动的

var images = [
 	'./images/background1.jpg',
 	'./images/blueplanet1.png',
 	'./images/mech.png',
 	'./images/nebula6.png',
 	'./images/nebula9.png',
 	'./images/planet2.png',
 	'./images/planet3.png',
 	'./images/powerball1.png',
 	'./images/start5.png',
 	'./images/stone1.png',
 	'./images/UI3.png',
 	'./images/UI5.png'
];

var Resume = {
	// 初始化操作-页面入口
	init: function() {
		var self = this; // 指代函数内部的执行环境，本作用域的对象
		// 初始化其他组件
		Act.init();
		// 页面滚动到最开始的时候
		$(window).scrollTop(0);
		// 加载资源
    	resourceHelper.load(images, function(result) {
			// 去除loading
			loading.fadeOut(1000);//fadeOut() 方法使用淡出效果来隐藏被选元素fadeOut(speed,callback),speed内的数字的单位为ms
			// 绑定事件
			self.bindEvent();//只有当图加载完成后，事件才开始绑定
		});
  	},
	// 事件绑定
	bindEvent: function() {
		var self = this;
		var currPosition = 0;//当前位置
		var prePosition = 0;//之前位置

		//监听滚动事件
		$window.on('scroll', function(e) {
			// 设置当前页面滚动位置
			currPosition = $window.scrollTop();
			// 计算移动距离
		 	var distant = currPosition - prePosition;

		 	// 更新人物状态
		 	Act.setDirection(distant);
		 	// //背景移动
		 	Scense.move(currPosition);
		 	// //人物走
		 	Act.walk();
		 	//判断是否跳跃
		 	Act.checkJump(currPosition, prePosition);

		 	//更新 prePosition
		 	prePosition = currPosition;
		});


		//开始建立按钮
		$window.on('click', '.js-start-resume', function() {
			me.hide(); 
			containerPage.css({
				height: Scense.computeWidth()//给页面增加高度产生滚动条
			});
		});


	}
}


//页面初始化
Resume.init();