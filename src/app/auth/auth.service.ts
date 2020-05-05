import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data-model';

@Injectable({providedIn: 'root'})
export default class AuthService {
    private readonly port = 3000;
    private readonly path = `http://localhost:${this.port}/api/user`;

    constructor(private http: HttpClient) { }

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

        this.http.post(url, authData)
        .subscribe((response) => {
            console.log(response);
        });
    }
}
