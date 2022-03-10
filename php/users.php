<?php
require_once('DBmodel.php');

$DB = new DBmodel();

$data = json_decode(file_get_contents('php://input'), true);

if ($data['request'] == 'get_users_data')
{
	$result = $DB->get_users_data();
	echo json_encode($result);
}

if ($data['request'] == 'user_data')
{
	$result = $DB->get_users_data($data['user_id']);
	echo json_encode($result[0]);
}

if ($data['request'] == 'add_update_user')
{
	$data['status'] = filter_var($data['status'], FILTER_VALIDATE_BOOLEAN);

	if ($data['user_id'] == 'adduser')
	{
		$user_id = $DB->insert_user($data['status'], $data['role'], $data['name']);
		$result = TRUE;

	}elseif(!empty($data['user_id']))
	{
		$result = $DB->update_user($data['user_id'], $data['role'], $data['name'], $data['status']);

	}else
	{
		$result = FALSE;
	}

	echo json_encode(array('status' => $result, 'user_id' => $user_id));
}

if ($data['request'] == 'delete_user')
{
	$result = $DB->delete_user($data['user_id']);
	echo json_encode(array('result' => $result));
}

if ($data['request'] == 'mass_action')
{
	foreach ($data['checked_users_ids'] as $key => $value)
	{
		$users_ids[] = str_replace('item-', '', $value);
	}

	if ($data['action'] == '1')
	{
		$result = $DB->update_user($users_ids, FALSE, FALSE, TRUE);
	}elseif($data['action'] == '2')
	{
		$result = $DB->update_user($users_ids, FALSE, FALSE, FALSE);
	}elseif($data['action'] == '3')
	{
		$result = $DB->delete_user($users_ids);
	}

	echo json_encode(array('status' => $result));
}