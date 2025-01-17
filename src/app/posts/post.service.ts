import IPost from './ipost.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, count } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import IPostDB from './ipost.model.db';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const  BACKEND_URL = environment.apiUrl + '/posts/';
@Injectable({providedIn: 'root'})
export class PostService {
    private posts: IPost[] = [];

    private postUpdated = new Subject<{posts: IPost[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {
    }

    getPosts(postPerPage: number, currentPage: number) {
        const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
        this.http.get<{message: string, posts: IPostDB[], maxPosts: number}>(BACKEND_URL + queryParams)
        .pipe(
            map((postData) => {
            return {
                posts: postData.posts.map((post) => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                };
                }),
                maxPosts: postData.maxPosts
            };
        }))
        .subscribe((transformedPostsData) => {
            this.posts = transformedPostsData.posts;
            this.postUpdated.next(
                {
                    posts: [...this.posts],
                    postCount: transformedPostsData.maxPosts
                });
        });
    }

    getPostUpdateListener(): Observable<{posts: IPost[], postCount: number }> {
        return this.postUpdated.asObservable();
    }

    getPost(postId: string): Observable<IPostDB> {
        return this.http.get<IPostDB>(BACKEND_URL + postId);
    }


    addPost(thePost: IPost,  image: File): void {
        const postData = new FormData();
        postData.append('id', thePost.id);
        postData.append('title', thePost.title);
        postData.append('content', thePost.content);
        postData.append('image', image);

        this.http
        .post<{message: string, post: IPost}>(
            BACKEND_URL,
            postData)
        .subscribe((res) => {
            this.router.navigate(['/']);
        });
    }

    updatePost(thePost: IPost, image: File | string): void {
        let postData: IPost | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('title', thePost.title);
            postData.append('content', thePost.content);
            postData.append('image', image, thePost.title);

        } else {
            postData = {
                id: thePost.id,
                title: thePost.title,
                content: thePost.content,
                imagePath: image,
                creator: null
            };
        }
        this.http.put<{message: string, postId: string}>(
            BACKEND_URL + thePost.id,
            postData)
        .subscribe((res) => {
            this.router.navigate(['/']);
        });
    }

    deletePost(postId: string): Observable<unknown> {
        return this.http.delete(BACKEND_URL + postId);
    }
}
