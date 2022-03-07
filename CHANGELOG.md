# History of notable changes introduced in each version

## v1.1.0 (2022-03-07)
#### New features
  - Add support for multiple instances of the element in a page ([`aa435053`](https://github.com/mahozad/theme-switch/commit/aa435053));
    if there are multiple instances, they are all updated/animated in synchrony when one is toggled ([`8811803e`](https://github.com/mahozad/theme-switch/commit/8811803e))
  - A new custom event called `themeToggle` is triggered whenever the element is toggled. It can be listened to if needed ([`8811803e`](https://github.com/mahozad/theme-switch/commit/8811803e))
#### Bug fixes
- Make the element able to be hidden (if/when `display: none` is applied to the element) ([`32a0f5d4`](https://github.com/mahozad/theme-switch/commit/32a0f5d4))

[All commits since version 1.0.0](https://github.com/mahozad/theme-switch/compare/v1.0.0...v1.1.0)

## v1.0.0 (2022-03-06)
#### Bug fixes
  - Fix the bug with sun rays color not being affected by the `--theme-switch-icon-color` CSS property ([`c90d7874`](https://github.com/mahozad/theme-switch/commit/c90d7874))

[All commits since version 1.0.0-rc](https://github.com/mahozad/theme-switch/compare/v1.0.0-rc...v1.0.0)

## v1.0.0-rc (2022-03-06)
#### Removals
  - Remove the unnecessary Node.js exports ([`cd296e55`](https://github.com/mahozad/theme-switch/commit/cd296e55))

[All commits since version 0.9.2](https://github.com/mahozad/theme-switch/compare/v0.9.2...v1.0.0-rc)

## v0.9.2 (2022-03-04)
#### Bug fixes
  - Wrap the whole code (minified version) in an IIFE to avoid exposing variables and functions in global scope ([`a659c312`](https://github.com/mahozad/theme-switch/commit/a659c312))

[All commits since version 0.9.1](https://github.com/mahozad/theme-switch/compare/v0.9.1...v0.9.2)

## v0.9.1 (2022-03-01)
This version had no changes to the code.

[All commits since version 0.9.0](https://github.com/mahozad/theme-switch/compare/v0.9.0...v0.9.1)

## v0.9.0 (2021-03-01)
This is the first release of the library.


[comment]: <> (NOTE: Be aware that modifying the format of this file might impact the script that makes the body of GitHub releases)


# Template:
## vx.y.z (yyyy-mm-dd)
#### New features
  - new feature 1
#### Updates
  - change 1
#### Bug fixes
  - bug fix 1
#### Deprecations
  - deprecation 1
#### Removals
  - removal 1
#### Other
  - other 1
