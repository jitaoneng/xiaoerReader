import React from 'react';
import {Layout, Icon, Input, Spin, Tag} from 'antd';
import { Link } from 'react-router-dom';
import styles from './search.css';
import store from 'store/dist/store.legacy';
import randomcolor from 'randomcolor';
import 'whatwg-fetch';
import ResultBookItem from './resultBookItem';
import {url2Real} from "./method";

const { Header, Content } = Layout;


class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchValue: '',
            bookList: [],
            loading: false,
            searchHistory: store.get('searchHistory') || []
        };
        this.flag = this.state.searchValue.length ? false : true;
        this.tagColorArr = this.state.searchHistory.map(item => randomcolor({luminosity: 'dark'}));
        this.clearHistory = ()=>{
            let searchHistory = [];
            this.setState({searchHistory});
            store.set('searchHistory',searchHistory);
        };
        this.searchBook = (value)=>{
            this.flag = false;
            value = value === undefined ? this.state.searchValue : value;
            if (new Set(value).has(' ') || value === '') {
                alert('输入为空！');
                return;
            };
            //更新搜索历史
            let searchHistory = new Set(this.state.searchHistory);
            if(!searchHistory.has(value)){
                searchHistory = this.state.searchHistory;
                searchHistory.unshift(value);
                store.set('searchHistory',searchHistory);
            }
            this.tagColorArr.push(randomcolor({luminosity: 'dark'}));
            this.setState({loading:true,searchHistory});
            fetch(`/api/book/fuzzy-search?query=${value}&start=0`)
                .then(res=>res.json())
                .then(data => {
                    data.books.map((item)=>{item.cover=url2Real(item.cover);});
                    return data.books;
                })
                .then(data=>{
                    this.setState({bookList:data,loading:false});
                })
                .catch(err=>{console.log(err)});

        }
        this.handleChange = (e)=>{
            this.setState({
                searchValue:e.target.value
            });
        }
        this.wordSearch = (e)=>{
            let word = e.target.textContent;
            this.setState({searchValue: word});
            this.searchBook(word);
        }
        this.clearInput = () => {
            this.flag = true;
            this.setState({searchValue:''});
        }
    }

    render(){
        return (
            <Layout>
                <Header className={styles.header}>
                    <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
                    <Input
                        ref="search"
                        placeholder="请输入搜索的书名"
                        className={styles.searchInput}
                        value={this.state.searchValue}
                        onChange={this.handleChange}
                        onPressEnter={ () => this.searchBook()}
                        suffix={<Icon type="close-circle" onClick={this.clearInput} />}
                    />
                    <Icon type='search' className={styles.search} onClick={() => this.searchBook()}/>
                </Header>
                <Spin className={styles.loading} spinning={this.state.loading} tip="书籍搜索中...">
                    <Content className={styles.content}>
                        {
                            this.flag ? (
                                    <div className='tagBox'>
                                        <h2>最近搜索历史</h2>
                                        <div className={styles.tags}>
                                            {
                                                this.state.searchHistory.map((item, index) =>
                                                    <Tag onClick={this.wordSearch} className={styles.tag} color={this.tagColorArr[index]} key={index}>{item}</Tag>
                                                )
                                            }
                                        </div>
                                        <div className={styles.clear} onClick={this.clearHistory}><Icon type="delete" />清空搜索历史</div>
                                    </div>
                                )
                                :
                                (
                                    this.state.bookList.length !== 0 ?
                                        this.state.bookList.map((item, index) => <ResultBookItem data={item} key={index}/>)
                                        : (<div className={styles.noResult}>没有找到搜索结果</div>)
                                )
                        }
                    </Content>
                </Spin>
            </Layout>
        )
    }
}

export default Search;