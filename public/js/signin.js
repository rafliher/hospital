$(function() {
    $('form').submit(function(e) {
        $.ajax({
            type: "post",
            url: "/api/auth/signin",
            data: $(this).serialize(),
            success: function(response) {
                console.log(response);
                window.localStorage.setItem('token', response.accessToken);
                window.localStorage.setItem('username', response.username);
                window.localStorage.setItem('isAdmin', response.isAdmin);
          
                window.location = "/appointment"
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
