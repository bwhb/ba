<?php
echo "<pre>";
/*$files = scandir("data");
foreach ($files as $f) {
	if (preg_match("/\w{6}\.json/", $f)){
		$data  = json_decode(file_get_contents("data/".$f));
		$data->id = substr($f, 0,6);
		$data = json_encode($data);
		file_put_contents("data/".$f, $data);

	}
}*/
$data = json_decode( file_get_contents("data.json") );
foreach ($data as $d) {
	if(!file_exists("data/".substr(md5($d->mail),0,6) .".json")){
		echo substr(md5($d->mail),0,6).".json\n";
		$d->id = substr(md5($d->mail),0,6);
    $d->mail="";
 		file_put_contents("data/".$d->id.".json", json_encode($d) );
	}
	//else echo $d->name;

}
 ?>