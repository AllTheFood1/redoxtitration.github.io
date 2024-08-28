let currentAgent = null
let buretteMolarity = 0
let flaskMolarity = 0
let finalVolume =  0
let volumeAdded = 0
let flaskVolume = 0
let currentGradientPercentage = [4.5, 4.5]

function propertiesSetter() {
    document.getElementById("oxidation-agent-molarity").innerText = "Molarity of Oxidation Agent: " + currentMolarity
    document.getElementById("flask-volume").innerText = "Volume in Flask: " + flaskVolume.toFixed(2) + "mL"
    document.getElementById("total-volume").innerText = "Total Volume Added: " + volumeAdded.toFixed(2) + "mL"
    console.log(document.getElementById("fill-color").style.background)
    document.getElementById("fill-color").style.background = "linear-gradient(to bottom,white " + currentGradientPercentage[0] + "%,#8cbbdd " + currentGradientPercentage[1] + "%,#8cbbdd 63%,white 37%)"
    console.log(document.getElementById("fill-color").style.background)
}

function VolumeToPercent(volume) {
    return (0.908 * volume).toFixed(3)
}

function UpdateSliderText(value) {
    document.getElementById("slider-text").innerText = value + "mL"
}

function CalcCurrentMolarity(finalVolume, flaskMolarity, currentAgent) {
    switch(currentAgent) {
        case "KMnO4":
            return (finalVolume * flaskMolarity * 5) / flaskVolume
        case "K2Cr2O7":
            return (finalVolume * flaskMolarity * 3) / flaskVolume
        case "I2":
            return (finalVolume * flaskMolarity * 2) / flaskVolume
        default:
            return null
    }
}

function CalcSigFigs(n) {
    n = Math.abs(String(n).replace(".", ""));
    if (n == 0) return 0;
    while (n != 0 && n % 10 == 0) n /= 10;

    return Math.floor(Math.log(n) / log10) + 1;
}

function AgentClicked(id) {
    if(id !== currentAgent) {
        if(currentAgent !== null) {
            document.getElementById(currentAgent).checked = false
        }
        currentAgent = id
        document.getElementById(currentAgent).checked = true
        // document.getElementById("fill-color").classList.add("full")
        document.getElementById("titration-setup-mask").src = "./assets/titration-flask-blue.png"
        flaskVolume = 25
        volumeAdded = 0
        flaskMolarity = Math.random().toFixed(4)
        finalVolume = Math.random().toFixed(4)
        currentMolarity = CalcCurrentMolarity(finalVolume, flaskMolarity, currentAgent).toFixed(4)
        propertiesSetter()
    }
}

function ResetClicked() {
    document.getElementById(currentAgent).checked = false
    document.getElementById("fill-color").classList.remove("full")
    document.getElementById("titration-setup-mask").src = "./assets/titration-flask-empty.png"
    currentAgent = null
    currentMolarity = 0
    volumeAdded = 0
    flaskVolume = 0
    propertiesSetter()
    document.getElementById("fill-color").style.background = "transparent"
    document.getElementById("status-text").style.display = "none"
}

function RepeatClicked() {
    volumeAdded = 0
    flaskVolume = 25
    propertiesSetter()
    document.getElementById("fill-color").style.background = "linear-gradient(to bottom,white 4.5%,#8cbbdd 4.5%,#8cbbdd 63%,white 37%);"
    document.getElementById("status-text").style.display = "none"
}

function DropClicked() {
    if(currentAgent === null) {
        return
    }
    volumeAdded += 0.02
    flaskVolume += 0.02
    console.log(typeof(VolumeToPercent(0.02)))
    currentGradientPercentage[0] += Number(VolumeToPercent(0.02))
    currentGradientPercentage[1] += Number(VolumeToPercent(0.02))
    // document.getElementById("fill-color").classList.remove("full")
    propertiesSetter()
    document.getElementById("titration-setup-mask").src = "./assets/titration-flask-blue.gif"
    window.setTimeout(function() {
        document.getElementById("titration-setup-mask").src = "./assets/titration-flask-blue.png"
    }, 2000)
}

function DispenseClicked() {
    let additionVolume = Number(document.getElementById("slidebar").value)
    if(currentAgent === null || additionVolume === 0) {
        return
    }
    volumeAdded += additionVolume
    flaskVolume += additionVolume
    currentGradientPercentage[0] += Number(VolumeToPercent(additionVolume))
    currentGradientPercentage[1] += Number(VolumeToPercent(additionVolume))
    // document.getElementById("fill-color").classList.remove("full")
    propertiesSetter()
    document.getElementById("titration-setup-mask").src = "./assets/titration-flask-stream-animation.gif"
    window.setTimeout(function() {
        document.getElementById("titration-setup-mask").src = "./assets/titration-flask-blue.png"
    }, 3000)
}

function CheckMolarityCalculation() {
    let textBox = document.getElementById("final-molarity-text")
    let statusText = document.getElementById("status-text")
    if(!isNaN(textBox.value)) {
        let entry = Number(textBox.value)
        if(CalcSigFigs(entry) === 4) {
            if(entry >= (flaskMolarity - (flaskMolarity * 0.02)) && entry <= (flaskMolarity + (flaskMolarity * 0.02))) {
                statusText.style.display = "block"
                statusText.innerText = "Correct!"
                return
            }
        }
    }
    statusText.style.display = "block"
}