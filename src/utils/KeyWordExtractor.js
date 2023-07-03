const retext = require("retext");
const pos = require("retext-pos");
const keywords = require("retext-keywords");
const toString = require("nlcst-to-string");

export const getKeyWords = (text) => {
  retext
    .retext()
    //.use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
    .use(keywords)
    .process(text, done);
  function done(err, file) {
    if (err) throw err;

    console.log("Keywords:", file);
    // file.data.keywords.forEach(function (keyword) {
    //   console.log(toString(keyword.matches[0].node));
    //   const word = toString(keyword.matches[0].node);
    // });

    // console.log("Key-phrases:");

    // file.data.keyphrases.forEach(function (phrase) {
    //   console.log(phrase.matches[0].nodes.map(stringify).join(""));
    //   function stringify(value) {
    //     return toString(value);
    //   }

    //   const keyphrase = phrase.matches[0].nodes.map(stringify).join("");
    // }
    //);

    return { keywords: [], keyPhrases: [] };
  }
};
