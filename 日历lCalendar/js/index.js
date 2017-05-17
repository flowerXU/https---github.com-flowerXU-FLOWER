/**
 * Created by xtt on 2017/5/15.
 */


function lcalendarFinish(){
    var timeFinish=$(".edits").val().replace(" ",":").replace(/\:/g,"-").split("-");
    var yearFinish=timeFinish[0];
    var monthFinish=timeFinish[1];
    var dayFinish=timeFinish[2];
    $(".tops li").html(monthFinish+"("+yearFinish+")");

    function DayNumOfMonth(Year,Month)
    {
        Month--;
        var d = new Date(Year,Month,1);
        d.setDate(d.getDate()+32-d.getDate());
        return (32-d.getDate());
    }
    var dayNumMonth=DayNumOfMonth(yearFinish,monthFinish);//某个月天数
    var htmlAdd="";
    for(var i=1;i<=dayNumMonth;i++){
        htmlAdd+="<li class='swiper-slide'><a href='#_'>"+(i)+"</a></li><br>";
    }
    $(".swiper-wrapper").html(htmlAdd);//生产日期列表
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 7,
        paginationClickable: true,
        spaceBetween: 0
    });
    $(".days-list .swiper-wrapper li").each(function(i){
        if(i==(dayFinish-1)){
            $(this).addClass("active").siblings().removeClass("active");
        }
        var liWisth=($(window).width()-20)/7;
        if($(this).hasClass("active")){
            $(".days-list .swiper-wrapper").css("transform","translate3d("+(-(i-3)*(liWisth))+"px, 0px, 0px)");
            $(".days-list .swiper-wrapper li").each(function(m){
                if(m>i){
                    $(this).addClass("next-num");
                }
                else{
                    $(this).removeClass("next-num");
                }
            })
        }
        $(this).click(function(){
            console.log("aaa");
            $(this).addClass("active").siblings().removeClass("active");
            $(".days-list .swiper-wrapper").css("transform","translate3d("+(-(i-3)*(liWisth))+"px, 0px, 0px)");
            $(".days-list .swiper-wrapper li").each(function(m){
                if(m>i){
                    $(this).addClass("next-num");
                }
                else{
                    $(this).removeClass("next-num");
                }
            })
        })
    })

}
var calendar = new lCalendar();
calendar.init({
    'trigger': '#demo1',
    'type': 'date'
});
$(".menuh").click(function(){
    if(!$(this).hasClass("active")){
        $(this).addClass("active");
        $(".model-slide").css({"display":"block"});
        $(".nav-bg").css({"display":"block"});
        $("header").css({"background":"#fff"});
        $(".content").animate({"left":"85%"},500);
        $(".nav-bg").animate({"left":"85%"},500);

    }
    else{
        $(this).removeClass("active");
        $(".model-slide").css({"display":"none"});
        $(".nav-bg").css({"display":"none"});
        $(".nav-bg").animate({"left":"0%"},500);
        $("header").css({"background":"#1b1b1b"});
        $(".content").animate({"left":"0%"},500);

    }

})
