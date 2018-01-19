import React from 'react';
import {Layout, Icon, Spin, Button, Tag, message, Modal} from 'antd';
import { Link } from 'react-router-dom';
import styles from './bookIntroduce.css';
import randomcolor from 'randomcolor';
import {
    time2Str,
    url2Real,
    wordCount2Str
} from './method.js';
import store from 'store/dist/store.legacy';

const {Header,Content} = Layout;

let errorLoading = require('./images/error.jpg');

class BookIntroduce extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:true,
            save:false,
            data:{}
        };
        message.config({top:500,duration:2});

        this.addBook = ()=>{
            let dataIntroduce = this.state.data;
            fetch(`/api/toc?view=summary&book=${this.state.data._id}`)
                .then(res=>res.json())
                .then(data=>{
                    let sourceId = data.length>1?data[1]._id:data[0]._id;
                    for(let item of data){
                        if(item.source === 'my176'){
                            sourceId = item._id;
                        }
                    }
                    dataIntroduce.sourceId = sourceId;
                    return fetch(`/api/toc/${sourceId}?view=chapters`);
                })
                .then(res=>res.json())
                .then(data=>{
                    data.readIndex = 0;
                    dataIntroduce.list = data;
                    let localList = store.get('bookList')||[];
                    let localIdList = store.get('bookIdList')||[];
                    if(localIdList.indexOf(dataIntroduce._id)!==-1){
                        message.info('书籍已在书架中');return;
                    }
                    localList.unshift(dataIntroduce);
                    localIdList.unshift(dataIntroduce._id);
                    store.set('bookList',localList);
                    store.set('bookIdList',localIdList);
                    message.info(`《${this.state.data.title}》加入书架`);
                    this.setState({save:true});
                    return;
                })
                .catch(err=>{console.log(err)});
        }
        this.readBook = ()=>{
            this.addBook();
            this.props.history.push({pathname: '/read/' + 0});
        }
        this.deleteBook = ()=>{
            let localList = store.get('bookList');
            let localIdList = store.get('bookIdList');
            localList.shift();
            localIdList.shift();
            store.set('bookList',localList);
            store.set('bookIdList',localIdList);
            this.setState({save:false});
        }
    }
    componentDidMount(){
        fetch(`/api/book/${this.props.match.params.id}`)
            .then(res=>res.json())
            .then(data=>{
                data.cover = url2Real(data.cover);
                data.wordCount = wordCount2Str(data.wordCount);
                data.updated = time2Str(data.updated);
                this.setState({data:data,loading:false});
            })
            .catch(err=>console.log(err));
    }
    handleImageErrored(e){
        e.target.src = errorLoading;
    }

    render(){
        return (
            <Layout>
                <Header className={styles.header}>
                    <Link to={'/search'}><Icon type="arrow-left" className={styles.pre} /></Link>
                    <span className={styles.title}>书籍详情</span>
                </Header>
                <Spin className={styles.loading} spinning={this.state.loading} tip="书籍详情正在加载中...">
                    <Content className={styles.content}>
                        {
                        this.state.loading?'':(
                            <div>
                                <div className={styles.box}>
                                    <img src={this.state.data.cover} onError={this.handleImageErrored}/>
                                    <p>
                                        <span className={styles.bookName}>{this.state.data.title}</span><br/>
                                        <span className={styles.bookMsg}><em>{this.state.data.author}</em> | {this.state.data.minorCate} | {this.state.data.wordCount}</span>
                                        <span className={styles.updated}>{this.state.data.updated}前更新</span>
                                    </p>
                                </div>
                                <div className={styles.control}>
                                    {
                                        this.state.save ?
                                            (<Button icon='minus' size='large' className={styles.cancel} onClick={this.deleteBook}>移出书架</Button>) :
                                            (<Button icon='plus' size='large' onClick={this.addBook}>加入书架</Button>)
                                    }
                                    <Button icon='search' size='large' onClick={this.readBook}>开始阅读</Button>
                                </div>
                                <div className={styles.number}>
                                    <p><span>追书人数</span><br/>{this.state.data.latelyFollower}</p>
                                    <p><span>读者留存率</span><br/>{this.state.data.retentionRatio}%</p>
                                    <p><span>日更新字数</span><br/>{this.state.data.serializeWordCount}</p>
                                </div>
                                <div className={styles.tags}>
                                    {
                                        this.state.data.tags.map((item, index) =>
                                            <Tag className={styles.tag} color={randomcolor({luminosity: 'dark'})} key={index}>{item}</Tag>
                                        )
                                    }
                                </div>
                                <div className={styles.introduce}>
                                    <p>{this.state.data.longIntro}</p>
                                </div>
                            </div>
                        )
                        }
                    </Content>
                </Spin>
            </Layout>
        );
    }
}

export default BookIntroduce;