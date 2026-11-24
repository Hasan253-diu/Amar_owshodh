import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Ensure environment variables are defined before initializing
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project')
  ) {
    // Return early if Supabase credentials are not populated yet
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid calling supabase.auth.getSession() which can be spoofed.
  // Always use getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isGuest = request.cookies.get('amar_owshodh_guest')?.value === 'true'
  const isRealUser = !!user && !user.is_anonymous && !isGuest
  const isAuthenticated = isRealUser || isGuest

  // Protected application routes
  const protectedPrefixes = [
    '/dashboard',
    '/medicines',
    '/schedule',
    '/calendar',
    '/history',
    '/reports',
    '/settings',
    '/profile',
    '/admin',
  ]

  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  )

  // Auth pages
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // If a guest attempts to visit creation/mutation pages, redirect to login with friendly message
  if (isGuest && (pathname === '/medicines/new' || pathname.startsWith('/medicines/new'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('message', 'guest_restricted')
    return NextResponse.redirect(url)
  }

  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // Only real registered users are redirected to dashboard from login/register.
  // Guests are allowed to navigate freely to login/register to sign in or create an account.
  if (isAuthRoute && isRealUser) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Admin route protection: check role (always block guests from admin)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const profile = data as { role?: string } | null

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
