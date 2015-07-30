<?php
if ($_REQUEST['do']=="getdata" && isset($_REQUEST['u'])) {
	if(file_exists("data/".$_REQUEST['u'].".json")){
		die(file_get_contents("data/".$_REQUEST['u'].".json"));

	}

}
if ($_REQUEST['do']=="setdata" && isset($_REQUEST['u'])) {
	if(file_exists("data/".$_REQUEST['u'].".json")){
		$model_data = Array("vormittag","nachmittag1","nachmittag2");
		if(!isset($_REQUEST['dataob'])){
			$data = file_get_contents("data/".$_REQUEST['u'].".json");
			$data = json_decode($data);
			if($_REQUEST["k"]=="abendprogramm")$_REQUEST["k"] = "abend";
			$data->$_REQUEST["k"] = $_REQUEST["v"];
			file_put_contents("data/".$_REQUEST['u'].".json", json_encode($data));
		}
		else if(isset($_REQUEST['dataob'])){
			$data = file_get_contents("data/".$_REQUEST['u'].".json");
			$data = json_decode($data);
			$model = file_get_contents("data/attraktionen.json");
			$model = json_decode($model);
      $user = $_REQUEST['dataob'];
      foreach ($user as $u => $v) {
        if($v!=$data->$u){
          foreach ($model as $m=>$mv) {
            if ($mv->name == $data->$u){
              $mv->plaetze->$u++;
            }
            if ($mv->name == $v){
              $mv->plaetze->$u--;
            }
          }
        }
        $data->$u=$v;
      }
      file_put_contents("data/attraktionen.json", json_encode($model));
			file_put_contents("data/".$_REQUEST['u'].".json", json_encode($data));
		}
	die(json_encode($data));
	}

}
if ($_REQUEST['do']=="interesse" && isset($_REQUEST['u'])&& isset($_REQUEST['k'])) {
	if(file_exists("data/".$_REQUEST['u'].".json")){
		$data = file_get_contents("data/".$_REQUEST['u'].".json");
		$data = json_decode($data);
		$sel = ["a"=>0,"b"=>1,"c"=>2,"d"=>3,"e"=>4];
		$data->programm[$sel[$_REQUEST["k"]]]->$_REQUEST["k"] = $_REQUEST["v"];
		file_put_contents("data/".$_REQUEST['u'].".json", json_encode($data));
		die(json_encode($data));
	}

}
if ($_REQUEST['do']=="setprogramm" && isset($_REQUEST['u'])&& isset($_REQUEST['p'])) {
	if(file_exists("data/".$_REQUEST['u'].".json")){
		$data = file_get_contents("data/".$_REQUEST['u'].".json");
		$data = json_decode($data);
		$sel = ["a"=>0,"b"=>1,"c"=>2,"d"=>3,"e"=>4];
		$data->programm[$sel[$_REQUEST["k"]]]->$_REQUEST["k"] = $_REQUEST["v"];
		file_put_contents("data/".$_REQUEST['u'].".json", json_encode($data));
		die(json_encode($data));
	}

}

if ($_REQUEST['do']=="mail"){
	echo "MAILVERSAND";
	if(!file_exists("lock")){
		$user = scandir("data");
		foreach ($user as $u){
			unset($headers,$body);
			if(preg_match_all("/\w{6}\.json/", $u)){
				$data = json_decode(file_get_contents("data/".$u));
				$to = $data->mail;
				//$to="benjamin.weber@bverwg.bund.de";
				$subject = '[Betriebsausflug 2015] Erinnerung: (Vor-)Anmeldebogen';
				$headers[] 	= "From: betriebsausflug2015@bverwg.bund.de";
				$headers[] 	= "Reply-To: betriebsausflug2015@bverwg.bund.de";
				$headers[] 	= "Repturn-Path: betriebsausflug2015@bverwg.bund.de";
				$headers[] 	= "MIME-Version: 1.0";
				//$headers 	= "$data->mail\n\r\n\r";
				$body[] = "Liebe Kolleginnen und Kollegen,\n\r";
				$body[] = "am 24.4.2015 endete der Termin für die (Vor-)Anmeldung zur Teilnahme am Betriebsausflug 2015 nach Chemnitz. Da sich noch nicht alle Kolleginnen und Kollegen gemeldet haben, wird der Termin bis zum 8. Mai 2015 verlängert. \n\rHier finden Sie Ihren persönlichen Anmeldebogen: http://wid/betriebsausflug/?u=".$data->id."\n\r";
				$body[] = "Bitte nehmen Sie sich die Zeit und teilen Sie uns Ihre Teilnahmeabsichten mit. Es handelt sich noch nicht um eine feste Anmeldung, sondern um eine Orientierungshilfe für die weitere Planung. Sie können Ihre Angaben zu jedem späteren Zeitpunkt noch ändern.\n\r";
				$body[] = "Für Rückfragen stehen wir Ihnen gerne zur Verfügung.\n\r";
				$body[] = "Ihr Organisationsteam „Betriebsausflug 2015“\n\r";
				$body[] = "Fr. K. Fröhlich, Fr. Wolf, Fr. Ihle, Fr. Brömler";
				echo "<pre>";
				if(!$data->teilnahme||$data->teilnahme==="null"){
					$mail_sent = mail( $to, $subject, implode($body,"\r\n"), implode($headers,"\r\n"), "-fbetriebsausflug2015@bverwg.bund.de" );
				}
				//$body = implode(" ", $body);
				//file_put_contents("mails/".$u.".txt", $headers." ".$body);
		 	}
		}
	echo "Die E-Mail wurde versendet.";
	file_put_contents("lock", "");


	}

}
 ?>
