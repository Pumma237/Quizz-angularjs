var indexedDB = window.indexedDB;

const DB_NAME = 'BddQuizz';
const DB_VERSION = 4;
const DB_STORE_NAME_THEME = 'Theme';
const DB_STORE_NAME_QUESTION = 'Question';
const DB_STORE_NAME_REPONSE = 'Reponse';
var ThemeBDD;
var QuestionBDD;
var db;

var themes =[
  {name:"Geographie", unique: true },
  {name:"Divertisement",unique: true },
  {name:"Histoire",unique: true },
  {name:"Art & Litterature",unique: true },
  {name:"Science & Nature",unique: true },
  {name:"Sport & Loisirs",unique: true }
];

var questions =[
  {label:"Quelle est la capitale du Pérou ?", unique: true , idTheme: "1", Type: "TXT",src:"",Answer: "r1"},
  {label:"Quel est le symbole chimique de l'Arsenic ?", unique: true , idTheme: "5", Type: "TXT",src:"",Answer: "r3"},
  {label:"Qui a écrit Charlie et la chocolaterie ?", unique: true , idTheme: "4", Type: "TXT",src:"",Answer: "r2"},
  {label:"Quel joueur de football a marqué le premier but en or de l'histoire de la coupe du monde ?", unique: true , idTheme: "6", Type: "TXT",src:"",Answer: "r3"},
  {label:"Sur quel continent vit le kinkajou ?", unique: true , idTheme: "1", Type: "TXT",src:"",Answer: "r1"},
  {label:"Quel pays reçoit le plus grand nombre de demandes d'immigration de français ?", unique: true , idTheme: "1", Type: "TXT",src:"",Answer: "r4"},
  {label:"Quelle feuille est au centre du drapeau canadien ?", unique: true , idTheme: "1", Type: "TXT",src:"",Answer: "r3"},
  {label:"Comment appelle-t-on les habitants de l'île de Mayotte ?", unique: true , idTheme: "1", Type: "TXT",src:"",Answer: "r3"},
];

var reponses =[
  {label:"Lima",idQuestion:1, unique:true, position:"r1",Type:"TXT"},
  {label:"Santiago", idQuestion:1,unique:true, position:"r2",Type:"TXT"},
  {label:"La Paz", idQuestion:1,unique:true, position:"r3",Type:"TXT"},
  {label:"Paita", idQuestion:1,unique:true, position:"r4",Type:"TXT"},

  {label:"Ar", idQuestion:2, unique:true, position:"r2",Type:"TXT"},
  {label:"Ag", idQuestion:2,unique:true, position:"r1",Type:"TXT"},
  {label:"As", idQuestion:2, unique:true, position:"r3",Type:"TXT"},
  {label:"At", idQuestion:2, unique:true, position:"r4",Type:"TXT"},

  {label:"Roald Dahl", idQuestion:3,unique:true, position:"r1",Type:"TXT"},
  {label:"J.K. Rowling",idQuestion:3, unique:true, position:"r2",Type:"TXT"},
  {label:"Charles Dickens",idQuestion:3, unique:true, position:"r3",Type:"TXT"},
  {label:"Victor Hugo",idQuestion:3, unique:true, position:"r4",Type:"TXT"},

  {label:"David Trezeguet", idQuestion:4,unique:true, position:"r1",Type:"TXT"},
  {label:"Didier Deschamps",idQuestion:4, unique:true, position:"r2",Type:"TXT"},
  {label:"Laurent Blanc",idQuestion:4, unique:true, position:"r3",Type:"TXT"},
  {label:"Zinédine Zidane",idQuestion:4, unique:true, position:"r4",Type:"TXT"},

  {label:"Amérique du Sud", idQuestion:5, unique:true, position:"r2",Type:"TXT"},
  {label:"Europe", idQuestion:5,unique:true, position:"r1",Type:"TXT"},
  {label:"Asie", idQuestion:5, unique:true, position:"r3",Type:"TXT"},
  {label:"Amérique du Nord",idQuestion:5, unique:true, position:"r4",Type:"TXT"},

  {label:"La Russie", idQuestion:6, unique:true, position:"r1",Type:"TXT"},
  {label:"La Belgique", idQuestion:6,unique:true, position:"r2",Type:"TXT"},
  {label:"Les Etats-Unis", idQuestion:6, unique:true, position:"r3",Type:"TXT"},
  {label:"Le Canada",idQuestion:6, unique:true, position:"r4",Type:"TXT"},

  {label:"Une feuille de chêne", idQuestion:7, unique:true, position:"r1",Type:"TXT"},
  {label:"Une feuille d'hêtre", idQuestion:7,unique:true, position:"r2",Type:"TXT"},
  {label:"Une feuille d'érable", idQuestion:7, unique:true, position:"r3",Type:"TXT"},
  {label:"Une feuille de vigne",idQuestion:7, unique:true, position:"r4",Type:"TXT"},

  {label:"Les Mayottais", idQuestion:8, unique:true, position:"r1",Type:"TXT"},
  {label:"Les Mayens", idQuestion:8,unique:true, position:"r2",Type:"TXT"},
  {label:"Les Mahorais", idQuestion:8, unique:true, position:"r3",Type:"TXT"},
  {label:"Les Mayottes",idQuestion:8, unique:true, position:"r4",Type:"TXT"},
];
// Ouverture de la BDD + ajout des thèmes / questions / réponses
function openDb() {
  var req = indexedDB.open(DB_NAME, DB_VERSION);

  // Si BDD récupérée
  req.onsuccess = function (evt) {
    db = req.result;
  };
  // Sinon on affiche l'erreur
  req.onerror = function (evt) {
    console.log("openDb:", evt.target.errorCode);
  };

  req.onupgradeneeded = function (evt) {
    // Création store thème & ajout des thèmes
    ThemeBDD = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_THEME, { keyPath: 'id', autoIncrement: true });
    for (var i in themes) {
      ThemeBDD.add(themes[i]);
    }
    // Création store question
    QuestionBDD = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_QUESTION, { keyPath: 'id', autoIncrement: true });
    for(var i in questions) {
      QuestionBDD.add(questions[i]);
    }

    // Création store réponse
    ReponseBDD = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_REPONSE, { keyPath: 'id', autoIncrement: true });
    for(var i in reponses) {
      ReponseBDD.add(reponses[i]);
    }

  };
}

function DBaddQuestion(q,listeR) {
  // Ouverture de la BDD
  var DBOpenRequest = window.indexedDB.open(DB_NAME, 4);
  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
  };

  // On crée un nouvel objet qu'on insèrera ensuite dans la base de données
  var newQ ={label:q.Label, unique: true , idTheme: q.IdTheme, Type: q.Type, Answer: q.Answer, src: q.src};
  questions.push(newQ);

  // On ouvre une transaction en lecture/écriture afin d'ajouter la question
  var tmp = db.transaction([DB_STORE_NAME_QUESTION], "readwrite");
  var storeQuestions = tmp.objectStore(DB_STORE_NAME_QUESTION);

  // On vérifie le statut d'ajout de la question
  var request = storeQuestions.add(newQ);
  var Answer={};

  request.onsuccess = function(e){
    console.log("onsuccess : question bien ajoutée.");
    for(var i in listeR) {
      var t = parseInt(i,10)+1;
      Answer[i] ={label:listeR[i], idQuestion:e.target.result, unique: true , position:"r"+t, Type: q.Type};
      reponses.push(Answer[i]);
    }
  };

  // On indique si la transaction s'est bien déroulée
  tmp.oncomplete = function() {
    console.log('oncomplete : transaction terminée : question bien ajoutée.');
    DBaddReponse(Answer);
  };

  // Si erreur on affiche dans le log
  tmp.onerror = function() {
    console.log('onerror : ouverture de la transaction impossible : les objets dupliqués ne sont pas autorisés.');
  };
}

function DBaddReponse(listeReponses) { 
  var copie = Object.assign({}, listeReponses);
  var DBOpenRequest = window.indexedDB.open(DB_NAME, 4);

  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
  };

  var tmp = db.transaction([DB_STORE_NAME_REPONSE], "readwrite");
  var storeReponses = tmp.objectStore(DB_STORE_NAME_REPONSE);

  for(var i in copie) {
    answer = {label: copie[i].label, idQuestion: copie[i].idQuestion, unique: true, position: copie[i].position, Type: copie[i].Type};
    var request = storeReponses.add(answer);
  }

  request.onsuccess = function(e) {
    console.log("on success : réponse bien ajoutée.");
  };


  tmp.oncomplete = function() {
    console.log('on complete : réponses bien ajoutées.');
  };

  tmp.onerror = function() {
    console.log('on error : ouverture de la transaction impossible : les objets dupliqués ne sont pas autorisés.');
  };
}

function RecupQuestions(idTheme, callBack) {
  var DBOpenRequest = window.indexedDB.open(DB_NAME, 4);  
  DBOpenRequest.onsuccess = function(e) {
    db = DBOpenRequest.result;
    var tmp = db.transaction([DB_STORE_NAME_QUESTION], "readonly");
    var storeQuestions = tmp.objectStore(DB_STORE_NAME_QUESTION);
    var TabQues = [];
    storeQuestions.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        if(cursor.value.idTheme == idTheme) {
          TabQues.push(cursor.value);
        }
        cursor.continue();
      } else {
        callBack(TabQues);
      }
    };
  };
}

function RecupReponse(idQuestion, callBack) {
  var DBOpenRequest = window.indexedDB.open(DB_NAME, 4);
  DBOpenRequest.onsuccess = function(e) {
    db = DBOpenRequest.result;
    var TabRep = [];
    var tmp = db.transaction(DB_STORE_NAME_REPONSE, "readonly");
    var storeReponses = tmp.objectStore(DB_STORE_NAME_REPONSE);
    storeReponses.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        if(idQuestion == cursor.value.idQuestion) {
          TabRep.push(cursor.value);
        }
        cursor.continue();
      } else {
        callBack(TabRep);
      }
    };
  };
}

function LogQuestion(Ques) {
  console.log('il y a ' + Ques.length +' questions ');
}


function LogReponse(Rep) {
  console.log('il y a ' + Rep.length +' Reponse ');
}

class Question {
  constructor(Label,IdTheme, Type, Answer,src) {
    this.Label = Label;
    this.IdTheme = IdTheme;
    this.Type = Type;
    this.src = src;
    this.Answer = Answer;
  }
}

class Reponse {
  constructor(Label,position, Type, idQuestion) {
    this.Label = Label;
    this.position = position;
    this.Type = Type;
    this.idQuestion = idQuestion;
  }
}
