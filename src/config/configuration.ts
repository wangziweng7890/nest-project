export default () => ({
    oss: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        accessKeySecret: process.env.ACCESS_KEY_SECRET || '',
        roleArn: process.env.ROLE_ARN,
        bucket: 'my-bucket-wzw',
        region: 'oss-cn-shenzhen'
    }
  });