var question = [];
var reponse = [];

function selectQuestionType() {
	var select = document.getElementById("selectType");
	for(var i=0; i < select.options.length; i++) {
		if(select.options[i].selected == true) {
			sessionStorage.setItem("type", select.options[i].value);
		}
	}
}

// Ajout d'un élément HTML pouvant être drag n drop
function addTri(reponse) {
	if(document.getElementById(reponse.name)) {
		document.getElementById(reponse.name).remove();
	}
	var div = document.getElementById("ordre");
	var p = document.createElement("p");
	p.innerHTML = reponse.value;
	p.setAttribute("class", "draggable");
	p.setAttribute("draggable", true);
	p.setAttribute("ondragstart", "drag(event)");
	p.setAttribute("value", reponse.value);
	p.setAttribute("id", reponse.name);
	div.appendChild(p);
}

// Permettre le drop
function allowDrop(e) {
    e.preventDefault();
}

// Si déplacement
function drag(e) {
	e.dataTransfer.setData("text/html", e.target.id);
}

// Si placé au dessus
function drop(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text/html");
    e.target.appendChild(document.getElementById(data));
}

// Encodage + lecture d'un fichier image
function readURLImage(input) {
	if (input.files && input.files[0]) {
	var reader = new FileReader();
	var img = document.getElementById("uploaded-image");
	reader.onload = function (e) {
	    img.src = e.target.result;
	};
	reader.readAsDataURL(input.files[0]);
	}
}

// Encodage + lecture d'un fichier audio
function readURLMusique(input) {
	if (input.files && input.files[0]) {
	var reader = new FileReader();
	var audio = document.getElementById("uploaded-audio");
	reader.onload = function (e) {
	    audio.src = e.target.result;
	    audio.controls = true;
	    audio.play();
	};
	reader.readAsDataURL(input.files[0]);
	}
}

// Vérification du formulaire
function checkForm(f) {
	if(f.q.value == "" || f.r1.value == "" || f.r2.value == "" || f.r3.value == "" || f.r4.value == "") {
		f.q.background = "red";
	}
}

// Ajout d'un question en fonction du type
function addQuestion(type) {
	sessionStorage.clear();
	switch(type) {

		// Question Texte //
		case("texte") :
			// Récupération du formulaire
			var f = document.forms["form-texte"];
			checkForm(f);
			// Question
			var q = f.q.value;
			// Thème
			var theme = null;
			for(var i = 0; i < f.t.options.length; i++) {
				if(f.t.options[i].selected) {
					theme = f.t.options[i].value
				}
			}
			// Réponses possibles
			var listeQ = new Array();
			var r1, r2, r3, r4;
			r1 = f.r1.value;
			r2 = f.r2.value;
			r3 = f.r3.value;
			r4 = f.r4.value;
			listeQ.push(r1);
			listeQ.push(r2);
			listeQ.push(r3);
			listeQ.push(r4);

			// Bonne réponse
			var answer = null;
			for(var i = 0; i < f.a.options.length; i++) {
				if(f.a.options[i].selected) {
					answer = f.a.options[i].value
				}
			}
			var question = new Question(q,theme,"TXT",answer,"");
			DBaddQuestion(question,listeQ);
			f.reset();

		break;

		// Question avec piste audio //
		case("musicale") :
			// Récupération du formulaire
			var f = document.forms["form-musicale"];
			// Récupération de l'URL de la piste audio (format base64)
			var url = document.getElementById("uploaded-audio").src;

			// Question
			var q = f.q.value;
			// Thème
			var theme = null;
			for(var i = 0; i < f.t.options.length; i++) {
				if(f.t.options[i].selected) {
					theme = f.t.options[i].value
				}
			}
			var listeQ = new Array();
			// Réponses possibles
			var r1, r2, r3, r4;
			r1 = f.r1.value;
			r2 = f.r2.value;
			r3 = f.r3.value;
			r4 = f.r4.value;
			listeQ.push(r1);
			listeQ.push(r2);
			listeQ.push(r3);
			listeQ.push(r4);
			// Bonne réponse
			var answer = null;
			for(var i = 0; i < f.a.options.length; i++) {
				if(f.a.options[i].selected) {
					answer = f.a.options[i].value
				}
			}
			var question = new Question(q,theme,"MUS",answer,url);
			DBaddQuestion(question,listeQ);
			f.reset();

		break;

		// Question avec une image //
		case("image") :
			// Récupération du formulaire
			var f = document.forms["form-image"];
			// Récupération de l'URL de l'image (format base64)
			var url = document.getElementById("uploaded-image").src;

			// Question
			var q = f.q.value;
			// Thème
			var theme = null;
			for(var i = 0; i < f.t.options.length; i++) {
				if(f.t.options[i].selected) {
					theme = f.t.options[i].value
				}
			}

			// Réponses possibles
			var listeQ = new Array();

			var r1, r2, r3, r4;
			r1 = f.r1.value;
			r2 = f.r2.value;
			r3 = f.r3.value;
			r4 = f.r4.value;
			listeQ.push(r1);
			listeQ.push(r2);
			listeQ.push(r3);
			listeQ.push(r4);
			// Bonne réponse
			var answer = null;
			for(var i = 0; i < f.a.options.length; i++) {
				if(f.a.options[i].selected) {
					answer = f.a.options[i].value
				}
			}
			var question = new Question(q,theme,"IMG",answer,url);
			DBaddQuestion(question,listeQ);
			f.reset();
		break;
		case("tri") :
			// Récupération du formulaire
			var f = document.forms["form-tri"];

			// Question
			var q = f.q.value;
			// Thème
			var theme = null;
			for(var i = 0; i < f.t.options.length; i++) {
				if(f.t.options[i].selected) {
					theme = f.t.options[i].value
				}
			}
			// Réponses possibles
			var r1, r2, r3, r4;
			r1 = f.r1.value;
			r2 = f.r2.value;
			r3 = f.r3.value;
			r4 = f.r4.value;

			// Ordre des réponses
			var zone1 = document.getElementById("pos1")
			var pos1 = zone1.childNodes[0].id;
			var zone2 = document.getElementById("pos2")
			var pos2 = zone2.childNodes[0].id;
			var zone3 = document.getElementById("pos3")
			var pos3 = zone3.childNodes[0].id;
			var zone4 = document.getElementById("pos4")
			var pos4 = zone4.childNodes[0].id;
			f.reset();
		break;
	}
}

// Attente des réponses avant de passer à autre chose
var handleReponses = function(tab2) {
	for(var i in tab2) {
		reponse.push(tab2[i]);
	}
	sessionStorage.setItem("r", JSON.stringify(reponse));
	var currentUrl = window.location.pathname;
	var url = currentUrl.replace("index.html", "serie.html");
	window.location.href = url;
}

// Attente des questions avant de passer à autre chose
var handleQuestions = function(tab) {
	for(var i in tab) {
		question.push(tab[i]);
	}
	sessionStorage.setItem("q", JSON.stringify(question));

	for(var i in question) {
		RecupReponse(question[i].id, handleReponses);
	}
}

// Pour lancer une série de questions
function lancerSerie(themeId) {
	sessionStorage.clear();
	question = [];
	reponse = [];
	sessionStorage.setItem("t", themeId);
	RecupQuestions(themeId, handleQuestions);
}


