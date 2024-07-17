
<?php
require_once 'model/DataModel.php';

class DataController {
    public function invoke() {
        if (isset($_GET['action']) && $_GET['action'] == 'getData') {
            echo json_encode($this->getData());
            return;
        }
        include 'view/index.php';
    }

    public function getData() {
        $model = new DataModel();
        return $model->fetchData();
    }
}
?>

