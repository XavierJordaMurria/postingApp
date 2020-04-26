import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: {title: string, content: string}[] = [];
/*   posts: {title: string, content: string}[] = [
    {
      title: 'Title1',
      content: 'Content1',
    },
    {
      title: 'Title2',
      content: 'Content2',
    },
    {
      title: 'Title3',
      content: 'Content3',
    },
    {
      title: 'Title4',
      content: 'Content4',
    }
  ]; */

  constructor() { }

  ngOnInit() {
  }

}
