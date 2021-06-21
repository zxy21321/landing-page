$(document).ready(function () {

    // Custom method to validate username
    $.validator.addMethod("usernameRegex", function(value, element) {
        return this.optional(element) || regex_first_last_name.test(value);
    }, "Name must be more than 2 characters long, without special characters or spaces");

    $.validator.addMethod("lastusernameRegex", function(value, element) {
        return this.optional(element) || regex_first_last_name.test(value);
    }, "Last name must be more than 2 characters long, without special characters or spaces");

    $.validator.addMethod("passwordRegex", function(value, element) {
        return this.optional(element) || /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value) && /^[0-9A-Za-z]+$/.test(value);
    }, 'Password must be between 8-12 characters in length, including letters (A-Z, a-z) and numbers (0-9). Without any special symbols (^@()#*+/\"?!=.{}~`&) and spaces');

    $.validator.addMethod("phoneRegex", function(value, element) {
        return this.optional(element) || /^(\d[- ]?){7,11}$/.test(value);
    }, "The phone must be from 7 to 11 characters, without special characters");



    $(function () {
        var form = $("#myform")
        form.validate({
            onfocusout: function (element) {
                if(this.currentElements.length != 0 && this.currentElements[0].name == "email"){
                    rebuidEmail($(this.currentElements[0]))
                }
                this.element(element);
                $(element).valid()
            },
            onkeyup: function (element) {
                $(element).valid()
                $('[name="' + element.name + '"]').val(element.value);
                if($(".password").valid()){
                 $('.valid-pass-label').fadeOut(500)
                }
            },

            rules: {
                first_name: {
                    required: true,
                    usernameRegex: true,
                    minlength: 2,
                    maxlength: 60,
                },
                last_name:{
                    required: true,
                    lastusernameRegex: true,
                    minlength: 2,
                    maxlength: 60,
                },
                password : {
                    required: true,
                    passwordRegex: true,
                    minlength: 8,
                    maxlength: 12,
                },
                email: {
                    required: true,
                    email: true,

                },
                phone:{
                    phoneRegex: true,
                    required: true,
                }



            },
            messages: {
                first_name: {
                    required: "The first name field is required",
                    minlength: "The first name must be at least 2",
                    maxlength: "First name can be a maximum of 25",
                },

                last_name:{
                    required: "The last name field is required",
                    minlength: "The last name must be at least 2",
                    maxlength: "Surname can be a maximum of 25",
                },
                password:{
                    required: "Passordfelt kreves",
                    minlength: "Passordet må være minst 8 tegn",
                    maxlength: "Passordet kan ikke overstige 12 tegn",
                },
                email: {
                    required: "The e-mail field is required",
                    email: "The e-mail must be a valid address",
                },
                phone:{
                    required: "The phone is required",
                }

            },
            submitHandler: function (form, event) {
                event.preventDefault();
                $("input[name='first_name']").each(function(){
                    $(this).val($(this).val().substr(0,60).replace(/[.-]/g, ' ').replace(/\s\s+/g, ' '))
                });
                $("input[name='last_name']").each(function(){
                    $(this).val($(this).val().substr(0,60).replace(/[.-]/g, ' ').replace(/\s\s+/g, ' '))
                });
                var msg = $(form).serialize();
                var linkAdress = makeSendAdress();
                console.log('linkAdress= ' + linkAdress);
                $('.preloader').show();
                // console.log('data= ' + msg);
                $.post(linkAdress, msg)
                    .done(function (data) {
                        var domainForPixel = $.urlParam('domain');
                        var lead = $('[name=first_name]').val();
                        if (domainForPixel != null) {
                            $('body').prepend('<iframe width="1" height="1" alt="" style="display:none" src="https://' + decodeURIComponent(domainForPixel) + '"></iframe>');
                        }
                        var obj_data = JSON.parse(data)
                        adress_redir = obj_data.redirect;
                        var broker = obj_data.broker_name
                        if(broker === ""){
                            $('.broker-name').hide()
                        }
                        else{
                            $('.broker-name').text(broker)
                        }
                        $('.btm-send-fanks').attr('href', adress_redir);
                        if ($.urlParam('noautologin') == 1) {
                            setTimeout(function(){window.location = adress_redir}, 3000)
                            return true;
                        }
                        $(".lead-name").text(lead);
                        $('#finishPopup').show(100);
                        $('#ytplayer').remove();
                        $("#ytplayer1").append("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/y9Tau1UVxBk?mute=0&amp;autoplay=1&amp;controls=1&amp;disablekb=0&amp;loop=1&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;playlist=y9Tau1UVxBk\" frameborder=\"0\" allowfullscreen=\"\"></iframe>");
        
                        // setTimeout(function () {
                        //     window.location = adress_redir
                        // }, 3000)
                        // console.log(data);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        $('.preloader').hide();
                    // console.log(jqXHR.status)
                    if (jqXHR.status == 400) {
                        var obj_data = JSON.parse(jqXHR.responseText)
                        for (key in obj_data.errors) {
                            if (key == "CROB") {
                                window.location = obj_data.errors[key]
                            } 
                           if(obj_data.errors.phone){
                                $(".phone").parent().find("label").remove();
                                $("#myform .phone").val("").valid();
                                $("[for='phone']").text(obj_data.errors.phone);
                                }
                            else {
                                alert(obj_data.errors[key])
                            }
                        }
                    } else {
                        alert('Register form field error')
                        console.log(jqXHR)
                    }
                    // $('#step_phone').hide();
                    // $('#account_information').fadeIn(1000);
                });

            }
        });
    });

    $(function () {
        var form = $("#myform2")
        form.validate({
            onfocusout: function (element) {
                if(this.currentElements.length != 0 && this.currentElements[0].name == "email"){
                    rebuidEmail($(this.currentElements[0]))
                }
                this.element(element);
            },
            onkeyup: function (element) {
                $(element).valid();
                $('[name="' + element.name + '"]').val(element.value);
                if($(".password").valid()){
                 $('.valid-pass-label').fadeOut(500)
                }
            },

            rules: {
                first_name: {
                    required: true,
                    usernameRegex: true,
                    minlength: 2,
                    maxlength: 60,
                },
                last_name:{
                    required: true,
                    lastusernameRegex: true,
                    minlength: 2,
                    maxlength: 60,
                },
                password : {
                    required: true,
                    passwordRegex: true,
                    minlength: 8,
                    maxlength: 12,
                },
                email: {
                    required: true,
                    email: true,

                },
                phone:{
                    phoneRegex: true,
                    required: true,
                }



            },
            messages: {
                first_name: {
                    required: "The first name field is required",
                    minlength: "The first name must be at least 2",
                    maxlength: "First name can be a maximum of 25",
                },

                last_name:{
                    required: "The last name field is required",
                    minlength: "The last name must be at least 2",
                    maxlength: "Surname can be a maximum of 25",
                },
                password:{
                    required: "Passordfelt kreves",
                    minlength: "Passordet må være minst 8 tegn",
                    maxlength: "Passordet kan ikke overstige 12 tegn",
                },
                email: {
                    required: "The e-mail field is required",
                    email: "The e-mail must be a valid address",
                },
                phone:{
                    required: "The phone is required",
                }

            },
            submitHandler: function (form, event) {
                event.preventDefault();
                $("input[name='first_name']").each(function(){
                    $(this).val($(this).val().substr(0,60).replace(/[.-]/g, ' ').replace(/\s\s+/g, ' '))
                });
                $("input[name='last_name']").each(function(){
                    $(this).val($(this).val().substr(0,60).replace(/[.-]/g, ' ').replace(/\s\s+/g, ' '))
                });
                var msg = $(form).serialize();
                var linkAdress = makeSendAdress();
                console.log('linkAdress= ' + linkAdress);
                $('.preloader').show();
                // console.log('data= ' + msg);
                $.post(linkAdress, msg)
                    .done(function (data) {
                        var domainForPixel = $.urlParam('domain');
                        var lead = $('[name=first_name]').val();
                        if (domainForPixel != null) {
                            $('body').prepend('<iframe width="1" height="1" alt="" style="display:none" src="https://' + decodeURIComponent(domainForPixel) + '"></iframe>');
                        }
                        var obj_data = JSON.parse(data)
                        adress_redir = obj_data.redirect;
                        var broker = obj_data.broker_name
                        if(broker === ""){
                            $('.broker-name').hide()
                        }
                        else{
                            $('.broker-name').text(broker)
                        }
                        $('.btm-send-fanks').attr('href', adress_redir);
                        if ($.urlParam('noautologin') == 1) {
                            setTimeout(function(){window.location = adress_redir}, 3000)
                            return true;
                        }
                        $(".lead-name").text(lead);
                        $('#finishPopup').show(100);
                        $('#ytplayer').remove();
                        $("#ytplayer1").append("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/y9Tau1UVxBk?mute=0&amp;autoplay=1&amp;controls=1&amp;disablekb=0&amp;loop=1&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;playlist=y9Tau1UVxBk\" frameborder=\"0\" allowfullscreen=\"\"></iframe>");

                        // setTimeout(function () {
                        //     window.location = adress_redir
                        // }, 3000)
                        // console.log(data);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        $('.preloader').hide();
                    // console.log(jqXHR.status)
                    if (jqXHR.status == 400) {
                        var obj_data = JSON.parse(jqXHR.responseText)
                        for (key in obj_data.errors) {
                            if (key == "CROB") {
                                window.location = obj_data.errors[key]
                            } 

                           if(obj_data.errors.phone){
                                $(".phone").parent().find("label").remove();
                                $("#myform2 .phone").val("").valid();
                                $("[for='phone']").text(obj_data.errors.phone);
                                }
                            else {
                                alert(obj_data.errors[key])
                            }
                        }
                    } else {
                        alert('Register form field error')
                        console.log(jqXHR)
                    }
                    // $('#step_phone').hide();
                    // $('#account_information').fadeIn(1000);
                });

            }
        });
    });
    $(function () {
        var form = $("#myform3")
        form.validate({
            onfocusout: function (element) {
                if(this.currentElements.length != 0 && this.currentElements[0].name == "email"){
                    rebuidEmail($(this.currentElements[0]))
                }
                this.element(element);
            },
            onkeyup: function (element) {
                $(element).valid();
                $('[name="' + element.name + '"]').val(element.value);
                if($(".password").valid()){
                 $('.valid-pass-label').fadeOut(500)
                }
            },

            rules: {
                first_name: {
                    required: true,
                    usernameRegex: true,
                    minlength: 2,
                    maxlength: 60,
                },
                last_name:{
                    required: true,
                    lastusernameRegex: true,
                    minlength: 2,
                    maxlength: 60,
                },
                password : {
                    required: true,
                    passwordRegex: true,
                    minlength: 8,
                    maxlength: 12,
                },
                email: {
                    required: true,
                    email: true,

                },
                phone:{
                    phoneRegex: true,
                    required: true,
                }



            },
            messages: {
                first_name: {
                    required: "The first name field is required",
                    minlength: "The first name must be at least 2",
                    maxlength: "First name can be a maximum of 25",
                },

                last_name:{
                    required: "The last name field is required",
                    minlength: "The last name must be at least 2",
                    maxlength: "Surname can be a maximum of 25",
                },
                password:{
                    required: "Passordfelt kreves",
                    minlength: "Passordet må være minst 8 tegn",
                    maxlength: "Passordet kan ikke overstige 12 tegn",
                },
                email: {
                    required: "The e-mail field is required",
                    email: "The e-mail must be a valid address",
                },
                phone:{
                    required: "The phone is required",
                }

            },
            submitHandler: function (form, event) {
                event.preventDefault();
                $("input[name='first_name']").each(function(){
                    $(this).val($(this).val().substr(0,60).replace(/[.-]/g, ' ').replace(/\s\s+/g, ' '))
                });
                $("input[name='last_name']").each(function(){
                    $(this).val($(this).val().substr(0,60).replace(/[.-]/g, ' ').replace(/\s\s+/g, ' '))
                });
                var msg = $(form).serialize();
                var linkAdress = makeSendAdress();
                console.log('linkAdress= ' + linkAdress);
                $('.preloader').show();
                // console.log('data= ' + msg);
                $.post(linkAdress, msg)
                    .done(function (data) {
                        var domainForPixel = $.urlParam('domain');
                        var lead = $('[name=first_name]').val();
                        if (domainForPixel != null) {
                            $('body').prepend('<iframe width="1" height="1" alt="" style="display:none" src="https://' + decodeURIComponent(domainForPixel) + '"></iframe>');
                        }
                        var obj_data = JSON.parse(data)
                        adress_redir = obj_data.redirect;
                        var broker = obj_data.broker_name
                        if(broker === ""){
                            $('.broker-name').hide()
                        }
                        else{
                            $('.broker-name').text(broker)
                        }
                        $('.btm-send-fanks').attr('href', adress_redir);
                        if ($.urlParam('noautologin') == 1) {
                            setTimeout(function(){window.location = adress_redir}, 3000)
                            return true;
                        }
                        $(".lead-name").text(lead);
                        $('#finishPopup').show(100);
                        $('#ytplayer').remove();
                        $("#ytplayer1").append("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/y9Tau1UVxBk?mute=0&amp;autoplay=1&amp;controls=1&amp;disablekb=0&amp;loop=1&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;playlist=y9Tau1UVxBk\" frameborder=\"0\" allowfullscreen=\"\"></iframe>");

                        // setTimeout(function () {
                        //     window.location = adress_redir
                        // }, 3000)
                        // console.log(data);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        $('.preloader').hide();
                    // console.log(jqXHR.status)
                    if (jqXHR.status == 400) {
                        var obj_data = JSON.parse(jqXHR.responseText)
                        for (key in obj_data.errors) {
                            if (key == "CROB") {
                                window.location = obj_data.errors[key]
                            } 
                           if(obj_data.errors.phone){
                                $(".phone").parent().find("label").remove();
                                $("#myform3 .phone").val("").valid();
                                $("[for='phone']").text(obj_data.errors.phone);
                                }
                            else {
                                alert(obj_data.errors[key])
                            }
                        }
                    } else {
                        alert('Register form field error')
                        console.log(jqXHR)
                    }
                    // $('#step_phone').hide();
                    // $('#account_information').fadeIn(1000);
                });

            }
        });
    });
});




// function makeSendAdress() {
//     var protocol = location.protocol;
//     var tmp = location.hostname.replace(/[a-z]{2}\./, '');
//     tmp = protocol + '//cabinet.' + tmp + '/api/register';
//     return tmp;
// }

