import { Page } from "@playwright/test";

export class HeaderComponent {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.click('button[data-testid="login-button"]');
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button.bg-primary[type="submit"]');
  }
}
