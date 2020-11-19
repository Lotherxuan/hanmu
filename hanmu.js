const axios = require('axios');
const md5 = require('js-md5');
const process = require('process');

(async function () {

    /* delete axios.defaults.headers.common["Accept"]; */
    /*     axios.defaults.headers.common["proxy"] = {
            host: '127.0.0.1',
            port: 8888,
        }; */


    let ROOTURL = "http://client3.aipao.me";
    let IMEI = String(process.argv[2]);
    let runTime = String(820 + Math.floor(Math.random() * (850 - 720)));
    let runDist = String(2000 + Math.floor(Math.random() * 3));
    let runStep = String(1300 + Math.floor(Math.random() * (1600 - 1300)));
    let alphabet = shuffle("abcdefghijklmnopqrstuvwxyz".split(""));

    let version = "2.40";

    let url1 = ROOTURL + "/api/%7Btoken%7D/QM_Users/Login_AndroidSchool?IMEICode=" + IMEI;
    let h = {
        "version": "2.40",
    };
    let response1 = await axios.get(url1, {
        headers: h,
    });
    let token = response1['data']['Data']['Token'];
    let userID = response1['data']['Data']['UserId'];

    let nonce = String(100000000 + Math.floor(Math.random() * (1000000000 - 100000000)));
    let timespan = String(Date.now());
    let fullString = String(token) + nonce + timespan + String(userID);
    let sign = md5(fullString).toUpperCase();
    let header = {
        "nonce": nonce,
        "sign": sign,
        "timespan": timespan,
        "version": version,
        "Connection": "Keep-Alive",
        "Host": "client3.aipao.me",
    };

    console.log(header);

    console.log("response1");
    console.log(response1);

    let url2 = ROOTURL + "/api/" + token + "/QM_Runs/SRS?S1=30.534736&S2=114.367788&S3=2000";
    let response2 = await axios.get(url2, {
        headers: header,
    });
    let runID = response2['data']['Data']['RunId'];

    console.log("response2");
    console.log(response2);

    console.log(runTime);

    setTimeout(async (alphabet) => {
        let newnonce = String(100000000 + Math.floor(Math.random() * (1000000000 - 100000000)));
        let newtimespan = String(Date.now());
        let newfullString = String(token) + newnonce + newtimespan + String(userID);
        let newsign = md5(newfullString).toUpperCase();
        let newheader = {
            "nonce": newnonce,
            "sign": newsign,
            "timespan": newtimespan,
            "version": version,
            "Connection": "Keep-Alive",
            "Host": "client3.aipao.me",
        };
        console.log(newheader);


        let url3 = ROOTURL + "/api/" + token + "/QM_Runs/ES?S1=" + runID + "&S4=" + encrypt(runTime, alphabet) + "&S5=" + encrypt(runDist, alphabet) + "&S6=&S7=1" + "&S8=" + alphabet.join("") + "&S9=" + encrypt(runStep, alphabet);
        let response3 = await axios.get(url3, {
            headers: newheader,
        });

        console.log("response3");
        console.log(response3);
    }, Number(runTime) * 1000, alphabet);
})()

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5).slice(0, 10);
}

function encrypt(s, alphabet) {
    let res = "";
    for (let index = 0; index < s.length; index++) {
        res += alphabet[+s[index]];
    }
    return res;
}

