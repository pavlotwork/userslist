<?php
require_once('DBmodel.php');

class Controler
{
	function __construct()
    {   
    	$this->DBmodel = new DBmodel();
    }

	public function get_users_data($user_id = FALSE)
	{
		return $this->DBmodel->get_users_data($user_id);
	}

	public function delete_user($user_id)
	{
		return $this->DBmodel->delete_user($user_id);
	}

	public function add_user($status, $role, $name)
	{
		return $this->DBmodel->insert_user($status, $role, $name);
	}

	public function update_user($id, $role, $name, $status)
	{
		return $this->DBmodel->update_user($id, $role, $name, $status);
	}
}