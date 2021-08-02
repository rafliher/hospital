$(function() {
    $('form').submit(function(e) {
        $.ajax({
            type: "post",
            url: "/api/auth/signup",
            data: $(this).serialize(),
            success: function(response) {
                console.log(response);
                window.location = "/signin"
            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
                Swal.fire({
                    title: `Error!`,
                    text: xhr.responseJSON.message,
                    icon: 'error',
                    confirmButtonText: 'Cool'
                });
            }
        });
        e.preventDefault();
    });
});
