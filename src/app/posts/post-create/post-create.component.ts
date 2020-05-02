import { Component, OnInit } from '@angular/core';
import IPost from '../ipost.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import IPostDB from '../ipost.model.db';

enum PostCreateStates {
  CREATE = 'create',
  EDIT = 'edit'
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode: PostCreateStates = PostCreateStates.CREATE;
  private postId: string;
  post: IPost;

  constructor(public postService: PostService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = PostCreateStates.EDIT;
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId)
        .subscribe((postData: IPostDB) => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = PostCreateStates.CREATE;
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {

    if (form.invalid) { return; }

    const post: IPost = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };

    if (this.mode === PostCreateStates.CREATE) {
      this.postService.addPost(post);
    } else {
      post.id = this.postId;
      this.postService.updatePost(post);
    }

    form.resetForm();
  }
}

