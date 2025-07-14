-- Update a user's role to admin (replace 'your-email@example.com' with your actual email)
UPDATE user_roles 
SET role = 'admin'::app_role 
WHERE user_id = (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = 'your-email@example.com'
);