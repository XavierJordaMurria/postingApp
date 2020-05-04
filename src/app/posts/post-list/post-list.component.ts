import { Component, OnInit, OnDestroy } from '@angular/core';
import IPost from '../ipost.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: IPost[] = [];
  private postSubscriptoin: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postService: PostService) { }

  ngOnDestroy(): void {
    this.postSubscriptoin.unsubscribe();
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    this.postSubscriptoin = this.postService.getPostUpdateListener()
    .subscribe((postData: { posts: IPost[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });

  }

  onDelete(postID: string) {
    this.isLoading = true;
    this.postService.deletePost(postID)
    .subscribe((result) => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(
      this.postsPerPage,
      this.currentPage
    );
  }
}
