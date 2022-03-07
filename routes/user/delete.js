'use strict'

const { deleteOne, deleteUserPromise, chkAuthorizationHeaders } = require('../../model')

module.exports = async function (app, opts) {
  app.delete('/:id', async function (request, reply) {
    const tmpId = await chkAuthorizationHeaders(request.headers.authorization)
    const result = await deleteOne(this.mongo, tmpId)
    const resultOfUserPromise = await deleteUserPromise(this.mongo, tmpId)
    console.log(result)
    if(!result.value && !resultOfUserPromise){
      reply
        .code(204)
        .header('content-type', 'application/json')
        .send({value : result.value, ok : result.ok})
    }
    else {
      reply
        .code(200) //상태코드 보내는 메소드
        .header('content-type', 'application/json')
        .send({value : result.value, ok : result.ok}) //데이터베이스에서 꺼내와야 함
    }
  })
}
