// javascript
import { defineConfig } from 'vite';
import prerender from 'vite-plugin-prerender';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    ...(isProd
      ? [
          prerender({
            staticDir: 'dist',
            routes: ['/'],
            // wait for a custom event dispatched by the app when it's fully rendered
            // in your app, do: window.dispatchEvent(new Event('prerender-ready'))
            renderAfterDocumentEvent: 'prerender-ready',
            // fallback: wait a small amount of time if you can't dispatch an event
            renderAfterTime: 500,
            // fail the build if prerender produced an error page
            postProcessHtml: ({ html, route }) => {
              if (
                html.includes('Internal Server Error') ||
                /<title>.*Internal Server Error.*<\/title>/i.test(html)
              ) {
                throw new Error(`Prerender produced an error page for route "${route}"`);
              }
              return html;
            },
          }),
        ]
      : []),
  ],
});
