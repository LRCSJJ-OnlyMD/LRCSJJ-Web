#!/bin/bash

# LRCSJJ Import Path Update Script
# This script updates import paths to match the new organized structure

echo "🔄 Updating import paths to new organized structure..."

# Directory to search
SRC_DIR="src"

# UI Primitives updates
echo "📦 Updating UI primitive imports..."
find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i \
  -e 's|@/components/ui/button|@/components/ui/primitives/button|g' \
  -e 's|@/components/ui/input|@/components/ui/primitives/input|g' \
  -e 's|@/components/ui/card|@/components/ui/primitives/card|g' \
  -e 's|@/components/ui/dialog|@/components/ui/primitives/dialog|g' \
  -e 's|@/components/ui/form|@/components/ui/primitives/form|g' \
  -e 's|@/components/ui/table|@/components/ui/primitives/table|g' \
  -e 's|@/components/ui/select|@/components/ui/primitives/select|g' \
  -e 's|@/components/ui/checkbox|@/components/ui/primitives/checkbox|g' \
  -e 's|@/components/ui/badge|@/components/ui/primitives/badge|g' \
  -e 's|@/components/ui/label|@/components/ui/primitives/label|g' \
  -e 's|@/components/ui/textarea|@/components/ui/primitives/textarea|g' \
  -e 's|@/components/ui/tabs|@/components/ui/primitives/tabs|g' \
  -e 's|@/components/ui/sheet|@/components/ui/primitives/sheet|g' \
  -e 's|@/components/ui/scroll-area|@/components/ui/primitives/scroll-area|g' \
  -e 's|@/components/ui/dropdown-menu|@/components/ui/primitives/dropdown-menu|g' \
  -e 's|@/components/ui/sonner|@/components/ui/primitives/sonner|g'

# Layout components
echo "🏗️  Updating layout component imports..."
find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i \
  -e 's|@/components/ui/navbar|@/components/ui/layout/navbar|g' \
  -e 's|@/components/ui/footer|@/components/ui/layout/footer|g' \
  -e 's|@/components/ui/sidebar|@/components/ui/layout/sidebar|g' \
  -e 's|@/components/ui/splash-screen|@/components/ui/layout/splash-screen|g'

# Form components
echo "📝 Updating form component imports..."
find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i \
  -e 's|@/components/ui/contact-form|@/components/ui/forms/contact-form|g' \
  -e 's|@/components/ui/athlete-form-dialog|@/components/ui/forms/athlete-form-dialog|g' \
  -e 's|@/components/ui/image-upload|@/components/ui/forms/image-upload|g'

# Map components
echo "🗺️  Updating map component imports..."
find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i \
  -e 's|@/components/ui/google-map|@/components/ui/maps/google-map|g' \
  -e 's|@/components/ui/google-maps|@/components/ui/maps/google-maps|g' \
  -e 's|@/components/ui/google-maps-embed|@/components/ui/maps/google-maps-embed|g'

# Theme components
echo "🎨 Updating theme component imports..."
find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i \
  -e 's|@/components/ui/theme-provider|@/components/ui/theme/theme-provider|g' \
  -e 's|@/components/ui/theme-toggle|@/components/ui/theme/theme-toggle|g' \
  -e 's|@/components/ui/language-switcher|@/components/ui/theme/language-switcher|g'

# Shared component updates
echo "🤝 Updating shared component imports..."
find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i \
  -e 's|@/components/ui/admin-access|@/components/shared/auth/admin-access|g' \
  -e 's|@/components/auth/|@/components/shared/auth/|g' \
  -e 's|@/components/logos/|@/components/shared/logos/|g' \
  -e 's|@/components/ui/payment-processing|@/components/shared/payments/payment-processing|g' \
  -e 's|@/components/ui/stripe-payment-processing|@/components/shared/payments/stripe-payment-processing|g' \
  -e 's|@/components/ui/payment-details-dialog|@/components/shared/payments/payment-details-dialog|g' \
  -e 's|@/components/ui/athlete-payment-manager|@/components/shared/payments/athlete-payment-manager|g' \
  -e 's|@/components/ui/notification-bell|@/components/shared/notifications/notification-bell|g'

echo "✅ Import path updates completed!"
echo ""
echo "📋 Summary of changes:"
echo "   • UI primitives moved to: @/components/ui/primitives/"
echo "   • Layout components moved to: @/components/ui/layout/"
echo "   • Form components moved to: @/components/ui/forms/"
echo "   • Map components moved to: @/components/ui/maps/"
echo "   • Theme components moved to: @/components/ui/theme/"
echo "   • Auth components moved to: @/components/shared/auth/"
echo "   • Logo components moved to: @/components/shared/logos/"
echo "   • Payment components moved to: @/components/shared/payments/"
echo "   • Notification components moved to: @/components/shared/notifications/"
echo ""
echo "🔧 Next steps:"
echo "   1. Run 'npm run build' to check for any remaining import issues"
echo "   2. Update any custom imports that weren't caught by this script"
echo "   3. Test all functionality to ensure everything works correctly"
