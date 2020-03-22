"use strict"
const form = document.querySelector('#search-form');



function apiSearch(e) {
    e.preventDefault();

    let searchText = document.querySelector('#search-text').value;
    let server = 'https://api.themoviedb.org/3/search/multi?api_key=1983cecd00be37d37b4510809b6e5780&language=ru&query=' + searchText;

    requestAPI('GET', server);
}

form.addEventListener('submit', apiSearch);

function requestAPI(method, url) {
    let request = new XMLHttpRequest();
    let movie = document.querySelector('#movies');

    request.open(method, url);
    request.send();

    request.addEventListener('readystatechange', function () {
        if (request.readyState !== 4) return;
        if (request.status !== 200) { //если запрос не успешный
            console.log('error ' + request.status);
        }

        const output = JSON.parse(request.responseText); // правильно форматируем длинную JSON строку
        console.log(output);
        let inner = "";

        output.results.forEach(function (item) {
            const itemName = item.name || item.title,
                itemPoster = item.poster_path,
                releaseDate = item.release_date || item.first_air_date || 'неизвестно';

            const img = itemPoster ? `https://image.tmdb.org/t/p/original/${itemPoster}` : '../img/no-poster.jpg';


            inner += `<div class="col-12 col-sm-6 col-lg-4 col-xl-3  mb-2">
                        <div class="border border-warning h-100">
                            <img src="${img}">
                            <div>
                                <b>Название фильма:</b> ${itemName}
                            </div>
                            <div>
                                <b>Дата выхода первой серии:</b>
                                <span class="badge badge-warning">${releaseDate}</span>
                            </div>
                            </div>
                    </div>`;
            movie.innerHTML = inner;
        });
    })
}