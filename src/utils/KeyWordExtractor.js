import { toString } from "nlcst-to-string";
import { retext } from "retext";
import retextPos from "retext-pos";
import retextKeywords from "retext-keywords";

export const getKeyWords = (text) => {
  let KeyWords = [];
  let KeyPhrases = [];

  retext()
    .use(retextPos) // Make sure to use `retext-pos` before `retext-keywords`.
    .use(retextKeywords)
    .process(text)
    .then((text) => {
      text.data.keywords.forEach((keyword) => {
        KeyWords.push(toString(keyword.matches[0].node));
      });

      console.log("Keywords:", KeyWords);

      // console.log();
      // console.log("Key-phrases:");
      // text.data.keyphrases.forEach((phrase) => {
      //   console.log(phrase.matches[0].nodes.map((d) => toString(d)).join(""));
      // });

      return KeyWords;
      console.log("Called after return");
    });
  //return [...text.data.keyphrases];
  //return { KeyWords: KeyWords, keyPhrases: [] };
};
