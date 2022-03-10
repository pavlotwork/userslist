function fill_table()
{
	$.ajax
	(
		{
			type:'post',
			dataType: 'json',
			url: 'php/users.php',
			contentType: 'application/json',
			
    		data: JSON.stringify({
				'request': 'get_users_data'
			}),
			
			success:function(response)
			{
				$('#tbody').empty();

				$.each(response, function(key, value)
				{
				    add_row_to_table(value['id'], value['name'], value['role'], value['status']);
				});
			},
			error: function() 
			{
			    console.log("ERROR!");
			}
		}
	);
}

function generate_row_html (id, name, role, status)
{
	var html = '<td class="align-middle">' +
				    '<div class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top">' + 
				      '<input type="checkbox" role="switch" class="custom-control-input table-individ-checkbox" id="item-' + id + '" onchange="indiv_checkbox_change()">' +
				      '<label class="custom-control-label" for="item-' + id + '"></label>' +
				    '</div>' +
				  '</td>' +
				  '<td class="text-nowrap align-middle">' + name + '</td>' +
				  '<td class="text-nowrap align-middle"><span>' + role + '</span></td>';

		if (status == false)
		{
			html = html +
			       '<td id="user-status-circle-' + id + '" class="text-center align-middle"><i class="fa fa-circle not-active-circle"></i></td>';
		}else
		{
			html = html +
			       '<td id="user-status-circle-' + id + '" class="text-center align-middle"><i class="fa fa-circle active-circle"></i></td>';
		}

		html = html + 
				   '<td class="text-center align-middle">' +
				    '<div class="btn-group align-top">' +
				      '<button class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-target="#user-form-modal" data-bs-userid="' + id + '">Edit</button>' +
				      '<button class="btn btn-sm btn-outline-secondary badge" type="button" onclick="confirm_delete_user(\'' + id + '\', \'' + name + '\')"><i class="fa fa-trash"></i></button>' +
				    '</div>' +
				  '</td>';
		return html;
}

function add_row_to_table(id, name, role, status)
{
	var html = '<tr id="row-' + id + '">' + generate_row_html (id, name, role, status) + '</tr>';

	$('#tbody').append(html);
}

function update_row_table(id, name, role, status)
{
	$('#row-'+id).empty();
	$('#row-'+id).append(generate_row_html (id, name, role, status));
}

function remove_row_from_table(id)
{
	$( "#row-"+id ).remove();
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
				type:'post',
				dataType: 'json',
				url: 'php/users.php',
				contentType: 'application/json',
				
	    		data: JSON.stringify({
					'request': 'user_data',
					'user_id': user_id,
				}),
				
				success:function(response)
				{
					var first_last_name_array = response['name'].split(" ");

					$('#first_name').val(first_last_name_array[0]);
					$('#last_name').val(first_last_name_array[1]);
					$('#role').val(response['role']);

					if (response['status'] == false)
					{
						$('#status').bootstrapToggle('off');
					}else
					{
						$('#status').bootstrapToggle('on');
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
		$('#status').bootstrapToggle('off');
		$('#role').val(0);
	}
}

function confirm_delete_user(user_id, user_name)
{
	$('#modal-confirm-delete-user-message').text('Delete user - ' + user_name);
	$('#delete-user-id').val(user_id);
	$('#modal-confirm-delete-user').modal('show');
}

function delete_user()
{
	var user_id = $('#delete-user-id').val();
	$.ajax
	(
		{
			type:'post',
			dataType: 'json',
			url: 'php/users.php',
			contentType: 'application/json',
			
    		data: JSON.stringify({
				'request': 'delete_user',
				'user_id': user_id,
			}),
			
			success:function(response)
			{
				if (response['status'] != false)
				{
					remove_row_from_table(user_id);
				}
				$('#user-form-modal').modal('hide');
			},
			error: function() 
			{
			    console.log("ERROR!");
			}
		}
	);

	$('#modal-confirm-delete-user').modal('hide');
}

function add_update_user()
{
	if ($('#role').val() == 0)
	{
		$('#modal-notification-message').text('Please select action!');
		$('#modal-notification').modal('show');
		return;
	}

	var user_id = $('#update_user_id').val();
    $.ajax
	(
		{
			type:'post',
			dataType: 'json',
			url: 'php/users.php',
			contentType: 'application/json',
			
    		data: JSON.stringify({
				'request': 'add_update_user',
				'name': $('#first_name').val() + ' ' + $('#last_name').val(),
				'role': $('#role').val(),
				'status': $('#status').prop('checked'),
				'user_id': user_id,
			}),
			
			success:function(response)
			{			
				if (response['status'] != false)
				{
					if (user_id == 'adduser')
					{
						add_row_to_table(response['user_id'], $('#first_name').val() + ' ' + $('#last_name').val(), $('#role').val(), $('#status').prop('checked'));
					}else
					{
						update_row_table($('#update_user_id').val(), $('#first_name').val() + ' ' + $('#last_name').val(), $('#role').val(), $('#status').prop('checked'));
					}
				}
				$('#user-form-modal').modal('hide');
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
	if( $(".table-individ-checkbox:not(:checked)").length == 0)
	{
		$('#all-items').prop('checked', true);
	}else
	{
		$('#all-items').prop('checked', false);
	}
}

function mass_action(select_id)
{

	if ($('#'+select_id).val() == 0)
	{
		$('#modal-notification-message').text('Please select action!');
		$('#modal-notification').modal('show');
		return;
	}

	var checked_users_ids = $('.table-individ-checkbox:checkbox:checked').map(function()
		{
			return $(this).attr('id');
		}).get();

	if(checked_users_ids.length == 0)
	{
		$('#modal-notification-message').text('Please select some users!');
		$('#modal-notification').modal('show');
		return;
	}

	var action = $('#'+select_id).val();

	$.ajax
	(
		{
			type:'post',
			dataType: 'json',
			url: 'php/users.php',
			contentType: 'application/json',
			
    		data: JSON.stringify({
				'request': 'mass_action',
				'checked_users_ids': checked_users_ids,
				'action': action,
			}),
			
			success:function(response)
			{
				if (response['status'] != false)
				{
					$('#all-items').prop('checked', false);

					if (action == 3)
					{
						$.each(checked_users_ids, function(key, value)
						{
						    remove_row_from_table(value.replace('item-',''));
						});
					}else if(action == 2)
					{
						$.each(checked_users_ids, function(key, value)
						{
						    $('#user-status-circle-' + value.replace('item-','')).html('<i class="fa fa-circle not-active-circle"></i>');
						});
					}else if(action == 1)
					{
						$.each(checked_users_ids, function(key, value)
						{
						    $('#user-status-circle-' + value.replace('item-','')).html('<i class="fa fa-circle active-circle"></i>');
						});
					}
				}

				$('.table-individ-checkbox').prop('checked', false);
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
    fill_table(); 

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