import React, { Component } from 'react';
import { Layout, Menu, Button } from 'antd';
const { Header, Content } = Layout;

export default class AppLayout extends Component {
    constructor(props) {
        super()

        this.state = {
            
        }
    }

    render() {
        return (
            <Layout 
                className="layout" 
                style={{
                }}>
                <div style={{
                    backgroundColor: "#073069",
                    padding: 10
                }}>
                    <Button style={{float: `right`}}>
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