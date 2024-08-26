const ALY = require('aliyun-sdk')
const { format } = require('logform');
let arr = []
var sls = new ALY.SLS({
    // 本示例从环境变量中获取AccessKey ID和AccessKey Secret。
    "accessKeyId": process.env.ACCESS_KEY_ID,
    "secretAccessKey": process.env.ACCESS_KEY_SECRET,
    //日志服务的域名。此处以杭州为例，其它地域请根据实际情况填写。 
    endpoint: 'http://cn-shenzhen.log.aliyuncs.com',
    //SDK版本号，固定值。
    apiVersion: '2015-06-01'
})
// 必选，Project名称。
const projectName = process.env.LOG_PROJECT_NAME
// 必选，Logstore名称。
const logstoreName = process.env.LOG_STORE_NAME

// 写入日志。
function writeLog(logs) {
    const param = {
        projectName,
        logStoreName: logstoreName,
        logGroup: {
            // 必选，写入的日志数据。
            logs: logs.map(info => {
                return {
                    time: info.timestamp ? Math.floor(new Date(info.timestamp).getTime() / 1000) : Math.floor(new Date().getTime() / 1000),
                        contents: Object.keys(info).map((key) => {
                            return {
                                key,
                                value: info[key]
                            }
                        })
                }
            }),
            topic: 'nest-logs',
            source: '127.0.0.1'
        }
    }

    sls.putLogs(param, function (err, data) {
        if (err) {
            console.error('error:', err)
            arr.push(logs)
        } else {
            console.log('写入日志成功', data)
        }
    })
}

setInterval(() => {
    if (arr.length > 0) {
        const logs = arr.splice(0, 100)
        if (logs.length) {
            writeLog(logs)
        }
    }
}, 5000)
export default format((info, opts) => {
    arr.push(info)
    return info;
});