import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndex: [],
        values: {},
        index: ''
    };

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
     } 

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        axios.get('/api/values/current')
            .then(response => {
                if (response && response.data) {
                    console.log("fetchValues finish " + JSON.stringify(response.data));
                    this.setState({ values: response.data });
                }
            })
            .catch(error => console.log(error));
    }

    async fetchIndexes() {
        axios.get('/api/values/all')
            .then(response => {
                if (response && response.data) {
                    console.log("fetchIndex finish " + JSON.stringify(response.data));
                    this.setState({ seenIndex: response.data });
                }
            })
            .catch(error => console.log(error));
    }

    handleSubmit(e) {
        e.preventDefault();

        const value = this.state.index.trim();
        if (isNaN(value) || !value) {
            console.log("nomber empty");
            return;
        }
          
        axios.post('/api/values', {
            index: this.state.index
        })
        .then((response) => {
            console.log(response);
            this.setState({ index: '' });
        }, (error) => {
            console.log(error);
        });
      }

    renderSeemIndexes() {
        return this.state.seenIndex.map(({ number }) => number).join(', ');
    }

    renderValues() {
        const entries = [];
        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }
        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={ this.handleSubmit }>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>
                <h3>Indexes I have seen:</h3>
                {this.renderSeemIndexes()}

                <h3>Calculated values:</h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;