<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
require_once($_SERVER['DOCUMENT_ROOT'].'/bitrix/templates/bagoria/artem.php');

IncludeTemplateLangFile(__FILE__);
//$wizTemplateId = COption::GetOptionString("main", "wizard_template_id", "eshop_vertical", SITE_ID);
CUtil::InitJSCore();
CJSCore::Init(array("jquery"));
$curPage = $APPLICATION->GetCurPage(true);
?>
<!DOCTYPE html>
<!--[if IE 8]><html lang="ru" class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html lang="ru" class="no-js"><!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<title><?$APPLICATION->ShowTitle()?></title>
		<?
		$APPLICATION->ShowMeta("robots", false, true);
		$APPLICATION->ShowMeta("keywords", false, true);
		$APPLICATION->ShowMeta("description", false, true);
		$APPLICATION->ShowCSS(true, true);	
		?>
		<meta name="viewport" content="width=device-width">
		<meta name="cmsmagazine" content="2833beba4b7fe5ca49273880fa1f1495" />
		<link rel="stylesheet" type="text/css" href="/bitrix/templates/bagoria/css/freeow/freeow.css" />
		<link rel="stylesheet" type="text/css" href="<?=CUtil::GetAdditionalFileURL(SITE_TEMPLATE_PATH."/css/fonts.css")?>" />
		<link rel="stylesheet" type="text/css" href="<?=CUtil::GetAdditionalFileURL(SITE_TEMPLATE_PATH."/css/main.css")?>" />
		<link rel="stylesheet" type="text/css" href="<?=CUtil::GetAdditionalFileURL(SITE_TEMPLATE_PATH."/css/artem.css")?>" />
		<link href="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/css/select2.min.css" rel="stylesheet" />
		<!-- <link rel="stylesheet" type="text/css" href="<?=CUtil::GetAdditionalFileURL(SITE_TEMPLATE_PATH."/css/jquery-ui-1.7.2.custom.css")?>" /> -->
		<link rel="shortcut icon" type="image/x-icon" href="<?=SITE_TEMPLATE_PATH?>/favicon.ico" />
		<!--[if lt IE 8]><link rel="stylesheet" href="<?=SITE_TEMPLATE_PATH?>/css/oldie.css"><![endif]-->
		<script type="text/javascript">
			_is_ie7 = false;
		</script>
		<!--[if IE 7]>
		<script type="text/javascript">
			_is_ie7 = true;
		</script>
		<![endif]-->
		<?$APPLICATION->ShowHeadStrings();?>
		<?$APPLICATION->ShowHeadScripts();?>
		<?
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/jquery-1.8.3.min.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/modernizr.custom.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/jquery.carouFredSel-6.2.1-packed.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/jquery.scrollTo-1.4.3.1-min.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/jquery-ui.min.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/jquery.mask.min.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/main.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/artem.js");
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/ui.datepicker-ru.js");
		//$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH."/js/jquery.datePicker.js");
		?>	
		<!--[if lt IE 9]><script scr="js/html5.js"></script><![endif]-->
		<script src="/bitrix/templates/bagoria/js/freeow/jquery.freeow.min.js"></script>
		<script src="/bitrix/templates/bagoria/js/jquery.cookie.js"></script>
		<script src="/bitrix/templates/bagoria/js/jquery.countdown.min.js"></script>
		<script src="/bitrix/templates/bagoria/js/jquery.countdown-ru.js"></script>
		<script src="http://maps.google.com/maps/api/js?sensor=false&language=ru" charset="utf-8"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/js/select2.min.js"></script>
		<?//$APPLICATION->ShowHead();
		echo '<meta http-equiv="Content-Type" content="text/html; charset='.LANG_CHARSET.'"'.(true ? ' /':'').'>'."\n";
		?>
		<link rel="shortcut icon" href="<?=SITE_TEMPLATE_PATH?>/i/favicon.ico" type="image/x-icon">
		<link rel="icon" href="<?=SITE_TEMPLATE_PATH?>/i/favicon.ico" type="image/x-icon">
		
		<!-- Google Tag Manager -->
		<script data-skip-moving="true">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-5L9WPFM');</script>
		<!-- End Google Tag Manager -->
	</head>
	<body <?if($APPLICATION->GetCurDir() != '/'):?> class="inside<? if(strpos($_SERVER['REQUEST_URI'], "/catalog/") !== false): ?> floatSidebar<? endif; ?>" <?endif?>>
	
		<?$APPLICATION->ShowPanel();?>

		<!-- Google Tag Manager (noscript) -->
		<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5L9WPFM"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<!-- End Google Tag Manager (noscript) -->
		
		<script type="text/javascript">
			chained_select    = [];
			chained_props     = [];
			chained_props_alt = [];
		</script>
	
		<div class="wrapper">
			<header class="header">
				<a href="/"><div class="logo" title="Оптовый поставщик шин и дисков в РБ. Купить автомобильные шины по безналу в Минске" alt="Шины. Диски. Аккумуляторы - СООО «Багория»">Багория</div></a>
				<?
				$APPLICATION->IncludeComponent('bitrix:menu', "top_horizontal", array(
						"ROOT_MENU_TYPE" => "top",
						"MENU_CACHE_TYPE" => "N",
						//"MENU_CACHE_TIME" => "36000000",
						//"MENU_CACHE_USE_GROUPS" => "Y",
						//"MENU_CACHE_GET_VARS" => array(),
						"MAX_LEVEL" => "2",
						"USE_EXT" => "N",
						"ALLOW_MULTI_SELECT" => "Y",
						"CHILD_MENU_TYPE" => "podmenu"
					)
				);
				?>
				<?
					global $USER;

					if ($USER->IsAuthorized()):
						
						$rsUser = CUser::GetByID($USER->GetID());
						$arUser = $rsUser->Fetch();
						
						getOrderFreezeInfo();
						
						/*
						$last_login = $arUser['LAST_LOGIN'];
						$exp = explode(" ", $last_login);
						$exp2 = explode(".", $exp[0]);
						$exp3 = explode(":", $exp[1]);
						$last_login_time = mktime($exp3[0],$exp3[1],$exp3[2], $exp2[1],$exp2[0],$exp2[2]);
						$timeleft = ($last_login_time+7200)-time();
						$expire_time = ($last_login_time+7200);
						if($timeleft <= 0) {
							//header('Location: /personal/logout/');
							//exit;
						}
						if($timeleft > 0):
				?>
			<? /*
				<script type="text/javascript">
					$(document).ready(function(){
						$('#timeleft').countdown({until: new Date(<? echo $expire_time*1000 ?>), 
						    format: 'hms',layout: '<b>{h<}{hn} {hl} {h>}{m<}{mn} {ml} {m>}{s<}{sn} {sl}{s>}</b> до конца сессии',
						    expiryText: '<b>время сессии истекло</b>'});
					});
				</script> ?>
					<? endif; */ ?>
				<a href="/personal/order/" class="userLink"><?=$arUser['UF_LEGAL_NAME']?></a>
				<a href="/personal/logout/" class="userLogout" title="Выход"><img src="/bitrix/templates/bagoria/i/exit.png"></a>
				<!--<div id="timeleft" class="userExpire"></div>-->
				<? else: ?>
					<span class="enterLink">Вход для клиентов</span>
					<form action="/personal/auth/" method="post" id="login_form">
						<div class="auth">
							<div class="column">
								<div class="label">Электронная почта:</div>
								<input type="email" name="email">
							</div>
							<div class="column">
								<div class="label">Пароль:</div>
								<input type="password" name="password">
							</div>
							<div class="column">
								<div style="position: absolute; top: -10000px;"><input type="submit"></div>
								<a href="javascript:void(0);" onClick="$('#login_form').submit(); return false;" class="btn">Войти</a>
							</div>
							<div class="clear"><!-- --></div>
							<div class="meta">
								<div class="links">
									<a href="/personal/lostpassword">Забыли пароль?</a>
									<a href="/personal/registration/">Регистрация</a>
								</div>
								<input type="checkbox" id="remember-me"> <label for="remember-me">Не выходить из системы</label>
							</div>
						</div>
					</form>
				<? endif; ?>
			</header>
			<?if($APPLICATION->GetCurDir() == '/'):?>
				<div class="intro" id="intro-catalogue">
					<nav class="catalogue">
						<div class="title">Каталог</div>
						<ul>
							<li><a href="#catalogue-1">Легковые шины</a></li>
							<li><a href="#catalogue-2">Грузовые шины</a></li>
							<li><a href="#catalogue-3">Легковые диски</a></li>
							<li><a href="#catalogue-4">Аккумуляторы</a></li>
							<li><a href="#catalogue-5">Шиноремонтные материалы и крепеж дисков</a></li>
							<!--<li><a href="#catalogue-6">Крепежные элементы</a></li>-->
							<li><a href="#catalogue-7">Шины, камеры и ободные ленты для спецтехники и погрузчиков</a></li>
						</ul>
						<!--<span class="more"><span>Весь каталог</span></span>-->
					</nav>
					
					<?
					$APPLICATION->IncludeComponent("bitrix:news.list","promo",Array(
						"IBLOCK_TYPE" => "content",
						"IBLOCK_ID" => 9,
						"NEWS_COUNT" => "5",
						"SORT_BY1" => "SORT",
						"SORT_ORDER1" => "ASC",
						"FIELD_CODE" => Array("ID","NAME","ACTIVE_FROM","PREVIEW_PICTURE", "DETAIL_PICTURE","PROPERTY_TITLE","PROPERTY_TEXT"),
						"CHECK_DATES" => "N",
						"SET_TITLE" => "N",
						"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
						"ADD_SECTIONS_CHAIN" => "N",
						"INCLUDE_SUBSECTIONS" => "Y",
						"DISPLAY_TOP_PAGER" => "N",
						"DISPLAY_BOTTOM_PAGER" => "N")
					);
					
					$SECTIONS_INFO = getDescrSection();
					 
					//Получаем переменные с js-хэшами соответствия заданных связанных селектов
					echo getFilterChainedSelect('shini', $SECTIONS_INFO["Шины"], "Легко%", array('SHIRINASHINADISK'=>'width','SERIYASHINA'=>'height','DIAMETRSHINADISK'=>'diametr')); 
					echo getFilterChainedSelect('diski', $SECTIONS_INFO["Диски"], FALSE, array('BOLTOVDISK'=>'pcd1','RASSTOYANIEDISK'=>'pcd2')); 
					echo getFilterChainedSelect('industrial_params', $SECTIONS_INFO["Шины"], "Индустр%", array('NORMASLOYNOSTI' =>'ply_rating',  'INDEKSNAGRUZKI' =>'index', 'FIELD_NAME'=>'size')); 
					$tires_car = getFilterChainedSelectExt('tires_car', array('vendor'=>'mark','car'=>'model','year'=>'year','modification'=>'modification'), array('zavod_shini'=>'zavod_shini','zamen_shini'=>'zamen_shini','tuning_shini'=>'tuning_shini')); 					
					$wheels_car = getFilterChainedSelectExt('wheels_car', array('vendor'=>'mark','car'=>'model','year'=>'year','modification'=>'modification'), array('zavod_diskov'=>'zavod_diskov','zamen_diskov'=>'zamen_diskov','tuning_diski'=>'tuning_diski'));
					$battery = getFilterChainedSelectExt('battery', array('vendor'=>'mark','car'=>'model','modification'=>'modification'), array('date_start'=>'date_start', 'date_end'=>'date_end', 'emkost_ot'=>'emkost_ot', 'emkost_do'=>'emkost_do', 'tok_xol_prok'=>'tok_xol_prok', 'diametr_klem'=>'diametr_klem', 'polarnost'=>'polarnost'));
					$industrial_type = getFilterChainedSelectExt('industrial_type', array('vendor'=>'manufacturer','model'=>'models'), array('size'=>'tiporazmer'));				
					echo $industrial_type['script']; 
					$chained_select['industrial_type'] = $industrial_type['array'];
					echo $battery['script'];
					echo $wheels_car['script'];
					echo $tires_car['script'];
					?>	
					<div class="iCatalogue ui-tabs-hide" id="catalogue-1">
						<a href="#" class="close"></a>
						<? $APPLICATION->IncludeComponent("astronim:catalog.filter", "tires_car", array('filter_id' => 1)); ?>
						<? $APPLICATION->IncludeComponent("astronim:catalog.novelties", ".default", array('category' => '/catalog/tires/car')); ?>
					</div>
					<div class="iCatalogue ui-tabs-hide" id="catalogue-2">
						<a href="#" class="close"></a>
						<? $APPLICATION->IncludeComponent("astronim:catalog.filter", "tires_truck", array('category' => 'truck', 'form_action' => '/catalog/tires/truck/')); ?>
						<? $APPLICATION->IncludeComponent("astronim:catalog.novelties", ".default", array('category' => '/catalog/tires/truck')); ?>
					</div>	
					<div class="iCatalogue ui-tabs-hide" id="catalogue-3">
						<a href="#" class="close"></a>
						<? $APPLICATION->IncludeComponent("astronim:catalog.filter", "wheels", array('category' => 'wheels', 'form_action' => '/catalog/wheels/')); ?>
					</div>	
					<div class="iCatalogue ui-tabs-hide" id="catalogue-4">
						<a href="#" class="close"></a>
						<? $APPLICATION->IncludeComponent("astronim:catalog.filter", "battery", array('category' => 'battery', 'form_action' => '/catalog/battery/')); ?>
						<? $APPLICATION->IncludeComponent("astronim:catalog.novelties", ".default", array('category' => '/catalog/battery')); ?>
					</div>	
					<div class="iCatalogue ui-tabs-hide" id="catalogue-5">
						<a href="#" class="close"></a>
						<? $materials_cats = getMaterialsCats();
						   $APPLICATION->IncludeComponent("astronim:catalog.filter", "materials", array('category' => 'materials', 'form_action' => '/catalog/materials/', 'materials_cats' => $materials_cats)); ?>
					</div>
					<div class="iCatalogue ui-tabs-hide" id="catalogue-6">
						<a href="#" class="close"></a>
						<? $APPLICATION->IncludeComponent("astronim:catalog.filter", "fasteners", array('category' => 'fasteners', 'form_action' => '/catalog/fasteners/')); ?>
					</div>		
					<div class="iCatalogue ui-tabs-hide" id="catalogue-7">
						<a href="#" class="close"></a>
						<? $APPLICATION->IncludeComponent("astronim:catalog.filter", "tires_industrial", array('category' => 'industrial', 'form_action' => '/catalog/tires/industrial/', 'CHAINED_SELECT'=>$chained_select)); ?>    
					</div>		
				</div>
				<div class="location" id="location">
					<?$APPLICATION->IncludeComponent("bitrix:news.list","maps_main",Array(
						"IBLOCK_TYPE" => "content",
						"IBLOCK_ID" => 10,
						"NEWS_COUNT" => "20",
						"SORT_BY1" => "SORT",
						"SORT_ORDER1" => "ASC",
						"FIELD_CODE" => Array("ID","NAME","ACTIVE_FROM",'PROPERTY_CITY','PROPERTY_ADDRESS','PROPERTY_MAP','PROPERTY_STORE','PROPERTY_EMAIL','PROPERTY_PHONE','PROPERTY_PHONE_VELCOM','PROPERTY_PHONE_MTS',),
						"CHECK_DATES" => "Y",
						"SET_TITLE" => "N",
						"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
						"ADD_SECTIONS_CHAIN" => "N",
						"INCLUDE_SUBSECTIONS" => "Y",
						"DISPLAY_TOP_PAGER" => "N",
						"DISPLAY_BOTTOM_PAGER" => "N",
						"CACHE_TYPE" => "N",
						)
					);?>
				</div>
			<?endif?>
			<section class="content">