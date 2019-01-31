# FIS Broker API

A simple API to query Berlin's FIS Broker. 

Installing dependencies
```
npm install
```

Duplicate and rename the *serverless-sample.yml* to *serverless.yml*

Add your profile and region to the serverless.yml:
```
  profile: YOUR_PROFILE
  region: YOUR_REGION
```

Deploy to AWS:
```
serverless deploy --stage production
```

## Additional settings
As this setup is quite simple it does not require any additional lambda settings. But you might want to configure a few things in the handler.js

### CORS Headers

If you want anyone to use the API without any restrictions you don't need to modify the CORS settings. If you want only a specific domain to be able to access the API change the following lines accordingly:

handler.js (line 13)
```
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};
```

### Rate Limits

If you don't want any rate limits you can complete remove lines 6-10, 42-49, 74-81, no further adjustments required.
Especially as the download function can consume quite a lot of resources, you might want to consider limiting the usage of the function.
The implemented rate-limiter-flexible module uses a credit system. In the current setup every IP address gets 10 credits every 5 minutes. A *getInfo* request costs 1 credit, a *download* request costs 5. You simply change this by changing the following values:

handler.js (line 8)
```
const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 300,
});
```

If users exceed their rate limit, the API will return a 429 with the message
```
{message: 'Too Many Requests'}
```

Make sure you handle this exception in your frontend.
## Todo 

- Move CORS settings to environmental variables
- Move rate limit settings to environmental variables