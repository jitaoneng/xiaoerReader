import React from 'react';
import {Layout, Icon, Spin, Button, Tag, message, Modal} from 'antd';
import { Link } from 'react-router-dom';
import styles from './bookIntroduce.css';
import randomcolor from 'randomcolor';
import CopyToClipboard from 'react-copy-to-clipboard';
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
        this.share='';
        message.config({top:500,duration:2});
        this.flag = false;

        this.addBook = (flag)=>{
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
                    let localBookIdList = store.get('bookIdList')||[];
                    let localIdList = new Set(localBookIdList);
                    if(localIdList.has(dataIntroduce._id)){
                        message.info('书籍已在书架中');return;
                    }
                    localList.unshift(dataIntroduce);
                    localIdList.add(dataIntroduce._id);
                    store.set('bookList',localList);
                    store.set('bookIdList',Array.from(localIdList));
                    message.info(`《${this.state.data.title}》加入书架`);
                    console.log(this.state.data);
                    this.setState({save:true});

                    if(flag) {
                        this.props.history.push({pathname: '/read/' + 0});
                    }
                    return;
                })
                .catch(err=>{console.log(err)});
        }
        this.deleteBook = ()=>{

        }
        this.shareSuccess =  () => {
            Modal.success({
                title: '链接已复制到你的剪贴板',
                content: this.share
            });
        }
    }
    componentDidMount(){
        console.log(this.props);
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
    componentWillReceiveProps(nextProps){
        this.share = `我在哦豁阅读器看《${this.data.title}》，绿色无广告，你也一起来呗！地址是${window.location.href}，移动端请手动复制这条信息。`;
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
                    <CopyToClipboard text={this.share} onCopy={this.shareSuccess}>
                        <span className={styles.share}>分享</span>
                    </CopyToClipboard>
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
                                            (<Button icon='minus' size='large' className={styles.cancel} onClick={this.deleteBook}>不追了</Button>) :
                                            (<Button icon='plus' size='large' onClick={this.addBook(false)}>追更新</Button>)
                                    }
                                    <Button icon='search' size='large' onClick={this.addBook(true)}>开始阅读</Button>
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