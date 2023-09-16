const apiKey = "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"

const maxImages = 4;

let selectedImageNumber = null;

//Function to generate Random number between min and max
function getRandomNumber(min, max){
    return Math.floor(Math.random()*(max-min+1));
}

//function to disable the generate button during processing
function disableGenerateButton(){
    document.getElementById("generate").disabled = true;
}

function enableGenerateButton(){
    document.getElementById("generate").disabled = false;
}

function clearImageGrid(){
    const imageGrid = document.getElementById
        ("image-grid");
    imageGrid.innerHTML = "";
}

async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for(let i = 0; i< maxImages; i++){
        const randomNumber = getRandomNumber(1, 100);
        const prompt = `${input} ${randomNumber}`;
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({inputs : prompt}),
            }


        );

        if(!response.ok){
            alert("Failed to generate image!");
        }

        const blob = await response.blob();

        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null;
}

document.getElementById("generate").addEventListener('click', ()=>{
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}
