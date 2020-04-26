import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  newPost = 'NO CONTENTE';
  enteredValue = '';
  constructor() { }

  ngOnInit() {
  }

  onAppPost() {
    this.newPost = this.enteredValue;
  }

}
