import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    }

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({[name]: val});
    };

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, {loading, error, called, data}) => (
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                
                            const res = await createItem();
                            Router.push({
                                pathname: '/item',
                                query: { id: res.data.createItem.id }
                            })
                        }}>
                        <ErrorMessage error={error} />
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="title">
                                    Title
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        placeholder="Title"
                                        value={this.state.title}
                                        onChange={this.handleChange}
                                        required></input>
                                </label>
                
                                <label htmlFor="title">
                                    Price
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        placeholder="item price"
                                        value={this.state.price}
                                        onChange={this.handleChange}
                                        required></input>
                                </label>
                
                                <label htmlFor="description">
                                    Description
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter the description"
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                        required></textarea>
                                </label>
                
                                <button type="submit">Submit item</button>
                            </fieldset>
                        </Form>
                    )
                }
            </Mutation>
        )
    }
}

export default CreateItem;
