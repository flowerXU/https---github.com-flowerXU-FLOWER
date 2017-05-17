/**
 * Created by Administrator on 2017/3/3.
 */
$(function(){
    $(".order-page .weeklf .s").each(function(m){
        if(m==0){
            var now = new Date();
            var nowH= now.getDay();
            $(".order-page .timert .s").each(function(i){
                if(i==0){
                    console.log($(this));
                    $(this).addClass("active").removeClass("past").nextAll().removeClass("past").removeClass("active");
                }

               /* if((nowH+1-12)/2<=i){
                    $(this).addClass("past").nextAll().removeClass("past");
                    $(this).next().next().addClass("active").nextAll().removeClass("active");
                    console.log(i);
                    return false;
                }*/
            })
        }
    })
    $(".order-page .timert .s").each(function(i){
        $(this).click(function(){
            if(!$(this).hasClass("past")){
                $(this).addClass("active").siblings().removeClass("active");
            }
        })
    })
})
$(".order-page .weeklf .s").each(function(m){
    $(this).click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        /*if(m==0){
            var now = new Date();
            var nowH= now.getHours();
            $(".order-page .timert .s").each(function(i){
                $(this).addClass("past");
                $(this).removeClass("active");

            })
        }
        else{
            $(".order-page .timert .s").each(function(i){
                $(this).removeClass("past");
                if(i==0){
                    $(this).addClass("active").siblings().removeClass("active");
                }
            })
        }*/
    })

})
