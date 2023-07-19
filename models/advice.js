const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const AdviceSchema = new Schema({
     likes : {
          type : Number,
          default : 0
     },
     author : {
          type : String,
          require : true
     },
     advice : {
          type : String,
          require : true
     }
},{timestamps : true})

const Advice = mongoose.model('advice', AdviceSchema)
module.exports = Advice;