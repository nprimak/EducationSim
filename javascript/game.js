/**
 * Created by prima on 2/20/2017.
 */

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-canvas', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.crossOrigin = 'anonymous';
    game.load.spritesheet('person', 'sprites/white.jpg', 222, 222);

}

var educatedPersonsGroup;
var unEducatedPersonsGroup;
var gridScale;
var educatedPersonsArray;
var unEducatedPersonsArray;
var text;
var canProCreate;

function create() {
    var numOfEducatedPersons = 10;
    var numOfUnEducatedPersons = 20;
    gridScale = 10;
    var rows= 100;
    educatedPersonsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    unEducatedPersonsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    educatedPersonsGroup.inputEnableChildren = true;
    unEducatedPersonsGroup.inputEnableChildren = true;
    //game.add.sprite(0, 0, game.create.grid('grid', gridScale * rows, gridScale * rows, gridScale, gridScale, 'rgba(0, 250, 0, 1)'));
    createEducatedPersons(educatedPersonsGroup, numOfEducatedPersons);
    createUneducatedPersons(unEducatedPersonsGroup, numOfUnEducatedPersons);

    function createUneducatedPersons(unEducatedPersonsGroup,numOfUnEducatedPersons){
        unEducatedPersonsArray = [];
        var person;
        for(var i=0; i<= numOfUnEducatedPersons; i++){
            person = unEducatedPersonsGroup.create(Math.floor(getRandom(1,rows))*gridScale, Math.floor(getRandom(1,rows))*gridScale, 'person');
            var employed = Math.floor(getRandom(0,2));
            var income, education, happiness;
            if(employed == 1){
                employed = true;
                education = 2;
                happiness = 1;
                income = getUnEducatedIncome();
            } else {
                employed = false
                happiness = 0;
                education = 1;
                income = 0;
            }
            unEducatedPersonsArray.push(new Person(education,happiness,employed,income));
            setPersonAttributes(person, false, education);
            person.childNum = i;
            unEducatedPersonsGroup.add(person);
        }
        unEducatedPersonsGroup.setAll('body.collideWorldBounds', true);
        unEducatedPersonsGroup.setAll('body.bounce.x', 1);
        unEducatedPersonsGroup.setAll('body.bounce.y', 1);
        unEducatedPersonsGroup.onChildInputOver.add(onOver, this);
    }

    function createEducatedPersons(educatedPersonsGroup, numOfEducatedPersons) {
        educatedPersonsArray = [];
        var person;
        for(var i=0; i<= numOfEducatedPersons; i++){
            person = educatedPersonsGroup.create(Math.floor(getRandom(1,rows))*gridScale, Math.floor(getRandom(1,rows))*gridScale, 'person');
            educatedPersonsArray.push(new Person(5,3,true,getEducatedIncome()));
            setPersonAttributes(person, true, 5);
            person.childNum = i;
            educatedPersonsGroup.add(person);
        }
        educatedPersonsGroup.setAll('body.collideWorldBounds', true);
        educatedPersonsGroup.setAll('body.bounce.x', 1);
        educatedPersonsGroup.setAll('body.bounce.y', 1);

        educatedPersonsGroup.onChildInputOver.add(onOver, this);

    }



}

function Person(education, happiness, employed, income) {
    this.education = education;
    this.happiness = happiness;
    this.employed = employed;
    this.income = income;
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
        person.body.velocity.set(gridScale/2);
    } else {
        person.tint = education * 0xDC143C;
        person.type = "uneducated";
        person.body.velocity.set(gridScale/10); //might not move at all
    }
}

function onOver (sprite) {

    var childNum = sprite.childNum;
    var childInfo;
    if(sprite.type === "educated"){
        childInfo = educatedPersonsArray[childNum];
    }else {
        childInfo = unEducatedPersonsArray[childNum];
    }

    text = "Education = " + childInfo.education + "| Happiness = " + childInfo.happiness + "| Employed = " + childInfo.employed + "| Income = " + childInfo.income ;

}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;

}


function transformToEducated(index, _uneducated){
    unEducatedPersonsArray[index].income = getEducatedIncome();
    unEducatedPersonsArray[index].employed = true;
    unEducatedPersonsArray[index].happiness++;
    setPersonAttributes(_uneducated, true, 5);
    educatedPersonsGroup.add(_uneducated);
    unEducatedPersonsGroup.remove(_uneducated);
    educatedPersonsArray.push(unEducatedPersonsArray[index]);
    unEducatedPersonsArray.splice(index, 1);
    unEducatedPersonsGroup.iterate('key', 'uneducated', Phaser.Group.RETURN_NONE, updateUneducatedChildNums(), this);
    _uneducated.childNum = educatedPersonsArray.length -1;
    console.log("transformedToEducated", _uneducated);
}

function updateUneducatedChildNums(){
    console.log(this);
    for(var i = 0; i < unEducatedPersonsArray.length; i++){
        if(this == unEducatedPersonsGroup.children[i]){
            this.childNum = i;
        }
    }
}

function getEducatedIncome(){
    return Math.floor(getRandom(50000,150000));
}

function getUnEducatedIncome(){
    return Math.floor(getRandom(10000,25000));
}


function diffEducationCollissionHandler(_uneducated, _educated){
    var uneducatedIndex = _uneducated.childNum;
    unEducatedPersonsArray[uneducatedIndex].education++;
    if(unEducatedPersonsArray[uneducatedIndex].education >= 5){
        transformToEducated(uneducatedIndex, _uneducated);
    }
    var educatedIndex = _educated.childNum;
    if(educatedPersonsArray[educatedIndex].happiness > 0){
        educatedPersonsArray[educatedIndex].happiness--;
    }
    if((educatedPersonsArray[educatedIndex].education - unEducatedPersonsArray[uneducatedIndex].education) <= 2){
        if(educatedPersonsArray[educatedIndex].happiness >= 2){
            if(unEducatedPersonsArray[uneducatedIndex].happiness >= 2){

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
    }, 5000);
    if(canProCreate ) {
        var education, income, happiness, employed, person;
        if (different) {
            education = educatedPersonsArray[sprite1.childNum].education - unEducatedPersonsArray[sprite2.childNum].education;
            if (education >= 5) {
                educated = true;
            } else {
                educated = false;
            }
        }
        if (educated) {
            if((educatedPersonsArray[sprite1.childNum].income + educatedPersonsArray[sprite2.childNum].income) >= 200000){
                education = 5;
                income = getEducatedIncome();
                happiness = 3;
                employed = true;
                person = educatedPersonsGroup.create(sprite1.position.x, sprite2.position.y, 'person');
                setPersonAttributes(person, true, education);
                educatedPersonsArray.push(new Person(education, happiness, employed, income));
                person.childNum = educatedPersonsArray.length - 1;
                console.log("new EDUCATED person created?");
            }
        } else {
            employed = Math.floor(getRandom(0, 2));
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
            unEducatedPersonsArray.push(new Person(education, happiness, employed, income));
            person.childNum = unEducatedPersonsArray.length - 1;
            console.log("new UNEDUCATED person created?");
        }
        canProCreate = false;
    }

}

function update() {
    game.physics.arcade.collide(unEducatedPersonsGroup, educatedPersonsGroup, diffEducationCollissionHandler, null, this);
    game.physics.arcade.collide(unEducatedPersonsGroup, unEducatedPersonsGroup, uneducatedCollissionHandler, null, this);
    game.physics.arcade.collide(educatedPersonsGroup, educatedPersonsGroup, educatedCollissionHandler, null, this);

}

function render() {
    game.debug.text(text, 32, 32);
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