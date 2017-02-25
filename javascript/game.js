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
    game.load.spritesheet('person0', 'sprites/person_0.png', 60, 130);
    game.load.spritesheet('person1', 'sprites/person_1.png', 60, 130);
    game.load.spritesheet('person2', 'sprites/person_2.png', 60, 130);
    game.load.spritesheet('person3', 'sprites/person_3.png', 60, 130);
    game.load.spritesheet('person4', 'sprites/person_4.png', 60, 130);
    game.load.spritesheet('person5', 'sprites/person_5.png', 60, 130);
    game.load.spritesheet('person6', 'sprites/person_6.png', 60, 130);
    game.load.spritesheet('person7', 'sprites/person_7.png', 60, 130);
    game.load.spritesheet('person8', 'sprites/person_8.png', 60, 130);
    game.load.spritesheet('person9', 'sprites/person_9.png', 60, 130);

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
var money = 500000;
var school;
var schoolPopupExists = false;

function create() {

    game.stage.backgroundColor = '#397152';
    text = "Hover over a person to see their stats";
    text2 = "Taxpayer Money: ";

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
    createButtonAreas();
    createEducatedPersons(educatedPersonsGroup, numOfEducatedPersons);
    createUneducatedPersons(unEducatedPersonsGroup, numOfUnEducatedPersons);
    game.time.events.loop(Phaser.Timer.SECOND*12, increaseAge, this);
    game.time.events.loop(Phaser.Timer.SECOND, updateMoney, this);
    createSchoolButton = game.add.button(game.world.width - (game.world.centerX/2.5), 10, 'button', displaySchoolPopup, this, .5, .5, 0);
    createSchoolButton.setScaleMinMax(.5, .5);

    function createUneducatedPersons(unEducatedPersonsGroup,numOfUnEducatedPersons){
        for(var i=0; i<= numOfUnEducatedPersons; i++){
            var randomPersonNum = getRandomPersonNum();
            person = unEducatedPersonsGroup.create(Math.floor(getRandom(20,780)), Math.floor(getRandom(80,400)), 'person' + randomPersonNum);
            var employed = Math.floor(getRandom(0,3));
            var income, education, happiness, age;
            if(employed >= 1){
                employed = true;
                education = 3;
                happiness = 1;
                income = getUnEducatedIncome();
            } else {
                employed = false;
                happiness = 0;
                education = 1;
                income = 0;
            }
            age = getRandomAdultAge();
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
            person.personProps = new Person(10,3,true,getEducatedIncome(), age);
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
        var bmd = game.add.bitmapData(800,50);

        // draw to the canvas context like normal
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,800,50);
        bmd.ctx.fillStyle = '#8b0000';
        bmd.ctx.fill();
        bottomTextArea = game.add.sprite(0, 450, bmd);
        game.physics.enable(bottomTextArea, Phaser.Physics.ARCADE);
        bottomTextArea.body.immovable = true;

        // create a new bitmap data object
        var bmd2 = game.add.bitmapData(800,80);

        // draw to the canvas context like normal
        bmd2.ctx.beginPath();
        bmd2.ctx.rect(0,0,800,80);
        bmd2.ctx.fillStyle = '#8b0000';
        bmd2.ctx.fill();
        topTextArea = game.add.sprite(0, 0, bmd2);
        game.physics.enable(topTextArea, Phaser.Physics.ARCADE);
        topTextArea.body.immovable = true;
    }

    function increaseAge(){
        game.world.forEach(function(item) {
            item.children.forEach(function(child){
                if(child.personProps){
                    if(child.personProps.enrolled){
                        child.personProps.education++;
                        if(child.personProps.education == 10){
                            transformToEducated(child);
                            removeEnrolledStudent(child);
                        }
                        if(child.personProps.education > 10){
                            removeEnrolledStudent(child);
                        }
                    }
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
            });

        });

    }

}


function updateMoney(){
    game.world.forEach(function(item) {
        item.children.forEach(function(child){
            if(child.personProps){
                money += child.personProps.taxes();
            }
        });
    });
    if(numOfSchools >= 1){
        money = money - (250000 * (numOfSchools));
    }
    text2 = "Taxpayer Money: " + Math.floor(money);
}

function getRandomPersonNum(){
    return Math.floor(getRandom(0,10));
}

function createSchool(type){
        money = money - 500000;
        numOfSchools = numOfSchools + 1;
        createSchoolButton.inputEnabled = true;
        school = game.add.sprite(game.world.centerX, game.world.centerY, type);
        game.physics.arcade.enable(school);
        school.body.immovable = true;
        school.setScaleMinMax(.25, .25);
        var style = {font: "20px Courier", fill: "#00ff44"};
        var text = game.add.text(20, 40, "Drag School to Desired Location", style);
        school.body.setSize(95, 40, 0, 25);
        school.maximumCapacity = 10;
        school.schoolProperties = new School(type);
        school.currentlyEnrolled = 0;
        school.roster = [];
        school.inputEnabled = true;
        dismissCreatePopup();
        school.input.enableDrag();
        setTimeout(function () {
            school.input.disableDrag();
            schoolCoordinates.push([school.centerX, school.centerY]);
            schoolsGroup.add(school);
            schoolsGroup.inputEnableChildren = true;
            schoolsGroup.onChildInputDown.add(onSchoolDown, this);
            schoolsGroup.onChildInputOver.add(onSchoolOver, this);
            text.destroy();
        }, 5000);


}

function School(type) {
    if(type == 'k12'){
        this.cost = 0;
        this.ageRange = [6,18];
        this.quality = 1;
        this.maxEducation = 18 * this.quality;
        this.minEducation = 0;
    }
    if(type == 'privatek12'){
        this.cost = 10000;
        this.ageRange = [6,18];
        this.quality = 2;
        this.maxEducation = 18 * this.quality;
        this.minEducation = 0;
    }
    if(type == 'uni'){
        this.cost = 50000;
        this.ageRange = [18,40];
        this.quality = 2;
        this.maxEducation = 21 * this.quality;
        this.minEducation = 18;
    }
    if(type == 'trade'){
        this.cost = 1000;
        this.ageRange = [18,30];
        this.quality = 2;
        this.maxEducation = 18 * this.quality;
        this.minEducation = 0;
    }
    if(type == 'community'){
        this.cost = 10000;
        this.ageRange = [18,60];
        this.quality = 2;
        this.maxEducation = 21 * this.quality;
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
    var popupElement = document.getElementById("popup-create-school");
    popupElement.className = popupElement.className.replace('hidden', ' ');
}

function updateRosterList() {
    var listParent = document.getElementById("enrolled-student-list");
    while (listParent.firstChild) {
        listParent.removeChild(listParent.firstChild);
    }
    var node;
    for(var i = 0; i < clickedSchool.roster.length; i++){
        node = document.createElement("LI");
        var textnode = document.createTextNode("Student #" + i + " Education Level: " + school.roster[i].personProps.education.toString());
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
    var listParent = document.getElementById("enrolled-student-list");
    popupElement.className = 'popup hidden';

}

function dismissCreatePopup(){
    var popupElement = document.getElementById("popup-create-school");;
    popupElement.className = 'popup hidden';

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
    this.taxes = function(){
        if(income > 100000){
            return Math.floor(income * 0.2);
        } else {
            return Math.floor(income * 0.1);
        }
    }
}

function setPersonAttributes(person, educated, education) {
    person.setScaleMinMax(.2, .2);
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

function checkOverlap() {
    var childrenNeedingEnrollment = [];
    game.world.forEach(function(item) {
        item.children.forEach(function (child) {
            for(var i=0; i < schoolCoordinates.length; i++){
                if(child.personProps){
                    var distanceFromSchool = game.physics.arcade.distanceToXY(child, schoolCoordinates[i][0], schoolCoordinates[i][1], true);
                    if(Math.floor(distanceFromSchool) <= 100){
                        childrenNeedingEnrollment.push(child);
                    }
                }
            }

        });
    });
    game.world.forEach(function(item) {
        item.children.forEach(function (child) {
            for(var i=0; i < childrenNeedingEnrollment.length; i++){
                if(child.currentlyEnrolled < child.maximumCapacity){
                   console.log("enrolling child");
                    child.currentlyEnrolled++;
                    child.roster.push(childrenNeedingEnrollment[i]);
                    childrenNeedingEnrollment[i].personProps.enrolled = true;
                }
            }

        });
    });
}


function onOver (sprite) {
    var childInfo;
    childInfo = sprite.personProps;
    text = "Sim Stats: Education: " + childInfo.education + "| Happiness: " + childInfo.happiness + "| Employed: " +
        childInfo.employed + "| $" + childInfo.income + "| Age: " + childInfo.age;

}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;

}

function getRandomAdultAge() {
    return Math.floor(Math.random() * (30 - 16) + 16);

}

function transformToEducated(_uneducated){
    _uneducated.personProps.income = getEducatedIncome();
    _uneducated.personProps.employed = true;
    _uneducated.personProps.happiness++;
    _uneducated.tint = 0xFFFFFF;
    setPersonAttributes(_uneducated, true, 5);
    educatedPersonsGroup.add(_uneducated);
    unEducatedPersonsGroup.remove(_uneducated);
    console.log("transformedToEducated", _uneducated);
}

function getEducatedIncome(){
    return Math.floor(getRandom(50000,150000));
}

function getUnEducatedIncome(){
    return Math.floor(getRandom(15000,30000));
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
    if(_educated.personProps.happiness > 0){
        _educated.personProps.happiness--;
    }
    if((_educated.personProps.education - _uneducated.personProps.education) <= 2){
        if(_educated.personProps.happiness >= 2){
            if(_uneducated.personProps.happiness >= 2){
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
    }, 3000);
    if(canProCreate ) {
        var age = 1, enrolled = false;
        var randomPersonNum = getRandomPersonNum();
        var education, income, happiness, employed, person;
        if (different) {
            education = sprite1.personProps.education - sprite2.personProps.education;
            if (education >= 10) {
                educated = true;
            } else {
                educated = false;
            }
        }
        if (educated) {
            if(educatedWillProCreate(sprite1, sprite2)){
                education = 3;
                income = 0;
                happiness = 3;
                employed = false;
                person = educatedPersonsGroup.create(sprite1.position.x, sprite2.position.y, 'person' + randomPersonNum);
                setPersonAttributes(person, true, education);
                person.personProps = new Person(education, happiness, employed, income, age, enrolled);
                console.log("new EDUCATED person created?");
            }
        } else {
            if(unEducatedWillProCreate(sprite1, sprite2)){
                    employed = false;
                    happiness = 0;
                    education = 1;
                    income = 0;

                person = unEducatedPersonsGroup.create(sprite1.position.x, sprite2.position.y, 'person' + randomPersonNum);
                setPersonAttributes(person, false, education);
                person.personProps = new Person(education, happiness, employed, income, age, enrolled);
                console.log("new UNEDUCATED person created?");
            }
        }
        canProCreate = false;
    }

}

function educatedWillProCreate(sprite1, sprite2) {
    if(sprite1.personProps.age > 30 && sprite2.personProps.age > 30){
        if(sprite1.personProps.age < 45 && sprite2.personProps.age < 45) {
            if(sprite1.personProps.income + sprite2.personProps.income >= 200000){
                return true;
            }
        }
    }
    return false;
}

function unEducatedWillProCreate(sprite1, sprite2) {
    if(sprite1.personProps.age > 16 && sprite2.personProps.age > 16){
        if(sprite1.personProps.age < 40 && sprite2.personProps.age < 40) {
            if(sprite1.personProps.income + sprite2.personProps.income >= 30000){
                return true;
            }
        }
    }
    return false;
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

    if(money > 500000){
        createSchoolButton.inputEnabled = true;
    } else {
        createSchoolButton.inputEnabled = false;
    }
    if(schoolPopupExists){
        educatedPersonsGroup.onChildInputDown.add(enrollStudent, this);
        unEducatedPersonsGroup.onChildInputDown.add(enrollStudent, this);
    };


}

function render() {
    game.debug.text(text, 20, 475);
    game.debug.text(text2, 20, 20);
}

// function move() {
//     var random = Math.floor(getRandom(1, 4));
//     if(random == 1){
//         personsGroup.body.moveTo(gridScale, gridScale, Phaser.ANGLE_RIGHT);
//     }
//     if(random == 2){
//         personsGroup.body.moveTo(gridScale, gridScale, Phaser.ANGLE_LEFT);
//     }
//     if(random == 3){
//         personsGroup.body.moveTo(gridScale, gridScale, Phaser.ANGLE_UP);
//     }
//
// }