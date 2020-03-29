"use strict";
const form = document.querySelector('#search-form');
const movieContainer = document.querySelector('#movies');
const posterPrefix = 'https://image.tmdb.org/t/p/w500/';

function apiSearch(e) {
    e.preventDefault();

    let searchText = document.querySelector('#search-text').value;

    if (searchText.trim().length === 0) { //удаляем пробелы в строке поиска
        movieContainer.innerHTML = "<h2 class='col-12 text-center text-danger'>Поле поиска не должно быть пустым</h2>";
        return;
    }


    const apiKey = '1983cecd00be37d37b4510809b6e5780';
    movieContainer.innerHTML = '<div class="spinner"></div>';

    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchText}`) // фетч принимает 2 параметра - юрл и необъязательный массив с опциями
        .then(function (val) {
            if (val.status !== 200) {
                return Promise.reject(val);
            }

            return val.json(); // возвращает ПРОМИС, json() вместо JSON.parse
        })// then может принимать 2 функции - первая - resolve, вторая - reject ошибка
        .then(function (output) {
            console.log(output);
            let inner = "";

            if (output.results.length === 0) {
                movieContainer.innerHTML = "<h2 class='col-12 text-center text-primary'>По Вашему запросу фильмов не найдено!</h2>";
            }

            output.results.forEach(function (item) {
                const itemName = item.name || item.title,
                    posterPath = item.poster_path,
                    releaseDate = item.release_date || item.first_air_date || 'неизвестно';

                const img = posterPath ? `${posterPrefix + posterPath}` : '../img/no-poster.jpg';

                let dataInfo = '';

                if (item.media_type !== 'person') {
                    dataInfo = `data-id="${item.id}" data-type = "${item.media_type}"`;
                }


                inner += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2 item">
                        <div class="border border-warning h-100">
                            <img src="${img}" alt="${itemName}" class="film-poster" ${dataInfo}>
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

                addDataAttributes();

            });

        })
        .catch(function (err) {
            movieContainer.innerHTML = 'Упс, что-то пошло не так!';
            console.log('Ошибка ' + err);
        });
}

form.addEventListener('submit', apiSearch);

function addDataAttributes() { // добавление дата-аттрибутов
    const items = movieContainer.querySelectorAll('img[data-id]');

    items.forEach(function (item) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', showFullInfo);
    });
}

function showFullInfo() { //запрос детальной информации о фильме

    let url = '';

    if (this.dataset.type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=1983cecd00be37d37b4510809b6e5780&language=ru`;
    } else if (this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=1983cecd00be37d37b4510809b6e5780&language=ru`;
    } else {
        movieContainer.innerHTML = "<h2 class='col-12 text-center text-danger'>Произошла ошибка (Не кино и не сериал). Повторите позже</h2>";
    }


    fetch(url) // фетч принимает 2 параметра - юрл и необъязательный массив с опциями
        .then(function (val) {
            if (val.status !== 200) {
                return Promise.reject(val);
            }

            return val.json(); // возвращает ПРОМИС, json() вместо JSON.parse
        })// then может принимать 2 функции - первая - resolve, вторая - reject ошибка
        .then(function (output) {
            console.log(output);
            movieContainer.innerHTML = `
                <h4 class="col-12 text-center text-success">${output.name || output.title}</h4>
                <div class="col-4 mb-4">
                    <img src="${posterPrefix + output.poster_path}" alt="${output.name || output.title}">

                    ${output.homepage ? `<p class="text-center">
                                            <a href="${output.homepage}" target="_blank">Официальная страница</a>
                                        </p>`
                    : 'Официальной страницы нету'}


                    ${output.imdb_id ? `<p class='text-center'>
                                            <a href="https://www.imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMDB</a>
                                        </p>`
                    : "IMDB страницы нету"}

                </div>
                <div class="col-8 mb-4">
                
                    <p><b>Рейтинг:</b> ${output.vote_average}</p>
                    <p><b>Статус:</b> ${output.status}</p>
                    <p><b>Премьера:</b> ${output.release_date || output.first_air_date}</p>

                    ${(output.number_of_seasons) ? `<p>Количество сезонов: ${output.number_of_seasons} </p>` : ''}

                    <p><b>Описание:</b> ${output.overview}</p>
                    
                    

                </div>
            `;
        })
        .catch(function (err) {
            movieContainer.innerHTML = 'Упс, что-то пошло не так!';
            console.log('Ошибка ' + err);
        });
}

document.addEventListener('DOMContentLoaded', function () { // запрос трендов
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=1983cecd00be37d37b4510809b6e5780&language=ru') 
        .then(function (val) {
            if (val.status !== 200) {
                return Promise.reject(val);
            }

            return val.json(); // возвращает ПРОМИС, json() вместо JSON.parse
        })// then может принимать 2 функции - первая - resolve, вторая - reject ошибка
        .then(function (output) {
            console.log('получили из раздела Популярное:', output);
            let inner = "<h4 class='col-12 text-center text-primary'>Популярное за неделю</h4>";

            if (output.results.length === 0) {
                movieContainer.innerHTML = "<h2 class='col-12 text-center text-primary'>По Вашему запросу фильмов не найдено!</h2>";
            }

            output.results.forEach(function (item) {
                const itemName = item.name || item.title,
                    posterPrefix = 'https://image.tmdb.org/t/p/w500/',
                    posterPath = item.poster_path,
                    releaseDate = item.release_date || item.first_air_date || 'неизвестно';

                const img = posterPath ? `${posterPrefix + posterPath}` : '../img/no-poster.jpg';
                const mediaType = item.media_type;

                let dataInfo = `data-id="${item.id}" data-type = "${mediaType}"`;


                inner += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2 item">
                        <div class="border border-warning h-100">
                            <img src="${img}" alt="${itemName}" class="film-poster" ${dataInfo}>
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

                addDataAttributes();

            });

        })
        .catch(function (err) {
            movieContainer.innerHTML = 'Упс, что-то пошло не так!';
            console.log('Ошибка ' + err);
        });
})