import React, { Component } from 'react';
import {Layout,Menu,Dropdown,Icon} from 'antd';
import styles from './home.css';
import store from 'store/dist/store.legacy';
import { Link } from 'react-router-dom';
import BookItem from './bookItem';

const {Header,Content} = Layout;
let menuPng = require('./images/menu.png');

class App extends Component {
    constructor(props){
        super(props);
        this.menu = (
            <Menu>
                <Menu.Item key='0'>
                    <a href="#"><Icon type="user" /> 我的</a>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/about"><Icon type="copyright" /> 关于</Link>
                </Menu.Item>
            </Menu>
        );
        this.state = {
            bookList: store.get('bookList')||[]
        };
        console.log(this.state.bookList);
        console.log(store.get('bookIdList'));
        this.deleteBook = (key)=>{
            let bookList = store.get('bookList');
            let bookIdList = store.get('bookIdList');
            bookList.splice(key,1);
            bookIdList.splice(key,1);
            store.set('bookList',bookList);
            store.set('bookIdList',bookIdList);
            this.setState({bookList:bookList});
        }
    }
    componentDidMount(){
    }
    render() {
        return (
                <Layout>
                    <Header className={styles.header}>
                        <span className={styles.title}>小二阅读</span>
                        <Dropdown overlay={this.menu} placement="bottomRight">
                            <img src={menuPng} className={styles.dropdown}/>
                        </Dropdown>
                        <Link to='/search'><Icon type="search" className={styles.search}/></Link>
                    </Header>
                    <Content className={styles.content}>
                        {
                            this.state.bookList.length===0?(
                                <div className={styles.null}>书架空空如也，快去添加吧！</div>
                            ):this.state.bookList.map((item,index)=>(
                                <Link to={`/read/${index}`} key={index}><BookItem data={item} deleteBook={this.deleteBook} key={index} arg={index}/></Link>
                            ))
                        }
                    </Content>
                </Layout>
        );
    }
}

export default App;