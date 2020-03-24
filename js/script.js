"use strict";
const form = document.querySelector('#search-form');
const movieContainer = document.querySelector('#movies');

function apiSearch(e) {
    e.preventDefault();

    let searchText = document.querySelector('#search-text').value;
    const apiKey = '1983cecd00be37d37b4510809b6e5780';
    let server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchText}`;
    movieContainer.innerHTML = 'Загрузка...';

    fetch(server) // фетч принимает 2 параметра - юрл и необъязательный массив с опциями
        .then(function (val) {
            if (val.status !== 200) {
                return Promise.reject(val);
            }

            return val.json(); // возвращает ПРОМИС, json() вместо JSON.parse
        })// then может принимать 2 функции - первая - resolve, вторая - reject ошибка
        .then(function (output) {
            console.log(output)
            let inner = "";

            output.results.forEach(function (item) {
                const itemName = item.name || item.title,
                    posterPrefix = 'https://image.tmdb.org/t/p/w500/',
                    posterPath = item.poster_path,
                    releaseDate = item.release_date || item.first_air_date || 'неизвестно';

                const img = posterPath ? `${posterPrefix + posterPath}` : '../img/no-poster.jpg';

                inner += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3  mb-2">
                        <div class="border border-warning h-100">
                            <img src="${img}" alt="${itemName}">
                            <div>
                                <h5 class="text-center font-weight-bold">${itemName}</h5>
                            </div>
                            <div>
                                <b>Дата премьеры:</b>
                                <span class="badge badge-warning">${releaseDate}</span>
                            </div>
                            </div>
                    </div>
                `;
                movieContainer.innerHTML = inner;
            });

            if (output.results.length === 0) {
                movieContainer.innerHTML = 'По Вашему запросу фильмов не найдено!';
            }
        })
        .catch(function (err) {
            movieContainer.innerHTML = 'Упс, что-то пошло не так!';
            console.log('Ошибка ' + err);
        });
}

form.addEventListener('submit', apiSearch);