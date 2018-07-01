const MAXSTRINGSIZE = 250

class Utils {
  static alphSort(entries, key=null, rev=false){
    const test = entries.sort((a, b) => {
      let fA = key === null ? a : a[key];
      let fB = key === null ? b : b[key];
      fA = fA.toLowerCase();
      fB = fB.toLowerCase();
      if (fA < fB) {
        return rev ? 1 : -1;
      }
      if (fA > fB) {
        return rev ? -1 : 1;
      }
      return 0;
    })
    return test;
  }

  static url(path){
    return process.env.PUBLIC_URL + path;
  }

  static shuffleArr(array){
    let counter = array.length;

    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;

  }

  static getDescriptValue(cObj, atrs){
    if(cObj === null){
      return null
    }
    if(typeof cObj !== 'object'){
      return atrs[cObj]
    }
    return cObj.add.map(field => atrs[field])
      .filter(field => field)
      .join(cObj.separator)
  }

  static trimString(str, nMax=MAXSTRINGSIZE) {
    if(!str) return null
    nMax -= 3
    return (str.length > nMax ? (str.substring(0, nMax) + '...') : str)
  }

}

export default Utils;