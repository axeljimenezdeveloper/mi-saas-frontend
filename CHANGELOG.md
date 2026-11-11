# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.3.7](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.3.6...v2.3.7) (2026-11-11)

### Features

* surface store errors to users via toast watcher ([8b91688](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/8b91688dd2d02d5aa972de2d15dd2825a61faaad))

### Bug Fixes

* refresh products after invoice creation in backend mode ([525b850](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/525b8509b9a5c2ba841211bb435f68cc7e0c365d))
* respect company currency in all money formatting ([0baccc0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/0baccc0184bdd0354c45d2d2d9260f520938d9bd))

## [2.3.6](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.3.5...v2.3.6) (2026-11-11)

### Bug Fixes

* remove unused test imports breaking tsc build ([6e8b061](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/6e8b061f42928efc33fe1411173fdd9227292c5c))

## [2.3.5](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.3.4...v2.3.5) (2026-11-11)

## [2.3.4](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.3.3...v2.3.4) (2026-11-11)

### Bug Fixes

* sequence products fetch before invoices to resolve item names ([0b5606a](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/0b5606a613028cff746fe6379ac367e4a8f31095))

## [2.3.3](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.3.2...v2.3.3) (2026-11-11)

### Bug Fixes

* show skeleton while store fetches resolve, drop fake timeouts ([bcd2359](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/bcd23593c87f9b19b23ddeb6ac1d6c3b7b1147cc))

## [2.3.2](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.3.1...v2.3.2) (2026-11-11)

### Bug Fixes

* align PDF preview height with Emisor/Cliente column ([b6463bb](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/b6463bb6abe8f02ba4636a9ddeec1fe230d2d0bd))

## [2.3.1](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.3.0...v2.3.1) (2026-11-11)

### Bug Fixes

* replace loremflickr with local SVG placeholders for demo products ([4a9c9b4](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/4a9c9b45e14d0f0d0638d7bd54dc316e7a7df74e))

## [2.3.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.2.0...v2.3.0) (2026-11-11)

### Bug Fixes

* fetch company before login redirect decision ([9c93469](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/9c93469f20406cd69f7267099ba76de75d2c8977))
* persist company changes to backend from settings ([947352d](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/947352d11a25a96dceb93c029c996c97d0cfafa1))
* reset stores on logout to prevent cross-session data leakage ([adae4f4](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/adae4f4d033cd1a675d72edbee8205194f3dab93))

## [2.2.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.1.0...v2.2.0) (2026-11-10)

### Features

* add demo product samples with UI entry points ([104f0a8](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/104f0a8bbc38b61b303ca2c77fe1798d048eb638))

## [2.1.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v2.0.0...v2.1.0) (2026-11-09)

### Features

* add create test account button with auto-login ([36f42a9](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/36f42a9920d4a48803496099f19cff021347ba5a))
* integrate notifications with backend in frontend ([65edc95](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/65edc9582c27d5df1e721f5415086f10ed3db8ff))

## [2.0.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v1.0.0...v2.0.0) (2026-11-08)

### Features

* add backend integration layer with feature flag ([6b140e8](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/6b140e8175d3b9821b0a488da8fbb8ba486488fb))
* add billing backend integration ([7f81d9a](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/7f81d9a2dce4274ed0e3f975b6d70ed1028e78fd))
* add inventory backend integration ([454f620](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/454f620b31d7417f9cbc570284d6d7c978c2c4fc))
* add invoice pdf download in billing detail ([c4bf051](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/c4bf051cb5e616c274a89f043109ac5d18046a55))

## [1.0.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.9.1...v1.0.0) (2026-11-07)

### Features

* add 404 page with sidebar, no scroll, and dynamic CTA based on onboarding status ([4f28c69](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/4f28c694b11c1e5deeb417ac989a3f2d80b9045d))
* add demo mode warning banner in dashboard ([609b8c1](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/609b8c1d7fce6f91d8f08b1557d7af2ee56bfa5b))
* add global error boundary with fallback UI ([02fdfb0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/02fdfb006c8fe988028dac9f202325bf3025fdc2))
* add invoice detail page with pdf preview placeholder ([e49dff1](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/e49dff1576628d5c836855b05f6027e48d26fdc8))
* add remember me checkbox and auto-redirect on login ([4f9711f](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/4f9711fb244927d3a9bba9376efac4082e2505c4))

## [0.9.1](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.9.0...v0.9.1) (2026-11-07)

### Features

* rebrand to Vendra with company name in header and dynamic iva ([d989c0e](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/d989c0e99eae62560f6ccbe9ffa9e9c4012c11c7))

## [0.9.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.8.0...v0.9.0) (2026-11-07)

### Features

* add notifications page with filtering, categories, and bulk actions ([8d4781d](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/8d4781d73d9e25e76a0dea6ca486e23d0af5ef88))
* add pagination and date sorting to billing list ([deebf84](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/deebf84ddf6e87d1bbea45dbae83b48fc45a2f23))
* add pagination component and integrate with sorting in products list ([ff6c0bf](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/ff6c0bfd349123b619bbdea6ad3a26d5fdaf53f5))
* add pagination to notifications page ([dc180c3](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/dc180c374c5c34494269964b19f1865499a5ec4e))
* categorize all toasts by domain (inventory, billing, auth, system) ([95ae427](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/95ae42752488d96fc4f03504505175dc6e436a84))
* notify on invoice status changes with category and action url ([bc99297](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/bc99297f3942c62ac516bea81aa3b2965e9f9dea))

## [0.8.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.7.0...v0.8.0) (2026-11-06)

### Features

* add business-focused documentation page with sidebar entry ([8dd879e](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/8dd879eda4247708896e83a363ab2539103bf895))
* add modal, confirm dialog for deletions, and dashboard widget limits ([cc5aead](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/cc5aead949096242d1a4e7181a5a1a740389e061))

### Bug Fixes

* render billing actions menu with portal to prevent clipping ([ded4ed2](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/ded4ed25fb07808d02d3a7a0016cfb813cd7ebdc))
* render billing actions menu with portal to prevent clipping ([377976d](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/377976d694b673893d3d5b8992f46fd160d610a1))

## [0.7.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.6.0...v0.7.0) (2026-11-05)

### Features

* add ImageUploader component with drag and drop, previews, and validation ([ec7aa19](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/ec7aa1905010720681002bd8eb4015c4bcf05c6e))
* add invoice status menu to mark invoices as paid, pending, or overdue ([b3d4c29](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/b3d4c2949733b41c34ac0cd71b49b88c94cc5948))
* add product edit mode reusing new product form with route and list integration ([921e8f7](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/921e8f77994bb62362db3e6047df6bd2bca98522))
* add products and invoices stores with in-memory persistence ([4ff7d23](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/4ff7d23abad4c827c5a77928c097e47a5cd0e8c0))
* add strict sku validation, real-time success feedback, and character counters ([2593839](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/25938397e5f2f54b128aedce391440c191be19c2))
* fix sidebar active state, move logout to sidebar footer, and make avatar link to settings ([199a7a7](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/199a7a7d4b3c58ddf30dfce50583b8d78cadfd83))
* integrate ImageUploader into product form with schema and store support ([a648616](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/a64861614990dcbcd42d750bd034dfb075ad7e25))
* migrate products list to store with functional delete and centered empty state ([468215e](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/468215eff441228cad918e196f44bf2324c4599c))
* show product thumbnail in list when images are available ([642a7ae](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/642a7aea5968384baa834002f841d55b282017f3))
* use real products in billing form, add validation, and fix layout ([af38cf1](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/af38cf13b8295d2111aa98477728d687a0010928))

## [0.6.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.5.0...v0.6.0) (2026-11-05)

### Features

* add zod schemas and migrate settings form to react-hook-form ([2755916](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/275591667fc4950fef973f14b4860ecf300e8d69))
* migrate billing form to react-hook-form with invoice zod schema ([adba9ea](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/adba9ea2da0e63969aebe10062d1017ad968b3b9))
* migrate login and product forms to react-hook-form with zod schemas ([10a757f](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/10a757f149db530ed440b31d5ddc090e144ee7a8))

## [0.5.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.4.0...v0.5.0) (2026-11-05)

### Features

* add useAuthStore with mock login and selective persistence ([4f0229e](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/4f0229ed7e5b8364834ad0b628c40e9b4ebf2ab3))
* add useSidebarStore with partial persistence for collapse state ([262048e](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/262048e01dbe204e60a39fd38da2f41a9d1a43a8))
* add useThemeStore with zustand and manual localStorage sync ([cf9a8a4](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/cf9a8a47f9863fe707229769bb94b489990e4459))

### Bug Fixes

* resolve eslint errors in tests and hooks ([742fa26](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/742fa26866169681029abf5f63fa58c23c60f2b7))

## [0.4.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.3.0...v0.4.0) (2026-11-04)

### Features

* add billing new invoice form with line items, IVA calculation, and form validation ([48a2a75](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/48a2a75ba3665d6b401bbc96accc46aa44a9df0a))
* add settings page with company data preferences and account section ([62898a0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/62898a0e62370f8a72a687ead4963b1584833907))

## [0.3.0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.2.0...v0.3.0) (2026-11-04)

### Features

* add AppRouter with protected routes and working login flow ([927b7de](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/927b7dedd0b7e209ed8199329ac6281e97c677e1))
* add AuthContext with mock login and localStorage persistence ([7c77d00](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/7c77d008fc827e73bd2c5ed9a877c6745370c82b))
* add billing page with full-bleed layout and sidebar alignment fix ([cacd8f6](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/cacd8f6bab8200b3905f6568293395e5d9572e5b))
* add user logout dropdown and link new product button to form ([043b21d](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/043b21daf83c448a588b3422df364082f9d3de9c))
* refactor products list to full-bleed layout with search and status filters ([82576d8](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/82576d844281f096ff48a327cfd1c1eef337da9e))

## [0.1.1](https://github.com/axeljimenezdeveloper/mi-saas-frontend/compare/v0.1.0...v0.1.1) (2026-11-04)

### Features

* add Alert component and show validation error alert in product form ([4871888](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/4871888e88d8b8b7ba63878a625c24b64587b719))
* add Avatar component and integrate user badge in products list ([d2bdc24](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/d2bdc246f6c86931f51c68ccd4bb36f7b4f48522))
* add Badge component and integrate status badges in product form ([6348de0](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/6348de0adeab765d99b1edfdffa8cb20e76cef07))
* add Button component with variants sizes and loading state ([bb43700](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/bb437000a053f2e171457ac4b60ecf2c4d640320))
* add Card component and refactor product form to use it ([78ff09e](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/78ff09ecfcfc7e7aebd94be2c7c819a41c9f4ed2))
* add CurrencyInput component and use it for product price field ([fcba773](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/fcba773a5052edbf8d9a68d88c58c0408709b1cb))
* add EmptyState component and use it when products list is empty ([0c3c657](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/0c3c657785edb291a15c6e30fa4b4147296cab59))
* add FormField component and refactor product form to use it ([b3a954b](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/b3a954b741129ee9195f5107d537fd0513eac4a5))
* add FormGroup component and organize product form into sections ([db87152](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/db8715283eeaf0d659aad05647d53cf4a57c1930))
* add Header component with brand search and actions slots ([b021e8a](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/b021e8aeb5c56daaac60677929300aefb4a73d29))
* add Input component with variants sizes icons and error state ([f6a5eed](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/f6a5eedfe4ff276297baf48bd9385d04ca5046e1))
* add MainLayout with responsive sidebar drawer and complete design system ([9ef8dea](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/9ef8dea2ab0d91058c51b829e36379e7181820b7))
* add NewProduct page composing input textarea and button components ([0d60a79](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/0d60a7973042a656bb00b359724ebed21f7dec72))
* add PageContainer layout component and refactor app to use it ([0a28865](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/0a288655e92dda1718e3279cf3b184a070a17b37))
* add PageHeader component and refactor app to use layout components ([f2e1d8d](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/f2e1d8d234f627638b19842e4aeb274ab78a9cfb))
* add product type radio group with conditional stock field ([987b1ca](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/987b1caaa57082fb636dbb882e8fca744b0c6a4c))
* add Sidebar navigation component with collapse mode and badges ([8d6ce54](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/8d6ce544d5913b3f508801567ffa45fc11692e0e))
* add Spinner component with loading state in products list ([a09441f](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/a09441fa42084a660c9032d1c779a1a5c8441239))
* add Switch component and integrate featured toggle in product form ([582d043](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/582d0434f9f7a4217bedc72b9149fcc0d873adf4))
* add Table component and create products list page with stock badges ([3850af2](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/3850af2959db8dc3d224eae11a40c47913b13928))
* add Toast system with provider, hook, and global notifications ([3665eaf](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/3665eaf8abdf058528ab0b1202880e3fcf5fcef7))

### Bug Fixes

* add rtl cleanup between tests and remove empty test placeholders ([85c1fca](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/85c1fca5382b0b8bcc8e8715f33c42138da0b30f))
* make Skeleton visible in light mode by using border-strong background ([51af668](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/51af668090d537150595052926405f6f12100aec))
* restrict checkbox click area to box and increase checkbox group spacing ([c3b736f](https://github.com/axeljimenezdeveloper/mi-saas-frontend/commit/c3b736fa68de8a659095db988b384aeee789e7bb))

# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.
