const API_KEY = '0798cf38-9199-4d51-845a-657bc5776e29';

// Using AXIOS
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    headers: {
        'x-api-key': '0798cf38-9199-4d51-845a-657bc5776e29',
    },
})

// I can describe headers with this option:
// api.defaults.headers.common['x-api-key'] = '0798cf38-9199-4d51-845a-657bc5776e29';

const API_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=4';
const API_FAVOURITES = 'https://api.thecatapi.com/v1/favourites?limit=20';
const API_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const errorMessage = document.getElementById('error');

// const API = 'https://api.thecatapi.com/v1/images/search'; This API was selected to work the first activity any query parameters

// Create with promises => first activity
// fetch(API)
//     .then(response => response.json())
//     .then(data => {
//         const img = document.getElementById('randomCat');
//         img.src = data[0].url;
//     })
//     .catch(error => console.error(error));

// Create with async-await
async function saveCat(id) {
    // Using AXIOS
    const {data, status} = await api.post('/favourites', {
        image_id: id,
    });
    try {
        console.log(data);
        favouriteCat();
    } catch {
        if(response.status !== 200) {
            errorMessage.innerHTML = `Ups, had an error: ${status}`;
        }
    }

    // Using fetch method
    // const response = await fetch(API_FAVOURITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'x-api-key': API_KEY,
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     }),
    // });
    // try {
    //     const data = await response.json();
    //     console.log(response);
    //     console.log(data);
    //     favouriteCat();
    // } catch {
    //     if(response.status !== 200) {
    //         errorMessage.innerHTML = `Ups, had an error: ${response.status}`;
    //     }
    // }
}

async function deleteFavouriteCat(id) {
    const response = await fetch(API_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY,
        }
    });
    const data = await response.json();
    try {
        console.log('Cat deleted');
        favouriteCat();
    } catch {
        if(response.status !== 200) {
            errorMessage.innerHTML = `Ups, had an error: ${response.status} ${data}`;
        }
    }
}

function previewCat() {
    const file = document.getElementById('file').files;
    const previewCat = document.getElementById('newCat');
    console.log(file);
    
    if(file.length > 0) {
        const fileShow = file[0];
        const objectURL = URL.createObjectURL(fileShow);
        previewCat.src = objectURL;
    } else {
        errorMessage.innerHTML = 'Ups, the file doesnt exist';
    }

}

async function uploadPhotoCat() {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);
    console.log(formData.get('file'));

    const response = await fetch(API_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
        },
        body: formData,
    });
    try {
        console.log('Cat Loaded');
        const data = await response.json();
        saveCat(data.id);
    } catch {
        if(response.status !== 200) {
            errorMessage.innerHTML = `Ups, had an error: ${response.status}`;
        }
    }
}

async function randomCat() {
    const response = await fetch(API_RANDOM);
    try {
        const data = await response.json();
        const img = document.getElementsByClassName('randomCat');
        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        const button3 = document.getElementById('button3');
        const button4 = document.getElementById('button4');
        const arrayImg = [...img];
        arrayImg.forEach((element, index) => {
            element.src = data[index].url;});
        
        button1.onclick = () => saveCat(data[0].id);
        button2.onclick = () => saveCat(data[1].id);
        button3.onclick = () => saveCat(data[2].id);
        button4.onclick = () => saveCat(data[3].id);        
    } catch {
        if(response.status !== 200) {
            errorMessage.innerHTML = `Ups, had an error: ${response.status}`;
        }
    }
}

async function favouriteCat() {
    const response = await fetch(API_FAVOURITES, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        },
    });
    try {
        const data = await response.json();
        console.log(data)
        const section = document.getElementById('favorite');
        section.innerHTML = '';
        
        data.forEach(singleCat => { // Manipulate DOM
            const article = document.createElement('article');
            const img = document.createElement('img');
            const button = document.createElement('button');
            const buttonText = document.createTextNode('Withdraw it of favourite Cat');

            img.src = singleCat.image.url;
            img.alt = 'Favorite Cat';
            img.width = 160;
            button.appendChild(buttonText);
            button.onclick = () => deleteFavouriteCat(singleCat.id);
            article.appendChild(img);
            article.appendChild(button);
            section.appendChild(article);
        })
    } catch {
        if(response.status !== 200) {
            errorMessage.innerHTML = `Ups, had an error: ${response.status}`;
        }
    }
}

randomCat();
favouriteCat();

// // Reload images with on click button
function loadCat() {
//  Load a new images with promises => first activity
//     fetch(API)
//     .then(response => response.json())
//     .then(data => {
//         const img = document.getElementById('randomCat');
//         img.src = data[0].url;
//     })
//     .catch(error => console.error(error));

//  Load a new images to async-await
    randomCat();
    favouriteCat();
}