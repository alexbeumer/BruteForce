/**
 * Created by jayfeurich on 30/05/16.
 */
var prg = prg || {

        config: {
            letters: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
            numbers: ["1","2","3","4","5","6","7","8","9","0"],
            pwMinlength: 2,
            pwMaxLength: 4,
            shuffles: 5,
        },

        users: {
            teatime : {
                password: "",
                login: "teatime",
            },
        },

        init: function() {
            prg.users.teatime.password = prg.generatePassword();
            prg.displayPassword();
            window.requestAnimationFrame(prg.bruteForce());
        },

        generatePassword: function(){
            var letters = prg.config.letters.concat(prg.config.numbers);
            var shuffled = prg.shuffle(letters, prg.config.shuffles);
            var used = [];
            var password = "";
            var pwLength = prg.giveRandomInt(prg.config.pwMinlength, prg.config.pwMaxLength);
            for (var i = 0; i < pwLength; i++) {
                var letter = shuffled[prg.giveRandomInt(0, shuffled.length -1)];
                if (used.indexOf(letter) == -1) {
                    password += letter;
                    used.push(letter);
                } else {
                    i = i - 1;
                }
            }
            return password;
        },

        giveRandomInt:function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        shuffle:function(array, repeat){
            for(var i = 0; i < repeat; i++){
                for(var j = 0; j < array.length; j++) {
                    var randomInt = prg.giveRandomInt(0, array.length -1);
                    temp = array[randomInt];
                    array[randomInt] = array[j];
                    array[j] = temp;
                }
            }
            return array;
        },

        displayPassword:function(){
            $("div:first").text("Generated Password: " +prg.users.teatime.password);
        },

        // Erhöhe den Buchstaben vor mir nur dann, wenn ich der letzte buchstabe bin oder aber alle hinter mir auch der letzte buchstabe sind!
        // Wenn es nur letzte buchstaben gibt, füge einen hinzu
        bruteForce:function() {
            var letters = prg.config.letters.concat(prg.config.numbers);
            var target = prg.users.teatime.password;
            var passwordArray = [];
            var foundPassword = false;
            var counter = 0;
            var falseGuesses = [];
            for(var i = 0; i < prg.config.pwMinlength; i++) {
                passwordArray[i] = letters[0];
            }

            while(foundPassword == false) {
                for (var i = 0; i < letters.length; i++) {
                    passwordArray[passwordArray.length -1] = letters[i];
                    foundPassword = checkPassword(passwordArray, target);
                    counter ++;
                    if(foundPassword) break;
                }
                if (onlyLastLetter(passwordArray)) {
                    for(var i = 0; i < passwordArray.length; i++){
                        passwordArray[i] = letters[0];
                    }
                    passwordArray[passwordArray.length] = letters[0];
                } else {
                    for (var i = 0; i < passwordArray.length; i++) {
                        if (passwordArray[i] == letters[letters.length -1]) {
                            var countLastLetters = 0;
                            for(var j = 0; j < passwordArray.length; j++) {
                                if (passwordArray[j] == letters[letters.length -1]) {
                                    countLastLetters += 1;
                                }
                            }
                            if (passwordArray.length - i <= countLastLetters){
                                var indexOfPreviousLetter = letters.indexOf(passwordArray[i - 1]);
                                if(letters[indexOfPreviousLetter + 1] != undefined) {
                                    passwordArray[i - 1] = letters[indexOfPreviousLetter + 1];
                                } else {
                                    passwordArray[i - 1] = letters[0];
                                }
                            }
                        }
                    }
                }
            }
            $("#counterDisplayer").text("Counted loops:" + counter);
            $("body").append(falseGuesses);

            function onlyLastLetter(passwordArray) {
                for (var i = 0; i < passwordArray.length; i++) {
                    if(passwordArray[i] != letters[letters.length -1]) {
                        return false;
                    }
                }
                return true;
            }

            function checkPassword(passwordArray, target) {
                var password = passwordArray.join("");
                if (password != target) {
                    falseGuesses[falseGuesses.length] = "No Match: "+password+ "<br>";
                    return false;
                } else {
                    $("#passwordDisplayer").text("Match: "+password);
                    return true;
                }
            }

        },

    }

$(document).ready(function() {
    prg.init();
});