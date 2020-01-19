import React, { Component } from 'react'
import Moment from "moment";

export default class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <div style={{
                paddingTop: 10,
                width: `100%`,
            }}>
               [{Moment(this.props.timeCreated).format('HH:mm')}] 
               <span style={{ color: this.props.colour }}>&lt;<b>{this.props.sender}</b>&gt; </span>: 
               <div style={{
                    whiteSpace: `initial`,
                    wordWrap: `break-word`
               }}>{this.props.children}</div>
            </div>
        )
    }
}