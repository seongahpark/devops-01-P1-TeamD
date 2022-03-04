const { ObjectId } = require('fastify-mongodb')

module.exports = {
  readAllUserResult: async (mongo) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)
    const result = await collection.find({}).toArray()
    return result
  },
  readPromiseForSurvey: async (mongo) => {
    //28개만 갖고오게 만드는 코드 필요
    /*
    구조
    1. president id값 가져오기 -> 결과 배열에 담기
    2. cate_id값 가져오기 -> 결과 배열에 담기
    3. promise에서 pres_id마다 cate_id에 해당하는거 하나씩만 가져오기
    4. 만약 cate_id에 해당하는 promise의 결과값이 0이면 다른 cate_id에서 하나 들고오기
    */
    const collectionPres = mongo.db.collection(process.env.COLLECTION_NAME_PRESIDENT)
    const collectionCate = mongo.db.collection(process.env.COLLECTION_NAME_CATEGORY)
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_PROMISE)
    
    const resultPres = await collectionPres.find({}).toArray()
    const resultCate = await collectionCate.find({}).toArray()

    const result = []
    for(let i=0; i<resultPres.length; i++){
        for(let j=0; j<resultCate.length; j++){
            //random 난수를 해당 카테고리에 들어있는 공약 최대 개수만큼 들고오게 만들고싶음
            let rand = Math.floor(Math.random() * 10);
            //result += collection.find()
        }
    }
    //const result = await collection.find({}).toArray()
    return result
  },
  readPromiseOfPresident: async (mongo) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_PROMISE)
    const result = await collection.find({}).toArray()
    return result
  },
  readBestAndWorst: async (mongo, id) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)
    const result = await collection.findOne({
      _id: ObjectId(id)
    })
    return result
  },
  createOne: async (mongo, body) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.insertOne(body)
    return result
  },
  createUserRes: async (mongo, body) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)

    const result = await collection.insertOne(body) //수정 필요
    return result
  },
  updateOne: async (mongo, id, body) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.findOneAndUpdate({
      _id: ObjectId(id)
    }, {
      $set: body
    })
    return result
  },
  deleteOne: async (mongo, id) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)

    const result = await collection.findOneAndDelete({
      _id: ObjectId(id)
    })
    return result
  },
  deleteUserPromise: async (mongo, id) => {
    //user의 모든 선택 항목을 삭제하도록 수정해야 함
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.findOneAndDelete({
      _id: ObjectId(id)
    })
    return result
  }
}
