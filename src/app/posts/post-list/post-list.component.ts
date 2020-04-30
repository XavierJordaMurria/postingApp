import { Component, OnInit, OnDestroy } from '@angular/core';
import IPost from '../ipost.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: IPost[] = [];
  private postSubscriptoin: Subscription;

  constructor(public postService: PostService) { }

  ngOnDestroy(): void {
    this.postSubscriptoin.unsubscribe();
  }

  ngOnInit() {
    this.postSubscriptoin = this.postService.getPostUpdateListener()
    .subscribe((theCurrentPostArr: IPost[]) => {
      this.posts = theCurrentPostArr;
    });
    this.postService.getPosts();
  }

  onDelete(postID: string) {
    this.postService.deletePost(postID);
  }
}
