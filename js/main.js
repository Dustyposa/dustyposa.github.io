function scrollToElement(o,n){var t=$(o).offset();$("body,html").animate({scrollTop:t.top+(n||0),easing:"swing"})}function scrollToBoard(){scrollToElement("#board",-$("#navbar").height())}function debounce(o,n,t){var a;return function(){var r=this,s=arguments,l=t&&!a;clearTimeout(a),a=setTimeout(function(){a=null,t||o.apply(r,s)},n),l&&o.apply(r,s)}}$(document).ready(function(){var o=$("#navbar");o.offset().top>0&&(o.addClass("navbar-custom"),o.removeClass("navbar-dark")),$(window).scroll(function(){o.offset().top>0?(o.addClass("navbar-custom"),o.removeClass("navbar-dark")):o.addClass("navbar-dark")}),$("#navbar-toggler-btn").on("click",function(){$(".animated-icon").toggleClass("open"),$("#navbar").toggleClass("navbar-col-show")});var n=$('#background[parallax="true"]'),t=function(){var o=$(window).scrollTop()/5,t=96+parseInt($("#board").css("margin-top"));o>t&&(o=t),n.css({transform:"translate3d(0,"+o+"px,0)","-webkit-transform":"translate3d(0,"+o+"px,0)","-ms-transform":"translate3d(0,"+o+"px,0)","-o-transform":"translate3d(0,"+o+"px,0)"}),$("#toc")&&$("#toc-ctn").css({"padding-top":o+"px"})};n.length>0&&(t(),$(window).scroll(t)),$(".scroll-down-bar").on("click",scrollToBoard);var a=$("#scroll-top-button"),r=!1,s=!1,l=function(){var o=document.getElementById("board").getClientRects()[0].right,n=document.body.offsetWidth-o;r=n>=50,a.css({bottom:r&&s?"20px":"-60px",right:n-64+"px"})};l(),$(window).resize(l);var e=$("#board").offset().top;$(window).scroll(debounce(function(){var o=document.body.scrollTop+document.documentElement.scrollTop;s=o>=e,a.css({bottom:r&&s?"20px":"-60px"})},20)),a.on("click",function(){$("body,html").animate({scrollTop:0,easing:"swing"})})});