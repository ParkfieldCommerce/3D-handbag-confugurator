function startUI() {
$(document).ready(function () {

//+++++++++++++++++++++++++++++++++++++++++++
//     Jquery Code Start
//+++++++++++++++++++++++++++++++++++++++++++

    $(".box1 li a").click(function(e){
        e.preventDefault();
        $(".box1 li a.active").removeClass("active");
        $(this).toggleClass("active");
    });
    $(".box2 li a").click(function(e){
        e.preventDefault();
        $(".box2 li a.active").removeClass("active");
        $(this).toggleClass("active");
    });
    $(".box3 li a").click(function(e){
        e.preventDefault();
        $(".box3 li a.active").removeClass("active");
        $(this).toggleClass("active");
    });
    $(".box4 li a").click(function(e){
        e.preventDefault();
        $(".box4 li a.active").removeClass("active");
        $(this).toggleClass("active");
    });


//    Show target image

    $('.box1 ul li a').on('click', function(){
        var src = $(this).find('img').attr('src');
        $('.targetImg').find('img').attr('src', src);
        var txt= $(this).text();
        $('.targetImg .detailbox').children('span').text(txt);

    });

    $('.box2 ul li a').on('click', function(){
        var src = $(this).find('img').attr('src');
        $('.targetImg2').find('img').attr('src', src);
        var txt= $(this).text();
        $('.targetImg2 .detailbox').children('span').text(txt);

    });

    $('.box3 ul li a').on('click', function(){
        var src = $(this).find('img').attr('src');
        $('.targetImg3').find('img').attr('src', src);
        var txt= $(this).text();
        $('.targetImg3 .detailbox').children('span').text(txt);

    });

    $('.box4 ul li a').on('click', function(){
        var src = $(this).find('img').attr('src');
        $('.targetImg4').find('img').attr('src', src);
        var txt= $(this).text();
        $('.targetImg4 .detailbox').children('span').text(txt);

    });


});
};
