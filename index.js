const P = new Pokedex.Pokedex()

let pokes = []
let challengedPokes = []
let activePokes = []

async function Run() {

    //First, get a randomized array of all pokemon
    let ps = await P.getPokemonsList()
    ps = shuffle(ps.results)
    
    //Then, check how many levels our tree/bracket needs to have
    let levelCount = Math.ceil(Math.log2(ps.length)) + 1
    
    //Set a global var
    pokes = ps.map(p => p.name)
    // console.log(pokes)
    
    //And then set up the first matchup
    await Matchup()
}

async function AddImage(source, target) {
    document.getElementById(`img-${target}`)?.remove()
    var img = document.createElement("img");
    img.src = source;
    img.id = `img-${target}`
    var src = document.getElementById(`imgcontainer-${target}`);
    src.appendChild(img);
}

Run()

async function Matchup() {
    if (pokes.length > 1) {
        activePokes = pokes.splice(0, 2)
        let form1 = await P.getPokemonFormByName(activePokes[0])
        AddImage(form1.sprites.front_default, 1)
        let form2 = await P.getPokemonFormByName(activePokes[1])
        AddImage(form2.sprites.front_default, 2)
    }
    else {
        challengedPokes.push(...pokes)
        pokes = challengedPokes
        Matchup()
    }
}

function Vote(btn) {
    let index = parseInt(btn.id.split("-")[1]) - 1
    challengedPokes.push(activePokes[index]);
    activePokes = [];
    Matchup();
    // TODO: make this into a update instead of remaking every time
    MakeProgressBar(challengedPokes.length * 2 + pokes.length, challengedPokes.length  * 2, "CurrentRound")
}

//Make the entire progress bar
function MakeProgressBar(max, value, id) {
    //Remove any old progress bars with the same ID
    document.getElementById("progress-" + id)?.remove()

    //Calculate the percentage of questions that the user got right
    let percentage = Math.round((value / max) * 100) + "%"

    let node = document.createElement("div")
    node.id = "progress-" + id;

    let hwrapper = document.createElement("div")
    hwrapper.id = "hwrapper"

    //Create the left header
    let header = document.createElement("h2")
    let htext = document.createTextNode(id)
    header.appendChild(htext)
    hwrapper.appendChild(header)

    //Create the right header
    let percCounter = document.createElement("h2")
    let percText = document.createTextNode(percentage)
    percCounter.id = "perccounter"
    percCounter.appendChild(percText)
    hwrapper.appendChild(percCounter)
    node.appendChild(hwrapper)

    //Create the wrapper div 
    let progressdiv = document.createElement("div")
    progressdiv.classList.add("progress");
    node.appendChild(progressdiv)

    //Then create the inside div, aka the one that gets the color
    let progressinsidediv = document.createElement("div")
    progressinsidediv.classList.add("progressinside");
    progressdiv.appendChild(progressinsidediv)
    progressinsidediv.style.width = percentage

    //Then create a laast progress

    //Finally, add it
    document.getElementById("progsec").appendChild(node)
}

function shuffle(arr) {
    let ret = []
    for (let i = arr.length - 1; i >= 0; i--) {
        //get a randomized index into the array, then add that to the output
        let index = Math.round(Math.random() * i)
        ret.push(...arr.splice(index, 1))
    }
    return ret
}