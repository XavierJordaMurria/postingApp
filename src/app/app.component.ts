import { Component, OnInit } from '@angular/core';
import IPost from './posts/ipost.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  postsArr: IPost[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

  onNewPost(thePost: IPost): void {
    this.postsArr.push(thePost);
  }

  getPosts(): IPost[] {
    return this.postsArr;
  }
}
