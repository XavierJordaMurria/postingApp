import IPost from './ipost.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import IPostDB from './ipost.model.db';
import { Router } from '@angular/router';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: IPost[] = [];

    private postUpdated = new Subject<IPost[]>();

    constructor(private http: HttpClient, private router: Router) {
    }

    getPosts() {
        this.http.get<{message: string, posts: IPostDB[]}>('http://localhost:3000/api/posts')
        .pipe(map((postData) => {
            return postData.posts.map((post) => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                };
            });
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener(): Observable<IPost[]> {
        return this.postUpdated.asObservable();
    }

    getPost(postId: string): Observable<IPostDB> {
        return this.http.get<IPostDB>('http://localhost:3000/api/posts/' + postId);
    }


    addPost(thePost: IPost,  image: File): void {
        const postData = new FormData();
        postData.append('id', thePost.id);
        postData.append('title', thePost.title);
        postData.append('content', thePost.content);
        postData.append('image', image);

        this.http
        .post<{message: string, post: IPost}>(
            'http://localhost:3000/api/posts',
            postData)
        .subscribe((res) => {
            console.log(res.message);
            this.posts.push(res.post);
            this.reloadRoot();
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
                imagePath: image
            };
        }
        this.http.put<{message: string, postId: string}>(
            'http://localhost:3000/api/posts/' + thePost.id,
            postData)
        .subscribe((res) => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === thePost.id);
            updatedPosts[oldPostIndex] = thePost;
            this.posts = updatedPosts;
            this.reloadRoot();
            console.log(res);
        });
    }

    deletePost(postId: string): void {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
        .subscribe((res) => {
            console.log(`Post Deleted: ${postId}`);
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts]);
        });
    }

    private reloadRoot() {
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
    }
}
