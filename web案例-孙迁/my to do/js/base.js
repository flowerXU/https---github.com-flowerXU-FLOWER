;(function (){
	"use strict";
	var $form_add_task = $('.add-task');
	var $body = $('body');
	var $window = $(window);
	var task_list = [];
	var $delete_task;
	var $task_detail = $(".task-detail");
	var $task_detail_mask = $('.task-detail-mask');
	var $detail_task;
	var current_index;
	var $update_form;
	var $task_detail_content;
	var $task_detail_content_input;
	var $checkbox_complete;
	var $msg = $('.msg');
	var $msg_content = $('.msg').find('.msg-content');
	var $msg_confirm = $('.msg').find('.confirmed');
	var $alerter = $('.alerter');


	init();


	function pop(org) {
		if(!org){
			console.error('eeee');
		}
		var conf = {}
					,$box
					,$mask
					,$title
					,$confirm
					,confirmed
					,$cancel
					,dfd
					,timer
					,$content;
		dfd = $.Deferred();
		if(typeof org == 'string') {
			conf.title = org;
		}
		else{
			conf = $.extend(conf,org);
		};
		$box = $('<div>' + 
			'<div class="pop-title">'+conf.title+'</div>' +
			'<div class="pop-content">'+
			'<div>'+
			'<button  style="margin:15px;" class="primary confirm">确定</button><button class="primary cancel">取消</button>'+
			'</div>' +
			'</div>' +
			'</div>')
			.css({
				color: "#000",
				position: 'fixed',
				width: 160,
				height: 70,
				background: 'rgba(0,127,255,.0)',
				'border-radius': 3,
				'box_shadow': '0 1px 2px rgba(0,0,0,.5)'
			});
		$title = $box.find('.pop-title').css({
			padding: '5px 10px',
			'font-weight': 900,
			'font-size': 20,
			'text-align': 'center'
		});
		$content = $box.find('.pop-content').css({
			padding: '5px 10px',
			'text-align': 'center'
		});
		$confirm = $content.find('button.confirm');
		$cancel = $content.find('button.cancel');
		timer = setInterval(function(){
			if(confirmed !== undefined) {
				dfd.resolve(confirmed);
				clearInterval(timer);
			}
		},40);
		$confirm.on('click',function() {
			confirmed = true;
			dismiss_pop();
		});
		$cancel.on('click',function() {
			confirmed = false;
			dismiss_pop();
		});
		
		$mask = $('<div></div>')
			.css({
				position: 'fixed',
				left: 0,
				bottom :0,
				right: 0,
				top: 0,
				background: 'rgba(0,0,0,.0)'
		    });
		$mask.on('click',function() {
			confirmed = false;
			dismiss_pop();
		});
		 function dismiss_pop(){
		 	$mask.remove();
		    $box.remove();
		 }
		function adjust() {
			var window_width = $window.width();
			var window_height = $window.height();
			var box_width = $box.width();
			var box_height = $box.height();
			var  move_x = (window_width - box_width)/2;
			var  move_y = (window_height - box_height)/2 - 20;
			 $box.css({
			 	left: move_x,
			 	top: move_y
			 })

		}
		$window.on('resize',function() {
			adjust();
		})
		adjust();
		
		$mask.appendTo($body);
		$box.appendTo($body);
		return dfd.promise();
		
	}
	function listion_msg() {
		$msg_confirm.on('click',function() {
			hide_notice();
		})
	}

	$form_add_task.on ('submit',function(e) {
		var new_task = {};
		var $input = $(this).find('input[name=content]');
		e.preventDefault();
		new_task.content = $input.val();
		if( !new_task.content ) return;
		if( add_task(new_task) ) {
			$input.val(null);
		}
	});

	$task_detail_mask.on('click',hide_task_detail);
	/*监听打开task详情事件*/
	function listion_task_detail() {
		var index;
		$('.task-item').on('dblclick',function() {
			index = $(this).data('index');
			show_task_detail(index);
		});
		$detail_task.on('click',function() {
			var $this = $(this);
			var $item = $this.parent().parent();
			index = $item.data('index');
			show_task_detail(index);
		})
	}
	function listion_checkbox_complete() {
		$checkbox_complete.on('click',function() {
			var $this = $(this);
			var index = $this.parent().parent().data('index');
			var item = get(index);
			if(item.complete) {
				update_task(index,{complete: false});
			}
			else{
				  update_task(index,{complete: true});
			}
		})
	}
	function get(index) {
		return store.get('task_list')[index];
	}
	/*/*查看task详情*/
	function show_task_detail(index) {
		/*生成详情模板*/
		render_task_detail(index);
		current_index = index;
		/*显示详情模板*/
		$task_detail.show();
		/*现实详情模板mask*/
		$task_detail_mask.show();
	}
	/*更新task*/
	 function update_task(index,data) {
		if(index===undefined||!task_list[index]) return;
		task_list[index] = $.extend({},task_list[index],data);
		//console.log(task_list[index]);
		refresh_task_list();
	}
	/*影藏task详情*/
	function hide_task_detail() {
		$task_detail.hide();
		$task_detail_mask.hide();
	}

	/*渲染制定task的详细信息*/
	 function render_task_detail(index) {
	 	if( !index ===undefined || !task_list[index]) return; 
	 	var item = task_list[index];
		var tpl = '<form>'+
				  '<div class="content">'+
				  item.content +
				  '</div>'+
				  '<div class="input-item"><input type="text" value="'+(item.content || "")+'" name="content" style="display:none;"></div>'+
				  '<div>'+
				  '<div class="desc input-item">'+
				  '<textarea name="desc">'+ (item.desc || "")+'</textarea>'+
				  '</div>'+
				  '</div>'+
				  '<div class="remind input-item">'+
				  '<span>提醒时间</span>'+
				  '<input class="datetime" type="text" name="remind_date" value="'+(item.remind_date || "")+'">'+
				  '</div>'+
				  '<div class="input-item update"><button type="submit">Update</button></div>'+
			      '</form>';
	    /*清空task详情*/
	 	$task_detail.html(null);
	 	/*渲染当前的task详情*/
	 	$task_detail.html(tpl);
	 	$('.datetime').datetimepicker();
	 	/*选中form元素，后面会使用其监听summit事件*/
	 	$update_form = $task_detail.find('form');
	 	/*选中显示task内容的元素*/
	 	$task_detail_content = $update_form.find('.content');
	 	/*选中用来修改的input元素*/
	 	$task_detail_content_input = $update_form.find('[name=content]');
	 	/*双击内容元素，现实input元素，隐藏内容元素*/
	 	$task_detail_content.on('dblclick',function() {
	 		$task_detail_content_input.show();
	 		$task_detail_content.hide();
	 	})
		//console.log($update_form);
	 	$update_form.on('submit',function(e) {
	 		e.preventDefault();
	 		var data = {};
	 		/*获取表单中各个input的值*/
	 		data.content = $(this).find('[name=content]').val();
	 		data.desc = $(this).find('[name=desc]').val();
	 		data.remind_date = $(this).find('[name=remind_date]').val();
	  		update_task(index,data);
	 		hide_task_detail();
	 	})

	}

    /*查找并监听所有删除按钮的点击事件*/
	function listion_task_delete() {
		 $delete_task.on('click',function () {
    	var $this = $(this);
    	/*找到删除按钮要作用的元素*/
    	var $item = $this.parent().parent();
    	var index = $item.data('index');
    	/*确认删除*/
    	pop('确定删除?').then(function(r){
    		r? delete_task(index) : null;
    	})
    	
    	//console.log(index);
        })
	}

   
	

	function add_task(new_task) {
		task_list.push(new_task);
		//store.set('task_list',task_list);
		refresh_task_list();
		return true;
	}

	function refresh_task_list() {
		store.set('task_list',task_list);
		render_task_list();
	}
    /*一条删除task*/
   function delete_task(index) {
   		//alert(22);
   	    if( index===undefined || !task_list[index]) return; 
   	    delete task_list[index];
   	    refresh_task_list();
   }
	



	function init() {
		listion_msg();
		//store.clear();
		task_list=store.get('task_list') || [];
		if( task_list.length){
			render_task_list();
		}
		
		 monitor();
	}

	function monitor() {
		//show_notice('pp');
		var current_timestamp;
		var itl = setInterval(function() {
			for(var i=0;i<task_list.length;i++) {
			var item = get(i);
			var task_timestamp;
			if(!item || !item.remind_date || item.informed) continue;
			current_timestamp = (new Date()).getTime();
			task_timestamp = (new Date(item.remind_date)).getTime();
			if((current_timestamp - task_timestamp) >= 1){
				update_task(i,{informed: true});
				show_notice(item.content);
			}
		    }
		},500)
		
	}

	function show_notice(msg) {
		if(!msg) return;
		$msg_content.html(msg);
		$msg.show();
		$alerter.get(0).play();
	}

	function hide_notice() {
		$msg.hide();
	}

	/*渲染全部task模板*/
	function render_task_list() {
		
		var $task_list = $('.task-list');
		$task_list.html(null);
		var complete_items = [];
		 for(var i=0; i<task_list.length; i++){
		 	var item = task_list[i];
			 if(item && item.complete){
		  		complete_items[i] = item;
			 }
		  	else{
				var $task = render_task_tpl(item,i);
			    $task_list.prepend($task);
		 	 }
			
		}
		for(var k=0;k<complete_items.length;k++){
		 	    $task = render_task_tpl(complete_items[k],k);
		 	    if(!$task) continue;
		 	    $task.addClass('completed');
		 	    $task_list.append($task);
		}
	
		
		$delete_task = $('.action.delete');
		$detail_task = $('.action.detail');
		$checkbox_complete = $('.complete');
		listion_task_delete();
		listion_task_detail();
		listion_checkbox_complete();



		
	}

	/*渲染单条task模板*/
	function render_task_tpl(data,index) {
		//if( !data || !index) return;
		if(!data||index===undefined) return;
		var list_item_tpl = '<div class="task-item" data-index="'+index+'">' + 
							'<span><input class="complete"  type="checkbox" '+(data.complete? 'checked' : '')+' ></span>' +
							'<span class="task-content">' + data.content + '</span>' +
							'<span class="fr">' + 
							'<span class="action delete">Delete &nbsp</span>' +
							'<span class="action detail"> Detail</span>' +
							'</span>' +
				    		'</div>';

		return $(list_item_tpl);
	}

})();


