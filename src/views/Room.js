import React, {Component} from 'react';
import Layout from '../container/Layout';
import queryString from 'query-string';
import { Input, Button, Spin, Modal } from 'antd';
import Message from "../components/Message";
import Moment from "moment";
import { db } from "../firebase";


export default class Room extends Component {
	constructor(props) {
		super();

		this.state = {
				params: null,
				messages: [],
				name: "",
				isLoaded: false,
				visible: true
		}
}

messagesEndRef = React.createRef()

componentDidMount () {
	this.scrollToBottom()
}
componentDidUpdate () {
	this.scrollToBottom()
}
scrollToBottom = () => {
	this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
}

componentWillMount() {
	let params = queryString.parse(this.props.location.search)
	this.setState({
			params: params,
			messageBody: "",
	})
}

onChange = (e) => {
	this.setState({
		[e.target.name]: e.target.value
	})
}

handleOk = (e) => {
	if (this.state.name !== "") {
		this.setState({
			visible: false
		})
	}
}

onSubmit = () => {
	
	let payload = {
		body: this.state.messageBody,
		sender: this.state.name,
		time_created: Date.now()
	}
	let messages = this.state.messages;
	messages.push(payload)
	this.setState({
		messageBody: "",
		messages: messages
	})

	db.collection("rooms").doc("ML9pIK9ImW").update({
		"messages": this.state.messages
	})
}

componentDidMount = () => {
	db.collection("rooms").doc("ML9pIK9ImW")
		.onSnapshot(function(doc) {
			let data = doc.data()
			this.setState({
				roomName: data.name,
				messages: data.messages,
				isLoaded: true
			})
		}.bind(this)
	);
}

render() {
		const { params, messageBody, messages, roomName, isLoaded, name, visible } = this.state
		
		return (
			<Layout>
				<Spin spinning={!isLoaded || visible}>
					<Modal
						title="Set display name"
						visible={visible}
						onOk={this.handleOk}
					>
						<Input
							onChange={this.onChange}
							name="name"
							value={name}
							style={{
								width: `80%`
							}}
							placeholder="eg. Noobmaster69"
						/>
					</Modal>
					{isLoaded && !visible ? <div style={{padding: 10}}>
						Hello {this.state.name}, welcome to <b>{roomName}</b> toilet chat.
					</div> : <div style={{height: 30}}/>}
					<div
						style={{
							display: `flex`,
							flexDirection: `column`,
							flex: 1,
							height: 500,
							overflowY: `scroll`,
							marginBottom: 20,
						}}
					>
						<div 
							style={{
								height: 500
							}}>
							{
								messages !== null && messages.length > 0 ?
								messages.map((msg) => {
										return (
											<Message
												sender={msg.sender}
												timeCreated={msg.time_created}
												>
												{msg.body}
											</Message>
										)
								}) : isLoaded ? "No messages yet" : "Loading messages..."
							}
							<div ref={this.messagesEndRef} />
						</div>
					</div>

					<div
						style={{
							display: `flex`,
							flexDirection: `row`,
							justifyContent: `space-evenly`,
							alignItems: `center`,
						}}
						>
						<Input
							onChange={this.onChange}
							name="messageBody"
							value={messageBody}
							style={{
								width: `80%`
							}}
							placeholder="Type your message here"
						/>
						<Button
							disabled={ messageBody.trim() === "" }
							onClick={this.onSubmit}
						>
							Send
						</Button>
					</div>
				</Spin>
			</Layout>
		)
	}
}