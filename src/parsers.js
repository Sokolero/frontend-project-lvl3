export default function parser(docString) {
  console.log(docString)
  try {
    const domParser = new DOMParser();
    return domParser.parseFromString(docString, 'text/xml');
  } catch(err) {
    console.error(err.message)
  }
}
