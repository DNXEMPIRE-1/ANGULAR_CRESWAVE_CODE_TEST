import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Image } from 'src/app/models';
import { paths } from 'src/app/util';
import { ImageComponent } from '../../image/image.component';
import { ButtonComponent } from '../../buttons';

@Component({
  selector: 'app-auth-page-layout',
  templateUrl: './auth-page-layout.component.html',
  styleUrls: ['./auth-page-layout.component.scss'],
  standalone: true,
  imports: [ImageComponent, ButtonComponent],
})
export class AuthPageLayoutComponent implements OnInit {
  switchPageLabel = 'Already have an account? Login';

  authImage: Image = {
    src: 'assets/img/auth-bg.png',
    alt: 'auth',
    priority: true,
    width: 500,
    height: 429,
  };

  get isLoginPage(): boolean {
    return this.router.url === paths.login;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.setSwitchPageLabel();
    this.router.events
      .pipe(
        filter((ev) => ev instanceof NavigationEnd),
        tap(() => this.setSwitchPageLabel())
      )
      .subscribe();
  }

  switchPage(): void {
    this.router.navigate([this.isLoginPage ? paths.signup : paths.login]);
  }

  setSwitchPageLabel(): void {
    this.switchPageLabel = this.isLoginPage
      ? "Don't have an account? Sign up"
      : 'Already have an account? Login';
  }
}
