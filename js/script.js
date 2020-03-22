"use strict"
const form = document.querySelector('#search-form');
const movieContainer = document.querySelector('#movies');

function apiSearch(e) {
    e.preventDefault();

    let searchText = document.querySelector('#search-text').value;
    const apiKey = '1983cecd00be37d37b4510809b6e5780';
    let server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchText}`;
    movieContainer.innerHTML = 'Загрузка...';
    requestAPI(server)
        .then(function (result) { //result - произвольное имя
            const output = JSON.parse(result);
            // console.log(output);

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
                movieContainer.innerHTML = inner;
            });

        })
        .catch(function(err) {
            movieContainer.innerHTML = 'Упс, что-то пошло не так!';
            console.error('Ошибка ' + err.status);
        });
}

form.addEventListener('submit', apiSearch);

function requestAPI(url) { //универсальная ф-я, которая не зависит ни от каких п-ров, можем вызывать где угодно
       return new Promise(function (resolve, reject) { //можно записать в переменную и потом возвращать
        let request = new XMLHttpRequest();
        // вместо readystatechange ожидаем load и error

        request.open('GET', url);
        request.addEventListener('load', function () {
            if (request.status !== 200) {
                reject({ status: request.status }); // дублируем код еррора, так как например событие еррор не ловит некоторые ошибки, такие как 404
                return;
            };

            resolve(request.response);

        });

        request.addEventListener('error', function () {
            reject({ status: request.status });// функция reject содержит обьект
        });

        request.send();
    })
}