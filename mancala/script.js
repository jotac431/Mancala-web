function startGame(event) {
    
    event.preventDefault();

    const parent = document.getElementById("base");

    const size = parseInt(document.querySelector("#board_size").value);
    const seed_num = parseInt(document.querySelector("#seed_num").value);
    const board1 = new Board("base", size, seed_num);
}

class Board {

    constructor(id, size, seed_num) {

        const form1 = document.getElementById('form');
        form1.style.display = "none";

        const parent = document.getElementById(id);
        const child1 = document.createElement('div');
        const board = document.createElement('div');
        
        let child = parent.lastElementChild;
        if (child) parent.removeChild(child);

        parent.appendChild(child1);
        child1.appendChild(board);
        child1.id = 'child1';
        board.className = 'board';

        this.size = size;
        this.currentPlayer = 1;
        this.arraymap = new Map();
        this.banks = new Array(2);
        this.pits = new Array(size);
        this.pitsBanks = new Array(size+2);

        for(let i=0; i<(size+2); i++) {
            this.pitsBanks[i] = new Pit(('p'+ (i+1)), seed_num, (i+1)%(size+2));
            switch(i){
                case (size/2):
                    this.banks[0] = this.pitsBanks[i];
                    this.banks[0].clear();
                    this.banks[0].setId('b1');
                    break;
                case (size+1):
                    this.banks[1] = this.pitsBanks[i];
                    this.banks[1].clear();
                    this.banks[1].setId('b2');
                    break;
                default:
                    this.pits[i - (i > size/2 ? 1 : 0) - (i > (size + 1) ? 1 : 0)] = this.pitsBanks[i];
            }
        } 

        const section1 = document.createElement('div');
        section1.className = 'section endsection';
        board.appendChild(section1);

        const bank1 = document.createElement('div');
        bank1.className = 'pot';
        bank1.id = "b2"
        section1.appendChild(bank1);
        this.arraymap.set(bank1.id, this.pitsBanks[size+1]);

        const midsection = document.createElement('div');
        midsection.className = 'section midsection';
        board.appendChild(midsection);

        const midrow_top = document.createElement('div');
        midrow_top.className = 'midrow topmid';
        midsection.appendChild(midrow_top);
        for(let i=0; i<(size/2); i++) {
            let pot = document.createElement("div");
            pot.className = "pot";
            pot.id = "p"+ (size-(i-1));
            midrow_top.appendChild(pot);
            for(let j=0; j<seed_num; j++) {
                let seed = document.createElement("div");
                seed.className = "seed";
                pot.appendChild(seed);
            }
            pot.board = this;
            pot.addEventListener("click", playHandler);
            this.arraymap.set(pot.id, this.pits[size-(i+1)]);
        } 

        const midrow_bot = document.createElement('div');
        midrow_bot.className = 'midrow botmid';
        midsection.appendChild(midrow_bot);
        for(let i=0; i<(size/2); i++) {
            let pot = document.createElement("div");
            pot.className = "pot";
            pot.id = "p"+ (i + 1);
            midrow_bot.appendChild(pot);
            for(let j=0; j<seed_num; j++) {
                let seed = document.createElement("div");
                seed.className = "seed";
                pot.appendChild(seed);
            }
            pot.board = this;
            pot.addEventListener("click", playHandler);
            this.arraymap.set(pot.id, this.pits[i]);
        }

        const endsection = document.createElement('div');
        endsection.className = 'section endsection';
        board.appendChild(endsection);

        const bank2 = document.createElement('div');
        bank2.className = 'pot';
        bank2.id = "b1"
        endsection.appendChild(bank2);
        this.arraymap.set(bank2.id, this.pitsBanks[size/2]);

        const giveup = document.createElement('button');
        giveup.innerText = 'Give Up';
        giveup.id = "giveup";
        giveup.addEventListener('click', gameStatusHandler);
        child1.appendChild(giveup);

        const turn = document.createElement('p');
        turn.innerText = 'Turn: Player ' + this.currentPlayer;
        turn.id = "turn";
        child1.appendChild(turn);

        
    }

    play(id){

        let seeds = this.arraymap.get(id).getSeeds();
        var currentPit = this.arraymap.get(id).getNext_pit();
        var cpit = mod(this.arraymap.get(id).getNext_pit()-1, this.size + 2);

        if(this.currentPlayer == 1 && cpit > (this.size/2)){
            return;
        }
        else if(this.currentPlayer == 2 && cpit < (this.size/2)){
            return;
        }

        this.arraymap.get(id).clear();
        this.arraymap.get(id).removeChilds();

        for(let i = 0 ; i < seeds; i++){
            this.pitsBanks[currentPit].increase();
            currentPit = this.pitsBanks[currentPit].getNext_pit();
        }

        let turn = document.getElementById('turn');

        if(this.currentPlayer == 1 && this.pitsBanks[mod(currentPit-1,this.size + 2)].id == 'b1')
            this.currentPlayer = 1;
        else if(this.currentPlayer == 2 && this.pitsBanks[mod(currentPit-1,this.size + 2)].id == 'b2')
            this.currentPlayer = 2;
        else if(this.currentPlayer == 1)
            this.currentPlayer = 2;
        else if(this.currentPlayer == 2)
            this.currentPlayer = 1;

        if(this.test_victory()){
            if(this.banks[0].getSeeds() == this.banks[1].getSeeds())
                turn.innerText = "It's a Draw!";
            else
                turn.innerText = "Player " + (this.banks[0].getSeeds() > this.banks[1].getSeeds() ? "1" : "2") + " wins!";
            return;
        }

        turn.innerText = 'Turn: Player ' + this.currentPlayer;
    }

    test_victory(){
        
        let flag = true;
        if (this.currentPlayer == 1){
            for(let i=0; i<(this.size/2); i++) {
                if(this.pits[i].getSeeds() > 0)
                    flag = false;
            }
        }
        if (this.currentPlayer == 2){
            for(let i=0; i<(this.size/2); i++) {
                if(this.pits[this.size-(i+1)].getSeeds() > 0)
                    flag = false;
            }
        }
        return flag;
    }
}

function mod(n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
}

function playHandler(event) {

    event.currentTarget.board.play(event.currentTarget.id);
    event.preventDefault();
}

function gameStatusHandler(event) {

    event.preventDefault();
    const giveup = document.getElementById('giveup');
    const child1 = document.getElementById('child1');

    let child = child1.lastElementChild;
    if (child) child1.removeChild(child);
    const p = document.createElement('p');
    p.innerText = "Player Loses";
    child1.appendChild(p);
    
    const form1 = document.getElementById('form');
    form1.style.display = "block";
}

class Pit{
    constructor(id, seeds, next_pit){
        this.id = id;
        this.seeds = seeds;
        this.next_pit = next_pit;
    }

    getNext_pit() {
        return this.next_pit;
    }

    increase(){
        this.seeds += 1;

        const pot = document.getElementById(this.id);

        let seed = document.createElement("div");
        seed.className = "seed";
        pot.appendChild(seed);
    }

    clear(){
        this.seeds = 0;
    }

    removeChilds(){
        let pot = document.getElementById(this.id);
        let child = pot.lastElementChild;  
        while (child) { 
            pot.removeChild(child); 
            child = pot.lastElementChild;   
        }
    }

    getSeeds(){
        return this.seeds;
    }

    setId(id){
        this.id = id;
    }
}

class Score{
    constructor(p1, p2){
        this.p1 = p1;
        this.p2 = p2;
    }
}