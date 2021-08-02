$(function() {
  $.get({
    url: "/api/appointment/all",
    // Fetch the stored token from localStorage and set in the header
    headers: {"x-access-token": localStorage.getItem('token')},
    success: function(response) {
      if(response.isAdmin){
        $(".card-header").show();
      }
      $(".welcome").html(`Welcome, ${response.user.firstname} ${response.user.lastname}!`);
      let data = '';
      response.appointments.forEach((row, i) => {
        // console.log(row);
        data += `<tr id="row${row.id}"><th scope="row">${row.id}</th>
        <td class="doctorname">${row.doctorname}</td>
        <td class="description">${row.description}</td>
        <td><button class="btn btn-success" onclick="apply(${row.id});">Apply</button>`;
        if(response.isAdmin===true){
          data +=`
            <button class="btn btn-primary" onclick="show(${row.id});"><i class="fa fa-eye" aria-hidden="true"></i> Show</button>
            <button class="btn btn-warning" onclick="edit(${row.id});"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button>
            <button class="btn btn-danger" onclick="del(${row.id});"><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>
          </td>`;
        }
        data += '</tr>';
      });
      $("#tableBody").html(data);
      response.appointmentIDs.forEach((id, i) => {
          $(`#row${id} td .btn-success`).html('Cancel');
          $(`#row${id} td .btn-success`).addClass('btn-danger isapplied');
          $(`#row${id} td .btn-success`).attr("onclick", `cancel(${id});`);
          $(`#row${id} td .btn-success`).removeClass('btn-success');
      });
    },
    error: function(xhr, status, error) {
        console.log([xhr, status, error]);
        Swal.fire({
            title: `Error!`,
            text: 'You haven\'t signed in!',
            icon: 'warning',
            confirmButtonText: 'Sign in'
        }).then(function() {
            window.location = "/signin";
        });
    }
  });

  $(".newform").submit(function(e) {
      Swal.fire({
        title: 'New Appointment',
        html: `<input type="text" id="doctorname" class="swal2-input" placeholder="Doctor Name">
        <textarea style="resize: none; height: 300px;" rows="4" cols="25" id="description" class="swal2-input" placeholder="Description">`,
        confirmButtonText: 'Add',
        focusConfirm: false,
        preConfirm: () => {
          const doctorname = Swal.getPopup().querySelector('#doctorname').value || ''
          const description = Swal.getPopup().querySelector('#description').value || ''
          if (!doctorname || !description) {
            Swal.showValidationMessage(`Please enter doctorname and description`)
          }
          return { doctorname: doctorname, description: description }
        }
      }).then((result) => {
        $.ajax({
          type: "post",
          url: "/api/appointment/new",
          headers: {"x-access-token": localStorage.getItem('token')},
          data: { doctorname: result.value.doctorname, description: result.value.description },
          success: function(response) {
            Swal.fire({
              title: `Success!`,
              text: "New appointment added succesfully",
              icon: 'success',
              confirmButtonText: 'Cool'
            });
            let data = '';
            data += `<tr id="row${response.newData.id}"><th scope="row">${response.newData.id}</th>
              <td class="doctorname">${result.value.doctorname}</td>
              <td class="description">${result.value.description}</td>
              <td><button class="btn btn-success" onclick="apply(${response.newData.id});"></i> Apply</button>`;
            if(localStorage.getItem('isAdmin')){
              data +=`
                  <button class="btn btn-primary" onclick="show(${response.newData.id});"><i class="fa fa-eye" aria-hidden="true"></i> Show</button>
                  <button class="btn btn-warning" onclick="edit(${response.newData.id});"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button>
                  <button class="btn btn-danger" onclick="del(${response.newData.id});"><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>
                </td>`;
            }
            data += '</tr>';
            $("#tableBody").append(data);
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
      });
      e.preventDefault();
  });
});

function apply(id){
  $.ajax({
    type: "post",
    headers: {"x-access-token": localStorage.getItem('token')},
    url: "/api/user/apply",
    data: {appointmentID: id},
    success: function(response) {
      Swal.fire({
        title: `Success!`,
        text: "Appointment succesfully applied",
        icon: 'success',
        confirmButtonText: 'Cool'
      });
      $(`#row${id} td .btn-success`).html('Cancel');
      $(`#row${id} td .btn-success`).addClass('btn-danger isapplied');
      $(`#row${id} td .btn-success`).attr("onclick", `cancel(${id});`);
      $(`#row${id} td .btn-success`).removeClass('btn-success');
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
}

function cancel(id){
  $.ajax({
    type: "post",
    headers: {"x-access-token": localStorage.getItem('token')},
    url: "/api/user/cancel",
    data: {appointmentID: id},
    success: function(response) {
      Swal.fire({
        title: `Success!`,
        text: "Appliance succesfully cancelled",
        icon: 'success',
        confirmButtonText: 'Cool'
      });
      $(`#row${id} td .isapplied`).html('Apply');
      $(`#row${id} td .isapplied`).addClass('btn-success');
      $(`#row${id} td .btn-success`).removeClass('btn-danger isapplied');
      $(`#row${id} td .btn-success`).attr("onclick", `apply(${id});`);
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
}

function show(id){
  console.log(id);
  $.ajax({
    type: "post",
    headers: {"x-access-token": localStorage.getItem('token')},
    url: "/api/appointment/appliances",
    data: {appointmentID: id},
    success: function(response) {
      console.log(response);
      if(response.applier.length > 0){
        table = `<table class="container-fluid"><thead class=".thead-dark">
        <tr><th scope="col">No</th><th scope="col">Fullname</th><th scope="col">Username</th><th scope="col">Email</th></tr>
        </thead><tbody>`;
        response.applier.forEach((user, i) => {
          table += `<tr><td>${i+1}</td><td>${user.firstname} ${user.lastname}</td><td>${user.username}</td><td>${user.email}</td></tr>`
        });
        table += '</tbody></table>';
      }else {
        table = "No applier yet";
      }
      Swal.fire({
        title: 'Applier',
        html: table,
        focusConfirm: false,
        confirmButtonText:'<i class="fa fa-thumbs-up"></i> Great!'
      });
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
}

function edit(id){
  const doctorname = $(`#row${id} .doctorname`).html();
  const description = $(`#row${id} .description`).html();
  Swal.fire({
    title: 'Edit Appointment',
    html: `<input type="text" id="doctorname" class="swal2-input" placeholder="Doctor Name" value=${doctorname}>
    <textarea style="resize: none; height: 300px;" rows="4" cols="25" id="description" class="swal2-input" placeholder="Description">${description}
    </textarea>`,
    confirmButtonText: 'Update',
    focusConfirm: false,
    preConfirm: () => {
      const doctorname = Swal.getPopup().querySelector('#doctorname').value || ''
      const description = Swal.getPopup().querySelector('#description').value || ''
      if (!doctorname || !description) {
        Swal.showValidationMessage(`Please enter doctorname and description`)
      }
      return { doctorname: doctorname, description: description }
    }
  }).then((result) => {
    $.ajax({
      type: "post",
      url: "/api/appointment/update",
      headers: {"x-access-token": localStorage.getItem('token')},
      data: { id: id,doctorname: result.value.doctorname, description: result.value.description },
      success: function(response) {
        Swal.fire({
          title: `Success!`,
          text: "Appointment updated succesfully",
          icon: 'success',
          confirmButtonText: 'Cool'
        });
        $(`#row${id} .doctorname`).html(result.value.doctorname);
        $(`#row${id} .description`).html(result.value.description);
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
  });

}

function del(id){
  $.ajax({
    type: "post",
    headers: {"x-access-token": localStorage.getItem('token')},
    url: "/api/appointment/delete",
    data: {id: id},
    success: function(response) {
      Swal.fire({
        title: `Success!`,
        text: "Appointment succesfully deleted",
        icon: 'success',
        confirmButtonText: 'Cool'
      });
      $(`#row${id}`).remove();
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
}
