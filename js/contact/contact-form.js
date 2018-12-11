jQuery(document).ready(function($) {
    $("#send-mail").click(function() {

        error = false;
        var name = $('input#name').val();
        if (name == "" || name == " ") {
            displayControl('#err-name');
            error = true;
        }

        var city = $('input#city').val();
        if (city == "" || city == " ") {
            displayControl('#err-city');
            error = true;
        }

        var phone = $('input#phone').val();
        if (phone == "" || phone == " ") {
            displayControl('#err-phone');
            error = true;
        }

        var emailCompare = /^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/;
        var email = $('input#email').val().toLowerCase();
        if (email == "" || email == " ") {
            displayControl('#err-email');
            error = true;
        }

        var comment = $('textarea#comment').val();
        if (comment == "" || comment == " ") {
            displayControl('#err-comment');
            error = true;
        }

        if (error == false) {
            var dataString = $('#contact-form').serialize(); // Collect data from form
            $.ajax({
                type: "POST",
                url: $('#contact-form').attr('action'),
                data: dataString,
                timeout: 6000,
                error: function(request, error) {
                    displayControl('#errorSend');
                },
                success: function(response) {
                    try {
                        response = $.parseJSON(response);
                        if (response.status) {
                            displayControl('#successSend');
                            $("#name").val('');
                            $("#city").val('');
                            $("#email").val('');
                            $("#phone").val('');
                            $("#comment").val('');
                        } else {
                            displayControl('#errorSend');
                        }
                    } catch {
                        displayControl('#errorSend');
                    }

                }
            });
            return false;
        }

        return false; // stops user browser being directed to the php file
    });
});

function displayControl(control) {
    $(control).show(500);
    $(control).delay(4000);
    $(control).animate({
        height: 'toggle'
    }, 500, function() {

    });
}