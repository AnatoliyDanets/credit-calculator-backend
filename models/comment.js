const { Schema, model } = require("mongoose");

const commentSchema = Schema({
  comment: {
    type: String,
    minLength: 2,
  },
});
const Comment = model ("comment", commentSchema)

module.exports={Comment}