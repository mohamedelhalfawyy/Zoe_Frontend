import React, {Component,useState} from "react";
import _ from 'lodash';
import Pagination from "./common/pagination";
import {deleteMovie, getMovies} from "../Services/movieService";
import {paginate} from "../utils/paginate";
import {toast} from "react-toastify";
import ListGroup from "./common/listGroup";
import {getGenres} from "../Services/genreService";
import MoviesTable from "./moviesTable";
import {Link} from "react-router-dom";
import SearchBox from "./common/searchBox";

class Movies extends Component {
    state = {
        movies: [],
        genres: [],
        currentPage: 1,
        pageSize: 4,
        searchQuery: "",
        selectedGenre: null,
        sortColumn: {path: 'title', order: 'asc'},
        isLoaded: true
    };

    async componentDidMount() {
        const {data} = await getGenres();
        const genres = [{_id: "", name: 'All Genres'}, ...data]

        const {data: movies} = await getMovies();

        this.setState({movies, genres});
    };

    handleDelete = async movie => {
        this.setState({isLoaded: false});

        const originalMovies = this.state.movies;
        const movies = originalMovies.filter(m => m._id !== movie._id);
        this.setState({movies: movies});

        try {
            await deleteMovie(movie._id);
        } catch (ex) {
            if (ex.response && ex.response.status === 404)
                toast.error('This Movie has already been deleted!');

            this.setState({movies: originalMovies});
        }

        this.setState({isLoaded: true});
        toast.success('Movie Deleted Successfully!');
    };

    handleLike = (movie) => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = {...movies[index]};
        movies[index].liked = !movies[index].liked;
        this.setState({movies});
    };

    handlePageChange = page => {
        this.setState({currentPage: page});
    };

    handleGenreSelect = genre => {
        this.setState({selectedGenre: genre, searchQuery: "", currentPage: 1});
    };

    handleSort = sortColumn => {
        this.setState({sortColumn});
    };

    handleSearch = query => {
        this.setState({searchQuery: query, selectedGenre: null, currentPage: 1});
    };

    refreshPage = () => {
        window.location.reload();
    }

    getPagedData = () => {
        const {pageSize, currentPage, movies: allMovies, selectedGenre, sortColumn, searchQuery} = this.state;

        let filtered = allMovies;
        if (searchQuery)
            filtered = allMovies.filter(m => m.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
        else if (selectedGenre && selectedGenre._id) {
            filtered = allMovies.filter(m => m.genre._id === selectedGenre._id)
        }

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

        const movies = paginate(sorted, currentPage, pageSize);

        return {totalCount: filtered.length, data: movies};
    };

    loadSplash = () => {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={require("../images/logo_nbg.png")} height={"300px"} width={"300px"} className="App-logo"
                         alt="logo"/>
                    <p>
                        Fetching <code>DATA</code> From the Database...
                    </p>
                </header>
            </div>
        );
    }

    render() {
        const {length: count} = this.state.movies;
        const {pageSize, currentPage, sortColumn, searchQuery} = this.state;
        const {user} = this.props;

        if ((this.state.genres === []) || (!user && count === 0)) return this.loadSplash();

        try {
            if (!user.isAdmin && count === 0) return this.loadSplash();
        } catch (ex) {
        }

        const {totalCount, data: movies} = this.getPagedData();

        const isLoaded = this.state.isLoaded;

        return (
            <div>
                {isLoaded ? (<div className={"row"}>
                    <div className="col-3" >
                        <ListGroup
                            items={this.state.genres}
                            selectedItem={this.state.selectedGenre}
                            onItemSelect={this.handleGenreSelect}
                        />
                    </div>
                    <div className="col">
                        {
                            (user && user.isAdmin) && <div className={"reload-container"}>
                                <Link
                                    to={'/movies/new'}
                                >
                                    <button className={"reload-btn"}><span>New Movie</span></button>
                                </Link>
                            </div>
                        }
                        <p>
                            Currently Showing {totalCount} Movies in the Database
                        </p>
                        <SearchBox value={searchQuery} onChange={this.handleSearch}/>
                        <MoviesTable
                            movies={movies}
                            onLike={this.handleLike}
                            onDelete={this.handleDelete}
                            onSort={this.handleSort}
                            sortColumn={sortColumn}
                        />
                        <Pagination
                            itemsCount={totalCount}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={this.handlePageChange}
                        />
                    </div>
                </div>) : (<div className="d-flex justify-content-center">
                    <div className="spinner-border text-warning"
                         style={{top: "50%",left: "50%",position: "fixed", width: "4rem", height: "4rem"}}
                         role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>)}
            </div>
        );
    }
}

export default Movies;