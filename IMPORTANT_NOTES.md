# Important Notes

Use this file to track warnings, risks, blockers, and important implementation notes.

## Entries

- 2026-05-13: Created this file by request. From now on, warnings and important notes will be recorded here.
- 2026-05-13: Backend validation/runtime commands could not be executed in this shell because `php` is not available on PATH.
- 2026-05-13: T002 env/config defaults were applied, but Laravel config cache/route checks were not runnable here due to missing `php`.
- 2026-05-13: T009 middleware/route bootstrapping updated, but route:list and runtime middleware verification remain blocked until `php` is available.
- 2026-05-13: Phase 1 backend feature tests were added in `backend/tests/Feature/Phase1BackendFeatureTest.php`.
  Run all feature tests later with: `cd backend && php artisan test --testsuite=Feature`
  Run only Phase 1 tests with: `cd backend && php artisan test tests/Feature/Phase1BackendFeatureTest.php`
