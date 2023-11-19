const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

exports.checkPlagiarism = (text1, text2) => {
  // Tokenize and stem both texts
  let tokens1 = tokenizeAndStem(text1);
  let tokens2 = tokenizeAndStem(text2);

  // Create a set for each text to remove duplicate words
  let set1 = new Set(tokens1);
  let set2 = new Set(tokens2);

  // Calculate intersection and union
  let intersection = new Set([...set1].filter(word => set2.has(word)));
  let union = new Set([...set1, ...set2]);

  // Calculate the Jaccard index for similarity
  let jaccardIndex = intersection.size / union.size;

  // Convert to percentage
  let plagiarismScore = jaccardIndex * 100;
  return plagiarismScore.toFixed(2);
};

function tokenizeAndStem(text) {
  // Tokenize and stem the text
  return tokenizer.tokenize(text).map(token => natural.PorterStemmer.stem(token.toLowerCase()));
}
