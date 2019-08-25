import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scrape';
  tag2

  constructor(private http: HttpClient) {
    
  }


  scraper(tag){
  
let data={
  text:tag
}

    let header=new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': "*",
    });
    
    let options={headers:header};
    let Root_url2= 'http://localhost:5001/scrape-a3cb5/us-central1/scraper' 
      this.http.post(Root_url2,data,options).toPromise().then(data=>
        {
          console.log(data);
        }).catch(err=>{
          console.log(err);
        });
  
  }

}
