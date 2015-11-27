var users;

$( document ).ready(function() {
    $.ajax({
        url: 'http://localhost:3000/welcome/getUsers',
        type: 'GET',
        success: function(data) {
            users = data;
            for (i = 0; i < users.length; i++) {
                if (users[i].email != thisUser.email) {
                    if (users[i].permissions == "super admin" || users[i].permissions == "admin") {
                    }
                    else{
                        $("#users-table tbody").append("<tr class='tablerow'><td>"+ users[i].email +"</td>" +
                            "<td>" + users[i].display_name + "</td><td><a class='btn btn-default btn-sm'>Edit User Profile</a></td></tr>");
                        }
                }
            }
            
            $("#users-table a").click(function (e) {
                var tr = $(this).parent().parent();
                var email = tr.find('td').get(0).innerHTML;
                
                var input = $("#profileForm input[name='email']");
                input.val(email);
                
                $("#profileForm").submit();
            });
        },
        error: function(e) {
            console.log(e);
        }
    });
    

    
});