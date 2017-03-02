/**
 * Created by prima on 2/20/2017.
 */

var game = new Phaser.Game(800, 500, Phaser.CANVAS, 'game-canvas', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.crossOrigin = 'anonymous';
    game.load.spritesheet('person', 'sprites/white.jpg', 222, 222);
    game.load.spritesheet('button', 'sprites/button.png', 278, 95);
    game.load.spritesheet('k12', 'sprites/school.png', 386, 239);
    game.load.spritesheet('community', 'sprites/community.png', 385, 239);
    game.load.spritesheet('privatek12', 'sprites/privateschool.png', 385, 239);
    game.load.spritesheet('trade', 'sprites/tradeschool.png', 385, 239);
    game.load.spritesheet('uni', 'sprites/university.png', 385, 239);
    game.load.spritesheet('person0', 'sprites/person_1.png', 88, 205);
    game.load.spritesheet('person1', 'sprites/person_2.png', 88, 205);
    game.load.spritesheet('person2', 'sprites/person_3.png', 88, 205);
    game.load.spritesheet('person3', 'sprites/person_4.png', 88, 205);
    game.load.spritesheet('person4', 'sprites/person_5.png', 88, 205);
    game.load.spritesheet('person5', 'sprites/person_6.png', 88, 205);
    game.load.spritesheet('person6', 'sprites/person_7.png', 88, 205);
    game.load.spritesheet('person7', 'sprites/person_8.png', 88, 205);
    game.load.spritesheet('person8', 'sprites/person_9.png', 88, 205);
    game.load.spritesheet('person9', 'sprites/person_10.png', 88, 205);
    game.load.spritesheet('person10', 'sprites/person_11.png', 88, 205);
    game.load.spritesheet('person11', 'sprites/person_12.png', 88, 205);
    game.load.spritesheet('person12', 'sprites/person_13.png', 88, 205);
    game.load.spritesheet('person13', 'sprites/person_14.png', 88, 205);
    game.load.spritesheet('person14', 'sprites/person_15.png', 88, 205);
    game.load.spritesheet('person15', 'sprites/person_16.png', 88, 205);
    game.load.spritesheet('person16', 'sprites/person_17.png', 88, 205);
    game.load.spritesheet('person17', 'sprites/person_18.png', 88, 205);
    game.load.spritesheet('person18', 'sprites/person_19.png', 88, 205);
    game.load.spritesheet('person19', 'sprites/person_20.png', 88, 205);
    game.load.spritesheet('person20', 'sprites/person_21.png', 88, 205);
    game.load.spritesheet('person21', 'sprites/person_22.png', 88, 205);
    game.load.spritesheet('person22', 'sprites/person_23.png', 88, 205);
}



var educatedPersonsGroup;
var unEducatedPersonsGroup;
var schoolsGroup;
var numOfSchools = 0;
var clickedSchool;
var gridScale;
var text;
var text2;
var canProCreate;
var createSchoolButton;
var person;
var bottomTextArea;
var topTextArea;
var schoolCoordinates = [];
var money = 1000000;
var schoolCost = 500000;
var minimumEducatedSalary = 50000;
var minimumNumForEducatedPerson = 12;
var schoolPopupExists = false;
var maintenanceFees = 0;
var taxes = 20;
var prosperityBar;
var createSchoolPopupOpen = false;
var elapsedSeconds = 0;
var gameOverDisplayed = false;

function create() {

    game.stage.backgroundColor = '#397152';
    text = "Hover over a person to see their stats";
    text2 = "$0";

    // Person generation
    var numOfEducatedPersons = 10;
    var numOfUnEducatedPersons = 20;
    gridScale = 10;
    var rows= 100;
    game.add.sprite(0, 0, game.create.grid('grid', gridScale * rows, gridScale * rows, gridScale/4, gridScale/4, 'rgba(0, 250, 0, .1)'));
    game.add.sprite(0, 0, game.create.grid('grid1', gridScale * rows, gridScale * rows, gridScale/3, gridScale/3, 'rgba(0, 220, 0, .1)'));
    educatedPersonsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    unEducatedPersonsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    schoolsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    educatedPersonsGroup.inputEnableChildren = true;
    unEducatedPersonsGroup.inputEnableChildren = true;
    prosperityBar = document.getElementById("prosperity-bar-filler");
    createButtonAreas();
    createEducatedPersons(educatedPersonsGroup, numOfEducatedPersons);
    createUneducatedPersons(unEducatedPersonsGroup, numOfUnEducatedPersons);
    game.time.events.loop(Phaser.Timer.SECOND*12, yearPasses, this);
    game.time.events.loop(Phaser.Timer.SECOND, monthPasses, this);
    createSchoolButton = game.add.button(game.world.width - (game.world.centerX/2.35), 4, 'button', displaySchoolPopup, this, .5, .5, 0);
    createSchoolButton.setScaleMinMax(.6, .6);

    function createUneducatedPersons(unEducatedPersonsGroup,numOfUnEducatedPersons){
        for(var i=0; i<= numOfUnEducatedPersons; i++){
            var randomPersonNum = getRandomPersonNum();
            person = unEducatedPersonsGroup.create(Math.floor(getRandom(20,780)), Math.floor(getRandom(80,400)), 'person' + randomPersonNum);
            var employed = true;
            var happiness = Math.floor(getRandom(0,50));
            var education = 1;
            var income = 20000;
            var age = getRandomAdultAge();
            person.personProps = new Person(education,happiness,employed,income, age);
            setPersonAttributes(person, false, education);
            unEducatedPersonsGroup.add(person);
        }
        unEducatedPersonsGroup.setAll('body.collideWorldBounds', true);
        unEducatedPersonsGroup.setAll('body.bounce.x', 1);
        unEducatedPersonsGroup.setAll('body.bounce.y', 1);
        unEducatedPersonsGroup.onChildInputOver.add(onOver, this);
    }

    function createEducatedPersons(educatedPersonsGroup, numOfEducatedPersons) {
        var person;
        for(var i=0; i<= numOfEducatedPersons; i++){
            var randomPersonNum = getRandomPersonNum();
            person = educatedPersonsGroup.create(Math.floor(getRandom(10,780)), Math.floor(getRandom(80, 400)), 'person' + randomPersonNum);
            var age = getRandomAdultAge();
            person.personProps = new Person(minimumNumForEducatedPerson,Math.floor(getRandom(50,100)),true,minimumEducatedSalary, age);
            setPersonAttributes(person, true, 5);
            educatedPersonsGroup.add(person);
        }
        educatedPersonsGroup.setAll('body.collideWorldBounds', true);
        educatedPersonsGroup.setAll('body.bounce.x', 1);
        educatedPersonsGroup.setAll('body.bounce.y', 1);
        educatedPersonsGroup.onChildInputOver.add(onOver, this);

    }

    function createButtonAreas() {
        // create a new bitmap data object
        var bmd = game.add.bitmapData(800,35);

        // draw to the canvas context like normal
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,800,50);
        bmd.ctx.fillStyle = '#8b0000';
        bmd.ctx.fill();
        bottomTextArea = game.add.sprite(0, game.height - 35, bmd);
        game.physics.enable(bottomTextArea, Phaser.Physics.ARCADE);
        bottomTextArea.body.immovable = true;
        // create a new bitmap data object

        var bmd2 = game.add.bitmapData(800,80);

        // draw to the canvas context like normal
        bmd2.ctx.beginPath();
        bmd2.ctx.rect(0,0,800,65);
        bmd2.ctx.fillStyle = '#8b0000';
        bmd2.ctx.fill();
        topTextArea = game.add.sprite(0, 0, bmd2);
        game.physics.enable(topTextArea, Phaser.Physics.ARCADE);
        topTextArea.body.immovable = true;
    }



}

function increaseAge(child){
    child.personProps.age++;
    if(child.personProps.age >= 50 && child.personProps.education <=5){
        var chanceOfDeath = Math.floor(getRandom(1,4));
        if(chanceOfDeath == 1){
            child.destroy();
        }
        if(child.personProps.age >= 80){
            child.destroy();
        }
    }
    if(child.personProps.age >= 70 && child.personProps.education >=5){
        var chanceOfDeath = Math.floor(getRandom(1,6));
        if(chanceOfDeath == 1){
            child.destroy();
        }
        if(child.personProps.age >= 100){
            child.destroy();
        }
    }
}

function monthPasses() {
    elapsedSeconds++;
    if(clickedSchool){
        game.world.forEach(function(item) {
            item.children.forEach(function(child){
                if(child.personProps){
                    if(canEnroll(child, clickedSchool) && !child.personProps.enrolled){
                        child.tint =  0x39FF14 ;
                    } else {
                        if(child.type == "educated"){
                            child.tint = 0xFFFFFF;
                        } else {
                            child.tint = 0x999999;
                        }
                    }
                }
            });
        });
    }
        updateMoney();

}

function yearPasses() {
    game.world.forEach(function(item) {
        item.children.forEach(function(child) {
            if (child.personProps) {
                adjustHappiness(child);
                if (child.personProps.enrolled) {
                    child.personProps.education += child.personProps.enrolledSchool.quality;
                    if (child.personProps.education == minimumNumForEducatedPerson) {
                        transformToEducated(child);
                        removeEnrolledStudent(child);
                    }
                    else if (child.personProps.education < child.personProps.enrolledSchool.maxEducation) {
                        giveSmallPromotion(child);
                    }
                    else if (child.personProps.education == child.personProps.enrolledSchool.maxEducation && child.personProps.education > minimumNumForEducatedPerson){
                        giveLargePromotion(child);
                        removeEnrolledStudent(child);
                    }
                }
                increaseAge(child);
            }
        });
    });
}


function giveSmallPromotion(child) {
    var promotion = Math.floor(getRandom(1000, 2000)) * child.personProps.enrolledSchool.quality;
    child.personProps.income += promotion;
}

function giveLargePromotion(child) {
    var promotion = Math.floor(getRandom(5000, 10000)) * child.personProps.enrolledSchool.quality;
    child.personProps.income += promotion;
}

function updateMoney(){
    taxes = document.getElementById('tax').value;
    if(taxes > 100 || taxes < 0){
        document.getElementById('tax').value = 20;
        taxes = 20;
    }
    var taxPercent= taxes * .01;

    game.world.forEach(function(item) {
        item.children.forEach(function(child){
            if(child.personProps){
                money += Math.floor(child.personProps.income * taxPercent);
            }
        });
    });
        money = Math.floor(money - maintenanceFees);

    text2 = "$" + Math.floor(money);
}

function adjustHappiness(child){
    if(taxes > 30){
        child.personProps.happiness--;
        if(taxes > 50){
            var happinessSubMultiplier = 51-taxes;
            child.personProps.happiness = child.personProps.happiness - happinessSubMultiplier;
        }
    }
    if(child.type == 'educated'){
        if(unEducatedPersonsGroup.length > (educatedPersonsGroup.length * 5)){
            child.personProps.happiness--;
            if(taxes > 0.3){
                child.personProps.happiness--;
            }
        }
        if(child.personProps.enrolled && child.personProps.happiness < 100){
            child.personProps.happiness++;
        }
        if(child.personProps.happiness <= 0){
            child.destroy();
        }
    } else{
         if(child.personProps.happiness > 0 && !child.personProps.enrolled){
            child.personProps.happiness--;
        } else if (child.personProps.enrolled){
             child.personProps.happiness++;
         }
    }
}

function getRandomPersonNum(){
    return Math.floor(getRandom(0,22));
}

function createSchool(type){
        var schoolProperties = new School(type);
        if(schoolProperties.cost <= money) {
            numOfSchools = numOfSchools + 1;
            createSchoolButton.inputEnabled = true;
            var school = game.add.sprite(game.world.centerX - 50, game.world.centerY - 50, type);
            game.physics.arcade.enable(school);
            school.body.immovable = true;
            school.setScaleMinMax(.25, .25);
            school.schoolProperties = schoolProperties;
            var style = {font: "20px Courier", fill: "#00ff44"};
            var text = game.add.text(game.world.centerX - 180, game.world.centerY - 100, "Drag School to Desired Location", style);
            school.body.setSize(95, 40, 0, 25);
            school.maximumCapacity = 20;
            school.currentlyEnrolled = 0;
            school.roster = [];
            school.inputEnabled = true;
            dismissCreatePopup();
            school.input.enableDrag();
            setTimeout(function () {
                money = Math.floor(money - school.schoolProperties.buildCost);
                maintenanceFees += Math.floor(school.schoolProperties.buildCost / 4);
                school.input.disableDrag();
                schoolCoordinates.push([school.centerX, school.centerY]);
                schoolsGroup.add(school);
                schoolsGroup.inputEnableChildren = true;
                schoolsGroup.onChildInputDown.add(onSchoolDown, this);
                schoolsGroup.onChildInputOver.add(onSchoolOver, this);
                text.destroy();
            }, 5000);
        }


}

function School(type) {
    if(type == 'k12'){
        this.cost = 0;
        this.ageRange = [6,18];
        this.quality = 1;
        this.maxEducation = 18 * this.quality;
        this.minEducation = 0;
        this.buildCost = schoolCost * this.quality;
    }
    if(type == 'privatek12'){
        this.cost = 5000;
        this.ageRange = [6,18];
        this.quality = 2;
        this.maxEducation = 18 * this.quality;
        this.minEducation = 0;
        this.buildCost = schoolCost * this.quality;
    }
    if(type == 'uni'){
        this.cost = 50000;
        this.ageRange = [18,80];
        this.quality = 3;
        this.maxEducation = 21 * this.quality;
        this.minEducation = 18;
        this.buildCost = schoolCost * this.quality;
    }
    if(type == 'trade'){
        this.cost = 1000;
        this.ageRange = [18,60];
        this.quality = 1;
        this.maxEducation = 18 * this.quality;
        this.minEducation = 0;
        this.buildCost = schoolCost * this.quality;
    }
    if(type == 'community'){
        this.cost = 10000;
        this.ageRange = [18,70];
        this.quality = 2;
        this.maxEducation = 21 * this.quality;
        this.minEducation = 18;
        this.buildCost = schoolCost * this.quality;
    }
}

function onSchoolDown(school) {
    var popupElement = document.getElementById("popup-student-roster");
    clickedSchool = school;
    schoolPopupExists = true;

    popupElement.className = popupElement.className.replace('hidden', ' ');
    updateRosterList();

}

function displaySchoolPopup(){
    if(!gameOverDisplayed){
        var popupElement = document.getElementById("popup-create-school");
        createSchoolPopupOpen = true;
        updateButtonColors();
        popupElement.className = popupElement.className.replace('hidden', ' ');
    }

}

function updateButtonColors(){
    var popupElement = document.getElementById("popup-create-school");
    var k12Button = document.getElementById("create-k12");
    var privateButton = document.getElementById("create-private");
    var tradeButton = document.getElementById("create-trade");
    var communityButton = document.getElementById("create-community");
    var uniButton = document.getElementById("create-uni");
    if(money >= schoolCost){
        k12Button.style.backgroundColor = 'darkgreen';
        tradeButton.style.backgroundColor = 'darkgreen';
    } else {
        k12Button.style.backgroundColor = '#dc143c';
        tradeButton.style.backgroundColor = '#dc143c';
    }

    if(money >= schoolCost * 2){
        privateButton.style.backgroundColor = 'darkgreen';
        communityButton.style.backgroundColor = 'darkgreen';
    } else {
        privateButton.style.backgroundColor = '#dc143c';
        communityButton.style.backgroundColor = '#dc143c';
    }

    if(money >= schoolCost * 3){
        uniButton.style.backgroundColor = 'darkgreen';
    } else {
        uniButton.style.backgroundColor = '#dc143c';
    }
}

function updateRosterList() {
    var listParent = document.getElementById("enrolled-student-list");
    while (listParent.firstChild) {
        listParent.removeChild(listParent.firstChild);
    }
    var node;
    for(var i = 0; i < clickedSchool.roster.length; i++){
        node = document.createElement("LI");
        var textnode = document.createTextNode("Student #" + (i+1) + " Education Level: " + clickedSchool.roster[i].personProps.education.toString());
        node.appendChild(textnode);
        listParent.appendChild(node);
    }
}

function enrollStudent(student) {
    if(clickedSchool.currentlyEnrolled < clickedSchool.maximumCapacity ){
        if(!student.personProps.enrolled){
            if(canEnroll(student, clickedSchool)){
                clickedSchool.currentlyEnrolled++;
                clickedSchool.roster.push(student);
                student.personProps.enrolled = true;
                student.personProps.enrolledSchool.maxEducation = clickedSchool.schoolProperties.maxEducation;
                student.personProps.enrolledSchool.quality = clickedSchool.schoolProperties.quality;
                updateRosterList();
            } else {
                text = "Student does not have funds or is too young/old to enroll";
            }
        } else {
            text = "Student is already enrolled.";
        }
    } else {
        text = "School is already at maximum capacity";
    }

}

function canEnroll(student, school) {
    if(student.personProps.age >= school.schoolProperties.ageRange[0] && student.personProps.age <= school.schoolProperties.ageRange[1]){
        if(student.personProps.income/2 >= school.schoolProperties.cost){
            if(student.personProps.education >= school.schoolProperties.minEducation && student.personProps.education < school.schoolProperties.maxEducation){
                return true;
            }
        }
    }
    return false;
}

function removeEnrolledStudent(student) {
    student.personProps.enrolled = false;
    game.world.forEach(function(item) {
        item.children.forEach(function(child) {
            if(child.currentlyEnrolled && child.currentlyEnrolled > 0 ){
                for(var i=0; i< child.roster.length; i++){
                    if(student == child.roster[i]){
                        child.currentlyEnrolled--;
                        child.roster.splice(i,1);
                    }
                }
            }
        });
    });

}

function dismissStudentPopup(){
    schoolPopupExists = false;
    var popupElement = document.getElementById("popup-student-roster");
    popupElement.className = 'popup hidden';

}

function dismissCreatePopup(){
    var popupElement = document.getElementById("popup-create-school");
    popupElement.className = 'popup hidden';

}

function displayGame() {
    var playOverlay = document.getElementById("play");
    var gameCanvas = document.getElementById("game-canvas");
    var aboutOverlay = document.getElementById("about");
    playOverlay.style.display = "none";
    aboutOverlay.style.display = "none";
    gameCanvas.style.display = "block";
}

function displayPlayOverlay() {
    var playOverlay = document.getElementById("play");
    var aboutOverlay = document.getElementById("about");
    var gameCanvas = document.getElementById("game-canvas");
    playOverlay.style.display = "block";
    aboutOverlay.style.display = "none";
    gameCanvas.style.display = "none";
}

function displayAboutOverlay() {
    var playOverlay = document.getElementById("play");
    var aboutOverlay = document.getElementById("about");
    var gameCanvas = document.getElementById("game-canvas");
    playOverlay.style.display = "none";
    aboutOverlay.style.display = "block";
    gameCanvas.style.display = "none";
}

function onSchoolOver(school){
    if(school.maximumCapacity == school.currentlyEnrolled){
        text = "School is at maximum capacity, currently " + school.currentlyEnrolled + " students enrolled.";
    }
}

function Person(education, happiness, employed, income, age) {
    this.education = education;
    this.happiness = happiness;
    this.employed = employed;
    this.income = income;
    this.enrolled = false;
    this.age = age;
    this.enrolledSchool = new enrolledSchool(null, null);
}

function enrolledSchool(maxEducation, quality){
    this.maxEducation = maxEducation;
    this.quality = quality;
}

function setPersonAttributes(person, educated, education) {
    person.setScaleMinMax(.15, .15);
    person.body.setSize(13, 30, 0, 0);
    person.body.collideWorldBounds = true;
    person.body.bounce.x = 1;
    person.body.bounce.y = 1;
    if(educated){
        person.type = "educated";
        person.body.velocity.set(gridScale*4);
    } else {
        person.tint = 0x999999;
        person.type = "uneducated";
        person.body.velocity.set(gridScale*2); //might not move at all
    }
}


function onOver (sprite) {
    var childInfo;
    childInfo = sprite.personProps;
    text = '';
    text += "Sim Stats: " + childInfo.age + " years old,";
    if(childInfo.education < minimumNumForEducatedPerson){
        text += " Uneducated, ";
    } else if (childInfo.education >= minimumNumForEducatedPerson && childInfo.education <= 25){
        text += " Educated, ";
    } else if (childInfo.education > 50){
        text += " Very Educated, "
    }

    if(childInfo.happiness <= 25){
        text += "Unhappy, "
    } else if( childInfo.happiness > 25 && childInfo.happiness < 50){
        text += "Neutral, "
    } else if(childInfo.happiness >=  50 && childInfo.happiness < 75 ){
        text += "Happy, "
    } else if (childInfo.happiness >= 75){
        text += "Ecstatic, "
    }

    if(!childInfo.employed){
        text += " Unemployed, ";
        if(childInfo.income > 0){
            text += "$" + childInfo.income +" Allowance"
        }
    } else {
        text += "$" + childInfo.income;
    }

}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;

}

function getRandomAdultAge() {
    return Math.floor(Math.random() * (30 - 16) + 16);

}

function getRandomK12Salary() {
    return Math.floor(getRandom(30000,50000));
}

function employUneducatedPerson(_uneducated){
    _uneducated.personProps.employed = true;
    _uneducated.personProps.income = getRandomK12Salary();
}

function transformToEducated(_uneducated){
    employUneducatedPerson(_uneducated);
    _uneducated.tint = 0xFFFFFF;
    setPersonAttributes(_uneducated, true, 5);
    educatedPersonsGroup.add(_uneducated);
    unEducatedPersonsGroup.remove(_uneducated);
}


function diffEducationCollissionHandler(_uneducated, _educated){
    _uneducated.personProps.numOfEducatedColliders++;
    if(_uneducated.personProps.numOfEducatedColliders >= 10){
        _uneducated.personProps.education++;
        _uneducated.personProps.numOfEducatedColliders = 0;
        if(_uneducated.personProps.education >=5) {
            transformToEducated( _uneducated);
        }
    }
    if(_educated.personProps.happiness > 0 && _uneducated.personProps.happiness <= 0){
        _educated.personProps.happiness--;
    }
    if((_educated.personProps.education - _uneducated.personProps.education) >= 10){
        if(_educated.personProps.happiness >= 50){
            if(_uneducated.personProps.happiness >= 50){
                        proCreate(_educated, _uneducated, true);
            }
        }
    }
}


function educatedCollissionHandler(_sprite1, _sprite2){

            proCreate(_sprite1, _sprite2, false, true);

}

function uneducatedCollissionHandler(_sprite1, _sprite2){

            proCreate(_sprite1, _sprite2, false, false);

}

function proCreate(sprite1, sprite2, different, educated) {
    setTimeout(function(){
        canProCreate = true;
    }, 12000);
    if(canProCreate ) {
        var age = 1, enrolled = false;
        var randomPersonNum = getRandomPersonNum();
        var education, income, happiness, employed, person;
        if (different) {
            education = sprite1.personProps.education - sprite2.personProps.education;
            if (education >= minimumNumForEducatedPerson) {
                educated = true;
            } else {
                educated = false;
            }
        }
        if (educated) {
            if(educatedWillProCreate(sprite1, sprite2)){
                education = 5;
                income = Math.floor((sprite1.personProps.income + sprite2.personProps.income) * .2 );
                happiness = 3;
                employed = false;
                if(sprite1.personProps.happiness < 100){
                    sprite1.personProps.happiness++;
                }
                if(sprite2.personProps.happiness < 100){
                    sprite2.personProps.happiness++;
                }
                person = unEducatedPersonsGroup.create(sprite1.position.x, sprite2.position.y, 'person' + randomPersonNum);
                setPersonAttributes(person, false, education);
                person.personProps = new Person(education, happiness, employed, income, age, enrolled);
            }
        } else {
            if(unEducatedWillProCreate(sprite1, sprite2)){
                    employed = false;
                    happiness = 50;
                    education = 0;
                    income = 0;
                if(sprite1.personProps.happiness < 100) {
                    sprite1.personProps.happiness++;
                }
                if(sprite2.personProps.happiness < 100){
                    sprite2.personProps.happiness++;
                }
                person = unEducatedPersonsGroup.create(sprite1.position.x, sprite2.position.y, 'person' + randomPersonNum);
                setPersonAttributes(person, false, education);
                person.personProps = new Person(education, happiness, employed, income, age, enrolled);
            }
        }
        canProCreate = false;
    }

}

function educatedWillProCreate(sprite1, sprite2) {
    if(sprite1.personProps.age > 30 && sprite2.personProps.age > 30){
        if(sprite1.personProps.age < 45 && sprite2.personProps.age < 45) {
            if(sprite1.personProps.income + sprite2.personProps.income >= 100000){
                return true;
            }
        }
    }
    return false;
}

function unEducatedWillProCreate(sprite1, sprite2) {
    if(sprite1.personProps.age > 16 && sprite2.personProps.age > 16){
        if(sprite1.personProps.age < 40 && sprite2.personProps.age < 40){
            if(sprite1.personProps.happiness >= 25 && sprite2.personProps.happiness >= 25) {
                var willProCreate = Math.floor(getRandom(1,5));
                if(willProCreate === 1){
                    return true;
                } else {
                    return false;
                }
            }

        }
    }
    return false;
}

//deciding prosperity
// one quarter is % employed
// one quarter is overall education % (100% is education level 63)
// one quarter is happiness
// one quarter is income (100% for income is 200K)

function calculateProsperity(){
    var numEmployed = 0, numFullyEducated = 0, numFullyHappy = 0, num100Income = 0;
    game.world.forEach(function(item) {
        item.children.forEach(function (child) {
            if(child.personProps) {
                if (child.personProps.employed) {
                    numEmployed++;
                }
                if (child.personProps.education >= 50){
                    numFullyEducated++;
                }
                if(child.personProps.happiness >= 100){
                    numFullyHappy++;
                }
                if(child.personProps.income >= 100000){
                    num100Income++;
                }
            }
        });
    });
    var numOfPeople = educatedPersonsGroup.length + unEducatedPersonsGroup.length;
    var percentEmployed = numEmployed/numOfPeople;
    var percentFullyEducated = numFullyEducated/numOfPeople;
    var percentFullyHappy = numFullyHappy/numOfPeople;
    var percent100Income = num100Income/numOfPeople;
    var prosperityScore = (percentEmployed + percentFullyEducated + percentFullyHappy + percent100Income) * 10;
    if(prosperityScore > 99.5){
        prosperityScore = 100;
    }
    if(prosperityScore <= 0 ){
        prosperityScore = 0;
    }
    prosperityScore = Math.floor(prosperityScore);

    prosperityBar.style.width = prosperityScore + '%';
    if(prosperityScore < 10){
        prosperityBar.style.backgroundColor = '#dc143c';
    }
    return prosperityScore;
};

function playerWon(){
    var style = {font: "30px Courier", fill: "#00ff44"};
    var text = game.add.text(game.world.centerX - 180, game.world.centerY - 100, "You Won! :)", style);
    displaySeconds();
    gameOver();
}

function playerLost(reason) {
    var style = {font: "30px Courier", fill: "#00ff44"};
    if(reason == 'money'){
        var text = game.add.text(game.world.centerX - 180, game.world.centerY - 100, "No more money! You Lost :(", style);

    } else {
        var text = game.add.text(game.world.centerX - 180, game.world.centerY - 100, "Zero prosperity! You Lost :(", style);
    }
    displaySeconds();
    gameOver();
}

function displaySeconds(){
    if(!gameOverDisplayed){
        var minutes, hours, secondsRemainders, minutesRemainder;
        if(elapsedSeconds > 60){
            minutes = Math.floor(elapsedSeconds/60);
            secondsRemainders = elapsedSeconds%60;
        }
        if(minutes > 60){
            hours = Math.floor(minutes/60);
            minutesRemainder = (minutes/60)%60;
        }
        var style = {font: "20px Courier", fill: "#00ff44"};
        if(minutes){
            var text = game.add.text(game.world.centerX - 180, game.world.centerY - 120, "Time Elapsed: " + minutes + " minutes, " + secondsRemainders + " seconds", style);
        }
        else if(hours){
            var text = game.add.text(game.world.centerX - 180, game.world.centerY - 120, "Time Elapsed: " + hours + " hours, " + minutesRemainder + " minutes, " + secondsRemainders + " seconds", style);
        }
        else {
            var text = game.add.text(game.world.centerX - 180, game.world.centerY - 120, "Time Elapsed: " + elapsedSeconds + " seconds", style);
        }
        gameOverDisplayed = true;
    }
}

function gameOver(){
    game.world.forEach(function(item) {
        item.children.forEach(function (child) {
            child.body.velocity.set(0);
        });
    });
    schoolsGroup.inputEnableChildren = false;

}

function update() {
    game.physics.arcade.collide(unEducatedPersonsGroup, educatedPersonsGroup, diffEducationCollissionHandler, null, this);
    game.physics.arcade.collide(unEducatedPersonsGroup, unEducatedPersonsGroup, uneducatedCollissionHandler, null, this);
    game.physics.arcade.collide(educatedPersonsGroup, educatedPersonsGroup, educatedCollissionHandler, null, this);
    game.physics.arcade.collide(educatedPersonsGroup, schoolsGroup);
    game.physics.arcade.collide(unEducatedPersonsGroup, schoolsGroup);
    game.physics.arcade.collide(educatedPersonsGroup, bottomTextArea);
    game.physics.arcade.collide(unEducatedPersonsGroup, bottomTextArea);
    game.physics.arcade.collide(educatedPersonsGroup, topTextArea);
    game.physics.arcade.collide(unEducatedPersonsGroup, topTextArea);
    if(schoolPopupExists){
        educatedPersonsGroup.onChildInputDown.add(enrollStudent, this);
        unEducatedPersonsGroup.onChildInputDown.add(enrollStudent, this);
    };

    var prosperityScore = calculateProsperity();
    if(prosperityScore <= 0){
        playerLost('prosperity');
    }
    if(money < 0){
        playerLost('money');
    }
    if(prosperityScore >= 100 ){
        playerWon()
    }


}

function render() {
    var text3 = "Prosperity: " + calculateProsperity() + "%";
    game.debug.text(text, 20, 487);
    game.debug.text(text2, 20, 20);
    game.debug.text(text3, 190, 20);
    if(createSchoolPopupOpen){
        updateButtonColors();
    }
}
