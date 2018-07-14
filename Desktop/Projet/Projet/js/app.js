var myApp = angular.module("serieApp", []);

// Tableaux contenants les réponses et questions de la série
var max = 5;
var score = 0;
var userAnswer = [];
var questionSerie = [];
var questionRand = [];
var reponseSerie = [];
var reponseRand = [];
var themes =[
  {name:"Geographie", id: 1},
  {name:"Divertisement", id: 2},
  {name:"Histoire", id: 3},
  {name:"Art & Litterature", id: 4},
  {name:"Science & Nature", id: 5},
  {name:"Sport & Loisirs", id: 6}
];
var indiceCurrentQ = 0;
var currentTheme = "";

function randQuestions() {
	var nb = 0;
	while(nb != 5) {
		var q = Math.floor(Math.random() * questionSerie.length);
		questionRand.push(questionSerie[q]);
		questionSerie.splice(q, 1);
		nb++;
	}
}

// Contrôleur de la série de question
myApp.controller('serieCtrl', ['$scope', function($scope) {

	// Récupération des questions & réponses associées
	questionSerie = JSON.parse(sessionStorage.getItem("q"));
	reponseSerie = JSON.parse(sessionStorage.getItem("r"));

	// Parmis les questions n'en garder que 5 au hasard
	randQuestions();


	// Initialisation de la série
	$scope.initialiserSerie = function () {

		// On affiche la série et on masque le score
		$scope.serie = true;
		$scope.showImage = false;
		$scope.showAudio = false;

		// Récupération du nom de thème choisit
		for(var t in themes) {
			if(themes[t].id == sessionStorage.getItem("t")) {
				currentTheme = themes[t].name;
			}
		}

		// On injecte le thème et la question à la vue
		$scope.currentTheme = currentTheme;
		$scope.currentQ = questionRand[indiceCurrentQ].label;

		// S'il y a une image ou piste audio
		if(questionRand[indiceCurrentQ].Type == "IMG") {
			$scope.imgSrc = questionRand[indiceCurrentQ].src;
			$scope.showImage = true;
		} else if(questionRand[indiceCurrentQ].Type == "MUS") {
			$scope.audioSrc = questionRand[indiceCurrentQ].src;
			$scope.showAudio = true;
		}
		
		// On enregistre les réponses
		for(var i in reponseSerie) {
			if(reponseSerie[i].idQuestion == questionRand[indiceCurrentQ].id) {
				reponseRand.push(reponseSerie[i]);
			}
		}
		$scope.currentR = reponseRand;
		$scope.indiceCurrentQ = indiceCurrentQ + 1;
	}

	// Quand on veut passer à la question suivante
	$scope.nextQuestion = function(answer) {
		$scope.showImage = false;
		$scope.imgSrc = "";
		$scope.showAudio = false;
		$scope.audioSrc = "";
		reponseRand = [];

		// On enregistre sa réponse
		userAnswer[indiceCurrentQ] = answer;
		indiceCurrentQ++;

		// On vérifie s'il n'a pas dépassé le nombre de questions de la série
		if(indiceCurrentQ < max) {
			$scope.currentQ = questionRand[indiceCurrentQ].label;


			// Selon le type de question
			if(questionRand[indiceCurrentQ].Type === "IMG") {
				$scope.imgSrc = questionRand[indiceCurrentQ].src;
				$scope.showImage = true;
			} else if (questionRand[indiceCurrentQ].Type === "MUS") {
				$scope.audioSrc = questionRand[indiceCurrentQ].src;
				$scope.showAudio = true;
			}

			for(var i in reponseSerie) {
				if(reponseSerie[i].idQuestion == questionRand[indiceCurrentQ].id) {
					reponseRand.push(reponseSerie[i]);
				}
			}
			$scope.currentR = reponseRand;
			$scope.indiceCurrentQ = indiceCurrentQ + 1;
		// Sinon on affiche le score
		} else {
			for(var r in userAnswer) {
				if(userAnswer[r] == questionRand[r].Answer) {
					score++;
				}
			}
			$scope.serie = false;
			$scope.resultat = true;
			$scope.score = score;
			switch(score) {
				case 0:
					$scope.messageScore = "Bravo vous n'avez plus qu'a retourner en cours !";
				break;
				case 1:
					$scope.messageScore = "C'est un début !";
				break;
				case 2:
					$scope.messageScore = "Mouais légèrement en dessous de la moyenne";
				break;
				case 3:
					$scope.messageScore = "Ok je l'admets c'est la moyenne :o";
				break;
				case 4:
					$scope.messageScore = "On frise la perfection !";
				break;
				case 5:
					$scope.messageScore = "Bravo vous avez atteint la perfection ! Mais vous pouvez mieux faire !";
				break;
			}
		}
	}

}]);


