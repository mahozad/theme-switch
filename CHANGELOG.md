# History of notable changes introduced in each version

## v1.5.1 (2022-03-30)
#### Updates
  - Change the library main script to the minified version (in hope of fixing the bundlephobia badge) ([`0de6d2df`](https://github.com/mahozad/theme-switch/commit/0de6d2df))

[All commits since version 1.5.0](https://github.com/mahozad/theme-switch/compare/v1.5.0...v1.5.1)

## v1.5.0 (2022-03-30)
#### New features
  - Reflect updates to switches in one page to all other open pages ([`b5586f00`](https://github.com/mahozad/theme-switch/commit/b5586f00))

[All commits since version 1.4.0](https://github.com/mahozad/theme-switch/compare/v1.4.0...v1.5.0)

## v1.4.0 (2022-03-14)
#### Updates
  - Update the animation of the "auto" icon ([`ae30ad8a`](https://github.com/mahozad/theme-switch/commit/ae30ad8a))

[All commits since version 1.3.0](https://github.com/mahozad/theme-switch/compare/v1.3.0...v1.4.0)

## v1.3.0 (2022-03-13)
#### Other
  - Migrate from Babel to [Rollup](https://rollupjs.org/) ([`c6f0f209`](https://github.com/mahozad/theme-switch/commit/c6f0f209), [`7f02c996`](https://github.com/mahozad/theme-switch/commit/7f02c996), and others).
    This results in a smaller minified script.
    Note that from this version on, the files to be used are in *dist/* directory of the library.

[All commits since version 1.2.1](https://github.com/mahozad/theme-switch/compare/v1.2.1...v1.3.0)

## v1.2.1 (2022-03-11)
#### Other
  - Add some code refactorings ([`0a2aab86`](https://github.com/mahozad/theme-switch/commit/0a2aab86), [`3d5573a2`](https://github.com/mahozad/theme-switch/commit/3d5573a2), [`7fc2b960`](https://github.com/mahozad/theme-switch/commit/7fc2b960))

[All commits since version 1.2.0](https://github.com/mahozad/theme-switch/compare/v1.2.0...v1.2.1)

## v1.2.0 (2022-03-08)
#### New features
  - Add previous and new theme name in the custom event ([`a34af81a`](https://github.com/mahozad/theme-switch/commit/a34af81a))
#### Other
  - Allow invalid strings as the value of theme key in storage ([`453bc60b`](https://github.com/mahozad/theme-switch/commit/453bc60b))
  - Add some minor code improvements ([`6d8bc9c9`](https://github.com/mahozad/theme-switch/commit/6d8bc9c9), [`074b33fa`](https://github.com/mahozad/theme-switch/commit/074b33fa), [`8c3082b1`](https://github.com/mahozad/theme-switch/commit/8c3082b1), [`104c2ef2`](https://github.com/mahozad/theme-switch/commit/104c2ef2))

[All commits since version 1.1.0](https://github.com/mahozad/theme-switch/compare/v1.1.0...v1.2.0)

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
