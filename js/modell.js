
var attraktionen = {
	data : [],
	pflicht: ["Stadtführung"],
	teilnehmen: function (attraktion,zeitpunkt){
		var ret = false;
		attraktionen.data.forEach(function(key,index){
			if (attraktion == key.name && key.plaetze[zeitpunkt]>0){
				key.plaetze[zeitpunkt] --;
				ret =  true;
			}
		});
		if(ret)return true;
		return false;
	},
	teilnehmen_anfrage: function (attraktion,zeitpunkt){
		var ret = false;
		attraktionen.data.forEach(function(key,index){
			if (attraktion == key.name && key.plaetze[zeitpunkt]>0){
				ret =  true;
			}
		});
		if(ret)return true;
		return false;
	},
	liste: function(zeitpunkt){

		var r = [];
		var z = zeitpunkt || "all";

		if(z=="all"){
			attraktionen.data.forEach(function(key){
			r.push(key.name);
			});
		}
		else{
			attraktionen.data.forEach(function(key){
				if (key.plaetze[z]>500 )r.push(key.name );
				else if (key.plaetze[z]>=0)r.push(key.name +" ("+key.plaetze[z]+")");
			});
		}
		return r;

	},
	pflichtprogramm: function(programm,aktiv){
		ret = false;
		counter =   0;
		programmpunkte = []; // enthält die zu prüfenden Programmpunkte
		pflichterfuellung = {} //enthält die Pflichprogrammpunkte mit den Zeitpunkten als Array
		zeitpunkte = ["vormittag","nachmittag1","nachmittag2"];
		attraktionen.pflicht.forEach(function(key){
			pflichterfuellung[key]=[];
			zeitpunkte.forEach(function(z){
				if(attraktionen.teilnehmen_anfrage(key,z)){

					pflichterfuellung[key].push(z);
				}
			})
		})
		for (p in programm){
			if(programm[p].length&&attraktionen.pflicht.indexOf(programm[p])!=-1){
				counter++;
			}
			if(zeitpunkte.indexOf(p)!=-1 && p!=aktiv){
				programmpunkte.push(p);
			}
		}

		if (counter==attraktionen.pflicht.length) return false;
		else{
			for (p in pflichterfuellung){
				var diff =0 ;
				var index = null;
				pflichterfuellung[p].forEach(function(key,i){
					if (programmpunkte.indexOf(key)!=-1&&programm[aktiv]!=Object.keys(pflichterfuellung)){
						diff++;
						index = i;
						programm.pflicht.push(index);
					}
				})
				if(diff>=1&&programm.pflicht.length==1){
					programm[pflichterfuellung[p][index]] = p;
					ret = true;
				}
			}
		}
		if(programm.pflicht.length>1)programm.pflicht =[]
		if (ret) return programm;
		else return false;
	}
}

var User = function(name) {
  this.name = name;
}
User.prototype = {
	"programm" : {
		"vormittag": "",
		"nachmittag1":"",
		"nachmittag2":"",
		"pflicht":[]
	}
}
var attraktionsliste = {
	"gun": "Gunzenhauser",
	"mus": "Museum für Archäologie",
	"sta": "Stadtführung",
	"kun": "Kunstsammlung",
	"auf": "Auf eigene Faust",
	"kos": "Kosmonautenzentrum"
}
function prog1(){
	$(".attraktionen").remove();
	programm.forEach(function(key,index){
		attrakt = attraktionen.liste(key);
		attrakt.forEach(function(a, i){
			a = a.replace(/(.*)\((\d+)\).*/,"$1<span class='badge'>$2</span>");
			a.match(/\>0\</) ? aclass="disabled" : aclass="";

			$("div."+programm[index]).append("<a href='javascript:void(0);' id='"+key+i+"' class='list-group-item attraktionen "+programm[index]+" "+a.substr(0,3).toLowerCase()+" "+aclass+"' data-attraktion='"+a.substr(0,3).toLowerCase()+"'>"+a+"</a>");
		})
	})
}
function prog2(){
	programm.forEach(function(key,index){
		attrakt = attraktionen.liste(key);
		attrakt.forEach(function(a, i){
			a = a.replace(/(.*)\((\d+)\).*/,"$2");
			if($("#"+key+i).find(".badge").length==1)$("#"+key+i).find(".badge").text(a);
			if((!a.match(/\d+/)||Number(a)<=0)&&$("#"+key+i).find(".badge").length==1&&!$("#"+key+i).hasClass("active")){

				$("#"+key+i).addClass("disabled");
			}
			else $("#"+key+i).removeClass("disabled");
		})
	})
}

var programm = ["vormittag","nachmittag1","nachmittag2"];
var programm_full = ["Vormittags","Früher Nachmittag","Später Nachmittag"];
var attraktion;

$(document).on("click",".vormittag, .nachmittag1, .nachmittag2",function(event){
	event.stopPropagation();
	clicker($(this));
})

$(document).on("mouseover",".vormittag, .nachmittag1, .nachmittag2",function(event){
	event.stopPropagation();
	info($(this));
})
$(document).on("click","#attr_buchen",function(event){
	event.stopPropagation();
})


function clicker(that){
	 $.getJSON('io.php', {'do': 'getdata', 'u': 'attraktionen', ts:  new Date().getTime()}, function(json, textStatus) {
	 	var data = $("body").data()
	 	if (that.hasClass("list-group")||that.hasClass("disabled")) return;
		$(".attraktionen").addClass('disabled')
		$(".attraktionen").removeClass("active");
    bw.programm[that.parent(".list-group").data("zeitpunkt")]= attraktionsliste[that.data("attraktion")];
    rclass = that.parent(".list-group").data("zeitpunkt");
    temp = attraktionen.pflichtprogramm(bw.programm,rclass);
    if (typeof(temp)=="object")bw.programm = temp
    bw.programm.pflicht.forEach(function(e){
    })
    for (key in bw.programm){
      if(bw.programm[key].length>0&&programm.indexOf(key)!=-1){
        $("."+key).find("."+bw.programm[key].substr(0,3).toLowerCase()).addClass("active");
      }
    }
    $("."+that.data("attraktion")).removeClass('active');
    for (var prop in bw.programm) {
        if (bw.programm[prop]==attraktionsliste[that.data("attraktion")]) bw.programm[prop]="";
    }
    console.dir(bw.programm);
		bw.programm[that.parent(".list-group").data("zeitpunkt")]= attraktionsliste[that.data("attraktion")];
		$.post('io.php', {'do': 'setdata', "k" : that.parent(".list-group").data("zeitpunkt"), "d" : attraktionsliste[that.data("attraktion")], "u": data.id, dataob: bw.programm}, function(json, textStatus) {
			data = json;
			$("body").data(data);
			that.addClass("active");
			bw.programm.pflicht = []
			if($("#programmauswahl").find(".active").length==3){
				$("#attr_buchen").removeAttr('disabled',false);
				if($("#nav_attraktionswahl").find(".glyphicon").length==0)$("#nav_attraktionswahl").html($("#nav_attraktionswahl").html()+"<span class='glyphicon glyphicon-ok'></span>");
			}else{
				$("#nav_attraktionswahl").find('.glyphicon-ok').remove()
			}
			 $.getJSON('io.php', {'do': 'getdata', 'u': 'attraktionen', ts:  new Date().getTime()}, function(json, textStatus) {
				$(".attraktionen").removeClass('disabled')

	 			attraktionen.data=json;
				prog2();
			})
		});
	});
}
$(document).on("click","#nav_attraktionswahl",function(){

})
function info(that){
	if (that.hasClass("list-group")) return;
	$(".info").hide()
	$("#info_"+that.data("attraktion")).show()
}