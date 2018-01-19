import React from 'react';
import {Layout, Icon} from 'antd';
import { Link } from 'react-router-dom';
import styles from './about.css';

const { Header, Content } = Layout;

class About extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
                <Layout >
                    <Header className={styles.header}>
                        <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
                        <span className={styles.title}>关于</span>
                    </Header>
                    <Content className={styles.content}>
                        <h1>小二阅读</h1>
                    </Content>
                </Layout>
        )
    }
}

export default About;