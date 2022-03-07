const { ObjectId } = require('fastify-mongodb')

module.exports = {
  readAllUserResult: async (mongo) => {
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)
    const result = await collection.find({}).toArray()
    return result
  },
  readPromiseForSurvey: async (mongo) => {
    //28개만 갖고오게 만드는 코드 필요 (완료)
    //보완 필요 -> 가져온 element가 null 값일 때 처리
    /*
    구조
    1. president id값 가져오기 -> 결과 배열에 담기
    2. cate_id값 가져오기 -> 결과 배열에 담기
    3. promise에서 pres_id마다 cate_id에 해당하는거 하나씩만 가져오기
    4. 만약 cate_id에 해당하는 promise의 결과값이 0이면 다른 cate_id에서 하나 들고오기
    */
    const collectionPres = mongo.db.collection(process.env.COLLECTION_NAME_PRESIDENT)
    const collectionCate = mongo.db.collection(process.env.COLLECTION_NAME_PROMISE_CATEGORY)
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_PROMISE)
    
    const resultPres = await collectionPres.find().project({name : 0, party : 0}).toArray()
    const resultCate = await collectionCate.find().project({name : 0}).toArray()

    const result = []
    //console.log(resultPres.length + " , " + resultCate.length) //여기까지 테스트 완료
    for(let i=0; i<resultPres.length; i++){
        for(let j=0; j<resultCate.length; j++){
            const maxPro = await collection.find({pres_id : resultPres[i]._id, cate_id : resultCate[j]._id}).count()
            //random 난수를 해당 카테고리에 들어있는 공약 최대 개수만큼 들고오게 만들고싶음
            let rand = Math.floor(Math.random() * maxPro);
            //onsole.log("hi " + maxPro + ", " + rand)
            let element = ''
            //if(rand === 0) element = await collection.find({pres_id : resultPres[i]._id, cate_id : resultCate[j-1]._id}).skip(rand)
            element = await collection.find({pres_id : resultPres[i]._id, cate_id : resultCate[j]._id}).limit(-1).skip(rand).next()
            result.push(element)
        }
    }
    return result
  },
  readPromiseOfPresident: async (mongo, id) => {
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_PROMISE)
    const result = await collection.find({pres_id : ObjectId(id)}).toArray()
    return result
  },
  readBestAndWorst: async (mongo, id) => {
    //id jwt 토큰 이슈로 해결해야 됨
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)
    const result = await collection.findOne({
      _id: ObjectId(id)
    })
    return result
  },
  createOne: async (mongo, body) => {
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.insertOne(body)
    return result
  },
  createUserRes: async (mongo, body) => {
    const collectionPres = mongo.db.collection(process.env.COLLECTION_NAME_PRESIDENT)
    const collectionUserPro = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)

    const resultPres = await collectionPres.find().project({name : 0, party : 0}).toArray() // pres_id 가져오기
    let resOfSurvey = [0, 0, 0, 0]
    for(let i=0; i<4; i++){
        let cnt = 0;
        //pres_id에 해당하는 항목들 가져오고 선택 결과 반영하기
    }
    const result = await collection.insertOne(body) //수정 필요
    return result
  },
  updateOne: async (mongo, id, body) => {
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.findOneAndUpdate({
      _id: ObjectId(id)
    }, {
      $set: body
    })
    return result
  },
  deleteOne: async (mongo, id) => {
    //인증 이슈
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)

    const result = await collection.findOneAndDelete({
      _id: ObjectId(id)
    })
    return result
  },
  deleteUserPromise: async (mongo, id) => {
    //user의 모든 선택 항목을 삭제 함수
    //인증 이슈
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.deleteMany({
      _id: ObjectId(id)
    })
    return result
  }
}
