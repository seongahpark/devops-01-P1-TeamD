'use strict'

// module.exports = async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//         const responseData = [
//             {
//                 id : 1,
//                 pro_id : "pro_id",
//                 choice : "choice" // 찬, 반
//             },
//             {
//                 id : 2,
//                 pro_id : "pro_id",
//                 choice : "choice" // 찬, 반
//             }
//         ]
//         reply 
//             .code(200)
//             .header('Content-Type', 'application/json')
//             .send(responseData)
//   })
// }

module.exports = async function (app, opts) {
    app.register(require('./create'))
    //app.register(require('./read'))
    //app.register(require('./update'))
    //app.register(require('./delete'))
}
  
