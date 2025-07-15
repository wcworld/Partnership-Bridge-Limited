-- Fix function search_path security warnings by setting explicit search_path

-- Update has_role function with explicit search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;

-- Update generate_reference_number function with explicit search_path
CREATE OR REPLACE FUNCTION public.generate_reference_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  RETURN 'LN' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 10000)::TEXT, 4, '0');
END;
$function$;

-- Update update_updated_at_column function with explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;