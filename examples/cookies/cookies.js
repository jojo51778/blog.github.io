function setCookie(name, val, day) {
  let expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + day);
  document.cookie = `${name}=${val};expires=${expireDate.toGMTString()}`;
}

function getCookies() {
  let cookies = [];
  if(document.cookie) {
    let cookieArr = document.cookie.split(';');
    for (let i = 0;i<cookieArr.length;i++) {
      let keyArr = cookieArr[i].split("=");
      let name = keyArr[0];
      let val = keyArr[1];
      cookies.push({name: val});
    }
  } else {
    return false;
  }
  return cookies;
}

function removeCookie(name) {
  let cookies = getCookies();
  if (cookies) {
    for(let cookie of cookies) {
     if(cookie.name === name) {
        setCookie(name, null, -99);
        break;
      }
    }
  } else {
    return false;
  }
}

let CookieManager = {
  setCookie,
  getCookies,
  removeCookie
};

export CookieManager