<?php
class DBmodel
{
	const DB_HOST = 'localhost';
    const DB_USER = 'jthousen_softspring';
    const DB_PASS = 'vOc7mYCPgM3s';
    const DB_NAME = 'jthousen_softspring';

    const TABLE_USERS = 'users';

    const COLUMN_ID = 'id';
    const COLUMN_STATUS = 'status';
    const COLUMN_ROLE = 'role';
    const COLUMN_NAME = 'name';

    private function queryTheDatabase($query, $return_id = FALSE)
    {   
        $connection = new mysqli(self::DB_HOST,self::DB_USER,self::DB_PASS,self::DB_NAME);
        
        if (!$connection->set_charset("utf8"))
        {
            printf("ERROR set_charset utf8: %s\n", $connection->error);
        }
        $result = $connection->query($query);
        

        if($return_id == TRUE)
        {
           $data = mysqli_insert_id($connection);
        }elseif(is_bool($result))
        {
            $data = $result;
        }else{
            while( $row = mysqli_fetch_array($result, MYSQLI_ASSOC) )
            {
                $data[] = $row;
            }
        }

        mysqli_close($connection);
        return $data;
    }

    public function get_users_data($id = FALSE)
    {
        if($id != FALSE)
        {
            $query = "SELECT * FROM `".self::TABLE_USERS."` WHERE `".self::COLUMN_ID."` = '".$id."'";
        }else
        {
            $query = "SELECT * FROM `".self::TABLE_USERS."` ORDER BY `".self::COLUMN_ID."` ASC";
        }

        return $this->queryTheDatabase($query);
    }

    public function insert_user($status = FALSE, $role = NULL, $name = '')
    {
    	 $query = "INSERT INTO `".self::TABLE_USERS."` 
			    	 	( 
			            `".self::COLUMN_STATUS."`,
			            `".self::COLUMN_ROLE."`,
			            `".self::COLUMN_NAME."`
			           	)

                VALUES (
                        '".$status."',
                        '".$role."',
                        '".$name."'
                        )";

        return $this->queryTheDatabase($query, TRUE);
    }

    public function update_user($id = FALSE, $role = FALSE, $name = FALSE, $status = NULL)
    {
    	if($id == FALSE) return FALSE;

    	if($status !== NULL) $set[] = "`".self::COLUMN_STATUS."` = '".$status."'";
    	if($role !== FALSE) $set[] = "`".self::COLUMN_ROLE."` = '".$role."'";
    	if($name !== FALSE) $set[] = "`".self::COLUMN_NAME."` = '".$name."'";

    	$query = "UPDATE `".self::TABLE_USERS."` SET ";
    	$query .= implode(',', $set);

        if(is_array($id) & !empty($id))
        {
            $id = implode(',', $id);
            $query .= " WHERE `".self::COLUMN_ID."` IN (".$id.")";
        }else
        {
            $query .= " WHERE `".self::COLUMN_ID."` = '".$id."'";
        }
        

        return $this->queryTheDatabase($query);
    }

    public function delete_user($id = FALSE)
    {
    	if($id == FALSE) return FALSE;

        if(is_array($id) & !empty($id))
        {
            $id = implode(',', $id);
            $query = "DELETE FROM `".self::TABLE_USERS."` WHERE `".self::COLUMN_ID."` IN (".$id.")";
        }else
        {
            $query = "DELETE FROM `".self::TABLE_USERS."` WHERE  `".self::TABLE_USERS."`.`".self::COLUMN_ID."` = '".$id."' ";
        }

        return $result = $this->queryTheDatabase($query);
    }
}