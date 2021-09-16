import React, { useEffect, useRef, useState} from 'react'
import { Card, Col, Row, List, Avatar, Drawer} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as Echarts from 'echarts'
import _ from 'lodash'
import axios from 'axios'

const { Meta } = Card;
export default function Home () {
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [allList, setAllList] = useState([])
    const [visible, setVisible] = useState(false)
    const [pieChart, setPieChart] = useState(null)
    const barRef = useRef()
    const pieRef = useRef()
    //浏览最多的数据
    useEffect(() => {
      axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&limit=6`).then(res=>{
        setViewList(res.data)
      })
    }, [])
    //点赞最多的数据
    useEffect(() => {
      axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&limit=6`).then(res=>{
        setStarList(res.data)
      })
    }, [])


    //获取按照新闻类型分类的数据
    useEffect(() => {
      axios.get(`/news?publishState=2&_expand=category`).then(res=>{
        setAllList(res.data)
        renderBarView(_.groupBy(res.data,item=>item.category.title))
      })
      //组件销毁的时候,清空resize事件
      return ()=>{
        window.onresize = null
      }
    }, [])
    //根据数据渲染柱状图
    const renderBarView=(obj)=>{

      var myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel:{
                  rotate:"60", //X轴标题旋转
                  interval:0  //始终显示完全标题  
                }
            },
            yAxis: {
              minInterval:1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item=>item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () =>{
          myChart.resize()
        }
    }

    const renderPieView = (obj)=>{
      //数据处理工作
      var currentList = allList.filter(item=>item.author===username)
      var gruopObj = _.groupBy(currentList,item=>item.category.title)
      var list = []
      for(var i in gruopObj){
        list.push({
          name:i,
          value:gruopObj[i].length
        })
      }
      console.log(list)
      
      
      var myChart;
      //避免多次初始化，只需要初始化一次
      if(!pieChart){
        myChart = Echarts.init(pieRef.current)
        setPieChart(myChart)
      }else{
        myChart = pieChart
      }
      var option;

      option = {
          title: {
              text: username+'新闻分类图示',
              // subtext: '纯属虚构',
              left: 'center'
          },
          tooltip: {
              trigger: 'item'
          },
          legend: {
              orient: 'vertical',
              left: 'left',
          },
          series: [
              {
                  name: '发布数量',
                  type: 'pie',
                  radius: '50%',
                  data: list,
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      };

      option && myChart.setOption(option);

    }
    
    const {username,region,role:{roleName}} = JSON.parse(localStorage.getItem("token"))
    
    return (
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                size="small"
                // bordered
                dataSource={viewList}
                renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
            <List
                size="small"
                // bordered
                dataSource={starList}
                renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={()=>{
                //为了保持同步更新，先渲染组件，再创建饼状图
                setTimeout(()=>{
                  setVisible(true)
                  //初始化饼状图
                  renderPieView()
                },0)
              }}/>,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={username}
              description={
                <div>
                  <b>{region===null?region:"全球"}</b>
                  <span style={{paddingLeft:"30px"}}>{roleName}</span>
                </div>
              }
            />
          </Card>
          </Col>
        </Row>

        <Drawer title="个人新闻分类" 
        width="500px"
        placement="right" closable={true} onClose={()=>{setVisible(false)}} visible={visible}>
          
          <div ref={pieRef} style={{
          height:"300px",
          width:"100%",
          marginTop:"30px"
          }}></div>
        </Drawer>

        <div ref={barRef} style={{
          height:"300px",
          width:"100%",
          marginTop:"30px"
          }}></div>
      </div>
    )
}
