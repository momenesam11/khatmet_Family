# AUDIT.md — ختمة عيلة

قراءة وتحليل للكود فقط — لا تعديلات.

---

## 1. فلو التسجيل

### الـ redirect بعد التسجيل
`app/signup/page.tsx:50`

```
router.push("/login?signup_success=true");
```

بعد `signUp` الناجح، المستخدم يُحوَّل مباشرةً لصفحة اللوجين مع query param `signup_success=true`، وتظهر له رسالة ترحيبية.

### البيانات اللي بتتكتب وقت التسجيل

| الجدول | ما يحدث |
|--------|---------|
| `auth.users` | يُنشئ Supabase Auth السجل تلقائياً |
| `public.profiles` | يُنشئ **تلقائياً** عبر trigger `on_auth_user_created` (schema.sql:90-94) بـ `id`, `email`, `full_name` |
| `public.families` | **لا يُنشئ شيء** — يحدث لاحقاً في `/setup` |

المعلومات المُرسَلة في `user_metadata`:
`first_name`, `second_name`, `full_name`, `family_name`, `phone`

بيانات `families` (تُكتب في `/setup` وليس في `/signup`):
- `active = false`
- `payment_status = 'pending'`

---

## 2. بوابة الدفع

### كود الـ insert في جدول payments
`app/payment-pending/page.tsx:175-184`

```js
await supabase.from("payments").insert({
  family_id: family.id,
  user_id: userData.user.id,
  method: paymentMethod,        // e.g. "vodafone_cash"
  reference: referenceNumber.trim(),
  receipt_url: receiptValue,    // اسم الملف فقط — مش URL حقيقي
  note: optionalNote.trim() || null,
  status: "submitted",          // ← هذه القيمة
  submitted_at: new Date().toISOString(),
});
```

### سبب باج `payments_status_check`

الـ constraint الأصلي في `schema.sql:64`:
```sql
check (status in ('pending', 'approved', 'rejected'))
```

الكود يُرسِل `status = 'submitted'`، وهو غير موجود في القائمة الأصلية → **insert يفشل**.

الإصلاح موجود في `supabase/migrations/001_add_payment_fields.sql:14-18`:
```sql
drop constraint if exists payments_status_check;
add constraint payments_status_check
  check (status in ('pending', 'submitted', 'approved', 'rejected'));
```

لكن هذه الـ migration **يجب تطبيقها يدوياً** على الـ instance — إذا لم تُطبَّق فالباج لا يزال قائماً.

---

## 3. حارس الدخول (Access Gate)

### أين يتم التحقق
`app/dashboard/page.tsx:55-88` — داخل `useEffect` في دالة `init()`:

```js
if (!data.user)          → router.push("/login")
if (!familyData)         → router.push("/setup")
if (!familyData.active)  → router.push("/payment-pending")
```

### ما يُستخدَم فعلاً كشرط
يُستخدَم **فقط `families.active`** (boolean). لا يوجد تحقق مباشر من `payment_status` في الـ dashboard.

### لو الحساب مش active
يُعاد توجيه المستخدم إلى `/payment-pending` مباشرةً — لا يُعرض أي محتوى.

### تحذير أمني
الحماية **client-side فقط** — لا يوجد middleware أو server component يحمي المسار. مستخدم يعرف كيف يتجاوز الـ redirect يمكنه رؤية الواجهة، لكن Supabase RLS ستمنعه من قراءة البيانات الحقيقية.

---

## 4. بوابة العضو والأمان

### كيف تقرأ الداتا في member portal
`app/member/[token]/page.tsx:24`

```js
await supabase.rpc("get_member_portal", { p_token: token });
```

لا يوجد استعلام مباشر على الجدول. يتم استدعاء **stored function** `security definer` تفلتر بـ `access_token`:

```sql
-- schema.sql:207
select * into v_member from public.members where access_token = p_token;
```

الفلترة والأمان كلها داخل الـ function في Postgres — الـ token هو مفتاح الوصول الوحيد.

### الـ client المستخدم
`lib/supabase.ts:10`:

```js
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

يستخدم **anon key فقط** — لا يوجد service role key في أي مكان في الكود.

بوابة العضو تستخدم **نفس الـ client** (anon key) — مناسب لأن الـ functions مُصرَّح بها لـ `anon`:

```sql
-- schema.sql:292-293
grant execute on function public.get_member_portal(uuid) to anon, authenticated;
grant execute on function public.complete_member_assignment(uuid, uuid, text, text) to anon, authenticated;
```

---

## 5. حالة الـ RLS

RLS مفعّل على كل الجداول (schema.sql:124-129). الـ policies موجودة كالتالي:

| الجدول | Policy | الشرط |
|--------|--------|-------|
| `profiles` | `profiles_select_own_or_admin` | `id = auth.uid()` أو `is_super_admin()` |
| `profiles` | `profiles_update_own_or_admin` | نفس الشرط |
| `families` | `families_all_owner_or_admin` | `owner_id = auth.uid()` أو `is_super_admin()` |
| `members` | `members_all_owner_or_admin` | `owns_family(family_id)` أو `is_super_admin()` |
| `plans` | `plans_all_owner_or_admin` | `owns_family(family_id)` أو `is_super_admin()` |
| `assignments` | `assignments_all_owner_or_admin` | plan's family = owns_family أو admin |
| `payments` | `payments_owner_or_admin` | `user_id = auth.uid()` أو `is_super_admin()` |

**لا توجد policy لـ `INSERT` على `profiles`** — يعتمد الكود على الـ trigger `handle_new_user` بدلاً من RLS insert policy. إذا فشل الـ trigger لأي سبب، لن يتمكن المستخدم من إنشاء profile.

---

## 6. ملاحظات

### أعمدة موجودة في الكود لكن غائبة في السكيما

`dashboard/page.tsx:9-17` يعرّف النوع:
```ts
type Family = {
  current_start_page: number;
  current_round: number;
  ...
};
```

ويقرأ ويكتب هذين العمودين فعلياً:
- `dashboard/page.tsx:216` — يقرأ `family.current_start_page`
- `dashboard/page.tsx:262,265` — يقرأ لحساب الـ ward التالي
- `dashboard/page.tsx:289-295` — يكتب `current_start_page` و `current_round` في Supabase

**هذان العمودان غير موجودَين في `schema.sql` ولا في أي migration** → الكتابة ستُهمَل صامتةً بسبب RLS أو الـ schema، والقراءة ستعيد `undefined`.

### receipt_url — رفع الملف غير مكتمل
`payment-pending/page.tsx:173`:
```js
const receiptValue = receiptFile ? receiptFile.name : null;
```

يُحفَظ **اسم الملف فقط** (مثل `"receipt.jpg"`) لا URL حقيقي. لا يوجد كود upload لـ Supabase Storage في أي مكان — الميزة غير مكتملة.

### Dead code — نموذج إنشاء عيلة في dashboard
`dashboard/page.tsx:399-413` — شرط `if (!family)` يعرض نموذج إنشاء عيلة:

```js
if (!family) {
  return <form onSubmit={createFamily}...>
```

هذا الكود **غير قابل للوصول**: دالة `init()` تعمل قبله وتُعيد توجيه المستخدم لـ `/setup` إذا لم تكن هناك عيلة. النموذج ووظيفة `createFamily()` ميتتان.

### رابط Admin Panel مكشوف لكل المستخدمين
`dashboard/page.tsx:488`:
```jsx
<Link href="/admin">Admin Panel</Link>
```

يظهر في الشريط الجانبي لكل مستخدم مسجّل، بصرف النظر عن الدور. صفحة `/admin` نفسها تتحقق من الدور، لكن الرابط مرئي للجميع.

### purpose لا يُحفَظ في قاعدة البيانات
`setup/page.tsx:109-115` — نية الختمة (`purpose`) تُحفَظ فقط في `auth.user_metadata` كـ `khatma_purpose`، ولا يوجد عمود `purpose` في جدول `families`.

### migration 001 — غير مطبقة تلقائياً
`supabase/migrations/001_add_payment_fields.sql` ليست مرتبطة بأي CI أو Supabase migration runner. يجب تطبيقها يدوياً وإلا ظلّ باج `payments_status_check` قائماً.

### families.payment_status — قيمة 'paid' vs 'approved'
- `schema.sql` و `migration 001` يدعمان القيم: `pending`, `submitted`, `paid`, `rejected`
- `admin/page.tsx:159` يكتب `payment_status: "paid"` عند التفعيل — صحيح
- `payments.status` عند التفعيل يُكتَب `"approved"` — صحيح (جدولان مختلفان بـ constraints مختلفة)
