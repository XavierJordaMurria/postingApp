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
    private userId: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any; // NodeJS.Timer

    constructor(private http: HttpClient, private router: Router) { }

    createUser(email: string, password: string) {
        const url = this.path + '/signup';
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post(url, authData)
        .subscribe( () => {
            this.router.navigate(['/']);
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    login(email: string, password: string) {
        const url = this.path + '/login';
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post<{token: string, expiresIn: number, userId: string}>(url, authData)
        .subscribe((response) => {
            console.log(response);
            this.token = response.token;

            if (this.token) {
                const expiresInDuration = response.expiresIn; // in seconds

                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(this.token, expirationDate, this.userId);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();

        if (!authInfo) {
            return;
        }

        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.authStatusListener.next(this.isAuthenticated);
            this.setAuthTimer(expiresIn / 1000);
        }
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

    getUserId() {
        return this.userId;
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(this.isAuthenticated);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiration');
    }

    private getAuthData(): { token: string, expirationDate: Date, userId: string } {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');

        if (!token || !expirationDate) {
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }

    /**
     * Sets auth expiration token timeOUt
     * @param duration in seconds
     */
    private setAuthTimer(duration: number) {

        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
}
