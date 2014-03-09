//Capulets and Montagues
//Author: @Fajita_Mane
version = 'alpha 0.8.2';
$('#version').html('Current version: '+version);
///////////////////////card constructor////////////////////
function card (suit, symbol, val) {
    this.suit = suit;
    this.sym = symbol;
    this.val = val;
    this.hp = val;
    this.idstr = this.suit +' '+ this.sym;
    this.atk = this.val;
    this.lvl = this.val;
};
//////////////////////////////////////////////////////////////////
//////////////////ARMY CONSTRUCTOR///////////////////////////////

function army (suit, player) {
    //playedBy designates whether the army is player by a user or AI
    this.playedBy = player;

    this.suit = suit;
    this.grid = new Array(5);
    this.grid[4] = [(new card(suit, 2, 2)), (new card(suit, 3, 3))];
    this.grid[3] = [(new card(suit, 6, 6)), (new card(suit, 5, 5)), (new card(suit, 4, 4))];
    this.grid[2] = [(new card(suit, 10, 10)), (new card(suit, 9, 9)), (new card(suit, 8, 8)), (new card(suit, 7, 7))];
    this.grid[1] = [(new card(suit, 'A', 11)),(new card(suit, 'J', 11))];
    this.grid[0] = [(new card(suit, 'Q', 11)), (new card(suit, 'K', 11))];


    //make this anonymous
    this.list = [];
    this.cardList = function(){
        for (var i = 0; i < this.grid.length;i++){
            for (var j = 0; j < this.grid[i].length; j++){
                this.list.push(this.grid[i][j]);
                this.grid[i][j].c = 4 - i;
                this.grid[i][j].r = j;
            }
        }
    }
    this.cardList();

    //sets pk for the insanely stupid army.open function
    for (var i = 0; i < this.list.length; i++){
        s = this.list[i].sym;
        switch (s){
            case 'J': this.list[i].pk = 12;
            break;
            case 'A': this.list[i].pk = 11;
            break;
            case 'K': this.list[i].pk = 14;
            break;
            case 'Q': this.list[i].pk = 13;
            break;
            default: this.list[i].pk = this.list[i].sym;
                    this.list[i].used = true;
        }
    }
    
    //accessor for cards on the grid
    this.card = function(pk){
        switch(pk){
            //this doesn not account for place changes
            case 2:
                return this.list[11];
            case 3:
                return this.list[12];
            case 4:
                return this.list[10];
            case 5:
                return this.list[9];
            case 6:
                return this.list[8];
            case 7:
                return this.list[7];
            case 8:
                return this.list[6];
            case 9:
                return this.list[5];
            case 10:
                return this.list[4];
            case 11:
                return this.list[2];
            case 12:
                return this.list[3];
            case 13:
                return this.list[0];
            case 14:
                return this.list[1];
            
        }
    };

    //set all powers to usable although jack power condition is irrelevant
    this.card(11).used = false;
    this.card(12).used = false;
    this.card(13).used = false;
    this.card(14).used = false;

    
    //max alive card
    this.max = function(){
        for(var i = 14;i >= 2; i--){
            if (alive(this.card(i))){
                return this.card(i);
            }
        }
    };

    //min alive card
    this.min = function(){
        for(var i = 2; i < 15;i++){
            if (alive(this.card(i))){
                return this.card(i);
                break;
            }
        }
    };

    //check if a card is open for attack
    this.open = function(pk){
        switch(pk){
            case 2:
                return true;
            case 3:
                return true;
            case 4:
                return !alive(this.card(2));
            case 5:
                return !alive(this.card(2)) && !alive(this.card(3));
            case 6:
                return !alive(this.card(3));
            case 7:
                return !alive(this.card(4));
            case 8:
                return !alive(this.card(4)) && !alive(this.card(5));
            case 9:
                return !alive(this.card(5)) && !alive(this.card(6));
            case 10:
                return !alive(this.card(6));
            case 11:
                return !alive(this.card(9));
            case 12:
                return !alive(this.card(8));
            case 13:
                return !alive(this.card(11));
            case 14:
                return !alive(this.card(12)) && !alive(this.card(8));
            default: 
                console.log('this.open() is broken');
        }
    };
    //returns max open card of an army
    this.maxopen = function(){
        for(var i = 14; i > 2;i--){
            if (this.open(i) && alive(this.card(i).sym)){
                return this.card(i);
            }
        }
    };
    //returns min open card of an army 
    this.minopen =  function(){
        for(var i = 2; i < 15;i++){
            if (alive(this.card(i)) && this.open(this.card(i).pk)){
                return this.card(i);
            }
        }
    };
    //returns lowest hp card in army
    this.lowest = function(i, stack){
        if (i == 15){
            return stack;
        }
        if (this.card(i).hp <= this.card){
            this.lowest(i + 1, this.card(i));
        } else {
            this.lowest(i + 1, this.card(i + 1));
        }
    };
    //returns the minimum hp of the army's cards
    this.hpmin = function(){
        min = this.list[0];
        for (var i = 0; i < this.list.length; i++){
            if (((this.list[i].lvl - this.list[i].hp) > (min.lvl - min.hp)) && alive(this.list[i])){
                var min = this.list[i];
            }
        }
        return min;
    }
    //the jack's special ability is to make a suicide death pact
    this.pow_j = function(){
        if (!this.open(12)){
            msg('The Jack can\'t use his power unless he is exposed');
        } else {
            if (!alive(this.card(12))) {
                 msg("The Jack is already dead");
             } else {
                 army1.card(12).hp = 0;
                 army2.card(12).hp = 0;
                 //not an elegant system of reporting the attack
                 if (card.suit == 'Montague'){
                    msg("The Jack sacrificies their life to kill the "+army2.card(12).idstr);
                } else {
                    msg("The Jack sacrificies their life to kill the "+army1.card(12).idstr);
                }
                
              }
              this.card(12).used = true;
         }
         renderField();
     }
    //the apothecary's special ability heals a card to full health
    this.pow_a = function(target){
        if  (!this.open(11)){
            msg('The Apothecary must be open to use his power');
            return false;
        } /*else if (target == this.card(11)){
            msg('The Apothercary can\'t heal himself');
            return false;
        }*/
        //success
        else {
            if (!alive(this.card(11)) || !alive(target)){
                    msg('The '+this.suit+' apothecary can\'t heal from the grave', true);
            } else {
                if (target.suit == 'Montague'){
                    clr = 'blue';
                } else {
                    clr = 'red';
                }
                msg('The ' + this.suit + ' apothecary heals his ' + target.sym, true);
                //restores the target's hp to max
                target.hp = target.lvl;
                this.card(11).used = true;
                renderField();
                turn++
                user.state = 'AI';
                setTimeout(function(){
                    AIMove();
                }, 500);
            }
        }
    };
    //the queen's special power inflicts random dmg on random opponents
    this.pow_q = function(){
        if (!this.open(13)){
            msg('The queen can\'t user her power unless she is exposed');
        } else {
            //defines which army will be attacke by the queen
            if (this.playedBy == 'user'){
                enemyArmy = army2;
            } else {
                enemyArmy = army1;
            }
            //declaring variables before procedure just for documentation
            enemyAlive = [];
            totalDmg = Math.abs(this.card(13).hp - 14);
            dmgArray = [];
            //determines which cards are still alive
            for (var i = 0; i < enemyArmy.list.length; i++){
                if (alive(enemyArmy.list[i])){
                    enemyAlive.push(enemyArmy.list[i]);
                }
            }
            //randomizes enemies and inflicts random damage;
            shuffle(enemyAlive);
            for (var i = 0; i < enemyAlive.length; i ++){
                if (totalDmg == 0 || enemyAlive.length == 0){
                    //msg('The queen has ended her wrath');
                    break;
                } else {
                    thisDmg = Math.round(Math.random() * (totalDmg - 1)) + 1;
                    msg('The queen\'s wrath touches '+enemyAlive[i].idstr+' for '+thisDmg+' damage');
                    enemyAlive[i].hp -= thisDmg;
                    if (!alive(enemyAlive[i])){
                        msg('The queen has slain '+enemyAlive[i].idstr+' in her wrath');
                    }
                    totalDmg -= thisDmg;
                    enemyAlive = enemyAlive.slice(1, enemyAlive.length);
                }
            }
            this.card(13).used = true;
        }
    }
         //king's special ability
    this.pow_k = function(target){
        if (this.used === true){
            msg(this.idstr + 'has already used his power');
        } else if (!this.open(14)){
            msg('The king can only use his power when he is exposed');
        } else if (alive(target)){
            msg('The king can\'t revive a card that is alive')
        } else {
                if (alive(target)){
                    msg('The king can\'t revive a unit that is alive');
                } else{
                    target.hp = 5;
                    msg('The king revives '+target.idstr+' with 5 hp');
                }
            }
            //boilerplate shit to change turns
            renderField();
            turn++;
            this.card(14).used = true;
        };
        //levels up a card
        this.level = function(c){
            msg('The '+c.idstr+' gains experience and becomes more powerful');
            c.lvl++
        }
};
//////////////////////////////////////////////////////////
//GAME FUNCTIONS//////////////////////////////////////////

//returns a d6 roll
function roll () {
    return Math.floor(1 + Math.random() * 6);
};

function checkEnd(){
    if(!alive(army1.card(14))){
        msg('The '+army1.suit+' patriarch has fallen in battle. The '+army2.suit+' house will feast to this victory!');
        user.state = 'post';
        renderField();
        helperDialog('The game is over. The '+army2.suit+'\'s have won the battle but not the war.');
        return true;
    }
    if (!alive(army2.card(14))){
        msg('The '+army1.suit+' house is victorious! Po\' up some mead!');
        user.state = 'post';
        helperDialog('The game is over. The '+army2.suit+'\'s are victorious! Well played, user! Po\' up some mead!!!');
        return true;
    }
    return false;
}

//checks if a move is valid
function validMove (card1, card2){
    if (card1.suit == card2.suit){
        msg('Error: same suit');
        return false;
    } else if (!army1.open(card1.pk)){
        msg(card1.idstr+' not open');
        return false;
    } else if (!army2.open(card2.pk)){
        msg(card2.idstr+' not open');
        return false;
    } else if (!alive(card1) || !alive(card2)){
        msg('Can\'t attack a dead card');
        return false;
    } else {
        return true;
    }
}

function attack(card1, card2, initBy) {
    var atk = card1.atk + roll();
    var def = card2.atk + roll();
    var dmg = Math.abs(atk - def);
    if (initBy){
        userGood = true;
    } else {
        userGood = false;
    }
    //inaccurate logging
    if (atk > def) {
        //succesful attack
        card2.hp = card2.hp - dmg;
        if (card2.hp <= 0) {
            msg('The ' + card1.idstr + ' strikes down the ' + card2.idstr + ' with ' + dmg.toString() + ' damage', userGood);
            if (card2.sym == 'K'){
                msg('<strong>'+card1.idstr + ' strikes the winning blow. The ' + card1.suit + '\'s are victorious!!!'+'</strong>', userGood);
                return;
            }
        } else {
            msg('The ' + card1.idstr + ' strikes the '+card2.idstr+' for ' + dmg.toString() + ' damage. ' + card2.hp.toString() + ' remaining', userGood);
        }

    } //stalemeate
    else if (atk == def) {
        msg('Stalemate. '+card1.idstr+'\'s attack is unsuccesful', userGood);
    } //succesful defense
    else {
        card1.hp = card1.hp - dmg;
        if (card1.hp <= 0) {
            msg('The ' + card2.idstr + ' counters the' + card1.idstr + 's attack for a kill with '+dmg.toString()+' damage!', !userGood);
            
        } else {
            msg('The ' + card2.idstr + ' counters the  '+card1.idstr+' attack for ' + dmg.toString() + ' damage. ' + card1.hp.toString() + ' remaining.', !userGood);
        }
    }
    switch (dmg){
        case 6: msg('<strong>Big hit!</strong>');
        break;
        case 7: msg('<strong>Very big hit!</strong>');
        break;
        case 8: msg('<strong>Devastating hit!</strong>');
        break;
        case 9: msg('<strong>MASSIVE HIT!</strong>');
        break;
        case 10: msg('<strong>THE DAMAGE THOUGH.</strong>');
        break;
    }
    checkEnd();
};

//is this card alive?
var alive = function (card) {
    if (card.hp <= 0) {
        return false;
    } else {
        return true;
    }
};
///////////////////////////////////////////////////////////////
/////////////////////AI Strategies////////////////////////////
var AI = {};
//this is the highest level of wrapping around an AI turn. This alternates with playerTurn
function AITurn(){
    AIMove();
    turn++;
    getState(army1);
    getState(army2);
    renderField();
    user.state = 'atk';
}

function AIMove(){
    //assumes that army2 is the AI
    getState(army2);
    state = army2.state;
    //test powers
    AI.usePows();
       //if a low hp card is open, sweep the leg
    if (AI.easyKill()){
        markAssBitch = AI.easyKill();
        attack(army2.maxopen(), markAssBitch);
        turn++;
        user.state = 'atk';
        return;
    }
    //allows for the variation of strats between different decks
    switch (state){
        case 'EE': AIOrderedAttack([army2.card(3), army2.card(2)], 
            //what the fuck is this?
            [army1.card(5), army1.card(4),army1.card(2), army1.card(3), army1.card(6), army1.card(7)]);
                    break;
        case 'E': AIOrderedAttack([army2.card(10),army2.card(9),army2.card(8),army2.card(7), army2.card(6),army2.card(4), army2.card(5)], 
            [army1.card(2), army1.card(3),army1.card(5), army1.card(4), army1.card(6),army1.card(7), army1.card(8), army1.card(3), army1.card(2)]);
                    break;
        case 'M': AIOrderedAttack([army2.card(6), army2.card(10), army2.card(9), army2.card(7), army2.card(8), army2.card(5)],
                                    [army1.card(14),army1.card(4),army1.card(5),army1.card(7), army1.card(6),army1.card(8), army1.card(9), army1.card(10), army1.card(11), army1.card(12)]);
                    break;
        case 'L': AIOrderedAttack([army2.card(13), army2.card(11), army2.card(10), army2.card(9), army2.card(8), army2.card(7), army2.card(6)],
                                        [army1.card(14), army1.card(4),army1.card(5),army1.card(6),army1.card(7),army1.card(8), army1.card(9), 
                                        army1.card(10), army1.card(11), army1.card(12), army1.card(13)]);
                    break;
        case 'LL': AIOrderedAttack([army2.card(13), army2.card(11), army2.card(10), army2.card(9), army2.card(8)],
                                        [army1.card(8), army1.card(9), army1.card(10), army1.card(11), army1.card(12), 
                                        army1.card(13), army1.card(14)]);

                    break;
        case 'END': AIOrderedAttack([army2.card(12), army2.card(13), army2.card(14)], 
                                    [army1.card(14), army1.card(13), army1.card(12), army1.card(11), army1.card(10)]);
                    break;
        default: console.log('AIMove() can\'t detect a valid move');
    }
    //this probably isn't necessary and state control is a fucking mess. 
    user.state = 'atk';
}
//oop method for testing AI powers
AI.usePows = function(){
    //uses the powers if possible
    if (army2.open(11) && alive(army2.card(11)) && !army2.card(11).used && army2.hpmin().hp != army2.hpmin().lvl){
        army2.pow_a(army2.hpmin());
        return;
    }
    if (alive(army2.card(12)) && army2.open(12) && !alive(army1.card(8)) && alive(army1.card(12))) {
                        army2.pow_j();
                        return;
    }
    if (alive(army2.card(13)) && army2.open(13) && !army2.card(13).used) {
                        army2.pow_q();
                        return;
    }
    if (alive(army2.card(14)) && army2.open(14) && !army2.card(14).used) {
        if (!alive(army2.card(12))){
            army2.pow_k(army2.card(12));
        } else {
            army2.pow_k(army2.card(10));
        }
        return;
    }
 
}

//attack order for simple attack order per state. Allows for funkier strat manipulation
AI.attackOrder = {
    EE: {
        atk: [3, 2],
        def: [2, 3]
    },
    E: {
        atk: [10, 9, 8, 7, 6, 5, 4, 3, 2],
        def: [2, 3, 5, 4, 6, 7, 8, 9, 10]
    },
    M: {
        atk: [6, 10, 7, 8, 9], 
        def: [14, 5, 4, 6, 7, 8, 9, 10, 11, 12, 13]
    },
    L: {
        atk: [10, 11, 12, 9, 8, 7, 6],
        def: [14, 4, 5, 7, 6, 8, 9, 12, 11, 10]
    }
}
//new version of AIOrderedAttack() handles. c
AI.orderOfAttack = function(state){
    
}
//returns a card if an easy kill is available, other wise returns false. an handle multiple low hp cards
AI.easyKill = function(){
    lowest = null;
    for (var i = 6; i <= 14; i++){
        if (army1.card(i).hp <= 4 && army1.open(i) && alive(army1.card(i))) {
            //card(i) is low. check if lowest is already set
            if (lowest == null){
                lowest = army1.card(i);
            } else {
                if (army1.card(i).hp <= lowest.hp){
                    lowest = army1.card(i);
                }
            }
        }
    }
    //return lowest if it exists and if not, false
    if (lowest != null){
        return lowest;
    } else {
        return false;
    }
}
//executes an attack in order of prefential attackers and defenders
function AIOrderedAttack(atkcards, dfdcards){
    for (var i = 0; i < atkcards.length; i++){
        if (alive(atkcards[i]) && army2.open(atkcards[i].pk)){
            var atkCard = atkcards[i];
            break;
        }
    }
    for (var i = 0; i < dfdcards.length; i++){
        if (alive(dfdcards[i]) && army1.open(dfdcards[i].pk)){
            var dfdCard = dfdcards[i];
            break;
        }
    }
    //make the attack and check for a kill
    attack(atkCard, dfdCard, false);
    if (!alive(dfdCard)){
        msg('The '+atkCard.idstr+'\'s attack was succesful! They are granted a potion', false);
        army2.level(atkCard);
        if (army2.hpmin().hp != army2.hpmin().lvl){
            setTimeout(function(){
                AIPot(drawPot())
            }, 1000);
        } else {
            msg('The '+atkCard.suit+'\s can\'t use the potion', false);
            user.state = 'atk';
        }
    }
    //should the state be switched here as well?
    renderField();
}

//determines how AI uses a pot where h is pot value
function AIPot (h){
    c = army2.hpmin();
    chp = c.hp;
    if ((c.hp + h) <= c.lvl){
        c.hp = c.hp + h;
    } else {
        c.hp = c.lvl;
    }
    msg(c.idstr+'\'s health has been restored from '+c.hp+' to '+c.hp);
    renderField();
}

function needPot(army){
    //if king is low, heal the goddam king first
    if (army1.card(14).hp < 5){
        return army.card(14);
    }
    //the queen is also critical
    if (army1.card(13).hp < 6){
        return arm.card(13);
    } else if (army.hpmin().val >= 7){
        return army.hpmin();
    }
}
/////////////////////////////////////////////////////////
/////////////////Handles Potion deck////////////////////

//deck card constructor
var deckcard = function(pk, sym){
    this.pk = pk;
};

//elegant shuffle function reappropriated from SE
function shuffle(o){ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

//creates a new pot deck 
var makeDeck = function(){
    this.stack = [];
    for (q = 0;q < 6;q++){
        //I set the max pot value at 5. This will offset snowballing cards, namely, the 10.
        for (i = 2;i < 5;i++){
            next = new deckcard(i , i);
            this.stack.push(next);
        }
    }
};

function drawPot(){
    cardDrawn = deck.stack.pop();
    return cardDrawn.pk;
}
/////////////////////////////////////////////////////////////
///////////here we define user variables and controls///////
/////////////////////////////////////////////////////////////
var user = {
    army: army1,
    //user.state changes after the user makes actions
    /*states
    atk = waiting for attack pick
    def = waiting for tobeattacked pick
    ent = both atk and defense have been entered
    pot = waiting on the user to use a pot
    powK = waiting on the user to choose a card to revive
    powA = waiting on the user to choose a card to heal
    AI = AI's turn
    menu = idling in the menu
    post = post-game stats
    */ 
    state: 'atk'
}
/*
if (user.first){
        user.state = 'atk';
    } else {
        user.state = 'AI';
        AIMove();
    }
*/
function userTurn(){
    //tests validity of user inputs before making tha attack
    if (validMove(user.atk, user.def)){
        attack(user.atk, user.def, true);
        //if your attack kills a card, draw a potion
        if (!alive(user.def)){
            //level the attacking card
            army1.level(user.atk);
            renderField();
            if (army1.hpmin().hp != army1.hpmin().val){
                //you can use your potion
                user.state = 'pot';
                msg('You are granted a potion. Select card to heal', true);
            } else {
                //all your army is at full health - proceed to AI turn
                msg('You can\'t use your potion', true);
                setTimeout(function(){
                    user.state = 'AI';
                    AIMove();
                }, 200);
            }
        } else {
            setTimeout(function(){
                msg('The '+army2.suit+' king contemplates his move...');
                user.state = 'AI';
                //sets the timeout to a different value based on the game's state
                switch (army2.state){
                    case 'EE': time = 1;
                    case 'E': time = Math.random() * 1+ 1;
                    case 'M': time = Math.random() * 3 + 1;
                    case 'L': time = Math.random() * 4 + 1;
                    case 'LL': time = Math.random() * 3 + 1;
                    case 'END': time = 4;
                setTimeout(function(){AITurn()}, time * 1000);
                }
            }, 2000);

        }
        turn++;
        $('#attacking').html('');
        $('#defending').html('');
        getState(army1);
        getState(army2);
        renderField();   
    } else {
        msg('Enter a valid move');
        $('#attacking').html('');
        $('#defending').html('');
        //hacky as shiiiit but it works. Fix this later when sober.
        setTimeout(function(){
            user.state = 'atk';
        }, 500);
    }

    //console.log('field rendered');
    
}

//handles keypresses
$('html').keypress(function(e){
    //if atk and def are entered, make atk when enter key is pressed
  if (e.which == 13 && user.state == 'ent' && user.atk != null && user.def != null){
    userTurn();
    return;
  }
  //clears the user input\
  if (e.which == 32){
    user.atk = null;
    user.def = null;
    $('#attacking').html('');
    $('#defending').html('');
    //also hacky as shit. Fix when sober.
    setTimeout(function(){
        user.state = 'atk';
    }, 200);
    return;
  }
  //this was supposed to fix the error throwing when the key isn't mapped - broken
  if (keys[e.which]){
        key = keys[e.which];
    } else {
        key = '';
    }
    handleInput(key);
});
//handles input per state where key is the card's pk
function handleInput(key){
    if (alive(army1.card(key))) {
        switch (user.state){
        case 'atk': $('#attacking').html(army1.card(key).sym);
                    user.atk = army1.card(key);
                    user.state = 'def';
                    renderField();
            break;
        case 'def': $('#defending').html(army1.card(key).sym);
                    user.def = army2.card(key);
                    user.state = 'ent';
            break;
            //possibly shorten the pot handling. handleInput() should be more elegant
        case 'pot': c = army1.card(key);
                    if (alive(c)){
                        pot = drawPot();
                        if ((c.hp + pot) <= c.val){
                            healed = Math.abs(c.val- (c.val + pot));
                            c.hp = c.hp + pot;
                        } else {
                            c.hp = c.val;
                        }
                        msg('You heal your '+c.sym+' for '+pot+' hp', true);
                        user.state = 'AI';
                        renderField();
                        setTimeout(function(){AITurn()}, 2000);
                    } else {
                        msg('You can\'t use your potion on a dead card', true);
                    }
            break;
        case 'aPow': army1.pow_a(army1.card(key));
            break;
        default: console.log('input handler is confused');
        }
    }
    //the kPow state ignores whether the card is alive
    if (user.state == 'kPow'){
        army1.pow_k(army1.card(key));
    } 
}

//maps keystrokes to army.card(x) handler
var keys = {
    50: 2,
    51: 3,
    52: 4,
    53: 5,
    54: 6,
    55: 7,
    56: 8,
    57: 9,
    48: 10,
    97: 11,
    106: 12,
    113: 13,
    107: 14
}
//wired j power - works
$('#jPow').click(function(){
    if ((user.state == 'atk' || user.state == 'def' || user.state == 'ent') && army1.open(12) && alive(army1.card(12))){
        army1.pow_j();
        //let the AI have a turn
        user.state = 'AI';
        setTimeout(function(){
            AITurn();
        }, 500);
    } else {
        msg('You can\'t use the Jack\'s power right now', true);
    }
});
//wired q power - works (tentatively)
$('#qPow').click(function(){
    if ((user.state == 'atk' || user.state == 'def' || user.state == 'ent') && army1.open(13) && alive(army1.card(13))){
        army1.pow_q();
        //let the AI have a turn
        user.state = 'AI';
        setTimeout(function(){
            AITurn();
        }, 3000)
    } else {
        //queen's if logic failed
        msg('You can\'t use the Queen\'s power right now', true);
    }
});
//wired a power
$('#aPow').click(function(){
    if (army1.card(11).used == false && army1.open(11) && alive(army1.card(11))){
        user.state = 'aPow';
        msg('Which card should the a heal?', true);
        renderField(); 
    }
})
$('#kPow').click(function(){
    if (army1.card(14).used || !army1.open(14) || !alive(army1.card(14))) {
        msg('The king can\'t be used right now', true);
    } else {
        user.state = 'kPow';
        renderField();
    }
})
/////////////////////////////////////////////////////////////
//here we begin to init the game

//construct the two armies and set their states
var army1 = new army('Montague', 'user');
getState(army1);

var army2 = new army('Capulet', 'AI');
getState(army2);

var deck = new makeDeck();
shuffle(deck.stack);

//turn is cycled after the enemy makes their turn
turn = 1;
//determines whither user is first
user.first = function(){
    if (Math.random() > .5){
        return true;
        msg('You make the first move', true)
    } else {
        return false;
        msg('Your adversary makes the first move', false);
    }
};
//this alerts the player to the result after a succeful move
//possibly remake this with msgDiv.childNodes if it proves to be more annoying
var msgDiv = document.getElementById('message');
function msg(t, userPos){
    //picks color
    if (userPos){
        clr = 'blue';
    } else {
        clr = 'red';
    }
    hr = document.createElement('hr');
    msgDiv.innerHTML += '<hr>'+'<p style="color: '+clr+'">'+t+'</p>';
    msgDiv.scrollTop = msgDiv.scrollHeight;
}
//returns the state of the army specified by the argument
//why the fuck is this broken?
function getState(army){
    if (alive(army.card(2)) || alive(army.card(3))){
        army.state = 'EE';
    } else if ((alive(army.card(4)) + alive(army.card(5)) + alive(army.card(6))) >= 2){
        army.state = 'E';
    } else if ((alive(army.card(7)) + alive(army.card(8)) + alive(army.card(9)) + alive(army.card(10))) >= 3){
        army.state = 'M';
    } else if(alive(army.card(12)) || alive(army.card(11))){
        army.state = 'L';
    } else if (alive(army.card(13))){
            army.state = 'LL';   
    } else {
        army.state = 'END';
    }
}
/////////////////////////////////////////////////////////////
//presentation logic interacts with DOM//////////////////////
//dpi functions from SE
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();
createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}
//creates the canvas and loads into the DOM
var canvas = createHiDPICanvas(660, 425);
canvas.id = 'battlefield';
document.body.appendChild(canvas);

var can = document.getElementById('battlefield');
var ctx = can.getContext('2d');
//presets dimensions for the cards
var m = 5;
var h = 100;
var w = 50;
//rendering a card onto the screen
function drawCard(x, y, c) {
    if (alive(c)){
        //register coord variables
        c.topLeft = [x, y];
        c.botRight = [x + w, y + h];
        //render the card
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.rect(x, y, w, h);
        ctx.stroke();
        ctx.closePath();
        if (c.suit === 'Montague'){
            ctx.fillStyle = "blue";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.font = "bold 28px Arial";
        ctx.fillText(c.sym, x + 5, y + 40);
        ctx.font = "bold 9px Arial";
        ctx.fillText('HP: '+c.hp+'/'+c.lvl, x + 5, y + 70);
        ctx.fillText("Atk: "+c.atk, x + 5, y + 80);
        if (!c.used){
            ctx.fillText("POW", x + 5, y + 90);
        }
          ctx.beginPath();
          len = Math.round(c.hp/c.lvl * 50);
            if (len > 35){
                ctx.strokeStyle = "DarkGreen";
            } else if (len > 15){
                ctx.strokeStyle = "DarkOrange";
            } else {
                ctx.strokeStyle = "DarkRed";
            }
          ctx.moveTo(x + 45, y+(50 - len));
          ctx.lineTo(x + 45, y + 50);
          ctx.lineWidth = 10;
          ctx.stroke();
  }
}
//draws the entire army object onto the canvas
function renderArmy1(army){
    //could compute coords from card.r and card.c but maybe not efficient but possibly can't handle the tweened cards
    //recode this later the direction the army faces can be derived
    drawCard(0, (h+m)*1, army.card(13));
    drawCard(0, (h+m)*2, army.card(14));
    drawCard((w+m)*1, (h+m)*1, army.card(11));
    drawCard((w+m)*1, (h+m)*2, army.card(12));
    drawCard((w+m)*2, (h+m)*3, army.card(7));
    drawCard((w+m)*2, (h+m)*2, army.card(8));
    drawCard((w+m)*2, (h+m)*1, army.card(9));
    drawCard((w+m)*2, (h+m)*0, army.card(10));
    drawCard((w+m)*3, ((h+m)*2) + 50, army.card(4));
    drawCard((w+m)*3, ((h+m)*1) + 50, army.card(5));
    drawCard((w+m)*3, ((h+m)*0) + 50, army.card(6));
    drawCard((w+m)*4, ((h+m)*1), army.card(3));
    drawCard((w+m)*4, ((h+m)*2), army.card(2));
}
function renderArmy2(army){
    //could compute coords from card.r and card.c but maybe not efficient but possibly can't handle the tweened cards
    //recode this later the direction the army faces can be derived
    drawCard(600, (h+m)*1, army.card(13));
    drawCard(600, (h+m)*2, army.card(14));
    drawCard(600 - ((w+m)*1), (h+m)*1, army.card(11));
    drawCard(600 - ((w+m)*1), (h+m)*2, army.card(12));
    drawCard(600 - ((w+m)*2), (h+m)*3, army.card(7));
    drawCard(600 - ((w+m)*2), (h+m)*2, army.card(8));
    drawCard(600 - ((w+m)*2), (h+m)*1, army.card(9));
    drawCard(600 - ((w+m)*2), (h+m)*0, army.card(10));
    drawCard(600 - ((w+m)*3), ((h+m)*2) + 50, army.card(4));
    drawCard(600 - ((w+m)*3), ((h+m)*1) + 50, army.card(5));
    drawCard(600 - ((w+m)*3), ((h+m)*0) + 50, army.card(6));
    drawCard(600 - ((w+m)*4), ((h+m)*1), army.card(3));
    drawCard(600 - ((w+m)*4), ((h+m)*2), army.card(2));
}
function renderField(){
    ctx.clearRect(0, 0, can.width, can.height);
    renderArmy1(army1);
    renderArmy2(army2);
    //set the hint based on the user.state
    switch(user.state){
        case 'atk': hint = 'Choose a card to attack with';
        break;
        case 'def': hint = 'Choose an enemy card to attack';
        break;
        case 'pot': hint = 'Pick which card to heal with your potion';
        break;
        case 'AI': hint = 'Your opponent is making a move';
        break;
        case 'aPow': hint = 'Which card shall the Apothecary heal?';
        break;
        case 'kPow': hint = 'Which card shall the King revive?';
        break;
        case 'post': hint = 'The battle is finished';
    }
    $('#hint').html(hint);
}
renderField();
//////////////////////////////////////////////////////////
/////////////////UI Shit///////////////////////////////////
$('#instructions').click(function(){
    pos = document.getElementById('instructions').getBoundingClientRect().left;
    if (pos < 0){
        $('#instructions').animate({left: '+=390'}, 300);
    } else {
        $('#instructions').animate({left: '-=390'}, 300);
    }
});

var helperDialog = document.createElement('div');
helperDialog.className = 'helperDialog';

function helperDialog(t){
    helperDialog.innerHTML = 't';
    $('html').append(helperDialog);
}

$('#title').click(function(){
    $('html').append(helperDialog);
})

$('#title').mouseover(function(){
  $(this).css('color', 'red');
})

$('#title').mouseout(function(){
    $(this).css('color', 'black');
})

$('.helperDialog').click(function(){
    console.log('clicked helperDialog')
    $('.helperDialog').remove();
})
//registers clicks and wires to fieldClick
can.addEventListener('click', fieldClick, false);
//handles event clicks and maps to the canvas
function fieldClick(e){
    clickX = e.layerX;
    clickY = e.layerY;
    //search for click's bounding rect in army1 coords if state calls for it
    if (user.state == 'atk' || user.state == 'pot' || user.state == 'kPow' || user.state == 'aPow'){
        for (var i = 0; i < army1.list.length; i++){
            if (clickX >= army1.list[i].topLeft[0] && clickY >= army1.list[i].topLeft[1] 
                && clickX <= army1.list[i].botRight[0] && clickY <= army1.list[i].botRight[1]){
                console.log('Clicked '+army1.list[i].idstr);
            //broken
                if (alive(army1.list[i].pk)){
                    handleInput(army1.list[i].pk);
                } else {
                    console.log('card is dead, yo');
                }
                
                return;
            }
        }
        //otherwise, search in army2 coords
    } else {
        for (var i = 0; i < army2.list.length; i++){
            if (clickX >= army2.list[i].topLeft[0] && clickY >= army2.list[i].topLeft[1] 
                && clickX <= army2.list[i].botRight[0] && clickY <= army2.list[i].botRight[1]){
                console.log('Clicked '+army2.list[i].idstr);
                handleInput(army2.list[i].pk)
                return;
            }
        }
    }
    console.log('Click mapping function done and fucked up');
}
//////////////////////////////////////////////////////////
/////////////////////Debugging Helpers///////////////////
/*
function jumpTo(state){

    for (index in stateCards){
        console.log('looking in '+index);
        for (var i = 0; i = stateCards[index].length; i++){
            console.log(stateCards[index][i]);
            army1.card(stateCards[index][i]).hp = 0;
            army2.card(stateCards[index][i]).hp = 0;
        }
        if (index = state){
            return;
        }
    }
    renderField();
    getState(army1);
    getstate(army2);
}
stateCards = {
    'EE': [2, 3],
    'E': [4, 5, 6],
    'M': [7, 8, 9],
    'L': [10, 11],
    'LL': [12]
};
*/
//jumps to late game
function jumpToL(){
    for (var i = 2; i <= 10; i++){
        army1.card(i).hp = 0;
        army2.card(i).hp = 0;
        getState(army1);
        getState(army2);
        renderField();
    }
}
jumpToL();