const functions = require('firebase-functions');
const cors=require('cors')({origin:true});
const cheerio =require('cheerio');
const getUrls=require('get-urls');
const fetch=require('node-fetch');
const puppeteer=require('puppeteer');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const scrapeImages=async(link)=>{
    const browser=await puppeteer.launch({
               headless: true,
               args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page=await browser.newPage();
    await page.goto(link);
    await page.waitForSelector('img',{
        visible:true,
    })

    await page.screenshot({path:'1.png', fullPage: true})

    const data=await page.evaluate(()=>{
        const images=document.querySelectorAll('img');
        const urls=Array.from(images).map(v=>v.src);
        return urls
    });

    await browser.close();
    console.log(data);
    return data;
}

const scrapeMetatags=(text)=>{
    const urls=Array.from(getUrls(text));
    const requests=urls.map(async url=>{
        const res=await fetch(url);
        const html=await res.text();
        const $=cheerio.load(html);

        const getMetatag=(name)=>
        $(`meta[name=${name}]`).attr('content')||
        $(`meta[property="og:${name}"]`).attr('content')||
        $(`meta[property="wtitter:${name}"]`).attr('content');

        return{
            url,
            title:$('title').first().text(),
            favicon:$('link[rel="shortcut icon"]').attr('href'),
            // description:$('meta[name=description]').attr('content'),
            description:getMetatag('description'),
            image:getMetatag('image'),
            author:getMetatag('author'),
        }
    });
    return Promise.all(requests);
}

exports.scraper=functions.https.onRequest((request,response)=>{
    cors(request,response,async()=>{
        console.log(request.body.text)
        // const body=JSON.parse(request.body);
        //  const data=await scrapeMetatags(request.body.text);
        const data= await scrapeImages(request.body.text);
        response.send(data)
    });
});