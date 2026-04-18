/**
 * cookieService.ts
 * Manages strictly non-sensitive UI personalization cookies (Theme, Language, UI State).
 * Security Note: NEVER use these JS-accessible functions for Auth Tokens (JWTs).
 * Those are handled securely via HttpOnly cookies injected solely by the Express Backend.
 */

export const cookieService = {
  /**
   * Sets a non-sensitive cookie.
   * Max size limit strictly ~4KB.
   */
  set(name: string, value: string, days = 30): void {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    
    // Defaulting to SameSite=Lax for proper cross-navigation safety
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  },

  /**
   * Retrieves a JS-accessible cookie.
   */
  get(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },

  /**
   * Clears a cookie.
   */
  delete(name: string): void {
    this.set(name, '', -1);
  },

  // --- Specific Personalization Helpers --- //

  setTheme(theme: 'light' | 'dark'): void {
    this.set('ux_theme', theme);
  },

  getTheme(): 'light' | 'dark' {
    return (this.get('ux_theme') as 'light' | 'dark') || 'light';
  },

  setLanguage(lang: string): void {
    this.set('ux_lang', lang);
  },

  getLanguage(): string {
    return this.get('ux_lang') || 'en';
  }
};
