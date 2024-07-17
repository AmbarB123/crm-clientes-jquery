<?php
    class DataModel {
        public function fetchData() {
            $url = 'https://documenter.getpostman.com/view/3936594/S1a4Z7cb?version=latest';
            $response = file_get_contents($url);
            $data = json_decode($response, true);
            echo $data;
            return $data['result'];
        }
    }
?>
