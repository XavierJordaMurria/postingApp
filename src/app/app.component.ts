import { Component } from '@angular/core';
import IPost from './posts/ipost.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  postsArr: IPost[] = [];

  onNewPost(thePost: IPost): void {
    this.postsArr.push(thePost);
  }

  getPosts(): IPost[] {
    return this.postsArr;
  }
}
