import IPost from './ipost.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: IPost[] = [];

    private postUpdated = new Subject<IPost[]>();

    getPosts(): IPost[] {
        return [...this.posts];
    }

    getPostUpdateListener(): Observable<IPost[]> {
        return this.postUpdated.asObservable();
    }

    addPost(thePost: IPost): void {
        this.posts.push(thePost);
        this.postUpdated.next([...this.posts]);
    }
}