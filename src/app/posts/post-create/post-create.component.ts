import { Component, OnInit, EventEmitter } from '@angular/core';
import IPost from '../ipost.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

  constructor(public postService: PostService) { }

  onAppPost(form: NgForm) {

    if (form.invalid) { return; }

    const post: IPost = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };
    this.postService.addPost(post);

    form.resetForm();
  }
}

