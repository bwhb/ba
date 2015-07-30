<?php 
	echo"<pre>";
	$dir = "data/";
	$files = scandir($dir);
	$teilnahmenein = 0;
	$teilnahmeja = 0;
	$csv[] = "ID;Teilnahme;Mittag;Abend;Gunzenhauser;Kunstsammlung;Kosmonautenzentrum;Archäologie;Selbstläufer1";
	foreach ($files as $f) {
		if(file_exists($dir.$f)&&preg_match("/\w{6}\.json/", $f)){

			$gesamt++;
			$data = json_decode(file_get_contents($dir.$f));
			$csv[] = $data->id.";".$data->teilnahme.";".$data->mittag.";".$data->abend.";".$data->programm[0]->a.";".$data->programm[1]->b.";".$data->programm[2]->c.";".$data->programm[3]->d.";".$data->programm[4]->e;
		//	print_r($data);
		//	$names[$data->id] = $data->name;
			if ($data->teilnahme=="1"){
				$teilnahmeja++;
				$names[] = $data->name." ".$data->id;


				if ($data->mittag=="1")$mittagja++;
				else if ($data->mittag=="0")$mittagnein++;
				if ($data->abend=="1")$abendja++;
				else if ($data->abend=="0")$abendnein++;
				if ($data->programm[0]->a>0){
					$gunzenhauser++;
					$gunzenhauserwertung = $gunzenhauserwertung + $data->programm[0]->a;
				}
				if ($data->programm[1]->b>0){
					$kunstsammlung++;
					$kunstsammlungwertung = $kunstsammlungwertung + $data->programm[1]->b;
				}
				if ($data->programm[2]->c>0){
					$kosmonauten++;
					$kosmonautenwertung = $kosmonautenwertung + $data->programm[2]->c;
				}
				if ($data->programm[3]->d>0){
					$knochen++;
					$knochenwertung = $knochenwertung + $data->programm[3]->d;
				}
				if ($data->programm[4]->e>0){
					$faust++;
					$faustwertung = $faustwertung + $data->programm[4]->e;
				}


			}
			else if ($data->teilnahme=="0")$teilnahmenein++;
			
		}

	}
	echo "Vorhandene Datensätze:\t".$gesamt;
	echo "\nTeilnahmen:\t".$teilnahmeja;
	echo "\nAbsagen:\t".$teilnahmenein;
	echo "\nFleisch:\t".$mittagja;
	echo "\nVegetarisch:\t".$mittagnein;
	echo "\nAbendkultur:\t".$abendja;
	echo "\nFrühfahrer:\t".$abendnein;
	echo "\n\nGunzenhauser:\t".$gunzenhauser."\tWertungspunkte:\t".$gunzenhauserwertung." (".$gunzenhauserwertung/$gunzenhauser.")";
	echo "\nKunstsammlung:\t".$kunstsammlung."\tWertungspunkte:\t".$kunstsammlungwertung." (".$kunstsammlungwertung/$kunstsammlung.")";
	echo "\nKosmonauten:\t".$kosmonauten."\tWertungspunkte:\t".$kosmonautenwertung." (".$kosmonautenwertung/$kosmonauten.")";
	echo "\nArchälogie:\t".$knochen."\tWertungspunkte:\t".$knochenwertung." (".$knochenwertung/$knochen.")";
	echo "\nSelbstläufer:\t".$faust."\tWertungspunkte:\t".$faustwertung." (".$faustwertung/$faust.")\n";
	//print_R($names);
$t = implode("\n", $csv);
//echo "$t";
file_put_contents("data.csv", utf8_decode($t));
 ?>