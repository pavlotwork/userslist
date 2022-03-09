<?php
require_once('Controler.php');
$Controler = new Controler();

if ($_POST['request'] == 'delete_user')
{
	$result = $Controler->delete_user($_POST['user_id']);
	echo json_encode(array('result' => $result));
}

if ($_POST['request'] == 'add_update_user')
{
	$_POST['status'] = filter_var($_POST['status'], FILTER_VALIDATE_BOOLEAN);

	if ($_POST['user_id'] == 'adduser')
	{
		$result = $Controler->add_user($_POST['status'], $_POST['role'], $_POST['name']);

	}elseif(!empty($_POST['user_id']))
	{
		$result = $Controler->update_user($_POST['user_id'], $_POST['role'], $_POST['name'], $_POST['status']);

	}else
	{
		$result = FALSE;
	}

	echo json_encode(array('result' => $result));
}

if ($_POST['request'] == 'get_user_data')
{
	$result = $Controler->get_users_data($_POST['user_id']);
	echo json_encode($result[0]);
}

if ($_POST['request'] == 'mass_action')
{
	foreach ($_POST['checked_users_ids'] as $key => $value)
	{
		$users_ids[] = str_replace('item-', '', $value);
	}

	if ($_POST['action'] == '1')
	{
		$result = $Controler->update_user($users_ids, FALSE, FALSE, TRUE);
	}elseif($_POST['action'] == '2')
	{
		$result = $Controler->update_user($users_ids, FALSE, FALSE, FALSE);
	}elseif($_POST['action'] == '3')
	{
		$result = $Controler->delete_user($users_ids);
	}

	echo json_encode(array('result' => $result));
}