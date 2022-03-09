<?php
require_once('Controler.php');
$Controler = new Controler();
$users_data = $Controler->get_users_data();
//print_r("<pre>\n");print_r('$users_data : ');print_r($users_data);print_r("\n</pre>");
?>
<?php foreach ($users_data as $key => $value) : ?>
 <tr>
  <td class="align-middle">
    <div
      class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top">
      <input type="checkbox" role="switch" class="custom-control-input table-individ-checkbox" id="item-<?= $value['id'] ?>" onchange="indiv_checkbox_change()">
      <label class="custom-control-label" for="item-<?= $value['id'] ?>"></label>
    </div>
  </td>
  <td class="text-nowrap align-middle"><?= $value['name'] ?></td>
  <td class="text-nowrap align-middle"><span><?= $value['role'] ?></span></td>
  <?php if ($value['status'] == TRUE) : ?>
  <td class="text-center align-middle"><i class="fa fa-circle active-circle"></i></td>
  <?php else : ?>
  <td class="text-center align-middle"><i class="fa fa-circle not-active-circle"></i></td>
  <?php endif; ?>
  <td class="text-center align-middle">
    <div class="btn-group align-top">
      <button class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-target="#user-form-modal" data-bs-userid="<?= $value['id'] ?>">Edit</button>
      <button class="btn btn-sm btn-outline-secondary badge" type="button" onclick="delete_user('<?= $value['id'] ?>')"><i class="fa fa-trash"></i></button>
    </div>
  </td>
</tr>
<?php endforeach; ?>