const { ObjectId } = require('fastify-mongodb')

module.exports = {
  readAllUserResult: async (mongo, id) => {
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)
    const result = await collection.find({_id : id}).toArray()

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
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)
    const result = await collection.findOne({
      _id: ObjectId(id)
    })
    return result
  },
  createOne: async (mongo, id, body) => {
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)
    body.user_id = id
    const result = await collection.insertOne(body)
    return result
  },
  createUserRes: async (mongo, id, body) => {
    const collectionPres = mongo.db.collection(process.env.COLLECTION_NAME_PRESIDENT)
    const collectionUserPro = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)

    //cnt로 대통령 마다 몇개인지 구하기
    const resultPres = await collectionPres.find().project({name : 0, party : 0}).toArray() // pres_id 가져오기
    let resOfSurvey = [0, 0, 0, 0]
    let maxIndex = 0, maxValue = 0
    let minIndex = 0, minValue = 0

    for(let i=0; i<4; i++){
      let plusElement = await collectionUserPro.find({pres_id : String(resultPres[i]._id), choice : true}).count()
      let minusElement = await collectionUserPro.find({pres_id : String(resultPres[i]._id), choice : false}).count()

      //console.log(plusElement)
      console.log("plus : " + plusElement + ", " + "minus : " + minusElement)
      resOfSurvey[i] = plusElement - minusElement

      if(maxValue <= resOfSurvey[i]){
        maxValue = resOfSurvey[i]
        maxIndex = i
      }
      if(minValue >= resOfSurvey[i]){
        minValue = resOfSurvey[i]
        minIndex = i
      }
    }

    //body에 json 데이터 추가
    body.best_pres = await collectionPres.findOne({_id : resultPres[maxIndex]._id})
    body.worst_pres = await collectionPres.findOne({_id : resultPres[minIndex]._id})

    const result = await collection.findOneAndUpdate({
      _id: ObjectId(id)
    }, {
      $set: body
    })
    return result
  },
  updateOne: async (mongo, id, body) => {
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.findOneAndUpdate({
      _id: id
    }, {
      $set: body
    })
    return result
  },
  deleteOne: async (mongo, id) => {
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER)

    const result = await collection.findOneAndDelete({
      _id: ObjectId(id)
    })
    return result
  },
  deleteUserPromise: async (mongo, id) => {
    //user의 모든 선택 항목을 삭제 함수
    //완료
    const collection = mongo.db.collection(process.env.COLLECTION_NAME_USER_PROMISE)

    const result = await collection.deleteMany({
      user_id: id
    })
    return result
  },
  chkAuthorizationHeaders: async (id) => {
    let result = "62255d6559bcdbd928f15557"
    if(id === "aa") result = "62255d6559bcdbd928f15557"
    else if(id === "bb") result = "62255d311c717fe62a48f0b5"
    else if(id === "cc") result = "62255d479e02aadbc32d2882"
    else if(id === "dd") result = "62255d3c1c717fe62a48f0b6"
    else if(id === "ee") result = "62255d4b59bcdbd928f15556"
  
    return result
  }
}
