$(function() {
    $("#logintouch").click(function(event) {
        let useremail = $("#logintouchemail").val();
        let href =$("#logintouch").attr("href");
        $("#logintouch").attr("href", href + '/' + useremail);
        //window.location.href = "http://stackoverflow.com";
		//event.preventDefault();
	});

});