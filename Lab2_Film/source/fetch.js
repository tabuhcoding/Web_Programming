import data from './db/data.js'

const database = {
    Movies: data.Movies,
    Names: data.Names,
    Reviews: data.Reviews,
    Top50Movies: data.Top50Movies,
    MostPopularMovies: data.MostPopularMovies,
  };
function Fetch(request) {
    return new Promise((resolve, reject) => {
        var type, typeClass, queryString, className, pattern, pairs, params;
        if (request.includes('?')) {
            [typeClass, queryString] = request.split('?');
            [type, className, pattern] = typeClass.split('/');
            pairs = queryString.split("&");
            params = {};
            pairs.forEach(pair => {
                const [key, value] = pair.split("=");
                params[key] = value;
            });
        } else {
            [type, className,pattern] = request.split('/');
            params = {};
        }

        if (!params.hasOwnProperty("page")) {
            params["page"] = 1;
        }
        if (!params.hasOwnProperty("per_page")) {
            params["per_page"] = 15;
        }

        if (type == "search") {
            params["items"] = handleSearch(className, pattern);
            params["search"] = pattern;
            params["total"] = params["items"].length;
            params["total_page"] = parseInt((params["total"] - 1) / params["per_page"]) + 1;
            resolve(params);
        } else if (type == "detail") {
            params["detail"] = pattern;
            params["item"] = handleDetail(className, pattern);
            resolve(params);
        } else if (type == "get") {
            params["get"] = className;
            params["items"] = handleGet(className);
            params["total"] = params["items"].length;
            params["total_page"] = parseInt((params["total"] - 1) / params["per_page"]) + 1;
            resolve(params);
        } else
        {
            reject("Invalid request type");
        }
    });
}

function handleSearch(className,pattern){
    if(className=="movie"){
        let displayMovieFromMovies = database.Movies.filter(movie =>
            movie.title.toLowerCase().includes(pattern.toLowerCase()) ||
            movie.fullTitle.toLowerCase().includes(pattern.toLowerCase())||
            movie.originalTitle.toLowerCase().includes(pattern.toLowerCase())
        );
        let displayMovieFromTop50 = database.Top50Movies.filter(movie =>
            movie.title.toLowerCase().includes(pattern.toLowerCase()) ||
            movie.fullTitle.toLowerCase().includes(pattern.toLowerCase())
        );
        let displayMovieFromPopular = database.MostPopularMovies.filter(movie =>
            movie.title.toLowerCase().includes(pattern.toLowerCase()) ||
            movie.fullTitle.toLowerCase().includes(pattern.toLowerCase())
        );
        let displayMovie = [...displayMovieFromMovies,...displayMovieFromPopular,...displayMovieFromTop50];
        const uniqueResults = Array.from(new Set(displayMovie.map(movie => movie.id)))
    .map(id => displayMovie.find(movie => movie.id === id));
        return uniqueResults;
    }
    else if(className=="name"){
        let displayName = database.Movies.filter(movie =>
            movie.actorList.some(act => act.name .toLowerCase().includes(pattern.toLowerCase()))
        );
        // console.log(displayName);
        // let displayMovie = database.Movies.filter(movie=>
        //     movie.directorList.some(person => displayName.some( targetPerson => targetPerson.id==person.id)) ||
        //     movie.writerList.some(person => displayName.some( targetPerson => targetPerson.id==person.id)) ||
        //     movie.actorList.some(person => displayName.some( targetPerson => targetPerson.id==person.id))    
        // );
        return displayName;
    }
    else if(className=="reviews"){
        let reviewsMovie = database.Reviews.filter(review =>
          review.movieId == pattern
        );
        return reviewsMovie;
    }
    else return null;
}
function handleDetail(className,pattern){
    if(className=="movie"){
        let movieDetail = database.Movies.find( movie => pattern==movie.id);
        return movieDetail;
    }
    else if(className=="name"){
        let nameDetail = database.Names.find(person => person.id == pattern)
        return nameDetail;
    }
    else return null;
}
function handleGet(className){
    if(className=="top50"){
        return database.Top50Movies;
    }
    if(className == "mostpopular"){
        return database.MostPopularMovies;
    }
    if(className=="topboxoffice"){
        database.Movies.sort((a, b) => {
            const grossA = parseCumulativeWorldwideGross(a.boxOffice.cumulativeWorldwideGross.replace(/\D/g, ''), 10);
            const grossB = parseCumulativeWorldwideGross(b.boxOffice.cumulativeWorldwideGross.replace(/\D/g, ''), 10);
            return grossB - grossA;
        });
        const top5Movies = database.Movies.slice(0, 5);
        return top5Movies;
    }
}

function parseCumulativeWorldwideGross(cumulativeWorldwideGross) {
    const cleanString = cumulativeWorldwideGross.replace(/\D/g, '');
    return cleanString ? parseInt(cleanString, 10) : 0;
}
export { Fetch };
