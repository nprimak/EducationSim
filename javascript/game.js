/**
 * Created by prima on 2/20/2017.
 */

var game = new Phaser.Game(800, 500, Phaser.CANVAS, 'game-canvas', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.crossOrigin = 'anonymous';
    game.load.spritesheet('person', 'sprites/white.jpg', 222, 222);
    game.load.spritesheet('button', 'sprites/button.png', 278, 95);
    game.load.spritesheet('k12school', 'sprites/school.png', 386, 239);

}

var educatedPersonsGroup;
var unEducatedPersonsGroup;
var schoolsGroup;
var gridScale;
var text;
var canProCreate;
var createSchoolButton;

function create() {
    var numOfEducatedPersons = 10;
    var numOfUnEducatedPersons = 20;
    gridScale = 10;
    var rows= 100;
    educatedPersonsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    unEducatedPersonsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    schoolsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    educatedPersonsGroup.inputEnableChildren = true;
    unEducatedPersonsGroup.inputEnableChildren = true;
    //game.add.sprite(0, 0, game.create.grid('grid', gridScale * rows, gridScale * rows, gridScale, gridScale, 'rgba(0, 250, 0, 1)'));
    createEducatedPersons(educatedPersonsGroup, numOfEducatedPersons);
    createUneducatedPersons(unEducatedPersonsGroup, numOfUnEducatedPersons);
    game.time.events.loop(Phaser.Timer.SECOND * 30, increaseAge, this);
    createSchoolButton = game.add.button(game.world.width - (game.world.centerX/2.5), 10, 'button', createSchool, this, .5, .5, 0);
    createSchoolButton.setScaleMinMax(.5, .5);

    function createUneducatedPersons(unEducatedPersonsGroup,numOfUnEducatedPersons){
        var person;
        for(var i=0; i<= numOfUnEducatedPersons; i++){
            person = unEducatedPersonsGroup.create(Math.floor(getRandom(1,rows))*gridScale, Math.floor(getRandom(1,rows))*gridScale, 'person');
            var employed = Math.floor(getRandom(0,3));
            var income, education, happiness, age;
            if(employed >= 1){
                employed = true;
                education = 2;
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
            person = educatedPersonsGroup.create(Math.floor(getRandom(1,rows))*gridScale, Math.floor(getRandom(1,rows))*gridScale, 'person');
            var age = getRandomAdultAge();
            person.personProps = new Person(5,3,true,getEducatedIncome(), age);
            setPersonAttributes(person, true, 5);
            educatedPersonsGroup.add(person);
        }
        educatedPersonsGroup.setAll('body.collideWorldBounds', true);
        educatedPersonsGroup.setAll('body.bounce.x', 1);
        educatedPersonsGroup.setAll('body.bounce.y', 1);

        educatedPersonsGroup.onChildInputOver.add(onOver, this);

    }

    function increaseAge(){
        game.world.forEach(function(item) {
            item.children.forEach(function(child){
                child.personProps.age++;
            });

        });

    }



}

function createSchool(){
    console.log("school created");
    var school = game.add.sprite(game.world.centerX, game.world.centerY, 'k12school');
    game.physics.arcade.enable(school);
    school.body.immovable = true;
    school.setScaleMinMax(.25, .25);
    var style = { font: "20px Courier", fill: "#00ff44" };
    var text = game.add.text(20, 40, "Drag School to Desired Location", style);

    school.inputEnabled = true;
    school.input.enableDrag();
    setTimeout(function(){
        school.inputEnabled = false;
        schoolsGroup.add(school);
        text.destroy();
    }, 5000);

}

function Person(education, happiness, employed, income, age) {
    this.education = education;
    this.happiness = happiness;
    this.employed = employed;
    this.income = income;
    this.age = age;
    //this.taxes = taxes;
}

function setPersonAttributes(person, educated, education) {
    person.setScaleMinMax(.05, .05);
    person.body.setSize(12, 12, 0, 0);
    if(educated){
        person.tint = education * 0xFFFF00;
        person.setScaleMinMax(.05, .05);
        person.body.setSize(12, 12, 0, 0);
        person.type = "educated";
        person.body.velocity.set(gridScale);
    } else {
        person.tint = education * 0xDC143C;
        person.type = "uneducated";
        person.body.velocity.set(gridScale/3); //might not move at all
    }
}

function onOver (sprite) {
    var childInfo;
    childInfo = sprite.personProps;

    text = "Education: " + childInfo.education + "| Happiness: " + childInfo.happiness + "| Employed: " + childInfo.employed + "| $" + childInfo.income + "| Age: " + childInfo.age;

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
    }, 1000);
    if(canProCreate ) {
        var education, income, happiness, employed, person,  age;
        if (different) {
            education = sprite1.personProps.education - sprite2.personProps.education;
            if (education >= 5) {
                educated = true;
            } else {
                educated = false;
            }
        }
        if (educated) {
            if(educatedWillProCreate(sprite1, sprite2)){
                education = 5;
                income = getEducatedIncome();
                happiness = 3;
                employed = true;
                age = 1;
                person = educatedPersonsGroup.create(sprite1.position.x, sprite2.position.y, 'person');
                setPersonAttributes(person, true, education);
                person.personProps = new Person(education, happiness, employed, income, age);
                console.log("new EDUCATED person created?");
            }
        } else {
            if(unEducatedWillProCreate(sprite1, sprite2)){
                employed = Math.floor(getRandom(0, 2));
                age = 1;
                if (employed == 1) {
                    employed = true;
                    education = 2;
                    happiness = 1;
                    income = getUnEducatedIncome();
                } else {
                    employed = false;
                    happiness = 0;
                    education = 1;
                    income = 0;
                }
                person = unEducatedPersonsGroup.create(sprite1.position.x, sprite2.position.y, 'person');
                setPersonAttributes(person, false, education);
                person.personProps = new Person(education, happiness, employed, income);
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

}

function render() {
    game.debug.text(text, 20, 20);
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