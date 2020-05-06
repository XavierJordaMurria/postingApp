import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data-model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export default class AuthService {
    private readonly port = 3000;
    private readonly path = `http://localhost:${this.port}/api/user`;

    private isAuthenticated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    createUser(email: string, password: string) {
        const url = this.path + '/signup';
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post(url, authData)
        .subscribe((response) => {
            console.log(response);
        });
    }

    login(email: string, password: string) {
        const url = this.path + '/login';
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post<{token: string}>(url, authData)
        .subscribe((response) => {
            console.log(response);
            this.token = response.token;

            if (this.token) {
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(['/']);
            }
        });
    }

    getToken(): string {
        return this.token;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(this.isAuthenticated);
        this.router.navigate(['/']);
    }
}
