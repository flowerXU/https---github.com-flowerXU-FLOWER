window.onload = function(){
	/*头部通栏事件*/
	headerScroll();
	/*倒计时*/
	cutdown();
	/*轮播*/
	banner();

};
function headerScroll() {
	 var jd_header = document.querySelector('.jd_header');
	 var jd_nav = document.querySelector('.jd_nav');
	 var nav_top = jd_nav.offsetHeight + jd_nav.offsetTop;
	 window.onscroll = function() {
	 	var scrollDistance = document.body.scrollTop;
	 	// console.log(scrollDistance);
	 	var percent = scrollDistance / nav_top;
	 	if(percent > 1){
	 		percent = 1;
	 	}
	 	jd_header.style.background = 'rgba(201,20,35,'+percent+')'

	 }
}

function cutdown(){
	var liArr = document.querySelectorAll('.main_content:nth-child(1) .content_top li');
	var hours = 3;
	var seconds = 3*60*60;
	var timeId = setInterval(function(){
		if (seconds<=0) {
			// 干掉 定时器
			clearInterval(timeId);

			console.log('结束啦,你买不到了哦');

			return;
		}
		seconds--;
		var hour = Math.floor(seconds / 3600);
		var minute = Math.floor(seconds % 3600 /60);
		var sec = seconds % 60;

		liArr[0].innerHTML =Math.floor(hour/10) ;  // 十位 41 / 10  =4.1 所以要取整数
		liArr[1].innerHTML =hour%10 ; // 个位

		// 分
		liArr[3].innerHTML = Math.floor(minute/10);// 是为 55/10 = 5.5 取整
		liArr[4].innerHTML = minute%10;

		// 秒
		liArr[6].innerHTML = Math.floor(sec/10); 
		liArr[7].innerHTML = sec%10; 

	},1000);

}

function banner(){
	var width = document.body.offsetWidth;
	var moveUl = document.querySelector('.banner_images');
	moveUl.style.transition = 'all .5s';
	var indexLiArr = document.querySelectorAll('.banner_index li');
	var index = 1;
	var timeId = setInterval(function(){
		index++;
		moveUl.style.transition = 'all .4s';

		moveUl.style.transform = 'translateX('+width*index*-1+'px)';
		console.log(index)
		
		
		
	},1000);
	moveUl.addEventListener('webkitTransitionEnd', function() {
		//console.log(33)
		if(index > 8)
		{
			index = 1;
			moveUl.style.transition = '';
			moveUl.style.transform = 'translateX('+width*index*-1+'px)';
		}
		else if(index<1){
			index= 8;
			moveUl.style.transition = '';
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		}

		 for(var i=0;i<indexLiArr.length;i++)
		
		{
			indexLiArr[i].className = "";
		}
		indexLiArr[index-1].className = 'current';

	});


	/*触摸事件*/
	var moveX = 0;
	var moveY = 0;
	var distanceX = 0;
	moveUl.addEventListener('touchstart',function(event){
		clearInterval(timeId);
		moveUl.style.transition = '';
	    startX = event.touches[0].clientX;
	   // console.log(startX);

	});
	moveUl.addEventListener('touchmove',function(event){
		moveX =  event.touches[0].clientX - startX;
		moveX =  event.touches[0].clientX - startX;

		moveUl.style.transform = 'translate('+(moveX+index*-1*width)+'px)'

	});
	moveUl.addEventListener('touchend',function (event) {

		// 定义 最大的 偏移值
		var maxDistance = width/3;

		// 判断 是否超过
		if (Math.abs(moveX)>maxDistance) {
			// 判断 到底是 往左 还是往右移动
			if (moveX>0) {
				index--;
			}else{
				index++;
			}
			// 为了好看 将 过渡效果开启
			moveUl.style.transition = 'all .3s';

			// 吸附 一整页
			moveUl.style.transform = 'translateX('+(index*-1*width)+'px)';

		}else{

			moveUl.style.transition = 'all .3s';

			moveUl.style.transform = 'translateX('+(index*-1*width)+'px)';
		}


		timeId = setInterval(function () {
			index++;

			moveUl.style.transition = 'all .5s';

			// 修改 ul的位置
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		},1000)
	})
}

