# ts-mixin

Exploration on mixin patterns in TypeScript.

## Installation

```sh
git clone https://github.com/moreirathomas/ts-mixin.git
cd ts-mixin
npm install
```

## Development

```sh
npm test
```

## Definition

A **mixin** is a function that:

1. takes a constructor,
2. declares a class that extends that constructor,
3. adds members to that new class, and
4. returns the class itself.
