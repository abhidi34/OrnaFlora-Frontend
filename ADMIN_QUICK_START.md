# Admin System Quick Start Guide

## 🚀 Getting Started with Admin Features

### Step 1: Access Admin Login
**Option A - Desktop:**
- Look for "Admin Login" link in the navigation menu (if not logged in as user/admin)

**Option B - Mobile:**
- Click the hamburger menu (☰)
- Scroll to bottom
- Tap "Admin Login" (purple link)

**Option C - Direct URL:**
- Go directly to: `http://localhost:3000/admin-login`

---

### Step 2: Login with Demo Credentials

```
Email:    admin@ornaflora.com
Password: admin123
```

**Note:** These credentials are displayed on the login form as a reminder.

---

### Step 3: View Admin Dashboard

Once logged in, you'll be redirected to the Admin Dashboard where you can:

✅ **See Statistics**
- Total orders placed
- Orders by status (Confirmed, Processing, Shipped, Delivered, Cancelled)

✅ **Search Orders**
- Type in the search box to find orders by:
  - Order ID (e.g., "ORD1234567890")
  - Customer Name
  - Customer Email
  - Customer Phone

✅ **Filter Orders by Status**
- Click status buttons: All, Confirmed, Processing, Shipped, Delivered, Cancelled

---

### Step 4: Manage Order Status

1. **Find an order** in the table
2. **Click "Edit Status"** button
3. **Select new status** from dropdown:
   - Confirmed (green)
   - Processing (yellow)
   - Shipped (blue)
   - Delivered (dark green)
   - Cancelled (red)
4. **Click "Save"** to save changes
   - OR **Click "Cancel"** to discard changes

> 💡 **Tip:** Changes are saved to localStorage immediately and persist across page refreshes.

---

### Step 5: View Order Details

- Click **"View"** button to see order details
- Shows:
  - Number of items in order
  - Payment method used
  - Total order amount

---

### Step 6: Logout

**Option A - Desktop Header:**
- Click the "🛠️ Admin" button
- Click "Logout"

**Option B - Mobile Menu:**
- Click hamburger menu (☰)
- Click "Logout"

---

## 📊 Dashboard Overview

### Statistics Cards
Show quick overview of all orders organized by status:
- **Total Orders**: All orders in system
- **Confirmed**: Orders awaiting processing
- **Processing**: Orders being prepared
- **Shipped**: Orders in transit
- **Delivered**: Successfully delivered orders
- **Cancelled**: Cancelled or returned orders

### Order Table Columns
| Column | Description |
|--------|-------------|
| Order ID | Unique order identifier |
| Customer | Customer name + phone |
| Address | Delivery address |
| Amount | Total order value |
| Date | Order placement date |
| Status | Current order status (color-coded) |
| Action | Edit or View buttons |

---

## 🎨 Status Color Coding

- 🟢 **Green** = Confirmed/Delivered (positive status)
- 🟡 **Yellow** = Processing (in progress)
- 🔵 **Blue** = Shipped (in transit)
- 🔴 **Red** = Cancelled (negative status)

---

## 💡 Pro Tips

1. **Quick Search**: Use the search box to quickly find a specific order
2. **Bulk Filter**: Use status filters to focus on orders needing attention
3. **Mobile Friendly**: Dashboard is fully responsive - works great on tablets
4. **Persistent Updates**: All status changes are saved automatically
5. **No Page Reload Needed**: Changes appear immediately

---

## ⚠️ Important Notes

### Admin-Only Features
- Admin users **cannot** browse plants, add to cart, or place orders
- Regular users **cannot** access admin dashboard
- Only one role can be active at a time

### Data Persistence
- All orders and changes are stored in browser's localStorage
- Data persists even after closing the browser
- Clearing browser data will erase all orders

### Demo Purpose
- This system uses localStorage (browser storage)
- For production, implement proper backend database
- See ADMIN_DOCUMENTATION.md for security recommendations

---

## 🐛 Troubleshooting

### Can't Login?
- Double-check credentials: `admin@ornaflora.com` / `admin123`
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Try a different browser

### No Orders Showing?
- First, place some test orders as a regular user
- Then login as admin to see them
- Refresh the page if needed

### Changes Not Saving?
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try clearing cache and reloading

### Can't Find Admin Link?
- Mobile users: Click hamburger menu (☰) and scroll down
- Make sure you're NOT logged in as regular user
- Try accessing directly: `/admin-login`

---

## 🔄 Workflow Example

**Complete workflow of managing orders:**

1. **Regular user places order** → Status: "Confirmed"
2. **Admin logs in** → Sees order in dashboard
3. **Admin filters by "Confirmed"** → Sees pending orders
4. **Admin edits status** → Changes to "Processing"
5. **Order is being prepared** → Admin edits to "Shipped"
6. **Order delivered** → Admin edits to "Delivered"
7. **Completed!** → Order shows in "Delivered" filter

---

## 📞 Need Help?

For detailed technical documentation, see: **ADMIN_DOCUMENTATION.md**

For general questions about the app, see: **README.md**

Happy managing! 🌿
