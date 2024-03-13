/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },

  async headers(){
    return [
      {
        source: '/unustasid-parooli/:slug*',
        headers: 
        [
          {
          key: 'Referrer-Policy',
          value: 'no-referrer' 
          }
        ]
      }
    ]

  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "gh7k4lm0-3000.euw.devtunnels.ms",
        "localhost:3000",
        "gh7k4lm0-3000.euw.devtunnels.ms:3000",
      ],
    },
  },
};

export default nextConfig;
