import React, {Component} from 'react';
import { Button, Input, Spin } from 'antd';
import Layout from '../container/Layout';
import { BrowserRouter } from 'react-router-dom';

export default class Login extends Component {

    constructor(props) {
        super();

        this.state = {
            isLoading: false,
            otp: null
        }
    }

    validateToken() {
        // call django
        return {
            token: "token",
            roomID: "5zeibORPXl9LCgaAxOFL"
        }
    }

    login() {
        this.setState({
            isLoading: true
        })

        var res = this.validateToken();
        
        if (res) {
            // setting token
            sessionStorage.setItem("token", res.token);
            this.props.history.push(`/room?id=${res["roomID"]}`);
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value 
        })
    }

    render() {
        const { isLoading, otp } = this.state
        return (
            <Layout>
                <div style={{
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    height: 300
                }}>
                    <h1>Enter chat</h1>
                    <div>Enter the OTP displayed on the screen</div>

                    <Spin spinning={this.state.isLoading}>
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
                                />
                            <Button 
                                disabled={otp === null}
                                onClick={this.login.bind(this)}
                            >
                                Login
                            </Button>
                        </div>
                    </Spin>
                </div>
            </Layout>
        )
    }
}