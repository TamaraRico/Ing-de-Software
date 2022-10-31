import React from 'react';
import { Link } from 'react-router-dom';

export default class POS extends React.Component {
    render(){
        return (
            <div>
                <h1>Pagina principal</h1>
                <Link to="/">Ir a login</Link>
                <div>
                    <p>Hola mundo jiji</p>
                </div>
            </div>
        );
    }
}