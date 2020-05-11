import { Component, OnInit, OnDestroy } from '@angular/core';
import IPost from '../ipost.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { PostService } from '../post.service';
import { AuthService } from '../../auth/auth.service';

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
  userId: string;
  private authStatusSubs: Subscription;
  isUserAuthenticated = false;

  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnDestroy(): void {
    this.postSubscriptoin.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSubscriptoin = this.postService.getPostUpdateListener()
    .subscribe((postData: { posts: IPost[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });

    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe((isUserAuthenticated) => {
      this.isUserAuthenticated = isUserAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(postID: string) {
    this.isLoading = true;
    this.postService.deletePost(postID)
    .subscribe(
      (result) => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
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
