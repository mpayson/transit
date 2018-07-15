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

  static baseUrl(path){
    return path.replace(process.env.PUBLIC_URL, '');
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

  static getBadges(badgeObj, atrs, delim=","){
    return badgeObj.badges.reduce((acc, b) => {
      if(!atrs.hasOwnProperty(b) || !atrs[b]){
        return acc;
      }
      const count = atrs[b].split(delim).length;
      acc.push([b, count]);
      return acc;
    }, [])
  }

  static formatSurveyStr(str){
    if(!str){
      return null;
    }
    return str.replace(/,/g, ', ').replace(/_/g, ' ');
  }

  static trimString(str, nMax=MAXSTRINGSIZE) {
    if(!str) return null
    nMax -= 3
    return (str.length > nMax ? (str.substring(0, nMax) + '...') : str)
  }

  static parseQStr(url){
    if(url.length < 1){
      return {}
    }
    const queryString = url.substring( url.indexOf('?') + 1 );
    let params = {};
    
    const queries = queryString.split("&");
    // Convert the array of strings into an object
    for (let i = 0; i < queries.length; i++ ) {
        const temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
  }

}

export default Utils;