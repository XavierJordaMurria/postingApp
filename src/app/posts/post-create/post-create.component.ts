import { Component, OnInit } from '@angular/core';
import IPost from '../ipost.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import IPostDB from '../ipost.model.db';
import { mimeType } from './mime-type.validator';


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
  isLoading = false;
  enteredTitle = '';
  enteredContent = '';
  form: FormGroup;
  imagePreview: string;

  constructor(public postService: PostService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null,
         {
           validators: [Validators.required, Validators.minLength(3)]
          }),
      content: new FormControl(null,
        {
          validators: [Validators.required]
        }),
        image : new FormControl(null,
          {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = PostCreateStates.EDIT;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId)
        .subscribe((postData: IPostDB) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = PostCreateStates.CREATE;
        this.postId = null;
      }
    });
  }

  onSavePost() {

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const post: IPost = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      creator: null
    };

    if (this.mode === PostCreateStates.CREATE) {
      this.postService.addPost(post, this.form.value.image);
    } else {
      post.id = this.postId;
      this.postService.updatePost(post, this.form.value.image);
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }
}

