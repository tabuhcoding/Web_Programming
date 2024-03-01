import { Fetch } from './fetch.js';

new Vue({
    el: "#app",
    data:{
        Top5News: [],
        TopPopular:[],
        TopRating:[],
        darkMode: false,
        searchQuery:'',
        searchResult: null,
        isSearching: false,
        currentPage:1,
        itemsPerPage: 3,
        selectedOption: 'movie',
        selectedMovie: null,
        selectedActor: null,
    },
    mounted(){
        this.fetchData();
    },
    methods:{
        async searching() {
            this.selectedActor = null;
            this.selectedMovie = null;
            if (this.searchQuery) {
                try {
                    if(this.selectedOption=='movie'){
                        this.searchResult = await Fetch(`search/movie/${this.searchQuery}?`);
                    }
                    else{
                        this.searchResult = await Fetch(`search/name/${this.searchQuery}?`);
                    }
                    this.itemsPerPage = this.searchResult['per_page'];
                    this.currentPage = this.searchResult['page'];
                    this.isSearching = true;
                    // console.log(this.searchResult);
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            }
        },
        changePage(pageNumber) {
            if (pageNumber >= 1 && pageNumber <= this.totalPages) {
                this.currentPage = pageNumber;
            }
        },
        backToHome(){
            this.isSearching=false;
            this.selectedMovie=null;
            this.selectedActor=null;
        },
        toggleHover(item, isHovered) {
            item.isHovered = isHovered;
        },
        async fetchData() {
            try {
                let mostPopularData = await Fetch('get/mostpopular');
                let topRatingData = await Fetch('get/top50');
                let topBoxOffice = await Fetch('get/topboxoffice');
                let mostPopular = mostPopularData['items'];
                let topRatingMovies = topRatingData['items'];
        
                for (let i = 0; i < 15; i += 3) {
                    this.TopPopular.push(mostPopular.slice(i, i + 3));
                }
                for (let i = 0; i < 15; i += 3) {
                    this.TopRating.push(topRatingMovies.slice(i, i + 3));
                }
                this.Top5News = topBoxOffice['items'];
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        },
        async showMovieDetail(movie, ori){
            // this.selectedMovie = movie;
            let findMovieId = null;
            let movieFound = null;
            if(ori==false){
                try{
                    findMovieId = await Fetch(`detail/movie/${movie.id}?`);
                    
                }catch (error) {
                    console.error("Error fetching data: ", error);
                }
                if(findMovieId.item == null){
                    let spiltCrew = movie.crew.split(/\s*,\s*/);
                    movie.detail = {};
                    movie.detail.directors = spiltCrew[0].replace(/\s*\(.*?\)\s*/, '');
                    movie.detail.actors = spiltCrew.slice(1).map((actor, index) => {
                        return {
                            id: '',
                            name: actor
                        };
                    });
                    this.selectedMovie = movie;
                    return;
                }
                else{
                    movieFound = findMovieId.item;
                }
            }else{
                movieFound = movie;
            }
            movieFound.detail = {};
            movieFound.detail.actors = movieFound.actorList.map((actor, index)=>{
                return{
                    id:actor.id,
                    name: actor.name
                }
            }
            );
            let directorList = movieFound.directorList.map(director => director.name);
            movieFound.detail.directors = directorList.join(", ");
            movieFound.detail.sumary = movieFound.plot;
            let genreList = movieFound.genreList.map(genre => genre.value);
            movieFound.detail.type = genreList.join(", ");
            let getReview;
            try{
                getReview = await Fetch(`search/reviews/${movieFound.id}/`)
            }catch (error) {
                console.error("Error fetching data: ", error);
            }
            movieFound.detail.reviews = getReview.items[0].items;
            // console.log(movieFound);
            this.selectedActor = null;
            this.selectedMovie = movieFound;
        },
        async showActorDetail(actorId){
            // console.log(actorId);
            let actorSelect;
            try{
                actorSelect = await Fetch(`detail/name/${actorId}/`)
            }catch (error) {
                console.error("Error fetching data: ", error);
            }
            if(!actorSelect.item){
                alert('nodata');
                return;
            }
            // console.log(actorSelect);
            let films = [];
            let movieDetails;
            for (const castMovie of actorSelect.item.castMovies) {
                try {
                    movieDetails = await Fetch(`detail/movie/${castMovie.id}`);
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
                if (movieDetails.item) {
                    const film = {
                        image: movieDetails.item.image,
                        role: castMovie.role,
                        title: movieDetails.item.title,
                        link_film:movieDetails.item
                    };
                    films.push(film);
                }
            }
            actorSelect.item.films = films;
            actorSelect.item.pagination = {
                per: 3,
                total_p: parseInt((films.length-1)/3)+1,
                nowp: 1,
                total_f: films.length,
                displayedFilms: [],
            }
            actorSelect.item.pagination.pageNumbers = Array.from({ length: actorSelect.item.pagination.total_p }, (_, index) => index + 1);
            this.changePageActor(actorSelect.item, 1);
            this.selectedActor = actorSelect.item;
            // console.log(this.selectedActor);
        },
        changePageActor(actor, pageNumber) {
            actor.pagination.nowp = pageNumber;
    
            const startIndex = (pageNumber - 1) * actor.pagination.per;
            const endIndex = Math.min(startIndex + actor.pagination.per, actor.pagination.total_f);
                
            actor.pagination.displayedFilms = actor.films.slice(startIndex, endIndex);
        }
    },
    computed: {
        isPreviousButtonEnabled() {
            return this.currentPage > 1;
        },
        isNextButtonEnabled() {
            return this.currentPage < this.totalPages;
        },
        totalItems() {
            return this.searchResult ? this.searchResult['total'] : 0;
        },
        totalPages() {
            return this.searchResult ? this.searchResult['total_page'] : 0;
        },
        displayedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
            return Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index);
        },
    },
})