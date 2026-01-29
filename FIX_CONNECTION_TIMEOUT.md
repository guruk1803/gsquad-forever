# 🚨 Fix Database Connection Timeout

## ❌ The Error

From Render logs:
```
❌ Database connection test failed: Connection terminated due to connection timeout
```

**What this means:** The connection to Supabase is timing out. This can happen for several reasons.

---

## ✅ Quick Fixes to Try

### Fix 1: Verify Supabase Project is Active

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Check if your project shows as **"Active"** (not "Paused")

2. **If Paused:**
   - Free tier projects can pause after inactivity
   - Click "Restore" or "Resume" to reactivate
   - Wait 1-2 minutes for it to come back online

### Fix 2: Verify Connection String Format

Your connection string:
```
postgresql://postgres.xojqojqeavgkabepehai:back%40youGuru318@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

**Verify:**
- ✅ Using pooler (port 6543) - **Correct!**
- ✅ Password encoded (`back%40youGuru318`) - **Correct!**
- ✅ Hostname format: `aws-1-ap-south-1.pooler.supabase.com` - **Correct!**

**Double-check in Render:**
1. Render Dashboard → Your service → Environment
2. Verify `DATABASE_URL` matches exactly (no extra spaces, correct encoding)

### Fix 3: Check Supabase Network Settings

1. **Go to Supabase Dashboard:**
   - Settings → Database
   - Check **"Connection pooling"** section
   - Make sure **"Session mode"** is enabled

2. **Check IP Restrictions (if any):**
   - Settings → Database → Network restrictions
   - If enabled, make sure Render's IPs are allowed
   - Or temporarily disable to test

### Fix 4: Try Transaction Mode Instead

Sometimes "Session mode" has issues. Try "Transaction mode":

1. **Supabase Dashboard:**
   - Settings → Database → Connection string
   - Select **"Transaction mode"** (instead of Session mode)
   - Copy the connection string
   - Update in Render

**Transaction mode format:**
```
postgresql://postgres.xojqojqeavgkabepehai:back%40youGuru318@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Fix 5: Wait and Retry

Sometimes the pooler is temporarily overloaded:
- Wait 2-3 minutes
- The connection might work on the next request
- Check Render logs again

---

## 🔧 Advanced Troubleshooting

### Check Render Logs for More Details

Look for:
- `ENOTFOUND` - Hostname not found
- `ETIMEDOUT` - Connection timeout
- `ECONNREFUSED` - Connection refused
- `ENETUNREACH` - Network unreachable

### Test Connection from Local Machine

1. **Install psql** (PostgreSQL client)
2. **Test connection:**
   ```bash
   psql "postgresql://postgres.xojqojqeavgkabepehai:back%40youGuru318@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
   ```
3. **If it works locally but not on Render:**
   - Network/firewall issue from Render
   - Try different Supabase region

### Try Different Supabase Region

If your project is in a region far from Render's servers:
1. Create a new Supabase project in a closer region (e.g., `us-east-1`)
2. Run migrations on new project
3. Update `DATABASE_URL` in Render

---

## 📋 Connection String Checklist

Before testing, verify:

- [ ] Connection string uses pooler (port 6543)
- [ ] Hostname includes `pooler.supabase.com`
- [ ] Password is URL-encoded (special characters)
- [ ] No extra spaces or characters
- [ ] Supabase project is active (not paused)
- [ ] Connection pooling is enabled in Supabase

---

## 🧪 Test After Fixes

1. **Wait 2-3 minutes** for Render to restart
2. **Check Render Logs:**
   - Should see: `✅ Database connection successful`
   - Or: Connection might work on first query (even if test fails)
3. **Test Login:**
   - Visit: https://gsquad-forever-client.vercel.app/admin/login
   - Try login: `admin@gsquadforever.com` / `admin123`
   - **Note:** Even if connection test fails, the actual login query might work!

---

## 💡 Important Note

**The connection test might fail, but actual queries might still work!**

The timeout happens during the initial connection test. When you actually try to login, the connection might succeed because:
- The pooler has time to establish connection
- Network conditions might improve
- The query retries automatically

**So even if you see the timeout error, try logging in - it might work!**

---

## 🆘 Still Not Working?

If connection still times out after trying all fixes:

1. **Check Supabase Status:**
   - https://status.supabase.com
   - Check if there are any outages

2. **Contact Support:**
   - Supabase: Check if your project has any restrictions
   - Render: Check if there are network issues

3. **Alternative: Use Direct Connection Temporarily**
   - Get direct connection string from Supabase
   - Use port 5432 (not 6543)
   - **Note:** This might have IPv6 issues, but worth trying

---

## ✅ Expected Result

After fixes:
- ✅ Render logs: `✅ Database connection successful`
- ✅ Or: Connection works on first query (login)
- ✅ No more timeout errors
- ✅ Login works

**The connection timeout is often a temporary issue. Try logging in even if the test fails!** 🎉

