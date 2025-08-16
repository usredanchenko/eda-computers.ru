# Nav removal note

- Removed direct `<nav>` element with class `bg-dark-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50` from `apps/web/components/Navigation.tsx`.
- Replaced with a semantic wrapper `<div role="navigation">` preserving all classes and behavior.
- Reason: avoid conflicting duplicate nav landmarks and ensure a single navigation source from layout without modifying visual design.
- Verified no other occurrences of the same `<nav>` class pattern in the repo.
