
const dns = require('dns');

const domain = 'uyecwhfggzfzxnwdakzv.supabase.co';

console.log(`Testing DNS resolution for: ${domain}`);

dns.lookup(domain, (err, address, family) => {
    if (err) {
        console.error('DNS Lookup failed:', err);
    } else {
        console.log('DNS Lookup successful!');
        console.log('Address:', address);
        console.log('Family:', family);
    }
});
