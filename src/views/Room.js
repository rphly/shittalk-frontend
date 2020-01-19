import React, {Component} from 'react';
import Layout from '../container/Layout';
import queryString from 'query-string';
import { Input, Button, Spin, Modal, Carousel, Badge } from 'antd';
import Message from "../components/Message";
import randomColor from 'randomcolor';
import Moment from "moment";
import { db } from "../firebase";
import axios from 'axios';


export default class Room extends Component {
	constructor(props) {
		super();

		this.state = {
				params: null,
				messages: [],
				pins: [],
				name: "",
				isLoaded: false,
				visible: true,
				colour: "",
				otp: "",
				isValidatingOTP: false,
				showValidateOTPModal: false,
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
			colour: randomColor(),
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

validateOTP = () => {
	this.setState({
		isValidatingOtp: true
	})
	axios.get(`https://shit-talk-django.herokuapp.com/api/chatrooms/${this.state.otp}`)
	.then((res) => {
		if (res.status === 200) {
			sessionStorage.setItem("token", res.data.token)
			this.setState({
				isValidatingOTP: false,
				showValidateOTPModal: false
			})
		}
	})
}

validateToken = () => {
	let token = sessionStorage.getItem("token")
	if (token !== null) {
		let form = new FormData()
		form.set("Token", token)

		axios.post(`https://shit-talk-django.herokuapp.com/api/chatrooms/`, form).then((res) => {
			if (res.status === 200) {
				// do nothing
			}
			console.log(res) 
		})
		.catch((err) => {
			console.log(err.response)
			if (err.response.status === 403) {
				// expired
				this.setState({
					showValidateOTPModal: true,
				})
			}
		})
	} else {
		window.location.href = `/`
	}
}

handleMessage = () => {
	let payload = {
		body: this.state.messageBody,
		sender: this.state.name,
		time_created: Date.now(),
		colour: this.state.colour
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

handlePin = (msg) => {
	let payload = {
		body: msg,
		sender: this.state.name,
		time_created: Date.now(),
		colour: this.state.colour
	}

	let pins = this.state.pins;
	pins.push(payload)
	
	this.setState({
		messageBody: "",
		pins: pins
	})

	db.collection("rooms").doc("ML9pIK9ImW").update({
		"pins": this.state.pins
	})
}

onSubmit = () => {
	let msg = this.state.messageBody;
	var pattern = /^(\/pin)\s(\S.*)/g;
	var match = pattern.exec(msg);
	
	if (match !== null  && match[1] == '/pin') {
		// need to submit pin
		this.handlePin(match[2])
	} else {
		this.handleMessage();
	}
}

componentDidMount = () => {
	db.collection("rooms").doc("ML9pIK9ImW")
		.onSnapshot(function(doc) {
			let data = doc.data()
			this.setState({
				roomName: data.name,
				messages: data.messages,
				pins: data.pins,
				isLoaded: true
			})

			this.validateToken();
		}.bind(this)
	);
}

render() {
		const { params, messageBody, messages, roomName, isLoaded, name, visible, colour, pins, showValidateOTPModal } = this.state
		
		return (
			<Layout>
				<Spin spinning={!isLoaded || visible}>
						<Modal
								//style={{position: `fixed`}}
								title="Your session has expired."
								visible={showValidateOTPModal}
								onOk={this.validateOTP}
								onCancel={
									() => {window.location.href='/'}
								}
							>
						<div>Enter the OTP displayed on the screen to continue</div>
						<Spin spinning={this.state.isValidatingOTP}>
								<div style={{
										display: `flex`,
										flexDirection: `column`,
										justifyContent: `space-evenly`,
										alignItems: `center`,
										height: 100
								}}>
										<Input
											name="otp"
											placeholder="eg. 306708"
											onChange={this.onChange}
											onFocus={function () {
												window.scrollTo(0, 0);
												document.body.scrollTop = 0;
											}}
											/>
								</div>
						</Spin>
					</Modal>

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
							onFocus={() => {
								window.scrollTo(0, 0);
								document.body.scrollTop = 0;
							}}
						/>
						<div style={{paddingTop: 20}}>
							Your colour: <span style={{ color: colour }}>{colour}</span> <Badge color={colour}/>
						</div>
					</Modal>

					<Carousel autoplay>
						{
							pins.reverse().map((p) => {
								return (
									<div>
										<h3>{p.body}</h3>
									</div>
								)
							})
						}
					</Carousel>

					{isLoaded && !visible ? <div style={{padding: 20}}>
						Hello {this.state.name}, welcome to <b>{roomName}</b> toilet chat.
					</div> : <div style={{height: 30}}/>}
					<div
						style={{
							display: `flex`,
							flexDirection: `column`,
							flex: 1,
							height: 400,
							overflowY: `scroll`,
							marginBottom: 20,
						}}
					>
						<div 
							style={{
								height: 500,
							}}>
							{
								messages !== null && messages.length > 0 ?
								messages.map((msg) => {
										return (
											<Message
												sender={msg.sender}
												colour={msg.colour}
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
					<div>
						<span style={{ fontSize: 12, padding: 5 }}>Use <code>/pin</code> to pin your message to the board</span>
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
					</div>
				</Spin>
			</Layout>
		)
	}
}