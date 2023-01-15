import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import Joi from 'joi-browser';
import Form from "./common/form";
import {getMovie, saveMovie} from "../Services/movieService";
import {getGenres} from "../Services/genreService";
import {toast} from "react-toastify";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()} />;
}

class MovieForm extends Form {

    state = {
        account: {
            title: "",
            genreId: "",
            numberInStock: "",
            dailyRentalRate: ""
        },
        genres: [],
        errors: {},
        isLoaded: false
    };

    formSchema = Joi.object({
        _id: Joi.string(),
        title: Joi.string().required().min(5).label('Title'),
        genreId: Joi.string().required().label('Genre'),
        numberInStock: Joi.number().required().min(0).max(100).label('numberInStock'),
        dailyRentalRate: Joi.number().required().min(0).max(100).label('dailyRentalRate'),
    });

    async populateGenres() {
        const {data: genres} = await getGenres();
        this.setState({genres, isLoaded: true});
    }

    async populateMovie() {
        try {
            let {id} = this.props.params;
            const movieId = id;
            if (movieId === "new") return;

            const {data: movie} = await getMovie(movieId);
            this.setState({account: this.mapToViewModel(movie)});
        } catch (ex) {
            if (ex.response && ex.response.status === 500)
                this.props.navigate("/not-found", {replace: true});
        }

    }

    async componentDidMount() {
        await this.populateMovie();
        await this.populateGenres();
    }

    mapToViewModel(movie) {
        return {
            _id: movie._id,
            title: movie.title,
            genreId: movie.genre._id,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        };
    }


    doSubmit = async () => {
        this.setState({isLoaded: false});

        const {account} = this.state;

        await saveMovie(account)
            .finally(() => this.setState({isLoaded: true}));

        toast.success('Movie Added Successfully!');
        this.props.navigate('/movies');
    };

    render() {
        const isLoaded = this.state.isLoaded;

        return (
            <div>
                {isLoaded ? (<div>
                    <form onSubmit={this.handleFormSubmit}>{this.renderCardSection(false, "Movie Form")}</form>
                </div>) : (<div className="d-flex justify-content-center">
                    <div className="spinner-border text-warning"
                         style={{top: "50%",left: "50%",position: "fixed", width: "4rem", height: "4rem"}}
                         role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>)}
            </div>
        );
    };
}

export default withParams(MovieForm);