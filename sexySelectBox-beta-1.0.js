/*!
 * jQuery sexySelectBox Plugin 
 * Examples and documentation at: https://github.com/d-c-wallace/sexySelectBox
 * Copyright (c) 2011-2012 Inclind Inc. http://www.inclind.com
 * Twitter: @inclindinc
 * Author: Doug Wallace @douglascwallace http://www.dcwallace.com
 * Version: 1.0beta
 * Dual licensed under the MIT and GPL licenses.
 * GPL - http://www.gnu.org/licenses/gpl.html
 * MIT - http://www.opensource.org/licenses/mit-license.php
 * Requires: jQuery v1.3.2 or later
 */


(function( $ ){

	$.fn.sexySelectBox = function() {
		var active = false;
		var scrolling = false;
		var count = 0;
		var scroll = 0;
		var scrollHeight = 0;
		
		this.each(function() {
			var disabled = false;
			if(this.disabled == true){
				disabled = true;
			}
			
			var $this = $(this);
			$this.css('display', 'none');
			$this.attr('count', count);
			init(this, count, disabled);
			count++;
		});

		function init(select, count, disabled){
			var dis = disabled;
			var val = $(select).val();
			var width = $(select).width();
			var list;
			var optgroups = $(select).children('optgroup');
			var text;
			var disClass = '';
			if(optgroups.length > 0){
				list = optGroupLists(select, count);
				text = $(select).children('optgroup').children('option[value="'+val+'"]').text();
				var og = $(select).children('optgroup');
				og.children('option[value="'+val+'"]').addClass('sexyActive');
				
			}else{
				list = optLists(select, count);
				text = $(select).children('option[value="'+val+'"]').text();
				$(select).children('option[value="'+val+'"]').addClass('sexyActive');
			}
			
			if(dis == true){
				disClass = 'disabled';
			}
			
			var cover = 
				'<div id="sexySelect-'+count+'" class="sexySelect '+disClass+'" count="'+count+'">'+
					'<div class="sexySelectCover '+disClass+'" value="'+val+'" count="'+count+'">'+
					'<span class="sexySelectText">'+text+'</span>'+
					'</div>'+
					list+
				'</div>';
			$(select).before(cover);			
		};
		
		//build a list from a select with optgroups
		function optGroupLists(select, count){
			var optgroups = $(select).children('optgroup');
			var list = '<dl class="sexySelectMenu" style="display:none;" count="'+count+'">';
			optgroups.each(function(){
				list += '<dt class="sexySelectOptGroup">'+$(this).attr('label')+'</dt>';
				var options = $(this).children('option');
				options.each(function(){
					list+= '<dd class="sexySelectOpt" value="'+ $(this).val() +'" count="'+count+'">'+ $(this).text() +'</dd>';
				});
			});
			list += '</dl>';
			return list;
		};
		
		//build a list from a select with only options
		function optLists(select, count){
			var options = $(select).children('option');
			var list = '<dl class="sexySelectMenu" style="display:none;" count="'+count+'">';
			options.each(function(){
				list+= '<dd class="sexySelectOpt" value="'+ $(this).val() +'" count="'+count+'">'+ $(this).text() +'</dd>';
			});
			list += '</dl>';
			return list;
		};
		
		//show the list corresponding to the cover that has been clicked or focused
		function show(cover){
			if(!$(cover).hasClass('disabled')){	
				var count = $(cover).attr('count');
				var dl = $('dl[count="'+count+'"]');
				if(active == false){
					$(cover).addClass('sexyActive').focus();
					$('div[count="'+count+'"]').addClass('sexyActive');
					active = true;
					$(dl).children('dd.sexyActive').removeClass('sexyActive');
					$(dl).addClass('sexyActive').fadeIn(function(){
						scrolling = true;
					});	
					$(dl).children('dd:first').addClass('sexyActive');
				}else{
					hide(cover);
				}
			}
		};
			
		//hide the lists
		function hide(cover){
			var count = $(cover).attr('count');
			var dl = $('dl[count="'+count+'"]');
			scrolling = false;
			scroll = 0;
			if(active == true){
				$('div.sexyActive').removeClass('sexyActive');
				//$('div[count="'+count+'"]').removeClass('sexyActive');
				$('dl.sexyActive').removeClass('sexyActive').fadeOut(function(){
					scrollHeight = 0;
				});
				active = false;
				$('dd.sexyActive').removeClass('sexyActive');
			}
		};
		
		//set value of select box 
		function select(dd){
			var val = $(dd).attr('value');
			var count = $(dd).attr('count');
			$('option.sexyActive').removeClass('sexyActive');
			$('option[value="'+val+'"]').addClass('sexyActive');
			var text = $(dd).text();
			$('div.sexyActive span').text(text);
			hide($('div[count="'+count+'"]'));
			$('select[count="'+count+'"]').val(val);
			$('dd.selected').removeClass('selected');
			$('dd.sexyActive').removeClass('sexyActive');
			scrollHeight = 0;
			$(dd).addClass('selected');
			
		};
		
		//-------------------scrolling functions-----------------//
		function scrollOffset(menu){
			var height = $(menu).innerHeight();
			return height;
		};
		
		function scrollItems(menu){
			var totalHeight = 0;
			$(menu).children().each(function(){
				totalHeight += parseInt($(this).outerHeight());
			});
			var totalChildren = $(menu).children('dd').length;
			return {totalHeight:totalHeight, totalChildren:totalChildren, items:$(menu).children('dd')};
		};
		
		function scrollMenuDown(items){
			if(scroll < items.length -1){
				var s = scroll+=1;
				return s;
			}
		};
		
		function scrollMenuUp(items){
			if(scroll > 0){
				var s = scroll -=1;
				return s;
			}
		};
		
		//navigate down through the options
		function moveMenuDown(dl, next, current){
			//var off = $('dl.sexyActive').children('dd.sexyActive').position().top;
			var nextDd = $(next).position().top;
			var curDd = current.position().top;
			var off = (nextDd-curDd);
			var sHeight = scrollHeight += off;
			$('dl.sexyActive').animate({scrollTop:sHeight}, 100);
		};
		
		//broken as of right now 1-4-2012 5:40pm EST
		function moveMenuUp(dl, from){
			var prev = $(from).position().top;
			var next = $(dl).children('dd.sexyActive').position().top;
			var off = parseInt(next - prev);
			var sHeight = scrollHeight += off;
			$(dl).animate({scrollTop:sHeight}, 100);
		};
		
		
		//-------------------Setting Tab Index---------------//
		var tabindex = 1;
	    $('input,select,.sexySelectCover, textarea').each(function() {
        	if (this.type != "hidden") {
            	var $input = $(this);
            	if(!$(this).hasClass('disabled')){	
					$input.attr("tabindex", tabindex);
            	}
					tabindex++;
        	}
    	});
		//------------------Binding Events------------------//
		
		//bind a click to the dd's in the definition list
		$('.sexySelectOpt').bind('click', function(e){
			select(this);
			e.preventDefault();
			return false;
		});
		
		//bind a click event to the select covers
		$('.sexySelectCover').bind('click', function(){
			show(this);
			return false;
		});
		
		//navigate the select dropdown with arrow keys
		$('.sexySelectCover').bind('keyup', function(e){
			var count = $(this).attr('count');
			if(e.keyCode == 40 && scrolling == false){
				show(this);
				scrolling = true;
			}else{
				if(e.keyCode == 40){
					var height = scrollOffset('dl[count="'+count+'"]');
					var tHeight = scrollItems('dl[count="'+count+'"]');
					var sItems = scrollItems('dl[count="'+count+'"]');
					var items = sItems.items;
					var s = scrollMenuDown(items);
					if(s < items.length){
						var current = $('dd.sexyActive');
						var next = $('dd.sexyActive').siblings('dd')[s-1];	
						$('dd.sexyActive').removeClass('sexyActive');
						$(items[s]).addClass('sexyActive');
						moveMenuDown('dl[count="'+count+'"]', next, current);
					}
				}
				if(e.keyCode == 38){
					//scrollHeight = 0;
					var sItems = scrollItems('dl[count="'+count+'"]');
					var items = sItems.items;
					var s = scrollMenuUp(items);
					if(s > -1){
						var from = $('dd.sexyActive');
						$('dd.sexyActive').removeClass('sexyActive');
						$(items[s]).addClass('sexyActive');
						moveMenuUp('dl[count="'+count+'"]', from);
					}
				}
				if(e.keyCode==13){
					select($('dl[count="'+count+'"] dd.sexyActive'));
				}
			}
		});
		
		//bind click event to the document to hide the active menu
		$(document).bind('click', function(){
			if(active==true){
				hide('div.sexyActive');
			}
		});
		
		$(document).bind('keyup', function(e){
			if(e.keyCode == 38 || e.keyCode == 40){
				disable_scroll();
			}else{
				enable_scroll();
			}
		});
		
		//-------------Prevent Default Scrolling-----------------//
		var keys = [37, 38, 39, 40];

		function preventDefault(e) {
		  e = e || window.event;
		  if (e.preventDefault)
		      e.preventDefault;
		  event.returnValue = false;  
		}

		function keydown(e) {
		    for (var i = keys.length; i--;) {
		        if (e.keyCode === keys[i]) {
		            preventDefault(e);
		            return;
		        }
		    }
		}


		function disable_scroll() {
		  document.onkeydown = keydown;
		}

		function enable_scroll() {
		    document.onkeydown = null;  
		}
		
		
	};
})( jQuery );