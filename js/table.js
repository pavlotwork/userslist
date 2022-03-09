function table_update()
{
	$.ajax
	(
		{
			type:"get",
			dataType: "html",
			url: 'https://scalping.top/userslist/php/tabletmpl.php',

			success:function(response)
			{
				$('#tbody').html(response);
			},
			error: function() 
			{
			    console.log("ERROR!");
			}
		}
	);
}

function update_user_modal_form(user_id)
{
	$('#update_user_id').val(user_id);

	if(user_id != 'adduser')
	{
		$('#user-edit-modal-title').text('Edit user');

		$.ajax
		(
			{
				type:"post",
				dataType: "json",
				url: 'https://scalping.top/userslist/php/request.php',
				
				data:
				{
					request: 'get_user_data',
					user_id: user_id
				},
				
				success:function(response)
				{
					var first_last_name_array = response['name'].split(" ");

					$('#first_name').val(first_last_name_array[0]);
					$('#last_name').val(first_last_name_array[1]);
					$('#role').val(response['role']);

					if (response['status'] == '1')
					{
						$('#status').bootstrapToggle('on');
					}else
					{
						$('#status').bootstrapToggle('off');
					}
				},
				error: function() 
				{
				    console.log("ERROR!");
				}
			}
		);
	}else
	{
		$('#user-edit-modal-title').text('Add user');
		$('#first_name').val('');
		$('#last_name').val('');
	}
}

function delete_user(user_id)
{
	var result = confirm("Confirm delete user - " + user_id);
    if (result == true) {
        console.log("OK was pressed.");

        $.ajax
		(
			{
				type:"post",
				dataType: "json",
				url: 'https://scalping.top/userslist/php/request.php',
				
				data:
				{
					request: 'delete_user',
					user_id: user_id
				},
				
				success:function(response)
				{
					table_update();
				},
				error: function() 
				{
				    console.log("ERROR!");
				}
			}
		);
        
    } else {
        console.log("Cancel was pressed.");
    }
}

function add_update_user()
{
    $.ajax
	(
		{
			type:"post",
			dataType: "json",
			url: 'https://scalping.top/userslist/php/request.php',
			
			data:
			{
				request: 'add_update_user',
				name: $('#first_name').val() + ' ' + $('#last_name').val(),
				role: $('#role').val(),
				status: $('#status').prop('checked'),
				user_id: $('#update_user_id').val(),
			},
			
			success:function(response)
			{
				table_update();
				$('#user-form-modal').modal('hide')
			},
			error: function() 
			{
			    console.log("ERROR!");
			}
		}
	);
}

function indiv_checkbox_change()
{
	$('#all-items').prop('checked', false);
}

function mass_action(select_id)
{

	if ($('#'+select_id).val() == 0)
	{
		alert('Please select action!');
		return;
	}

	var checked_users_ids = $('.table-individ-checkbox:checkbox:checked').map(function()
		{
			return $(this).attr('id');
		}).get();

	if(checked_users_ids.length == 0)
	{
		alert('Please select some users!');
		return;
	}

	$.ajax
	(
		{
			type:"post",
			dataType: "html",
			url: 'https://scalping.top/userslist/php/request.php',
			
			data:
			{
				request: 'mass_action',
				checked_users_ids: checked_users_ids,
				action: $('#'+select_id).val(),
			},
			
			success:function(response)
			{
				console.log(response);
				
				table_update();
				$('#user-form-modal').modal('hide');
				$('#all-items').prop('checked', false);
			},
			error: function() 
			{
			    console.log("ERROR!");
			}
		}
	);
}

$( document ).ready(function()
{
    table_update(); 

    $('#all-items').change(function()
	{
		$('.table-individ-checkbox').prop('checked', this.checked);
	});

	$('#user-form-modal').on('show.bs.modal', function (event)
	{
	  var button_user_edit = event.relatedTarget;
	  var user_id = button_user_edit.getAttribute('data-bs-userid');
	  update_user_modal_form(user_id)
	});

});