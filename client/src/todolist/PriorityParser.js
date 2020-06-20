export default function PriorityParser(str) {
  const priorities = ["!high", "!medium", "!low"];

  var words = str.toLowerCase().split(" "); // get an array of all the words the string in lowercase

  var keywords = "";

  // search for any occurences of priority strings
  for (let i = 0; i < words.length; i++) {
    var word = words[i];
    if (priorities.indexOf(word) !== -1) {
      keywords = word;
      break;
    }
  }

  // no date found
  if (keywords === "") return { priority: "low", keywords: "" };
  else {
    // there exist priority strings
    const priority = keywords.substring(1, keywords.length);
    return { priority: priority, keywords: keywords };
  }
}

// console.log(PriorityParser("go to the gym today !medium"));
