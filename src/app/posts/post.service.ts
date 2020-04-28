import IPost from './ipost.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: IPost[] = [];

    private postUpdated = new Subject<IPost[]>();

    constructor(private http: HttpClient) {
    }

    getPosts() {

        this.http.get<{message: string, posts: IPost[]}>('http://localhost:3000/api/posts')
        .subscribe((data) => {
            this.posts = data.posts;
            this.postUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener(): Observable<IPost[]> {
        return this.postUpdated.asObservable();
    }

    addPost(thePost: IPost): void {
        this.http.post<{message: string}>('http://localhost:3000/api/posts', thePost)
        .subscribe((res) => {
            console.log(res.message);
            this.posts.push(thePost);
            this.postUpdated.next([...this.posts]);
        });
    }
}
