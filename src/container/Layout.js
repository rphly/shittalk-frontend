import React, { Component } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
const { Header, Content } = Layout;

export default class AppLayout extends Component {
    constructor(props) {
        super()

        this.state = {
            showLogoutModal: false
        }
    }

    handleOk = () => {
        sessionStorage.removeItem("token")
        window.location.href = `/`
    }

    render() {
        const { showLogoutModal } = this.state;
        return (
            <Layout 
                className="layout" 
                style={{
                }}>

                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>

                <Modal
                    title="Are you sure you want to exit?"

                    visible={showLogoutModal}
                    onOk={this.handleOk}
                    onCancel={() => { this.setState({ showLogoutModal: false }) }}
                >
                You will have to re-enter the chat with an access code.
                </Modal>
                
                <div style={{
                    backgroundColor: "#073069",
                    padding: 10
                }}>
                    <Button onClick={()=>{
                        this.setState({ showLogoutModal: true })
                    }} style={{float: `right`}}>
                        Exit
                    </Button>
                </div>
                <Content >
                    <div style={{ background: '#fff', padding: 24 }}>
                        {this.props.children}
                    </div>
                </Content>
            </Layout>
        )
    }
    
}