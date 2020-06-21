export default function PriorityParser(str) {
  const priorities = ["!high", "!medium", "!low", "!lo", "!hi", "!med"];

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

  // no keywords found
  if (keywords === "") return { priority: "low", keywords: "" };
  else {
    // there exist priority strings
    const priority = keywordToPriority(keywords);
    return { priority: priority, keywords: keywords };
  }
}

function keywordToPriority(keyword) {
  if (keyword === "!lo" || keyword === "!low") return "low";
  else if (keyword === "!med" || keyword === "!medium") return "medium";
  else if (keyword === "!hi" || keyword === "!high") return "high";
}

// console.log(PriorityParser("go to the gym today !medium"));
