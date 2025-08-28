import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

type NewsItem = {
  id: string;
  title: string;
  url: string;
  by: string;
  points: number;
  timeISO: string;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  me: any;
  news: NewsItem[] = [];
  loading = true;
  errorNews = '';

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
   
    this.auth.me().subscribe({
      next: (u) => this.me = u,
      error: () => { this.auth.logout(); this.router.navigate(['/login']); }
    });

   
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  
}
