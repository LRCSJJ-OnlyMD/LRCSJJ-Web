# PowerShell script to fix all import paths in the LRCSJJ project

Write-Host "🔄 Fixing all import paths in LRCSJJ project..." -ForegroundColor Cyan

# Get all TypeScript/TSX files
$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.Name -notlike "*.d.ts" }

Write-Host "📁 Found $($files.Count) files to process..." -ForegroundColor Yellow

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # UI Primitives
    $content = $content -replace '@/components/ui/button', '@/components/ui/primitives/button'
    $content = $content -replace '@/components/ui/input', '@/components/ui/primitives/input'
    $content = $content -replace '@/components/ui/card', '@/components/ui/primitives/card'
    $content = $content -replace '@/components/ui/dialog', '@/components/ui/primitives/dialog'
    $content = $content -replace '@/components/ui/form', '@/components/ui/primitives/form'
    $content = $content -replace '@/components/ui/table', '@/components/ui/primitives/table'
    $content = $content -replace '@/components/ui/select', '@/components/ui/primitives/select'
    $content = $content -replace '@/components/ui/checkbox', '@/components/ui/primitives/checkbox'
    $content = $content -replace '@/components/ui/badge', '@/components/ui/primitives/badge'
    $content = $content -replace '@/components/ui/label', '@/components/ui/primitives/label'
    $content = $content -replace '@/components/ui/textarea', '@/components/ui/primitives/textarea'
    $content = $content -replace '@/components/ui/tabs', '@/components/ui/primitives/tabs'
    $content = $content -replace '@/components/ui/sheet', '@/components/ui/primitives/sheet'
    $content = $content -replace '@/components/ui/scroll-area', '@/components/ui/primitives/scroll-area'
    $content = $content -replace '@/components/ui/dropdown-menu', '@/components/ui/primitives/dropdown-menu'
    $content = $content -replace '@/components/ui/sonner', '@/components/ui/primitives/sonner'
    
    # Layout components  
    $content = $content -replace '@/components/ui/navbar', '@/components/ui/layout/navbar'
    $content = $content -replace '@/components/ui/footer', '@/components/ui/layout/footer'
    $content = $content -replace '@/components/ui/sidebar', '@/components/ui/layout/sidebar'
    $content = $content -replace '@/components/ui/splash-screen', '@/components/ui/layout/splash-screen'
    
    # Form components
    $content = $content -replace '@/components/ui/contact-form', '@/components/ui/forms/contact-form'
    $content = $content -replace '@/components/ui/athlete-form-dialog', '@/components/ui/forms/athlete-form-dialog'
    $content = $content -replace '@/components/ui/image-upload', '@/components/ui/forms/image-upload'
    
    # Map components
    $content = $content -replace '@/components/ui/google-map', '@/components/ui/maps/google-map'
    $content = $content -replace '@/components/ui/google-maps', '@/components/ui/maps/google-maps'
    $content = $content -replace '@/components/ui/google-maps-embed', '@/components/ui/maps/google-maps-embed'
    
    # Theme components
    $content = $content -replace '@/components/ui/theme-provider', '@/components/ui/theme/theme-provider'
    $content = $content -replace '@/components/ui/theme-toggle', '@/components/ui/theme/theme-toggle'
    $content = $content -replace '@/components/ui/language-switcher', '@/components/ui/theme/language-switcher'
    
    # Shared components
    $content = $content -replace '@/components/ui/admin-access', '@/components/shared/auth/admin-access'
    $content = $content -replace '@/components/auth/', '@/components/shared/auth/'
    $content = $content -replace '@/components/logos/', '@/components/shared/logos/'
    $content = $content -replace '@/components/logos', '@/components/shared/logos'
    $content = $content -replace '@/components/ui/payment-processing', '@/components/shared/payments/payment-processing'
    $content = $content -replace '@/components/ui/stripe-payment-processing', '@/components/shared/payments/stripe-payment-processing'
    $content = $content -replace '@/components/ui/payment-details-dialog', '@/components/shared/payments/payment-details-dialog'
    $content = $content -replace '@/components/ui/athlete-payment-manager', '@/components/shared/payments/athlete-payment-manager'
    $content = $content -replace '@/components/ui/notification-bell', '@/components/shared/notifications/notification-bell'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✅ Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "🎉 Import path updates completed!" -ForegroundColor Green
Write-Host "🔧 Run 'npm run build' to test the changes" -ForegroundColor Yellow
