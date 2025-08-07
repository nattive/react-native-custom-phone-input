# TODO - React Native Custom Phone Input

## 🚀 Feature Requests

### High Priority

#### 1. Optional Flag Images
- **Description**: Make flag PNG images optional - allow users to choose between PNG flags or text/emoji flags
- **Benefits**: 
  - Reduces bundle size significantly (currently ~2MB of flag images)
  - Better performance for apps that don't need visual flags
  - More accessibility-friendly with text-based country indicators
- **Implementation Ideas**:
  - Add `useFlagImages?: boolean` prop (default: true for backward compatibility)
  - When `false`, show country code text or emoji flags instead of PNG images
  - Add `flagType?: 'image' | 'emoji' | 'text'` for more granular control
- **Priority**: High - Bundle size optimization

### Medium Priority

#### 2. Enhanced Theming
- **Description**: Expand theming capabilities
- **Ideas**:
  - Dark mode preset themes
  - Material Design theme preset
  - iOS theme preset
  - Custom animation timing controls

#### 3. Accessibility Improvements
- **Description**: Better accessibility support
- **Ideas**:
  - Screen reader optimizations
  - Voice-over support for country selection
  - Keyboard navigation improvements
  - High contrast mode support

### Low Priority

#### 4. Advanced Validation
- **Description**: More validation options
- **Ideas**:
  - Custom validation rules
  - Real-time validation feedback
  - Integration with popular form libraries
  - Carrier detection

#### 5. Performance Optimizations
- **Description**: Further performance improvements
- **Ideas**:
  - Virtual scrolling for country list
  - Lazy loading of countries
  - Memoization improvements
  - Bundle size optimizations

## 🐛 Bug Fixes

- None currently reported

## 📚 Documentation

- Add more usage examples
- Create migration guide from other phone input libraries
- Add troubleshooting section

## 🧪 Testing

- Add comprehensive unit tests
- Add integration tests
- Add accessibility tests
- Add performance benchmarks

---

**Contributing**: Feel free to pick up any of these items or suggest new ones! 