$(document).ready(function(){

	jQuery.fn.exists = function() {
		return $(this).length;
	};

	/*  Обработчик связанных селектов, используют хэши chained_select и chained_props, заданные в шаблоне вызываемого раздела */ 
	if($('#chained_select_type').length){
	
	  //Устанавливаем обработчики для всех селектов с классом chained_select
	  $('select.chained_select').on('change', function(){

		//Получаем имя и выбранное значение селекта
		select_code = $(this).attr('select_code'); 
		active_select_name = $(this).attr('name'); 
		active_select_val  = $(this).val();
		first_select_name  = $('select[pos=first][select_code='+select_code+']').attr('name'); 
		forward_select = $(this).hasClass("forward_select") !== false;
		
		//Если выбран первый селект среди последовательных селектов, то очищаем все выбранные в других селектах значения для повторного выбора
		if(forward_select && active_select_name == first_select_name){
			$('select.chained_select[select_code='+select_code+']').each(function(i,select){			  
			  $('select[name='+$(select).attr('name')+'] option').each(function(i,option){
				if($(select).attr('pos') != 'first'){
					$(option).removeAttr('selected');
				}
				$(option).removeAttr('disabled');
				$(option).removeClass('hidden');
			  });		   
			  if($(select).attr('pos') == 'first'){
				$(select).removeAttr('disabled');
				$(select).removeClass('disabled');
			  }
			  else{
				$(select).attr('disabled','disabled');
				$(select).addClass('disabled');			
			  }
			  if($(select).attr('pos') == 'last'){
				name = $(select).attr('default');
				$(select).html('<option value="">'+name+'</option>');
			  }
			  $(select).removeClass('set');
			});	  		
		}		
		
		//Если данный тип связанных селектов относиться к последовательным, то разблокируем следующий по очереди селект
		if(forward_select && $(this).attr('pos') !== 'last'){ 
		  num = parseInt($(this).attr('order'),10) + 1;
		  $('select[order='+num+'][select_code='+select_code+']').removeAttr('disabled'); 
		  $('select[order='+num+'][select_code='+select_code+']').removeClass('disabled'); 
		  $('select[order='+num+'][select_code='+select_code+']').removeClass('hidden'); 
		}
		
		if(chained_select[select_code] != undefined){
			//Если выбрано значение, отличное от "Любой", то...
			//if(active_select_val != ''){
			if(true){

			  //Определяем действия для каждого из связанных селектов, имена которых передаются в теле страницы в переменной chained_props
			  for (var key in chained_props[select_code]) {		  
				
				//Если мы имеем дело с селектами, отличными от выбранного сейчас, то оставляем в нём активными только варианты, связанные с выбранным значением 
				if(chained_props[select_code][key] != active_select_name && chained_props[select_code][key] != first_select_name){
					
				  //Обработка происходит для тех селектов, в которых ещё не были выбраны значения (нет класса 'set')
				  if($('select[select_code='+select_code+'][name='+chained_props[select_code][key]+']').hasClass("set") === false){ 

					//Проходимся по всем свойствам каждого связанного селекта
					$('select[select_code='+select_code+'][name='+chained_props[select_code][key]+'] option').each(function(i,option){			  
						
					  //Проверяем, есть ли для данного значения свойства связанные значения для рассматриваемого свойства
					  if (chained_select[select_code][active_select_name][active_select_val][chained_props[select_code][key]] != false){
					  
						//Если данного свойства нет в хэше связанных значений 'chained_select', то делаем его неактивным
						if (chained_select[select_code][active_select_name][active_select_val][chained_props[select_code][key]][$(option).val()] === undefined && $(option).val() != '') {
						  $(option).attr("disabled","disabled");
						  $(option).addClass('hidden');
						  $(option).removeAttr('selected');
						}	
						
					  }
					  //Если для данного значения свойства нет значений для рассматриваемого свойства, то осталвляем активным только вариант "Любой"
					  else{
						if ($(option).val() != '') {
						  $(option).attr("disabled","disabled");
						  $(option).removeAttr('selected');
						  if(forward_select){
							$(option).addClass('hidden');
						  }
						}	
					  }
					});	
				  }
				}
				//Если это выбранный сейчас селект, то отключаем в нём все варианты, кроме выбранного, и присваеваем ему класс 'set', указывающий, что этот селект уже отработал
				else{
				 // console.log('active_select_val: '+active_select_val);
				  if(active_select_name != first_select_name){
					  $('select[select_code='+select_code+'][name='+active_select_name+'] option').each(function(i,option){		
						if($(option).val() != active_select_val){
						  $(option).attr("disabled","disabled");
						  if(forward_select){
							$(option).addClass('hidden');
						  }
						}
					  });
					  $('select[select_code='+select_code+'][name='+active_select_name+']').addClass('set');
				  }
				}
			  }
			  //Обработка последнего селекта в списке последовательных селектов
			  if(select_code == 'industrial_type'){
				  select = $('select[select_code='+select_code+'][name='+active_select_name+']');
				  last_select = $('select[select_code='+select_code+'][pos=last]');
				  last_select_name = last_select.attr('name');
				  pre_last_num = parseInt(last_select.attr('order'), 10) - 1;		  
				  if(select.hasClass('forward_select') && select.attr('order') == pre_last_num){
					
					//Проверяем, есть ли для данного значения свойства связанные значения для рассматриваемого свойства
					if (chained_select[select_code][active_select_name][active_select_val][last_select_name] != false){
					  j = 0; last_select.html('');
					  $.each(chained_select[select_code][active_select_name][active_select_val][last_select_name], function(key, value) {  
						//console.log(key);
						if(j == 0){
							group_name = last_select.attr('group_name_1');
							last_select.append($('<optgroup select_code="'+select_code+'" label="'+group_name+'" class="'+last_select_name+'"></optgroup>'));
							optgoup = $('optgroup[label='+group_name+'][select_code='+select_code+']');
							optgoup.append($("<option></option>").attr("value",key).text(value)); 
							j++;
						}
						else{
							if(j == 1){
								group_name = last_select.attr('group_name_2');
								last_select.append($('<optgroup select_code="'+select_code+'" label="'+group_name+'" class="'+last_select_name+'"></optgroup>'));			
							}
							optgoup = $('optgroup[label='+group_name+'][select_code='+select_code+']');
							optgoup.append($("<option></option>").attr("value",key).text(value));
							j++;
						}
					  });						
					  $('select[select_code='+select_code+'][pos=last] option').each(function(i,option){	});		  
					  /*
					  //Если данного свойства нет в хэше связанных значений 'chained_select', то делаем его неактивным
					  if (chained_select[select_code][active_select_name][active_select_val][last_select_name][$(option).val()] === undefined && $(option).val() != '') {
						$(option).attr("disabled","disabled");
						$(option).removeAttr('selected');
					  }	
					  */
					}		

					//Снимаем аттрибут блокировки с кнопки
					$('a[type='+select_code+']').removeClass("disabled");				
			
				  }
			  }
			}
		}
		
		
	  });
	}
	
	/*  Обработчик связанных селектов, используют хэши chained_select и chained_props, заданные в шаблоне вызываемого раздела, а также запросы к БД */ 
	if($('#chained_select_db_type').length){
		
	  $.each($('.chained_select_db_type'), function() {   
		  select_code = $(this).val();
		  if(chained_select[select_code] != undefined){
		  
			  //Получаем название первого элемента и заполняем его значениями из подключенного файла
			  first_prop_name = $('select[pos=first][select_code='+select_code+']').attr('name');
			  first_prop_val  = $('input[name=prop_'+first_prop_name+'][props_code='+select_code+']').val();
			  elms_count	  = parseInt($('select[pos=last][select_code='+select_code+']').attr('order'), 10);
			  default_option = $('select[pos=first][select_code='+select_code+']').attr('default');
			  $('select[pos=first][select_code='+select_code+']').html('<option value="">'+default_option+'</option>');
			  $.each(chained_select[select_code][first_prop_name], function(key, value) {   
				$('select[pos=first][select_code='+select_code+']')
				  .append($("<option></option>")
				  .attr("value",key)
				  .text(value)); 
			  });
			  if(first_prop_val != ''){
				$('select[pos=first][select_code='+select_code+']').val(first_prop_val);
			  }		
		  }
	  }); 
	  //$(this).is("[name]")
	  /*
	  last_prop_name = $('select[pos=last]').attr('name');
	  if($('input[name=prop_'+last_prop_name+']').val() == ''){
		$('select[pos=last]').append($("<option>Любой</option>"));
	  }
	  */
	  /*
	  if($('select[order=2]').val() == ''){
		for (i = 2; i <= elms_count; i++) {				
			$('select[order='+i+'][select_code='+select_code+']').attr("disabled","disabled");
			$('select[order='+i+'][select_code='+select_code+']').addClass("disabled");
		}		
	  }
	  */
	  
	  //Устанавливаем обработчики для всех селектов с классом chained_select_db
	  $('select.chained_select_db').on('change', function(){
		
		select_code = $(this).attr('select_code'); 
		act = $(this).attr('act');
		pos = $(this).attr('pos');
		
		//Если это не последний элемент - то получаем значение следующего элемента
		if(pos != 'last' || act == 'get'){
			
			//Получаем информацию о выбранном селекте
			active_select_order = $(this).attr('order'); 
			active_select_name  = $(this).attr('name'); 
			active_select_val   = $(this).val();		
					
			//Если выбрано значение, отличное от "Любой", то...
			//if(active_select_val != ''){
			if(true){

				//Если данный тип связанных селектов относиться к последовательным, то разблокируем следующий по очереди селект
				if($(this).hasClass("forward_select") !== false && $(this).attr('pos') !== 'last'){ 
					
					//Определяем номер следующего по очереди селекта и показываем прелоадер
					num = parseInt($(this).attr('order'),10) + 1;
					$('#'+select_code+'_loader_'+num).show();
					
					//Очищаем значения и деактивируем все следующие за активным селекты
					for (i = num; i <= elms_count; i++) {
						default_option = $('select[order='+i+'][select_code='+select_code+']').attr('default');
						$('select[order='+i+'][select_code='+select_code+']').html('<option value="">'+default_option+'</option>');						
						$('select[order='+i+'][select_code='+select_code+']').attr("disabled","disabled");
						$('select[order='+i+'][select_code='+select_code+']').addClass("disabled");
					}
					
					//Получаем значения предыдущих селектов
					props = {};
					for (i = 1; i < num; i++) {
						props[$('select[order='+i+'][select_code='+select_code+']').attr("name")] = $('select[order='+i+'][select_code='+select_code+'] option:selected').val();
					}					
					JSON.stringify(props); 
					  
					//Получаем из БД значения для следующего связанного селекта в зависимости от значений текущего
					$.get("/catalog/get_chained_select_values.php", { 'type': select_code, 'props' : props, 'selected_prop_name' : active_select_name }, function(res) {
						next_select = $('select[order='+num+'][select_code='+select_code+']');
						has_groups = next_select.hasClass('groups');
						//has_groups  = $(":input[group_name_1]").length;
						//Извлекаем переданные из скрипта значения селекта
						next_select_values = jQuery.parseJSON(res);
						//Если за этим селектом следует не последний селект, то обновляем значения
						if(num < elms_count || has_groups == 0){
							//Добавляем значения в селект
							$.each(next_select_values, function(key, value) {    
							  next_select
								.append($("<option></option>")
								.attr("value",key)
								.text(value)); 
							});		
							if(!$('a[type='+select_code+']').hasClass("disabled")){
								$('a[type='+select_code+']').addClass("disabled");
							};							
						}
						//Если следующий селект последний, то объединяем значения по нескольким свойствам
						else{
							first_value = '';
							//Записываем массив с результатами в служебную дивку
							$('#'+select_code+'_hidden_params').text(res);
							default_option = $('select[pos=last][select_code='+select_code+']').attr('default');
							next_select.html('<option value="">'+default_option+'</option>');							
							add_params = next_select.attr('add_params');
							alt_prop_name = next_select.attr('name');
							i = 1; j = 1;
							//Проходимся по всем переданным массивам значений
							$.each(next_select_values[alt_prop_name], function(prop_code, prop_values) {    
							  group_name = next_select.attr('group_name_'+i);
							  next_select.append($('<optgroup select_code="'+select_code+'" label="'+group_name+'" class="'+prop_code+'"></optgroup>'));
							  optgoup = $('optgroup[class='+prop_code+'][select_code='+select_code+']');
							  $.each(prop_values, function(key, value) { 
								name = value;
								if (add_params != undefined && next_select_values['filter'][add_params] != false){
									add_param_val = next_select_values['filter'][add_params][key];
									if(add_params == 'pcd'){
										tmp = add_param_val.split('*');
										add_param_val = tmp[0]+'/'+tmp[1];
									}
									name = value+' ('+add_param_val+')';
								}
							    optgoup
								  .append($("<option></option>")
								  .attr("value",key)
								  .text(name)); 	
								if(j == 1){ 
									first_value = value;
								}
								j++;
							  });
							  i++;
							});		
							$('a[type='+select_code+']').removeClass("disabled");
							if($('#'+select_code+'_hidden_params').length){
								val = first_value;
								arr = jQuery.parseJSON($('#'+select_code+'_hidden_params').text());
								//Проходимся по всем переданным массивам значений
								//$.each($('input[props_code_add='+select_code+']'), function(){
								//	 prop = $(this).attr('prop');
								//	 subj = $(this).attr('subj');
								//	 $(this).val(arr[subj][prop][val]);
								//});
							}	
						}
						//Снимаем аттрибут блокировки селекта и убираем прелоадер
						$('select[order='+num+'][select_code='+select_code+']').removeAttr('disabled'); 	
						$('select[order='+num+'][select_code='+select_code+']').removeClass('disabled'); 			
						$('#'+select_code+'_loader_'+num).hide();					
					}, "text");			
				}
				//Если элемент последний, но для него нужно получить доп.значения
				if(act == 'get'){
													
					//Получаем значения всех селектов
					props = {};
					num = parseInt($(this).attr('order'),10);
					for (i = 1; i <= num; i++) {
						props[$('select[order='+i+'][select_code='+select_code+']').attr("name")] = $('select[order='+i+'][select_code='+select_code+'] option:selected').val();
					}					
					JSON.stringify(props); 
					  
					//Получаем из БД доп.значения для выбранного селекта
					$.get("/catalog/get_chained_select_values.php", { 'type': select_code, 'props' : props, 'selected_prop_name' : active_select_name, 'act' : 'get'}, function(res) {
						//Извлекаем переданные из скрипта значения селекта
						add_select_values = jQuery.parseJSON(res);
						
						if(active_select_name == 'params'){

							//Проходимся по всем переданным массивам значений
							$.each($('input[props_code_add='+select_code+']'), function(){    
								 prop = $(this).attr('prop');
								 subj = $(this).attr('subj');
								 if (subj in add_select_values){
									$(this).val(add_select_values[subj][prop][props[active_select_name]]);
								 }
							});							
							$('input[props_code='+select_code+'][name=prop_params]').val(props['params']);
							
						}
						else{
							
							//Проходимся по всем переданным массивам значений
							$.each($('input[props_code_add='+select_code+']'), function(){    
								 prop = $(this).attr('prop');
								 subj = $(this).attr('subj');
								 if (subj in add_select_values){
									$(this).val(add_select_values[subj][prop]);
								 }
							});	
							
						}
						
						//Устанавливаем исходное значение выбранных параметров для передачи в фильтр
						$('input[props_code='+select_code+'][in_order=yes]').each(function(i,input){		
							$(input).val($('select[name='+$(input).attr('prop_name')+'][select_code='+select_code+']').val());
						});
						
						//Снимаем аттрибут блокировки с кнопки
						$('a[type='+select_code+']').removeClass("disabled");
						
					}, "text");								
				}
			}
		}
		//Если это последний элемент, то снимаем блокировку с кнопки "Отправить" и заносим значения доп.параметров в переменные
		else{
			$('a[type='+select_code+']').removeClass("disabled");
			if($('#'+select_code+'_hidden_params').length){
				if($('#'+select_code+'_hidden_params').text() != ''){
					val = $('select[pos=last][select_code='+select_code+']').val();
					arr = jQuery.parseJSON($('#'+select_code+'_hidden_params').text());
					//arr['filter']['pcd']['7 x 17 ET45'] = "5*114,3"
					console.log('!!!');
					//Проходимся по всем переданным массивам значений
					$.each($('input[props_code_add='+select_code+']'), function(){    
						 prop = $(this).attr('prop');
						 subj = $(this).attr('subj');
						 $(this).val(arr[subj][prop][val]);
					});					
				}
			}
		}
	  });
	}
	
	/*Клик на пуктах верхнего меню на touch*/
	 if($('html').hasClass('touch')){
	  	$('.topNav a').click(function(){
	  		if($(this).next('ul').length >0){
		  		if($(this).data("clicked")){
		  			$(this).data("clicked", 0)
		  			return true;
		  		}
		  		else {
		  			$(this).data("clicked", 1);
		  			return false;
		  		}
		  	}
		  	else {
		  		return true;
		  	}
	  	});
  	}

	// отметить всё / снять всё в грузовых шинах фильтр
	
	$('.sel_unsel .sel').click(function () {
		$('input', $(this).parents('.fParamsCheckbox')).attr('checked', 'checked');
		return false;
	});
	
	$('.sel_unsel .un_sel').click(function () {
		$('input', $(this).parents('.fParamsCheckbox')).removeAttr('checked');
		return false;
	});
	
	$('#delivery').click(function () {
		infoWindow('Доставка товара клиентам собственным транспортом и за свой счет.');
		return false;
	});		
	
	//Задаём ID групп пользователей
	var opt_user_group  = 8;
	var sale_user_group = 5;
	
	if ($('#ITEMS_UPDATED').exists()){
		infoWindow('Внимание! Со времени вашего последнего визита произошли изменения в некоторых заказанных позициях.');
	}
	
	if ($('#DELETED_ITEMS').exists()){
		infoWindow('Некоторые позиции были удалены из корзины в связи с отсутствием текущих остатков на складах.');
	}	

	if ($('#CHANGED_QUANTITY').exists()){
		infoWindow('Количество товара по некоторым позициям уменьшилось в связи с уменьшением текущих остатков на складах.');
	}

	if ($('#CHANGED_PRICE').exists()){
		infoWindow('Цены на некоторые товары изменились.');
	}	

	if ($("select[name='add_inf[goal]']").exists()){
	
		if($("select[name='add_inf[goal]']").attr('value') == 'SALE'){
			$("select[name='add_inf[store]'] option").each(function(i,option){
				if($(option).attr('value') != '1'){
					$(option).removeAttr('selected');
					$(option).attr('disabled','disabled');
				}
			});					
			$("select[name='add_inf[store]']").val('1');
			$("select[name='add_inf[store]'] option:last").attr('selected', 'selected');		
		}
		
		$("select[name='add_inf[goal]']").change(function() {
			if($(this).attr('value') == 'SALE'){
				$("select[name='add_inf[store]'] option").each(function(i,option){
					if($(option).attr('value') != '1'){
						$(option).removeAttr('selected');
						$(option).attr('disabled','disabled');
					}
				});			
				$("select[name='add_inf[store]']").val('1');
				$("select[name='add_inf[store]'] option:last").attr('selected', 'selected');
				//$("select[name='add_inf[store]']").prop('disabled', 'disabled');
			}
			else{
				$("select[name='add_inf[store]'] option").each(function(i,option){
					$(option).removeAttr('selected');
					$(option).removeAttr('disabled');
				});				
				//$("select[name='add_inf[store]']").prop('disabled', false);
			}
		});
	}
	
	if ($("select[name='add_inf[store]']").exists()){
		$("select[name='add_inf[store]']").change(function() {
			if($("select[name='add_inf[goal]'] option:selected").attr('value') == 'SALE'){
				$("select[name='add_inf[store]'] option").each(function(i,option){
					if($(option).attr('value') != '1'){
						$(option).removeAttr('selected');
						$(option).attr('disabled','disabled');
					}
				});					
				$("select[name='add_inf[store]']").val('1');
				$("select[name='add_inf[store]'] option:last").attr('selected', 'selected');
				//$("select[name='add_inf[store]']").prop('disabled', 'disabled');
			}
		});
	}
	
		// CSS calc support
	if($.browser.msie == true){
		if(!Modernizr.csscalc){
			$(window).resize(function(){
				if($(window).width() <= 1279){ 
					$('body').addClass('ie_less');
					$('.content').css('width', 'auto'); 
				}else{
					$('body').removeClass('ie_less');
					if(_is_ie7)
					{
						$('.content').css('width', $('.wrapper').width() - 340);
					} else {
						$('.content').css('width', $('.wrapper').width() - 250);
					}
				}
			}).resize();
		}
	}
		

	// Authorization
	$('.enterLink').click(function(){
		$('.auth').show();
	});
	$(document).click(function(e){
		if(!$(e.target).parents('.auth').length && !$(e.target).is('.enterLink') && !$(e.target).is('.auth')){
			$('.auth').hide();
		}
	});
	
	//Registration
	if ( $('.bx-auth-reg').length ) {
		$('#UF_REGDATE').mask('00.00.0000');
		$('#UF_UNP').mask('000000000');
		// /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/
	}

	if ($('#intro-catalogue').exists()){

		// Intro catalogue
		$('#intro-catalogue').tabs({
			collapsible: true,
			active: false,
			show:{
				effect: 'slide',
				direction: 'left',
				duration: 700
			},
			hide:{
				effect: 'fadeOut',
				direction: 'right',
				duration: 300
			}
		});

	}

	$('#intro-catalogue .close').click(function(){
		$('#intro-catalogue .ui-state-active a').click();
		//скрываем таб
	});
	
	// Promo
	if ( $('.promo ul.slides').length ) {
		$('.promo ul.slides').carouFredSel({
			items: 1,
			width: '100%',
			// auto: 6000,
			auto: false,
			align: false,
			pagination:{
				container: '.promo ol.pagination',
				anchorBuilder: false
			},
			scroll:{
				pauseOnHover: true,
				duration: 1000
			}
		});
	}
	
	// Catalogue
	$('.catalogue .more').click(function(){
		$('.catalogue').toggleClass('open');
	});
	
	//Проверяем, есть ли в корзине товары
	if($(".cart").exists())
	{		
		check_basket();
	}	
	
	if($("#datepicker").exists())
	{		
		$(function(){
			$.datepicker.setDefaults(
			$.extend($.datepicker.regional["ru"])
			);
			$("#datepicker").datepicker({ constrainInput: true, dateFormat: "dd.mm.yy" , changeMonth: true, changeYear: true, yearRange: "-40:+0" });
		});
	}	
	
	// Добавление товара в корзину запрещено
	/*
	$('.cartBtnDisabled.2').live("click", function(){
	});
	*/
	
	// Добавление товара в корзину
	$('.cartBtn.cartBtn').live("click", function(){

		_this = $(this);
		_prod_id    = $(_this).attr('element_id');
		_prod_price = parseFloat($(_this).attr('product_price'));
		_prod_name  = $(_this).attr('product_name');
		_prod_brand = $(_this).attr('brand_name');
		_prod_model = $(_this).attr('product_model');
		_prod_category   = $(_this).attr('subsection_name');
		_prod_diametr   = $(_this).attr('product_diametr');
		_prod_group      = $(_this).attr('section_name');
		_store_id        = $(_this).attr('store_id');
		_code_1c         = $(_this).attr('code_1c');
		//_store_quantity  = parseInt($(_this).attr('store_quantity'),10);
		_prod_quantity   = parseInt($('#quantity_store'+_store_id+'_'+_prod_id).val(),10);
		_prod_discount   = $('#discount').val();
		_user_store      = $(".user_store").val();
		
		$.get("/personal/order/cart/product_info.php", { 'PRODUCT_ID': _prod_id , 'USER_STORE_ID' : _user_store , 'PRODUCT_STORE_ID' : _store_id}, function(res) {
			_store_quantity = parseInt(res,10);
			$(_this).attr('store_quantity', _store_quantity)
			//$('#currentCount_'+_store_id+'_'+_prod_id).text(formatStoreAmount(_store_quantity));
			
			STORES = new Array();
			STORES[1] = 'Барановичи';
			STORES[2] = 'Гомель';
			STORES[3] = 'Брест';
			STORES[4] = 'Витебск';
			STORES[5] = 'Гродно';
			STORES[6] = 'Минск';
			STORES[7] = 'Могилёв';
			
			//Проверяем, чтобы человек не заказал в сумме больше, чем есть на складе
			if(_store_quantity > 0){
				if(_prod_quantity > _store_quantity){
					if(_store_quantity > 30){
						_prod_quantity = 30;
					}else{
						_prod_quantity = _store_quantity;
					}
					//$(_this).attr('store_quantity', 0);
					$('#quantity_store'+_store_id+'_'+_prod_id).val(_prod_quantity); 
					infoWindow('Количество товара уменьшено до доступного!');
				}
			}
			else{
				_prod_quantity = 0;
				$('#quantity_store'+_store_id+'_'+_prod_id).val(0);
				infoWindow('Больше нет товара для заказа!');		
			}
				
			if(_prod_quantity > 0){
				
				if(_store_id == _user_store){
					_store_quantity_1 = parseInt($('a[element_id="'+_prod_id+'"][store_id="1"]').attr('store_quantity'),10);
					_store_quantity_2 = _store_quantity - _prod_quantity;
				}
				else{
					_store_quantity_1 = _store_quantity - _prod_quantity;
					_store_quantity_2 = parseInt($('a[element_id="'+_prod_id+'"][store_id="'+_user_store+'"]').attr('store_quantity'),10);
				}		
				
				var free_delivery = $('#MinSumma').val();
				
				//Проверка на превышение месячного лимита
				limit = parseInt($('#UF_LIMIT_REST').val(),10);
				prod  = parseInt(_prod_quantity*_prod_price, 10);
				summ  = parseInt($('#cart_summ').val(),10) + prod;
				if(limit > summ){
					
					car_info = '';
					if($('#chained_select_db_type').length){
					  select_type = $('#chained_select_db_type').val();
					  $('input[props_code='+select_type+']').each(function(){
						in_order = $(this).attr('in_order');
						if(in_order != 'no'){
						  car_info = car_info+' '+$(this).val();
						}
					  });
					}
					
					$.get("/personal/order/cart/cart_add.php", { 'product_id': _prod_id , 'product_price' : _prod_price, 'product_discount' : _prod_discount, 'product_quantity' : _prod_quantity, 'product_name' : _prod_name, 'product_brand' : _prod_brand, 'product_model' : _prod_model, 'product_diametr' : _prod_diametr, 'product_category' : _prod_category, 'product_group' : _prod_group, 'store_id' : _store_id, 'code_1c' : _code_1c, 'store_quantity_1' : _store_quantity_1, 'store_quantity_2' : _store_quantity_2, 'car_info' : car_info}, function(res) {
						result = res.split('|');
						if(result[0] !== 'false'){	
							_store_quantity = _store_quantity -_prod_quantity;
							$('#quantity_store'+_store_id+'_'+_prod_id).val(_prod_quantity);
							$('#currentCount_'+_store_id+'_'+_prod_id).text(formatStoreAmount(_store_quantity));
							$(_this).attr('store_quantity',_store_quantity);
							$('.cart_items').text(result[0]);
							$('.cart_items_quantity').text(result[2]); 
							$('#cart_summ').val(result[1]);						
							$('.cart_summ').text(number_format(result[1], 2, '.', ' '));
							
							if(_store_id === '1'){
								store_summ = parseInt(result[3],10);
							}
							else{
								store_summ = parseInt(result[4],10);
							}
							if((store_summ >= free_delivery) || (_store_id === '1')){
								delivery = 'бесплатная';
							}
							else{
								delivery = 'самовывоз';
							}
							
							if(_user_store != '1'){
							
								if(_store_id === '1'){
									delivery = 'бесплатная с центрального склада';
									//delivery = delivery+' с центрального склада';
									if($('.cart_delivery_'+_user_store).text().length < 2){
										$('.cart_delivery').css('margin-top', '8px');
									}
								}
								else{
									delivery = 'самовывоз с регионального склада';
									//delivery = delivery+' с регионального склада';
									if($('.cart_delivery_1').text().length < 2){
										$('.cart_delivery').css('margin-top', '-8px');
									}							
								}
								
								$('.cart_delivery_'+_store_id).text(delivery);
								
								if($('.cart_delivery_1').text().length > 2 && $('.cart_delivery_'+_user_store).text().length > 2){	
									$('.cart_delivery').css('margin-top', '0px');
								}
								
							}
							else{
								delivery = 'бесплатная с центрального склада';
								//delivery = delivery+' с центрального склада';
								$('.cart_delivery_main').text(delivery); 
							}
							
							$('.cart').show();
							$(window).scroll();
							infoWindow('Товар добавлен в корзину!');
						}
						else{
							if(isNaN(parseInt(result[1],10))){
								infoWindow('Вами превышен лимит на заказ товаров '+result[1]+'. Уменьшите количество позиций товаров этого бренда или добавьте позиции других брендов в заказ.');
							}
							else{
								infoWindow('Данный товар можно заказать только в количестве до '+result[1]+' штук. Уточните возможность заказа большего количества у <a style="color: #ABCDEF;" href="/contacts/#'+STORES[_store_id]+'">специалиста по продажам.');
							}
						}
					}, "html");	
				}
				else{
					infoWindow('Превышен месячный лимит! Для заказа большего количества свяжитесь с вашим специалистом по продажам!');
				}
				
			}
			
		}, "html");	
		return false;
	});
	
	
	// Добавление товара в корзину
	$('.cartBtnAlt.cartBtnAlt').live("click", function(){
		_this = $(this);
		_prod_id    = $(_this).attr('element_id');
		_prod_price = parseFloat($(_this).attr('product_price'));
		_prod_name  = $(_this).attr('product_name');
		_prod_brand = $(_this).attr('brand_name');
		_prod_model = $(_this).attr('product_model');
		_prod_category   = $(_this).attr('subsection_name');
		_prod_diametr   = $(_this).attr('product_diametr');
		_prod_group      = $(_this).attr('section_name');
		_store_id        = $(_this).attr('store_id');
		_code_1c         = $(_this).attr('code_1c');
		//_store_quantity  = parseInt($(_this).attr('store_quantity'),10);
		_prod_quantity   = parseInt($('#quantity_store'+_store_id+'_'+_prod_id).val(),10);
		_prod_discount   = $('#discount').val();
		_user_store      = $(".user_store").val();
		_order_type      =  $(_this).attr('order_type');
		
		$.get("/personal/order/cart/product_info.php", { 'PRODUCT_ID': _prod_id , 'USER_STORE_ID' : _user_store , 'PRODUCT_STORE_ID' : _store_id}, function(res) {
			_store_quantity = parseInt(res,10);
			$(_this).attr('store_quantity', _store_quantity)
			//$('#currentCount_'+_store_id+'_'+_prod_id).text(formatStoreAmount(_store_quantity));
			
			STORES = new Array();
			STORES[1] = 'Барановичи';
			STORES[2] = 'Гомель';
			STORES[3] = 'Брест';
			STORES[4] = 'Витебск';
			STORES[5] = 'Гродно';
			STORES[6] = 'Минск';
			STORES[7] = 'Могилёв';
				
			if(_prod_quantity > 0){
			
				$('#quantity_store'+_store_id+'_'+_prod_id).val(_prod_quantity); 
			
				if(_prod_quantity > _store_quantity){
					infoWindow('Часть товара будет доставлена под заказ!');
				}
				
				if(_store_quantity == 0){
					infoWindow('Данный товар будет доставлен под заказ!');		
				}
				
				if(_store_id == _user_store){
					_store_quantity_1 = parseInt($('a[element_id="'+_prod_id+'"][store_id="1"]').attr('store_quantity'),10);
					_store_quantity_2 = _store_quantity - _prod_quantity;
					if(_store_quantity_2 < 0){
						_store_quantity_2 = 0;
					}
				}
				else{
					_store_quantity_1 = _store_quantity - _prod_quantity;
					_store_quantity_2 = parseInt($('a[element_id="'+_prod_id+'"][store_id="'+_user_store+'"]').attr('store_quantity'),10);
					if(_store_quantity_1 < 0){
						_store_quantity_1 = 0;
					}
				}		
				
				var free_delivery = $('#MinSumma').val();
				
				//Проверка на превышение месячного лимита
				limit = parseInt($('#UF_LIMIT_REST').val(),10);
				prod  = parseInt(_prod_quantity*_prod_price, 10);
				summ  = parseInt($('#cart_summ').val(),10) + prod;
				if(limit > summ){
					$.get("/personal/order/cart/cart_add.php", { 'product_id': _prod_id , 'product_price' : _prod_price, 'product_discount' : _prod_discount, 'product_quantity' : _prod_quantity, 'product_name' : _prod_name, 'product_brand' : _prod_brand, 'product_model' : _prod_model, 'product_diametr' : _prod_diametr, 'product_category' : _prod_category, 'product_group' : _prod_group, 'store_id' : _store_id, 'code_1c' : _code_1c, 'store_quantity_1' : _store_quantity_1, 'store_quantity_2' : _store_quantity_2, 'order_type' : _order_type}, function(res) {
						result = res.split('|'); 
						if(result[0] !== 'false'){	
							_store_quantity = _store_quantity -_prod_quantity;
							if(_store_quantity < 0){
								_store_quantity = 0;
							}							
							$('#quantity_store'+_store_id+'_'+_prod_id).val(_prod_quantity);
							$('#currentCount_'+_store_id+'_'+_prod_id).text(formatStoreAmount(_store_quantity));
							$(_this).attr('store_quantity',_store_quantity);
							$('.cart_items').text(result[0]);
							$('.cart_items_quantity').text(result[2]); 
							$('#cart_summ').val(result[1]);						
							$('.cart_summ').text(number_format(result[1], 2, '.', ' '));
							
							if(_store_id === '1'){
								store_summ = parseInt(result[3],10);
							}
							else{
								store_summ = parseInt(result[4],10);
							}
							if((store_summ >= free_delivery) || (_store_id === '1')){
								delivery = 'бесплатная';
							}
							else{
								delivery = 'самовывоз';
							}
							
							if(_user_store != '1'){
							
								if(_store_id === '1'){
									delivery = 'бесплатная с центрального склада';
									//delivery = delivery+' с центрального склада';
									if($('.cart_delivery_'+_user_store).text().length < 2){
										$('.cart_delivery').css('margin-top', '8px');
									}
								}
								else{
									delivery = 'самовывоз с регионального склада';
									//delivery = delivery+' с регионального склада';
									if($('.cart_delivery_1').text().length < 2){
										$('.cart_delivery').css('margin-top', '-8px');
									}							
								}
								
								$('.cart_delivery_'+_store_id).text(delivery);
								
								if($('.cart_delivery_1').text().length > 2 && $('.cart_delivery_'+_user_store).text().length > 2){	
									$('.cart_delivery').css('margin-top', '0px');
								}
								
							}
							else{
								delivery = 'бесплатная с центрального склада';
								//delivery = delivery+' с центрального склада';
								$('.cart_delivery_main').text(delivery); 
							}
							
							$('.cart').show();
							$(window).scroll();
							infoWindow('Товар добавлен в корзину!');
						}
						else{
							if(isNaN(parseInt(result[1],10))){
								infoWindow('Вами превышен лимит на заказ товаров '+result[1]+'. Уменьшите количество позиций товаров этого бренда или добавьте позиции других брендов в заказ.');
							}
							else{
								infoWindow('Данный товар можно заказать только в количестве до '+result[1]+' штук. Уточните возможность заказа большего количества у <a style="color: #ABCDEF;" href="/contacts/#'+STORES[_store_id]+'">специалиста по продажам.');
							}
						}
					}, "html");	
				}
				else{
					infoWindow('Превышен месячный лимит! Для заказа большего количества свяжитесь с вашим специалистом по продажам!');
				}
				
			}
			
		}, "html");	
		return false;
	});	
	
	$(document).on("click", ".go_back_to_hell", function(){ 	
		history.go(-1);
		return false;
	});		
	
	//Обновляем нужные поля в корзине
	if($("#basket_flag").exists())
	{		
		if($('#tab-1').length){
			_store_id = 1;
		}
		else{
			_store_id = $('input[name=USER_STORE]').val();
		}
		review_basket(_store_id);
	}		
	
	//Переход между вкладками складов
	$(document).on("click", ".cart-tab", function(){ 
		var _store_id = $(this).attr('store_id');
		$('.order_add').each(function(){
			$(this).attr('store_id', _store_id);
		});	
		renew_overal_summ(_store_id);
	});	
	
	//Изменение количества товара (+/-)
	$(document).on("click", ".change_counter", function(){ 
		var id = $(this).attr('element_id');
		var act 	= $(this).attr('act');
		var _prod_id  = $(this).attr('prod_id');
		var _store_id = $(this).attr('store_id');	
		var _order_type = $(this).attr('order_type');			
		if(_store_id == '1'){
			_store_cart =  $('#cart-tabs-1');
			_store_tab  = 1;
		}
		else{
			_store_cart =  $('#cart-tabs-2');
			_store_tab  = 2;
		}
		_count = parseInt($('#counter_'+id, _store_cart).val(),10);
		store_quantity = parseInt($('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(),10);
		switch (act) {
			case 'desc':	 
				if(_count>1){
					/*
					var flag = $('#request_finish_flag').val();
					function wait(){
						if(flag === 'false') setTimeout('wait()',5000);
						else return;
					}
					wait();
					$('#request_finish_flag').val('false');
					*/
					cartUpdate(_prod_id, _store_id, -1, 'desc');					
					if($('#request_result').val() === 'true'){
						// $('#counter_'+id, _store_cart).val(_count - 1);
						$('#counter_'+id, _store_cart).attr('value',_count - 1);
						$('#old_counter_'+id, _store_cart).val(_count - 1);
						$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(store_quantity+1);
						
					}
					else{
						return false;
					}					
				}
				if($('#info_popup').val() === 'true'){
					infoWindow('Изменения количества сохранены!');
				}
				break;
			case 'inc':	
				var user_group = $('input[name="USER_GROUP"]').val();
				
				//Проверка на превышение месячного лимита
				limit = parseInt($('#UF_LIMIT_REST').val(),10);
				price = parseInt($(this).attr('price'), 10);
				summ  = parseInt($('#overall_summ_'+_store_id).val(),10) + price;
				if(limit > summ){
					if(user_group == opt_user_group){
						total_quantity = parseInt($('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(),10);
					}
					else{
						total_quantity = parseInt($('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(),10) + parseInt($('#store_quantity_2_'+id, _store_cart).val(),10);
					}
					if(_order_type !== 'Под заказ'){
						if(total_quantity > 0){
							cartUpdate(_prod_id, _store_id, 1, 'inc');
							if($('#request_result').val() === 'true'){
								_new_count = parseInt($('#counter_'+id, _store_cart).val(),10);
								if(_new_count !== _count + 1){
									store_update = store_quantity;
								}
								else{
									store_update = store_quantity - 1;
								}
								// $('#counter_'+id, _store_cart).val(_count + 1);
								$('#counter_'+id, _store_cart).attr('value',_count + 1);
								$('#old_counter_'+id, _store_cart).val(_count + 1);
								$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(store_update);
							}
							else{
								return false;
							}
						}
						else{
							infoWindow('Вы заказали максимальное количество данного товара!');	
							return false;
						}
					}
					else{
						cartUpdate(_prod_id, _store_id, 1, 'inc');
						if($('#request_result').val() === 'true'){
							_new_count = parseInt($('#counter_'+id, _store_cart).val(),10);
							if(_new_count !== _count + 1){
								store_update = store_quantity;
							}
							else{
								store_update = store_quantity - 1;
							}
							if(store_update < 0){
								store_update = 0;
							}
							// $('#counter_'+id, _store_cart).val(_count + 1);
							$('#counter_'+id, _store_cart).attr('value',_count + 1);
							$('#old_counter_'+id, _store_cart).val(_count + 1);
							$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(store_update);
						}
						else{
							return false;
						}						
					}
					
					if($('#request_result').val() === 'true'){
						if($('#info_popup').val() === 'true'){
							infoWindow('Изменения количества сохранены!');
						}
					}
				}
				else{
					infoWindow('Превышен месячный лимит! Для заказа большего количества свяжитесь с вашим специалистом по продажам!');
				}
				break;
			default:
				break;
		}
		change_summ(id, _store_id);
		return false;
	});	
	
	//Ввод количества товара
	$(document).on("input", ".counter_input", function(){ 
		var id = $(this).attr('element_id');
		var _prod_id  = $(this).attr('prod_id');
		var _store_id = $(this).attr('store_id');	
		var _order_type = $(this).attr('order_type');			
		if(_store_id == '1'){
			_store_cart =  $('#cart-tabs-1');
			_store_tab  = 1;
		}
		else{
			_store_cart =  $('#cart-tabs-2');
			_store_tab  = 2;
		}
		var counter = parseInt($('#counter_'+id, _store_cart).val(),10);
		
		var old_counter = parseInt($('#old_counter_'+id, _store_cart).val(),10);
		var store_quantity = parseInt($('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(),10);
		if(isPositiveNumber(counter)){
			diff = counter - old_counter;
			if(diff > 0){
				//Проверка на превышение месячного лимита
				limit = parseInt($('#UF_LIMIT_REST').val(),10);
				price = parseInt($(this).attr('price'), 10);
				summ  = parseInt($('#overall_summ_'+_store_id).val(),10) + price*diff;		
				if(limit > summ){
					//update_cart
					if(_order_type !== 'Под заказ'){
						if(counter <= (store_quantity + old_counter)){
							cartUpdate(_prod_id, _store_id, diff, 'update');
							if($('#request_result').val() === 'true'){
								if($('#info_popup').val() === 'true'){
									infoWindow('Изменения количества сохранены!');
									$('#old_counter_'+id, _store_cart).val(counter);
									$('#counter_'+id, _store_cart).attr('value',counter);
									$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(old_counter - counter + store_quantity);
								}
								else{
									infoWindow('Количество уменьшено до возможного!');
									$('#old_counter_'+id, _store_cart).val(parseInt($('#counter_'+id, _store_cart).val(),10));
									$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(old_counter - parseInt($('#counter_'+id, _store_cart).val(),10) + store_quantity);
								}
								change_summ(id, _store_id);
								//$.cookie('quantity_store_'+_store_id+'_'+_prod_id, store_quantity - counter, { expires: 365, path: '/' });
							}
							else{
								// $('#counter_'+id, _store_cart).val(old_counter);
								 $('#counter_'+id, _store_cart).attr('value', old_counter);
							}
						}
						else{
							diff = counter - (store_quantity + old_counter);
							// $('#counter_'+id, _store_cart).val(store_quantity + old_counter);
							$('#counter_'+id, _store_cart).attr('value',store_quantity + old_counter);
							$('#old_counter_'+id, _store_cart).val(store_quantity + old_counter);
							
							cartUpdate(_prod_id, _store_id, diff, 'update');
							if($('#request_result').val() === 'true'){
								/*if(store_quantity > 30){
									store_quantity = 30;
								}*/
								if($('#info_popup').val() === 'true'){
									infoWindow('Количество товара уменьшено до возможного!');	
									//$('#counter_'+id, _store_cart).val(store_quantity);
									//$('#old_counter_'+id, _store_cart).val(store_quantity);
									$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(0);
								}
								else{
									infoWindow('Количество уменьшено до возможного!');
									//$('#old_counter_'+id, _store_cart).val(parseInt($('#counter_'+id, _store_cart).val(),10));
									$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(old_counter - parseInt($('#counter_'+id, _store_cart).val(),10) + store_quantity);
								}							
								change_summ(id, _store_id);
								//$.cookie('quantity_store_'+_store_id+'_'+_prod_id, 0, { expires: 365, path: '/' });
							}
							else{
								// $('#counter_'+id, _store_cart).val(old_counter);
								$('#counter_'+id, _store_cart).attr('value',old_counter );
							}				
						}
					}
					else{
						cartUpdate(_prod_id, _store_id, diff, 'update');
						if($('#request_result').val() === 'true'){
							if($('#info_popup').val() === 'true'){
								store_quantity = old_counter - counter + store_quantity;
								if(store_quantity < 0){
									store_quantity = 0;
								}
								infoWindow('Изменения количества сохранены!');
								$('#old_counter_'+id, _store_cart).val(counter);
								$('#counter_'+id, _store_cart).attr('value',counter);
								$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(store_quantity);
							}
							change_summ(id, _store_id);					
						}
					}
				}
				else{
					// $('#counter_'+id, _store_cart).val(old_counter);
					$('#counter_'+id, _store_cart).attr('value',old_counter);
					infoWindow('Превышен месячный лимит! Для заказа большего количества свяжитесь с вашим специалистом по продажам!');
				}
			}
			else{
				cartUpdate(_prod_id, _store_id, diff, 'update');
				if($('#request_result').val() === 'true'){
					if($('#info_popup').val() === 'true'){
						infoWindow('Изменения количества сохранены!');
						$('#old_counter_'+id, _store_cart).val(counter);
						$('#counter_'+id, _store_cart).attr('value',counter);
						$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(old_counter - counter + store_quantity);
					}
					else{
						infoWindow('Количество уменьшено до возможного!');
						$('#old_counter_'+id, _store_cart).val(parseInt($('#counter_'+id, _store_cart).val(),10));
						$('#store_quantity_'+_store_tab+'_'+id, _store_cart).val(old_counter - parseInt($('#counter_'+id, _store_cart).val(),10) + store_quantity);
					}
					//$.cookie('quantity_store_'+_store_id+'_'+_prod_id, store_quantity - counter, { expires: 365, path: '/' });
					change_summ(id, _store_id);
				}
				else{
					// $('#counter_'+id, _store_cart).val(old_counter);
					$('#counter_'+id, _store_cart).attr('value',old_counter);
				}				
			}
		}
		else{
			infoWindow('Введите корректное количество!');
			// $('#counter_'+id, _store_cart).val(old_counter);
			$('#counter_'+id, _store_cart).attr('value',old_counter);
		}
	});		
	
	//Обновление значений итоговых сумм по выбранному элементу заказа
	var change_summ = function(id, _store_id){

		if(_store_id == '1'){
			_store_cart =  $('#cart-tabs-1');
		}
		else{
			_store_cart =  $('#cart-tabs-2');
		}
	
		var price    = $('#price_'+id, _store_cart).val();
		var discount = $('#discount_'+id, _store_cart).val();
		var total    = parseInt($('#counter_'+id, _store_cart).val(),10);
		var total_price = 0;
		var total_disc  = 0;
		var disc_summ   = 0;
		
		var length = 0;
		var div_num = 0;	
		
		total_price = total*price;
		total_disc  = total*discount;
		disc_summ = total_price - total_disc;
		
		$('#summ_'+id).val(total_price);
		$('#summ_show_'+id).text(number_format(total_price, 2, '.', ' '));
		
		renew_overal_summ(_store_id);
		
	};
		
	//Обновление значений итоговых сумм по всему заказу в целом при изменении количества товаров
	var renew_overal_summ = function(_store_id){
	
		if(_store_id == '1'){
			_store_cart =  $('#cart-tabs-1');
		}
		else{
			_store_cart =  $('#cart-tabs-2');
		}	
		var stores = [];
		$('.cart-tab').each(function(){
			id = $(this).attr('store_id');
			if(_store_id === id){
				stores['current'] = id;
			}
			else{
				stores['second']  = id;
			}
		});	
		
		var overal_summ  = 0;
		var quantity     = 0;
		$('.basket_elements', _store_cart).each(function(){
			var id = $(this).attr('element_id');
			quantity = quantity + parseInt($('#counter_'+id, _store_cart).val(),10);
			overal_summ = overal_summ + parseFloat($('#summ_'+id, _store_cart).val(),10);
		});			
		
		$('#overall_summ_'+stores['current']).val(overal_summ);
		$('#overall_quantity_'+stores['current']).val(quantity);
		$('#overall_summ').val(overal_summ + parseInt($('#overall_summ_'+stores['second']).val(),10));
		$('.amount').text(number_format(overal_summ, 2, '.', ' '));		
		$('.quantity').text(quantity);		
		
		review_basket(_store_id);
		
	};
	
	//Обновление значений итоговых сумм по всему заказу в целом при удалении товара
	var change_overal_summ = function(_store_id, diff){
	
		if(_store_id == '1'){
			_store_cart =  $('#cart-tabs-1');
		}
		else{
			_store_cart =  $('#cart-tabs-2');
		}		
		var number   = 1;
		var quantity = 0;
		
		old_overal_summ = parseInt($('#overall_summ').val(),10);
		new_overal_summ = old_overal_summ + Number(diff);
		
		$('#overall_summ').val(new_overal_summ);
		$('.amount').text(number_format(new_overal_summ, 0, ',', ' '));
		
		$('.basket_elements', _store_cart).each(function(){
			var id = $(this).attr('element_id');
			quantity = quantity + parseInt($('#counter_'+id, _store_cart).val(),10);
			$('#number_'+id, _store_cart).text(number);
			number = number + 1;
		});		

		$('.quantity').text(quantity);	
		
		review_basket(_store_id);
		
	};
	
	//Удаление элемента из корзины
	$(document).on("click", ".deleteLink", function(){ 
		_this = $(this);
		var items_count = 0;
		var id = _this.attr('element_id');
		var _prod_id  = _this.attr('prod_id');
		var _store_id = _this.attr('store_id');
		var	summ = parseInt($('#summ_'+id).val(),10);
		var disc = parseInt($('#disc_'+id).val(),10);	
		if(_store_id == '1'){
			_store_cart  = $('#cart-tabs-1');
			_second_cart = $('#cart-tabs-2');
			tab_1 = 1;
			tab_2 = 2;
		}
		else{
			_store_cart =  $('#cart-tabs-2');
			_second_cart = $('#cart-tabs-1');
			tab_1 = 2;
			tab_2 = 1;			
		}		
		
		$.get("/personal/order/cart/cart_elm_remove.php", { 'id': id, 'prod_id' : _prod_id, 'store_id' : _store_id }, function(res) {
						
			//$.removeCookie('quantity_store_'+_store_id+'_'+_prod_id, { path: '/' });
				
			$('#element_'+id, _store_cart).remove();
			
			change_overal_summ(_store_id, -summ);
			
			if($('.basket_elements').length === 0){
				$('.basket').remove();
				$('.empty').html('<div style="text-align:center;"><h1 style="color: green; padding-top:45px;">Ваша корзина очищена!</h1></div>');
				setTimeout('history.go(-1)', 5000);	
			}
			else {	
				if($('.basket_elements', _store_cart).length === 0){
					$('#tab-'+tab_2).click();
					$('#cart-tabs-'+tab_1).remove();
					$('#tab-'+tab_1).remove();	
				}				
				infoWindow('Выбранная позиция была удалена!');
			}
						
		}, "json");

		return false;
	});	
	
	//Очистка корзины
	$(document).on("click", ".clearLink", function(){ 
	
		$.get("/personal/order/cart/cart_clear.php", { }, function(res) {
			
			//$('.product').each(function(){
				//_this = $(this);
				//var _prod_id  = _this.val();
				//var _store_id = _this.attr('store_id');
				//$.removeCookie('quantity_store_'+_store_id+'_'+_prod_id, { path: '/' });
			//});						
			
			$('.basket').html('<div style="text-align:center;"><h1 style="color: green; padding-top:45px;">Ваша корзина очищена!</h1></div>');
			//$('.basket').remove();
			//$('.empty').html('<div style="text-align:center;"><h1 style="color: green; padding-top:45px;">Ваша корзина очищена!</h1></div>');
			setTimeout('history.go(-1)', 5000);	
		}, "json");
		
		return false;
	});	

	//Оформить заказ
	$(document).on("click", ".order_add", function(){ 
		
		var store_id = $(this).attr('store_id');
		var limit = parseInt($('input[name=LIMIT_REST]').val(),10);
		
		if(store_id === '1'){
			tab_1 = 1;
			tab_2 = 2;
			store = 'центральный';
		}
		else{
			tab_1 = 2;
			tab_2 = 1;
			store = 'региональный';
		}
		
		var overal_summ = parseInt($('#overall_summ_'+store_id).val(),10);
		var overall_disc = parseInt($('#overall_disc_'+store_id).val(),10);

		if(limit >= overal_summ || isNaN(limit)){ 

			var deferment   = '';
			var prepayment  = '';		
			var LEGAL_CITY = $('input[name=LEGAL_CITY]').val();
			var SEND_ADDRESS = $('input[name=SEND_ADDRESS]').val();
			var CONTACT_FIO = $('input[name=CONTACT_FIO]').val();
			var CONTACT_PHONE = $('input[name=CONTACT_PHONE]').val();
			var CONTACT_FAX = $('input[name=CONTACT_FAX]').val();
			var LEGAL_NAME = $('input[name=LEGAL_NAME]').val();
			var FIO = $('input[name=FIO]').val();
			var LEGAL_ADDRESS = $('input[name=LEGAL_ADDRESS]').val();
			var UNP = $('input[name=UNP]').val();
			var RS = $('input[name=RS]').val();
			var BANK = $('input[name=BANK]').val();		
			var BANKCOD = $('input[name=BANKCOD]').val();
			var DELIVERY = parseInt($('input[name=DELIVERY]:checked').val(),10);
			var KONTAGENT_ID = $('input[name=1C_ID]').val();
			
			var PAYMENT_DEFERMENT = $("#PAYMENT_DEFERMENT").prop("checked");
			if((typeof PAYMENT_DEFERMENT !== 'undefined') && PAYMENT_DEFERMENT === true){
				deferment = 'Есть';
			}
			else{
				deferment = 'Нет';
			}
			
			if($('#tab-1').length && $('#tab-2').length){
				order_type = 'complex_order';
			}
			else{
				order_type = 'simple_order';
			}
			
			STORES = new Array();
			STORES[1] = 'Барановичи';
			STORES[2] = 'Гомель';
			STORES[3] = 'Брест';
			STORES[4] = 'Витебск';
			STORES[5] = 'Гродно';
			STORES[6] = 'Минск';
			STORES[7] = 'Могилёв';					
			
			$.get("/personal/order/send_order.php", { 'price': overal_summ , 'discount' : overall_disc, 'store_id' : store_id, 'order_type' : order_type, 'PAYMENT_DEFERMENT' : deferment , 'LEGAL_CITY' : LEGAL_CITY, 'SEND_ADDRESS' : SEND_ADDRESS, 'CONTACT_FIO' : CONTACT_FIO, 'CONTACT_PHONE' : CONTACT_PHONE, 'CONTACT_FAX' : CONTACT_FAX, 'LEGAL_NAME' : LEGAL_NAME, 'FIO' : FIO, 'LEGAL_ADDRESS' : LEGAL_ADDRESS, 'UNP' : UNP, 'RS' : RS, 'BANK' : BANK, 'BANKCOD' : BANKCOD, 'DELIVERY' : DELIVERY, '1C_ID' : KONTAGENT_ID }, function(res) {
				if(res === false){
					infoWindow('Для заказа большего количества свяжитесь с вашим специалистом по продажам!');
					$('#request_result').val('false');
				}
				else{
					if(order_type === 'complex_order'){
						$('#tab-'+tab_2).click();
						$('#cart-tabs-'+tab_1).remove();
						$('#tab-'+tab_1).remove();
						$('input[name=LIMIT_REST]').val(limit-overal_summ);
						
						$("body").animate({"scrollTop":0},"slow");
						window.scrollTo(0, 0);
						infoWindow('Ваш заказ на '+store+' склад оформлен!');
					}
					else{
						$("body").animate({"scrollTop":0},"slow");
						window.scrollTo(0, 0);
						$('.basket').remove();
						$('.sendOrder').html('<div style="text-align:center;"><h1 style="color: green; padding-top:45px;">Ваш заказ оформлен целиком!</h1></div>');
						setTimeout('window.location.href = \'/personal/order/\';', 5000);
					}
					$('#request_result').val('true');
				}
			}, "json");
			
			/*
			$('.product').each(function(){
				var _prod_id  = $(this).val();
				var _store_id = $(this).attr('store_id');
				$.removeCookie('quantity_store_'+_store_id+'_'+_prod_id, { path: '/' });
			});		
			*/
		}
		else{
		
			infoWindow('Вы превысили допустимый лимит! Уменьшите свой заказ, либо свяжитесь с менеджером для увеличения лимита.');
		
		}
		
		return false;
		
	});	

	//Оформить заказ
	$(document).on("click", ".order_add2", function(){ 
		
		var store_id = $(this).attr('store_id');
		var limit = parseInt($('input[name=LIMIT_REST]').val(),10);
		
		if(store_id === '1'){
			tab_1 = 1;
			tab_2 = 2;
			store = 'центральный';
		}
		else{
			tab_1 = 2;
			tab_2 = 1;
			store = 'региональный';
		}
		
		var overal_summ = parseInt($('#overall_summ_'+store_id).val(),10);
		var overall_disc = parseInt($('#overall_disc_'+store_id).val(),10);

		if(limit >= overal_summ || isNaN(limit)){ 

			var deferment   = '';
			var prepayment  = '';		
			var LEGAL_CITY = $('input[name=LEGAL_CITY]').val();
			var SEND_ADDRESS = $('input[name=SEND_ADDRESS]').val();
			var CONTACT_FIO = $('input[name=CONTACT_FIO]').val();
			var CONTACT_PHONE = $('input[name=CONTACT_PHONE]').val();
			var CONTACT_FAX = $('input[name=CONTACT_FAX]').val();
			var LEGAL_NAME = $('input[name=LEGAL_NAME]').val();
			var FIO = $('input[name=FIO]').val();
			var LEGAL_ADDRESS = $('input[name=LEGAL_ADDRESS]').val();
			var UNP = $('input[name=UNP]').val();
			var RS = $('input[name=RS]').val();
			var BANK = $('input[name=BANK]').val();		
			var BANKCOD = $('input[name=BANKCOD]').val();
			var DELIVERY = parseInt($('input[name=DELIVERY]:checked').val(),10);
			var KONTAGENT_ID = $('input[name=1C_ID]').val();
			var delivery_address_np = $('#delivery_address_np').val();
			var delivery_address_index = $('#delivery_address_index').val();
			var delivery_address_street_type = $('#delivery_address_street_type :selected').text();
			var delivery_address_street = $('#delivery_address_street').val();
			var delivery_address_house = $('#delivery_address_house').val();
			var delivery_address_house_corpus = $('#delivery_address_house_corpus').val();
			var delivery_address_office_appart = $('#delivery_address_office_appart').val();
			var legal_address_np = $('#legal_address_np').val();
			var legal_address_index = $('#legal_address_index').val();
			var legal_address_street_type = $('#legal_address_street_type :selected').text();
			var legal_address_street = $('#legal_address_street').val();
			var legal_address_house = $('#legal_address_house').val();
			var legal_address_house_corpus = $('#legal_address_house_corpus').val();
			var legal_address_office_appart = $('#legal_address_office_appart').val();
			
			var PAYMENT_DEFERMENT = $("#PAYMENT_DEFERMENT").prop("checked");
			if((typeof PAYMENT_DEFERMENT !== 'undefined') && PAYMENT_DEFERMENT === true){
				deferment = 'Есть';
			}
			else{
				deferment = 'Нет';
			}
			
			if($('#tab-1').length && $('#tab-2').length){
				order_type = 'complex_order';
			}
			else{
				order_type = 'simple_order';
			}
			
			STORES = new Array();
			STORES[1] = 'Барановичи';
			STORES[2] = 'Гомель';
			STORES[3] = 'Брест';
			STORES[4] = 'Витебск';
			STORES[5] = 'Гродно';
			STORES[6] = 'Минск';
			STORES[7] = 'Могилёв';					
			
			$.get("/personal/order/send_order.php", { 'price': overal_summ , 'discount' : overall_disc, 'store_id' : store_id, 'order_type' : order_type, 'PAYMENT_DEFERMENT' : deferment , 'LEGAL_CITY' : LEGAL_CITY, 'SEND_ADDRESS' : SEND_ADDRESS, 'CONTACT_FIO' : CONTACT_FIO, 'CONTACT_PHONE' : CONTACT_PHONE, 'CONTACT_FAX' : CONTACT_FAX, 'LEGAL_NAME' : LEGAL_NAME, 'FIO' : FIO, 'LEGAL_ADDRESS' : LEGAL_ADDRESS, 'UNP' : UNP, 'RS' : RS, 'BANK' : BANK, 'BANKCOD' : BANKCOD, 'DELIVERY' : DELIVERY, '1C_ID' : KONTAGENT_ID , 'delivery_address_np' : delivery_address_np, 'delivery_address_index' : delivery_address_index, 'delivery_address_street_type' : delivery_address_street_type, 'delivery_address_street' : delivery_address_street, 'delivery_address_house' : delivery_address_house, 'delivery_address_house_corpus' : delivery_address_house_corpus, 'delivery_address_office_appart' : delivery_address_office_appart, 'legal_address_np' : legal_address_np, 'legal_address_index' : legal_address_index, 'legal_address_street_type' : legal_address_street_type, 'legal_address_street' : legal_address_street, 'legal_address_house' : legal_address_house, 'legal_address_house_corpus' : legal_address_house_corpus, 'legal_address_office_appart' : legal_address_office_appart }, function(res) {
				if(res === false){
					infoWindow('Для заказа большего количества свяжитесь с вашим специалистом по продажам!');
					$('#request_result').val('false');
				}
				else{
					if(order_type === 'complex_order'){
						$('#tab-'+tab_2).click();
						$('#cart-tabs-'+tab_1).remove();
						$('#tab-'+tab_1).remove();
						$('input[name=LIMIT_REST]').val(limit-overal_summ);
						
						$("body").animate({"scrollTop":0},"slow");
						window.scrollTo(0, 0);
						infoWindow('Ваш заказ на '+store+' склад оформлен!');
					}
					else{
						$("body").animate({"scrollTop":0},"slow");
						window.scrollTo(0, 0);
						$('.basket').remove();
						$('.sendOrder').html('<div style="text-align:center;"><h1 style="color: green; padding-top:45px;">Ваш заказ оформлен целиком!</h1></div>');
						setTimeout('window.location.href = \'/personal/order/\';', 5000);
					}
					$('#request_result').val('true');
				}
			}, "json");
			
			/*
			$('.product').each(function(){
				var _prod_id  = $(this).val();
				var _store_id = $(this).attr('store_id');
				$.removeCookie('quantity_store_'+_store_id+'_'+_prod_id, { path: '/' });
			});		
			*/
		}
		else{
		
			infoWindow('Вы превысили допустимый лимит! Уменьшите свой заказ, либо свяжитесь с менеджером для увеличения лимита.');
		
		}
		
		return false;
		
	});	
	
	// Map
	$('#location a.mark').click(function(){
		if(!$(this).is('.active')){
			$('#location a.mark.active').parent().removeClass('active');
			$('#location a.mark.active').removeClass('active');
			$('.mapWrap:visible').hide();
			$(this).addClass('active');
			$(this).parent().addClass('active');
			$($(this).attr('href')).slideDown(500);
			$('html, body').animate({
				scrollTop: $('#location').offset().top
			}, 500);
			if($(this).attr('data-main') == '1') {
				$("#mapMainImage").show();
			} else {
				$("#mapMainImage").hide();
			}
			// mapSetMarker($(this).attr('data-lat'), $(this).attr('data-lng'), $(this), true);
		}else{
			$(this).removeClass('active');
			$(this).parent().removeClass('active');
			$('.mapWrap:visible').hide();
		}
		return false;
	});
	$('.mapWrap .close').click(function(){
		$('.mapWrap:visible').hide();
		$('#location a.mark.active').parent().removeClass('active');
		$('#location a.mark.active').removeClass('active');
	});
	
	// Services
	$('#services').after('<div class="arrow prev" /><div class="arrow next" />').carouFredSel({
		auto: false,
		circular: false,
		infinite: false,
		//responsive: true,
		align: false,
		//width: $('.services').width(),
		items:{
			visible: 4
		},
		prev: '.services .prev',
		next: '.services .next',
		scroll:{
			duration: 500
		}
	});
	
	$(window).resize(function(){
		var newWidth = $('.services').width();
		if(newWidth <= 640) {
			$('#services').trigger('configuration', ['items.visible', 2]);
			$('#services').trigger('configuration', ['width', newWidth]);
			$('#services').find('li').css('width', newWidth / 2);
			$('#services').parent().css('width', newWidth);
		}else if(newWidth <= 935){
			$('#services').trigger('configuration', ['items.visible', 3]);
			$('#services').trigger('configuration', ['width', newWidth]);
			$('#services').find('li').css('width', newWidth/3);
			$('#services').parent().css('width', newWidth);
		}else{
			$('#services').trigger('configuration', ['items.visible', 4]);
			$('#services').trigger('configuration', ['width', newWidth]);
			$('#services').find('li').css('width', newWidth/4);
			$('#services').parent().css('width', newWidth);
		}
	}).resize();
	
	// Services 2
	$('#services-2').after('<div class="arrow prev" /><div class="arrow next" /><div class="pager" />').carouFredSel({
		items: 1,
		width: 250,
		height: 150,
		auto: 6000,
		prev: '.services-2 .prev',
		next: '.services-2 .next',
		pagination: '.services-2 .pager',
		scroll:{
			duration: 500
		}
	});
	
	// Tabs
	$('#novelties').tabs();
	$('.cartTabsContainer').tabs();
	
	// Vote
	$('.qToggle').click(function(){
		$('.answers').slideToggle();
	});

	var closeBtnTpl = $('<div class="btn-close btn-close-fSizes"></div>');
	
	// Size's select
	$('ul.fSizes>li>span').on('click', function(){
		$(this).parent('li').siblings('li.active').removeClass('active');
		$(this).parent('li').toggleClass('active');
		if($('.btn-close-fSizes').length === 0){
			closeBtnTpl.clone().insertAfter($(this).closest('ul.fSizes'));
		}
	});

	$('ul.fSizes ul a').click('click', function(){
	
		text = $(this).text();
		size = text;
		split = text.split(' все ');
		if(split[0] === 'Выбрать'){
			text = split[1];
			size = '/'+text;
		}
		/*
		if($(".catalogLink").exists()){
			link = $('.catalogLink').attr('href');
			split = link.split('/catalog/tires/car/');
			if(split[0] === ''){
				split = text.split(' все ');
				if(split[0] === 'Выбрать'){
					text = split[1];
					size = '/'+text;
				}
			}	
		}
		*/
		$(this).parents('li.active').removeClass('active');
		$('.btn-close-fSizes').remove();
		$(this).parents('.fSize').find('.chosenSize').text(text);
		$("input[type=hidden][name=chosenSize]").val(size);
		return false;
	});
	$(document).on('mousedown touchstart vmousedown', function(e){
		if(!$(e.target).parents('ul.fSizes').length){
			$('ul.fSizes>li.active').removeClass('active');
			$('.btn-close-fSizes').remove();
		}
	});
	
	// Order info
	$('.orderInfo .toggle').click(function(){
		/*$('.orderInfo').each(function(){
			$(this).addClass('open');
		});
		$('#send_order').show();
		jQuery.scrollTo('#fill_order_info');*/
		if($('#delivery_address_name').val().length < 1)
		{
			$('#box').show();
		}
		else
		{
			$('.orderInfo').each(function(){
				$(this).addClass('open');
			});
			$('#send_order').show();
			jQuery.scrollTo('#fill_order_info');
		}
		//window.scrollTo(0, 0);		
		//$(this).parents('.orderInfo').addClass('open');
	});
	
	$(document).on("click", ".order_fill", function(){ 	
		document.location.href = '/personal/order/cart/?order=updated#fill_order_info'; 
		/*
		$('.orderInfo').each(function(){
			$(this).addClass('open');
		});			
		$('#send_order').show();
		jQuery.scrollTo('#fill_order_info');		
		*/
	});
	
	$(document).on("click", ".order_fill2", function(){ 	
		if($('#user_ur_oblast').val() == ''){
			 openbox('box');
		}
		else{
			document.location.href = '/personal/order/cart/index.php?order=updated#fill_order_info';	
		}
		/*
		$('.orderInfo').each(function(){
			$(this).addClass('open');
		});			
		$('#send_order').show();
		jQuery.scrollTo('#fill_order_info');		
		*/
	});
	
	// Map popup
	$('a.mapLink').click(function(){
		$('.mapPopup, .overlay').show();
		// mapSetMarker($(this).attr('data-lat'), $(this).attr('data-lng'), $(this), false);
		return false;
	});
	$('.overlay, .mapPopup .close').click(function(){
		$('.mapPopup, .overlay').hide();
	});
	
	// Disabled button
	$('a.btn.disabled').click(function(){
		return false;
	});
	
	// Float cart
	if($('.cart').length > 0){
		$(window).bind('scroll resize', function() {

			var cbd = $(document).height() - ( $(document).scrollTop() + $(window).height() );
			if( cbd <= $('.footer').outerHeight() ){
				$('.cartIn').css({
					'bottom': $('.footer').outerHeight() - cbd
				});
			}else{
				$('.cartIn').css('bottom', 0);
			}
			$('.cartIn').css({
				'left': $('.cart').offset().left
				// 'width': $('.cart').width()
			});

		}).scroll();
	}
	
	// Sidebar slide
	$('.narrowScreenNav .toggle').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		/*new*/
		toggleScreenNav();
		/*new end*/
	});

	$('.floatSidebar .catalogue .title').click(function(){
		if(window.innerWidth <= 1279){
			/*new*/
			toggleScreenNav();
			/*new end*/
		}
	});

	/*new*/
	$('.content').click(function(){
		if(window.innerWidth <= 1279 && $('body').hasClass('floatSidebar')){
			closeScreenNav();
		}
	});

	$('.enterLink').click(function(){
		if(window.innerWidth <= 1279 && $('body').hasClass('floatSidebar')){
			closeScreenNav();
		}
	});

	$('.btn-menu-js').click(function(){
		if(window.innerWidth <= 1279 && $('body').hasClass('floatSidebar')){
			closeScreenNav();
		}
	});
	/*new end*/

	/*new*/
	function toggleScreenNav() {
		$('.sidebar').toggleClass('open');
		$('.narrowScreenNav').toggleClass('open');
		$('body').toggleClass('openScreenNav');
	}
	function closeScreenNav() {
		$('.sidebar').removeClass('open');
		$('.narrowScreenNav').removeClass('open');
		$('body').removeClass('openScreenNav');
	}
	/*new end*/

	// IE CSS3 hacks
	if($('html').is('.lt-ie9')){
		$('ul.cNews li:nth-child(2n)').css('border-left', '15px solid #fff');
		$('ul.cNews li:nth-child(2n+1)').css('border-right', '15px solid #fff');
		$('ul.productsGrid>li:nth-child(3n+1)').css('border-left', 0);
		$('.content tr:nth-child(2n+1) td').css('background', '#e5edf5');
	}

	//Обработка нажатия на кнопку "Изменить скидку"
	if($(".changeLink").exists())
	{
		$(document).on("click", ".changeLink", function(){ 
			$(".discountText").text('Введите вашу скидку: ');
			$(".discountChange").show();
			$(".changeLinkText").hide();
			return false;
		});
	}

	//Изменение пользовательской скидки и сохранение её значения в куках
	if($("#changeDisc").exists())
	{
		$(document).on("click", "#changeDisc", function(){ 
			var discount = $("#discount").val();
			$.cookie("discount", discount, { path: $(location).attr('pathname')});
			$(".discountText").html('Ваша скидка: <strong>'+discount+'%</strong>');
			$(".discountChange").hide();
			$(".changeLinkText").show();
			infoWindow('Введенная скидка ориентировочная, уточняйте % скидки в <a href="/contacts/">отделе продаж</a>, после отправки к заказу будут применены действующие скидки!');
			/*if($(".productsGrid").exists())
			{
				$(".productsGrid").wrap('<div class="content_table">');
			} else {
				$(".content table").wrap('<div class="content_table">');
			}
			$(".content_table").append('<div class="loader"></div>');*/
			$.ajax({
			    url: "",
			    context: document.body,
			    success: function(s,x){
			    	/*if($(".productsGrid").exists())
					{
						$(".productsGrid").html($(s).find(".productsGrid"));
					} else {
						$(".content table").html($(s).find(".content table"));
					}
					
			        $(".content_table .loader").remove();

			        if($(".productsGrid").exists())
					{
						$(".productsGrid").unwrap();
					} else {
						$(".content table").unwrap();
					}*/

					if($('#currentOffer').exists())
					{
						$('#currentOffer').html($(s).find('#currentOffer').html());
						if($('#allModelOffers').exists())
						{
							$('#allModelOffers').html($(s).find('#allModelOffers').html());
						}
						if($('#allSizeOffers').exists())
						{
							$('#allSizeOffers').html($(s).find('#allSizeOffers').html());
						}
					}
					else if($('.productsGrid').exists())
					{
						$('.productsGrid').html($(s).find('.productsGrid').html());
					}
					else
					{
						$('.content table').html($(s).find('.content table').html());
					}
			    }
			});
			return false;
		});
	}	
	
	//Обработка введённой пользователем скидки
	if($("#discount").exists())
	{	
		$(document).on("input", "#discount", function(){ 			
			var discount = $('#discount').val();
			var discount_tmp = $('#discount_tmp').val();
			if(isPositiveNumber(discount) && (parseInt(discount,10) <= 100)){
				$('#discount_tmp').val(discount);
			}
			else{
				infoWindow('Введите корректное число!');
				$('#discount').val(discount_tmp);
			}
		});		
	}
});

//Проверка на вывод панели заказов    
function check_basket()
{
	//Если не отключен показ панели заказов
	if(!$("#no_cart").exists())
	{		
		//Если есть заказы, то показываем панель заказов
		$.get("/personal/order/cart/cart_elm_count.php", {}, function(res) {
			var free_delivery = $('#MinSumma').val();
			var cart_info = res.split('|');
			$('.cart_items').text(cart_info[0]);
			$('.cart_items_quantity').text(cart_info[2]);
			$('.cart_summ').text(number_format(cart_info[1], 2, '.', ' '));
			 
			user_store = $('.user_store').val();
			summ_main = parseInt(cart_info[3],10);
			summ_region = parseInt(cart_info[4],10);
			
			if(summ_main > 0){
				$('.cart_delivery_main').text('бесплатная с центрального склада');
				/*
				if(summ_main >= free_delivery){
					$('.cart_delivery_main').text('бесплатная с центрального склада');
				}
				else{
					$('.cart_delivery_main').text('самовывоз с центрального склада');
				}
				*/				
			}
			else{
				$('.cart_delivery_main').text(' ');
				$('.cart_delivery').css('margin-top', '-8px');
			}
			if(summ_region > 0){
				$('.cart_delivery_user').text('самовывоз с регионального склада');
				/*
				if(summ_region >= free_delivery){
					$('.cart_delivery_user').text('бесплатная с регионального склада');
					//$('.cart_delivery_'+user_store).text('бесплатная с регионального склада');
				}
				else{
					$('.cart_delivery_user').text('самовывоз с регионального склада');
					//$('.cart_delivery_'+user_store).text('самовывоз с регионального склада');
				}
				*/				
			}
			else{
				if(user_store != '1'){
					$('.cart_delivery_user').text(' ');
					//$('.cart_delivery_'+user_store).text(' ');
					$('.cart_delivery').css('margin-top', '8px');
				}
			}
			
			if(summ_main > 0 && summ_region > 0){
				$('.cart_delivery').css('margin-top', '0px');
			}
			
			if(parseInt(cart_info[0],10) === 0){
				$('.cart').hide();
			}
			else{
				$('.cart').show();
				$(window).scroll();
			}
		}, "html");		
	}
}

//Поиск по сайту
function fS(elem)
{
  if (elem.value === 'Поиск по сайту')
	  elem.value='';
}
function bS(elem)
{
  if (elem.value === '')
	  elem.value='Поиск по сайту';
}

//Установка маркеров с расположением офисов на карту
var mapMarker; 	
var mapSetMarker = function(lat, lng, elem, show_infowindow) {

	var myLatlng = new google.maps.LatLng(lat,lng);
	var mapObj = GLOBAL_arMapObjects['mapContacts'];
	google.maps.event.trigger(mapObj,'resize');

	if( typeof mapMarker != 'undefined' )
	{
		mapMarker.setMap(null);
	}

	if(show_infowindow)
	{
		var infowindow = new google.maps.InfoWindow({
			content: '<div><b>'+elem.attr('data-officetype')+'</b><br /><p>'+elem.attr('data-address')+'</p><br /><p>'+elem.attr('data-phones')+'</p><br /><p>'+elem.attr('data-emails')+'</p></div>'
		});
	}
	
	mapMarker = new google.maps.Marker({
	  position: myLatlng,
	  icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', //'/bitrix/templates/bagoria/i/apartment.png'
	  map: mapObj
	});

	if(show_infowindow)
	{
		//google.maps.event.addListener(mapMarker, 'click', function() {
			infowindow.open(mapObj, mapMarker);
		//});
	}

	mapObj.setCenter(myLatlng);
	mapObj.setZoom(12);

};

//Форматирование чисел для отображения пользователю в виде "XX XXX XXX"
function number_format(number, decimals, dec_point, thousands_sep){
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
	prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	s = '',
	toFixedFix = function (n, prec) {
	  var k = Math.pow(10, prec);
	  return '' + Math.round(n * k) / k;
	};
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
	s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
	s[1] = s[1] || '';
	s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

//Вывод всплывающего сообщения, исчезающего через заданное время
//http://pjdietz.com/jquery-plugins/freeow/ 
function infoWindow(message){
	
	var opts, container;
	
	opts = {};
	opts.classes = ['smokey'];
	opts.prepend = false;
	opts.classes.push("slide");
	opts.hideStyle = {
		opacity: 0,
		left: "400px"
	};
	opts.showStyle = {
		opacity: 1,
		left: 0,
		top: 100
	};
	if($('#freeow-tr').length !== 0){
		$('#freeow-tr').freeow('', message, opts);
	}
	else{
		$("body").append('<div id="freeow-tr" class="freeow freeow-top-right"></div>');
		$('#freeow-tr').freeow('', message, opts);
	}
}

//Проверка, является ли целым не дробным числом
function isPositiveNumber(num) {
	var positive = false;
	var number   = false;
	
	if( Math.max(0, num) == num ) { positive = true; }
	if( Math.ceil(num) == num )   { number   = true; }
	if( positive && number ) { return true; } else { return false; }
}

function formatStoreAmount(amount)
{
	limit = parseInt($('#displayQuantityLimit').val(),10);
	if( amount > limit ){
		return ">"+limit;
	}
	return amount;
}

//Обновление информации о товаре в корзине после изменения параметров (количества)
function cartUpdate(_prod_id, _store_id, _quantity_diff, send_type) {
	
	if(_store_id == '1'){
		_store_cart =  $('#cart-tabs-1');
		_store_tab  = 1;
	}
	else{
		_store_cart =  $('#cart-tabs-2');
		_store_tab  = 2;
	}
	var product     = $('#product_'+_prod_id, _store_cart);
	_element_id     = product.attr('element_id');
	_prod_name      = product.attr('product_name');
	_prod_brand     = product.attr('product_brand');
	_prod_model     = product.attr('product_model');
	_prod_price     = product.attr('product_price');
	_prod_discount  = product.attr('product_discount');
	_prod_category  = product.attr('product_category');
	_prod_group     = product.attr('product_group');
	_prod_diametr   = product.attr('product_diametr');
	_store_id       = product.attr('store_id');
	_code_1c        = product.attr('code_1c');
	_store          = product.attr('store');
	_user_store     = $("input[name=USER_STORE]").val();
	_order_type     = product.attr('order_type'); 
	/*
	if(_store_id == _user_store){
		//_store_quantity_2 = _store_quantity_1;// + parseInt(_quantity_diff, 10);
		_store_cart =  $('#cart-tabs-2');
		_store_tab  = 2;		
	}
	else{
		//_store_quantity_1 = _store_quantity_1;// + parseInt(_quantity_diff, 10);
		_store_cart =  $('#cart-tabs-1');
		_store_tab  = 1;		
	}
	*/	
	//_store_quantity_1 = parseInt(product.attr('store_quantity_1'),10);
	//_store_quantity_2 = parseInt(product.attr('store_quantity_2'),10);	
	_store_quantity_1 = parseInt($('#store_quantity_1_'+_element_id, _store_cart).val(),10);
	_store_quantity_2 = parseInt($('#store_quantity_2_'+_element_id, _store_cart).val(),10);
	
	_prod_quantity = parseInt($('#counter_'+_element_id, _store_cart).val(), 10);

	_old_quantity  = parseInt($('#old_counter_'+_element_id, _store_cart).val(),10);
	// alert('_prod_id: '+_prod_id+' _store_id: '+_store_id+' _prod_quantity: '+_prod_quantity+' _old_quantity: '+_old_quantity+' _store_quantity_1: '+_store_quantity_1+' _quantity_diff: '+_quantity_diff+' send_type: '+send_type);
		
	STORES = new Array();
	STORES[1] = 'Барановичи';
	STORES[2] = 'Гомель';
	STORES[3] = 'Брест';
	STORES[4] = 'Витебск';
	STORES[5] = 'Гродно';
	STORES[6] = 'Минск';
	STORES[7] = 'Могилёв';		
	
	/*		
	$.ajax({
		async: false,
		type: 'GET',
		url: "/personal/order/cart/cart_update.php",
		data: {'element_id': _element_id , 'product_id': _prod_id , 'product_price' : _prod_price, 'product_discount' : _prod_discount, 'product_quantity' : _prod_quantity, 'quantity_diff' : _quantity_diff , 'product_name' : _prod_name, 'product_brand' : _prod_brand, 'product_diametr' : _prod_diametr, 'product_model' : _prod_model,  'product_category' : _prod_category, 'product_group' : _prod_group, 'store' : _store, 'store_id' : _store_id, 'code_1c' : _code_1c, 'store_quantity_1' : _store_quantity_1, 'store_quantity_2' : _store_quantity_2, 'type' : send_type },
		dataType: 'text'
	}).done(function(res) {
		alert(res);	
	});			
	*/
	$.ajax({
		async: false,
		type: 'GET',
		url: "/personal/order/cart/cart_update.php",
		data: {'element_id': _element_id , 'product_id': _prod_id , 'product_price' : _prod_price, 'product_discount' : _prod_discount, 'product_quantity' : _prod_quantity, 'old_quantity' : _old_quantity, 'quantity_diff' : _quantity_diff , 'product_name' : _prod_name, 'product_brand' : _prod_brand, 'product_diametr' : _prod_diametr, 'product_model' : _prod_model,  'product_category' : _prod_category, 'product_group' : _prod_group, 'store' : _store, 'store_id' : _store_id, 'code_1c' : _code_1c, 'store_quantity_1' : _store_quantity_1, 'store_quantity_2' : _store_quantity_2, 'type' : send_type, 'order_type' : _order_type },
		dataType: 'text'
	}).done(function(res) {
		result = res.split('|');
		if(result[0] === 'false'){	
			if(isNaN(parseInt(result[1],10))){
				if(send_type === 'inc' || send_type === 'desc'){
					$('#counter_'+_element_id, _store_cart).val(_prod_quantity + _quantity_diff);
					$('#old_counter_'+_element_id, _store_cart).val(_prod_quantity + _quantity_diff);
				}			
				infoWindow('Вами превышен лимит на заказ товаров '+result[1]+'. Уменьшите количество позиций товаров этого бренда или добавьте позиции других брендов в заказ.');
			}
			else{
				$('#counter_'+_element_id, _store_cart).val(result[1]);
				$('#old_counter_'+_element_id, _store_cart).val(result[1]);
				infoWindow('Данный товар можно заказать только в количестве до '+result[1]+' штук. Уточните возможность заказа большего количества у <a style="color: #ABCDEF;" href="/contacts/#'+STORES[_store_id]+'">специалиста по продажам.');
			}
			$('#request_result').val('true');
			$('#info_popup').val('false');
		}
		else{
			if(send_type === 'inc' || send_type === 'desc'){
				$('#counter_'+_element_id, _store_cart).val(_prod_quantity + _quantity_diff);
			}
			$('#request_result').val('true');
			$('#info_popup').val('true'); 
		}		
	});		
		
	//$('#request_result').val('false');
	//return false;
	
	/*
	$.get("/personal/order/cart/cart_update.php", {  'element_id': _element_id , 'product_id': _prod_id , 'product_price' : _prod_price, 'product_discount' : _prod_discount, 'product_quantity' : _prod_quantity, 'quantity_diff' : _quantity_diff , 'product_name' : _prod_name, 'product_brand' : _prod_brand, 'product_diametr' : _prod_diametr, 'product_model' : _prod_model,  'product_category' : _prod_category, 'product_group' : _prod_group, 'store' : _store, 'store_id' : _store_id, 'code_1c' : _code_1c, 'store_quantity_1' : _store_quantity_1, 'store_quantity_2' : _store_quantity_2, 'type' : type }, function(res) {
		result = res.split('|');
		if(result[0] === 'false'){	
			if(isNaN(parseInt(result[1],10))){
				infoWindow('Вами превышен лимит на заказ товаров '+result[1]+'. Уменьшите количество позиций товаров этого бренда или добавьте позиции других брендов в заказ.');
			}
			else{
				infoWindow('Данный товар можно заказать только в количестве до '+result[1]+' штук. Уточните возможность заказа большего количества у <a style="color: #ABCDEF;" href="/contacts/#'+STORES[_store_id]+'">специалиста по продажам.');
			}
			$('#request_result').val('false');
		}
		else{
			$('#request_result').val('true');
		}
	}, "html");	
	*/
}

//Проверка на достаточную сумму заказа для бесплатной доставки
function review_basket(_store_id) {

	var overall_summ = parseInt($('#overall_summ_'+_store_id).val(),10);
	var free_delivery_summ = parseInt($('#MinSumma').val(),10);
	
	var overall_quantity = parseInt($('#overall_quantity_'+_store_id).val(),10);
	var free_delivery_quantity = parseInt($('#MinTovarov').val(),10);
	
	var delivery_status = '';
	
	if(overall_summ >= free_delivery_summ && overall_quantity >= free_delivery_quantity){
		if(parseInt(_store_id, 10) === 1){
			delivery_status = 'бесплатно с Центрального склада (Барановичи)';
		}
		else{
			store_name = $('#store_'+_store_id+'_name').val();
			delivery_status = 'самовывоз с регионального склада ('+store_name+')';
			//delivery_status = 'бесплатно с регионального склада ('+store_name+')';
		}	
		$('input[name="DELIVERY"]').val(1);
	}
	else{
		if(parseInt(_store_id, 10) === 1){
			delivery_status = 'бесплатно с Центрального склада (Барановичи)';
			//delivery_status = 'самовывоз с Центрального склада (Барановичи)';
		}
		else{
			store_name = $('#store_'+_store_id+'_name').val();
			delivery_status = 'самовывоз с регионального склада ('+store_name+')';
		}
		
		$('input[name="DELIVERY"]').val(2);
	}
	
	$('.delivery_status').each(function(){
		$(this).text(delivery_status);
	});			
	
}

//Проверка списка товаров в корзине согласно существующим в системе лимитам
function check_limits() {

	limits = [];
	i = 0;

	$('.limits').each(function(){
		//limits[i]['']
		//group="Диски" category="Легкогруз." brand="" diametr="" value="20" type="Количество"
		i = i + 1;
	});	

	$('.product_info').each(function(){
		
		type     = $(this).attr('product_type');
		value    = $(this).attr('name');
		price    = $(this).attr('price');
		quantity = $(this).attr('quantity');
		
	});		

}

function wait() {
	
}

//Очистка выбранных значений для связанных селектов
function reset_chained_selects(type) {
	if(type.length){
	  filter = 'select.chained_select[select_code='+type+']';
	}
	else{
	  filter = 'select.chained_select';
	}
	$(filter).each(function(i,select){			  
	  $('select[name='+$(select).attr('name')+'] option').each(function(i,option){
		  $(option).removeAttr('selected');
		  $(option).removeAttr('disabled');
		  $(option).removeClass('hidden');
	  });		   
	  if($(select).hasClass('forward_select')){
		if($(select).attr('pos') == 'first'){
			$(select).removeAttr('disabled');
			$(select).removeClass('disabled');
		}
		else{
			$(select).attr('disabled','disabled');
			$(select).addClass('disabled');			
		}
		if($(select).attr('pos') == 'last'){
		  name = $(select).attr('default');
		  $(select).html('<option value="">'+name+'</option>');
		}
	  }	  
	  $(select).removeClass('set');
	  $('a[type='+type+']').addClass("disabled");	
	});	 
} 

//Очистка выбранных значений для связанных селектов с запросом к БД
function reset_chained_selects_db() {
	$('select.chained_select_db').each(function(i,select){			  
	  pos = $(select).attr('pos')
	  select_code = $(select).attr('select_code');
	  switch (pos) {
		case 'first':	 
		  $('select[name='+$(select).attr('name')+'] option').each(function(i,option){
			  $(option).removeAttr('selected');
		  });			  
		  break;
		default:
		  default_option = $(select).attr('default');
		  $(select).html('<option value="">'+default_option+'</value>');
		  $(select).attr('disabled','disabled'); 
		  $(select).addClass('disabled');  
		  break;
	  }	
	});	 
} 

function check_chained_select(form_id){
	$select_code = $('#'+form_id).attr('type');
	if(!$('select[pos=last][select_code='+select_code+']').hasClass("disabled")){
		$('#'+form_id).submit();
	};
}

function openbox(id){
	var display = document.getElementById(id).style.display;
	if(display=='none'){
		document.getElementById(id).style.display='block';
		}else{
		document.getElementById(id).style.display='none';
	}
}

// увеличиваем картинку при наведении в каталоге
$(function () {

	$('.productsGrid .pic img').hover(function () {
		
		if ($(this).is('.noPhoto')) return false;

		!$(this).data('width') ? $(this).data('width', $(this).width()) : false;
		!$(this).data('height') ? $(this).data('height', $(this).height()) : false;
		
		if ($(this).width() > $(this).height()) {
			
			var _newWidth = 200,
				_newHeight = $(this).data('height') * 200 / $(this).data('width'),
				_top = _newHeight / 2 - $(this).data('height') / 2,
				_left = _newWidth / 2 - $(this).data('width') / 2;
			
		}
		else {
			var _newHeight = 200,
				_newWidth = $(this).data('width') * 200 / $(this).data('height'),
				_top = _newHeight / 2 - $(this).data('height') / 2,
				_left = _newWidth / 2 - $(this).data('width') / 2;
		}
		
		$(this)
			.addClass('hover')
			.stop(true, false)
			.animate({
				width: _newWidth,
				height: _newHeight,
				'margin-left': -_left,
				'margin-top': -_top
			});
		
	}, function () {
		
		if ($(this).is('.noPhoto')) return false;
		
		$(this)
			.stop(true, false)
			.animate({
				width: $(this).data('width'),
				height: $(this).data('height'),
				'margin-left': 0,
				'margin-top': 0
			}, function () {
				$(this).removeClass('hover');
			})
		
	});

	// new
	var $photoPreview = $('.photoPreview');
	if(window.innerWidth > 1023) {
		$photoPreview.mouseout(function () {
			$(this).removeClass('hovers');
		});

		$photoPreview.click(function () {
			$('.photoPreview').removeClass('hovers');
			$(this).addClass('hovers');
		});

		$photoPreview.find('img').click(function () {
			$('.photoPreview').removeClass('hovers');
			return false;
		});
	} else {
		$.each($photoPreview, function () {
			$(this).append('<div class="close">x</div>')
		});

		$photoPreview.on('click', function () {
			if($(this).hasClass('hovers')){
				$(this).removeClass('hovers');
				return;
			}

			$photoPreview.removeClass('hovers');
			$(this).addClass('hovers');
		});
	}

	$photoPreview.on('click', '.close', function (e) {
		e.stopPropagation();
		$(this).closest($photoPreview).removeClass('hovers');
	});
	// new end

	if($.browser.version <= 15.0 && $.browser.opera == true){
		function widthContent(){
			var width = $('.wrapper').width();
			 $('.wrapper .content').width(width-340);
		}
		$(window).resize(function(){
			if($(window).width() <= 1007){
				$('.wrapper .content').css('width','auto');
			}
			else{
				widthContent();
			}
		});

		if($(window).width() >= 1007){
			widthContent();
		}
		else{
			$('.wrapper .content').css('width','auto');
		}

	}
});

/* add for mobile */

/**
 * !device detected
 * */
var DESKTOP = device.desktop();
//console.log('DESKTOP: ', DESKTOP);
var MOBILE = device.mobile();
//console.log('MOBILE: ', MOBILE);
var TABLET = device.tablet();
//console.log('MOBILE: ', MOBILE);
/*device detected end*/

$(function () {

	/**
	 * !Equal height of blocks by maximum height of them
	 */
	function equalHeight() {
		// location thumbs
		var $location = $('.location');

		if($location) {
			$location.children().not('.mapWrap').matchHeight({
				byRow: true, property: 'height', target: null, remove: false
			});
		}

		// intro
		var $intro = $('.intro');

		if($intro) {
			$intro.children().not('script').not('.iCatalogue').matchHeight({
				byRow: true, property: 'height', target: null, remove: false
			});
		}

		// tabs
		var $tabs = $('.fTabs');

		if($tabs) {
			$tabs.children().matchHeight({
				byRow: true, property: 'height', target: null, remove: false
			});
		}

		// table-resp
		// var $tableRespRow = $('.table-resp tr');
		//
		// if($tableRespRow) {
		// 	$tableRespRow.children().matchHeight({
		// 		byRow: true, property: 'height', target: null, remove: false
		// 	});
		// }
	}

	equalHeight();

	/**
	 * Toggle mobile main menu
	 */
	function toggleMenu() {

		var $container = $('html');
		var $menu = $('.main-menu-js');
		var $menuOpener = $('.btn-menu-js');
		var $menuCloser = $('.btn-menu-close-js');
		var openClass = 'menu-is-open';

		$menuOpener.on('click', function (e) {

			e.preventDefault();
			var $currentContainer = $(this).closest($container);

			e.stopPropagation();

			if ($currentContainer.hasClass(openClass)) {
				closeMenu();
				return;
			}

			openMenu();
		});

		$menuCloser.on('click', function (e) {

			e.preventDefault();

			e.stopPropagation();

			closeMenu();
		});

		// $(document).on('click', function () {
		// 	closeDrop();
		// });

		$(document).keyup(function(e) {
			if ($menu.hasClass(openClass) && e.keyCode === 27) {
				closeMenu();
			}
		});

		$menu.on('closeChoiceDrop', function () {
			closeMenu();
		});

		function closeMenu() {
			$menu.removeClass(openClass);
			$menuOpener.removeClass(openClass);
			$container.removeClass(openClass);
		}

		function openMenu() {
			$menu.addClass(openClass);
			$menuOpener.addClass(openClass);
			$container.addClass(openClass);
		}

	}

	toggleMenu();

	/**
	 * !Collapse and expand blocks by fire events on the title of these blocks
	 */
	function simpleAccordion() {
		function simpleAccordion($hand, $panel, animateSpeed) {
			var activeClass = 'is-open';

			$.each($hand, function () {
				var $this = $(this);

				if ($this.hasClass(activeClass)) {
					$this.next().addClass(activeClass);
				}
			});

			$hand.on('click', function (e) {
				e.preventDefault();

				var $thisOpener = $(this);
				$thisOpener.toggleClass(activeClass);
				$thisOpener.next().toggleClass(activeClass);
			})
		}

		var $topNav = $('.top-nav-mob-js');

		if ($topNav.length) {
			$topNav.each(function () {
				var $thisHand = $(this);
				var $opener = $thisHand.find('.opener-drop-js');

				simpleAccordion($opener, $opener.next(), 200);
			})
		}
	}

	simpleAccordion();

	function filtersTab() {
		var collapsibleValue = window.innerWidth < 1024;

		$('#filter-1').tabs({
			collapsible: collapsibleValue,
			active: 0
		});
	}

	filtersTab();

	/**
	 * !Initial sliders on the project
	 * */
	function slidersInit() {
		/*news slider*/
		var $newsSlider = $('.news-slider-js');

		if ($newsSlider.length) {

			$newsSlider.each(function () {
				var $currentSlider = $(this);
				var dur = 200;

				$currentSlider.on('init', function (event, el) {
					$(el.$slides).matchHeight({
						byRow: true, property: 'height', target: null, remove: false
					});
				}).slick({
					fade: false,
					speed: dur,
					slidesToShow: 4,
					slidesToScroll: 4,
					// autoplay: true,
					// autoplaySpeed: 5000,
					// initialSlide: 2,
					// lazyLoad: 'ondemand',
					infinite: true,
					dots: true,
					arrows: true,

					draggable: false,
					swipe: false,
					touchMove: false,
					accessibility: false,

					responsive: [
						// {
						// 	breakpoint: 320,
						// 	settings: "unslick"
						// },
						{
							breakpoint: 1024,
							settings: {
								draggable: true,
								swipe: true,
								touchMove: true,
								accessibility: true
							}
						},
						{
							breakpoint: 960,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3,
								draggable: true,
								swipe: true,
								touchMove: true,
								accessibility: true
							}
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2,
								draggable: true,
								swipe: true,
								touchMove: true,
								accessibility: true
							}
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
								draggable: true,
								swipe: true,
								touchMove: true,
								accessibility: true
							}
						}
					]
				});

			});
		}
	}

	slidersInit();

	var $respVideo = $('.content iframe[src*="youtube"]');
	if($respVideo.length){
		$respVideo.wrap('<div class="video-wrap"></div>');
		$respVideo.parent().fitVids();
	}

	/** !table zoom */
	var $tableZoom = $('.table-zoom-js');

	$.each($tableZoom, function () {
		var $curTable = $(this);

		$curTable.wrap('<div class="table-zoom-wrap"></div>').addClass('table-zoom-initialized');
		var $curWrap = $curTable.closest('.table-zoom-wrap');

		$curWrap.css({
			'margin-bottom': '' + $curTable.css('margin-bottom') + '',
			'padding-bottom': 2
		});

		var $curTableWidth = $curTable.outerWidth();
		var $curWrapWidth = $curWrap.outerWidth();

		var scale = $curWrapWidth / $curTableWidth;

		$curWrap.css({
			'height': $curTable.outerHeight() * scale
		});

		$curTable.css({
			'-webkit-transform': 'scale(' + scale + ')',
			'-ms-transform': 'scale(' + scale + ')',
			'transform': 'scale(' + scale + ')',
			'-webkit-transform-origin': 'left top',
			'-ms-transform-origin': 'left top',
			'transform-origin': 'left top',
			'margin-bottom': 0
		});
	});

	$(window).on('resize', function () {
		$.each($tableZoom, function () {
			var $curTable = $(this);

			var $curWrap = $curTable.closest('.table-zoom-wrap');

			var $curTableWidth = $curTable.outerWidth();
			var $curWrapWidth = $curWrap.outerWidth();

			var scale = $curWrapWidth / $curTableWidth;

			$curWrap.css({
				'height': $curTable.outerHeight() * scale
			});

			$curTable.css({
				'-webkit-transform': 'scale(' + scale + ')',
				'-ms-transform': 'scale(' + scale + ')',
				'transform': 'scale(' + scale + ')',
				'-webkit-transform-origin': 'left top',
				'-ms-transform-origin': 'left top',
				'transform-origin': 'left top',
				'margin-bottom': 0
			});
		});
	});

	var closeBtnTpl = $('<div class="btn-close btn-close-findOutPriceBox"></div>');
	$('#callme').on('click', function (e) {
		e.preventDefault();
		if($('.btn-close-findOutPriceBox').length === 0){
			closeBtnTpl.clone().insertAfter($('#findOutPriceBox'));
		}
	});

	$(document).on('mouseup', function (e) {
		if ($(e.target).closest('#findOutPriceBox').length) return;
		$('.btn-close-findOutPriceBox').remove();
		e.stopPropagation();
	});

	// wrap table to table-mob-wrap
	var tableMob = $('.table-mob');

	$.each(tableMob, function () {
		$(this).wrap('<div class="table-mob-wrap"></div>');
	});

	// sorting
	var $select = $('select', $('.catalog_sort_by'));

	$.each($select, function () {
		$(this).wrap('<div class="select"></div>');
	});

	function changeSelect(select) {
		var $option = $('option', select);
		$.each($option, function () {
			var $thisOption = $(this);
			$thisOption.show().text($thisOption.attr('data-content'));
		});

		var $selectedOption = $('option:selected', select);
		var text = $selectedOption.text();
		$selectedOption.attr('data-content', text).text('Сортировать: ' + text).hide();
	}

	if(window.innerWidth < 1024) {
		$.each($select, function () {
			var $curSelect = $(this);
			changeSelect($curSelect);
		});

		$select.on('change', function () {
			var curSelect = $(this);
			changeSelect(curSelect);
		})
	}
});




/* add for mobile end */