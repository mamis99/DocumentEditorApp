import AWS from 'aws-sdk'


class AWSUtil {

  /**

  * Creates an instance of AWSUtil

  * @author Alan Aguilar

  * @date 29-07-2020

  * @memberof AWSUtil

  */

  constructor () {

    this.awsS3 = new AWS.S3({

      accessKeyId: 'AKIAQW7TFV54W6Q25LEK',

      secretAccessKey: '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'

    })

  }

  async downloadPDFBase64BucketObjectMiFirma (filePathAWS) {

    const awsS3Parameters = {

      Bucket: 'a3cloud-development',

      Key: filePathAWS

    }

    let fileObject = ''

    try {

      let objectAws = await this.awsS3.getObject(awsS3Parameters).promise()
      console.log(objectAws, 'object')
      fileObject = (objectAws) ? objectAws.Body.toString('base64') : ''
      console.log(typeof fileObject)
      
    } catch (error) {

      console.log(error)

    }
    return fileObject
  }
}

export{

    AWSUtil as default

}