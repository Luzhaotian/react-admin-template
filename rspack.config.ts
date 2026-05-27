import path from 'path';
import { Configuration } from '@rspack/core';

const isProd = process.env.NODE_ENV === 'production';

const config: Configuration = {
  context: __dirname,
  entry: { main: './src/main.tsx' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProd ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
    chunkFilename: isProd ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic' } },
            },
          },
        },
      },
      {
        test: /\.module\.css$/,
        type: 'css/module',
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        type: 'css/auto',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: { filename: 'static/images/[name].[hash:8][ext]' },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    new (require('@rspack/core').HtmlRspackPlugin)({
      template: './index.html',
      favicon: './public/favicon.ico',
    }),
  ],
  devServer: {
    port: Number(process.env.PORT) || 8080,
    hot: true,
    historyApiFallback: true,
    setupMiddlewares: (middlewares) => {
      middlewares.unshift({
        name: 'mock-middleware',
        middleware: (req: any, res: any, next: any) => {
          if (process.env.MOCK !== 'true') {
            return next();
          }
          const url = req.url;
          if (!url.startsWith('/api/v1/user')) {
            return next();
          }
          const { mockLogin, mockFetchUserInfo, mockFetchPermissions, mockGetGrowthDashboard } = require('./src/mock/user');
          const method = req.method.toLowerCase();
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              if (method === 'post' && url === '/api/v1/user/login') {
                const params = JSON.parse(body);
                const result = mockLogin(params);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'SUCCESS', data: result }));
                return;
              }
              if (method === 'get' && url === '/api/v1/user/info') {
                const token = req.headers['x-token'];
                const userInfo = mockFetchUserInfo(token);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'SUCCESS', data: userInfo }));
                return;
              }
              if (method === 'get' && url === '/api/v1/user/permissions') {
                const permissions = mockFetchPermissions();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'SUCCESS', data: permissions }));
                return;
              }
              if (method === 'get' && url === '/api/v1/user/growth-dashboard') {
                const data = mockGetGrowthDashboard();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'SUCCESS', data }));
                return;
              }
              next();
            } catch (error: any) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'ERROR', msg: error.message }));
            }
          });
        },
      });
      return middlewares;
    },
    proxy: process.env.MOCK !== 'true' ? [{
      context: ['/api'],
      target: 'http://localhost:3000',
      changeOrigin: true,
    }] : undefined,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 20,
        },
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: 'antd',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
};

export default config;
