
# sample typescript configuration files

## Sample 1: Basic / Beginner Configuration

```js

{
  // The compilerOptions object contains all TypeScript compiler settings
  // This is something that we need to always create. Something like main() function C language


  "compilerOptions": {
    
    // ============ BASIC OPTIONS ============
    
    // "target": Specifies which JavaScript version to compile to
    // Options: ES3, ES5, ES6/ES2015, ES2016, ES2017, ES2018, ES2019, ES2020, ES2021, ES2022, ESNext
    // ES5 = works in older browsers (IE11)
    // ES6+ = modern browsers only

    "target": "ES6", // aka "Ecma script 2015"
    

    // If you see a project see something more than 2015 then, Don't basics will be same. and Mostly all projects are as per ES6 After that only minor changes are happened

    // target: ESNext means. Compiles Typescript as per latest JavaScript version available. Output depends on ECMAScript standard



    // "module": Specifies the module system for the output code
    // Options: CommonJS, AMD, UMD, System, ES6/ES2015, ES2020, ES2022, ESNext, Node16, NodeNext

    // Mostly used:-
    // CommonJS = require/module.exports (Node.js traditional)
    // ES6 = import/export (modern standard)
    "module": "CommonJS",
    


    // "outDir": Directory where compiled .js files will be placed
    // Without this, .js files appear next to .ts files
    "outDir": "./dist",
    
    
    
    // "rootDir": Root directory of input .ts files
    // Helps maintain folder structure in outDir
    "rootDir": "./src",
    
    // When you create output consider src as root folder. Whatever i have inside src/, Put it's compiled file directly inside in dist.

    // so output becomes:        dist/index.js
    // Without it output becoes: dist/src/index.js   


  


    // "strict": Enables ALL strict type-checking options at once
    // Equivalent to enabling: 
        // strictNullChecks : If 'null' or 'undefined' is assigned to the variable type annoted as "string" or something else then You can not assign it value=null.   
        // strictFunctionTypes : Ensure function parameter types are compatible with passes arguments 
        // strictBindCallApply :  Make the bind,call,apply typeSafe. Perform TypeChecking.

        // strictPropertyInitialization : Class property must be intialize with something, Not only decalare. 
        // noImplicitAny : Prevent the variable/parameter whose type is not defined from automatically becoming "any". If you don't specify the type then automatically type will become "any"
        // noImplicitThis,
        // alwaysStrict : Outpu JavaScript should contain "use strict" mode automatically
        
        // useUnknownInCatchVariables: It makes the errors inside "catch" safer by making it "unknown" type instead of treating it as "any". error can be string, status_code, js_object, etc. 
            
            // ---- unknown type in typescript ---
            /* uknown means type is not decided yet. but not "any", any means any type.  
            // unknown is used when we don't know does the object has / or going to have some property/methods or not. so after assignment we check the object's type and then we use the method  


            let value: unknown = "hello";
            // console.log(value.toUpperCase()); // Error: Object is of type 'unknown'.

            // Type Narrowing : In other words you need to check the type using "typeof" for primitive datatype , or "instanceOf" for the instance of the class. 
            
            let value: unknown = "hello";
            if (typeof value === "string") {
                console.log(value.toUpperCase()); // OK, within this block, TypeScript knows 'value' is a string.
            }

            

            In "unknown" type you must need to use type narrowing accessing any property/method , That is the thing make it different from "any"

            "any" doesn't give any error. Even if the object doesn't own that property/method result during Runtime you will get error.  


            // Simple analogy
            - any : trust the stranger blindly
            - unknown : first verify it's identity then trust it. 


            */

            /*
            // useUnknownInCatchVariable:false
            try {
                throw "Error!"
            } catch (e) {
                console.log(e.message)  // ✅ No error (but runtime crash!)
            }

            // Even if from try block it explicitly always throws error. it not give linting error. But at Runtime program will crash.




            // useUnknownInCatchVariable:true
            */



    "strict": true,

    // by strict:true you don't need to explicitly enable every option.
    // Real world project always keep it true



    
    // "esModuleInterop": Enables compatibility between CommonJS and ES modules
    // Allows: import express from 'express' instead of import * as express from 'express'
    "esModuleInterop": true,


    /*
    // express is internallya CommonJS module

    ## Namespace object 
    A namespace object you get when you import everything from a module. That special object contains all exported memebers of module as properties.
    - Those will be read only, you can not modify the 

    import * as express from "express"

    Here, "express" is the 'namespace object'


    Concepually it is equivalent to:
    const express = require("express")

    Here also you can access everything via express object. 



    --------------------------

    Whereas, `import express from "express"` means import default export from the module

    concetually:
    const express = require("express").default

    ----------------------------

    typescript adds a wrapper when:
    esModuleInterop  : true

    After adding that line, somehow we use 
    "import express from 'express'". and it will work as `import * as express from 'express'`


    > This way it allows to import CommonJS module as they were ES6 module

    */






  



    
    // "skipLibCheck": Skips type checking of declaration files (.d.ts) <- This is where some third party libraries types are decalred. so that typescript can see and validate the datatype when use objects from the third party library
    // Speeds up compilation, recommended for most projects
    "skipLibCheck": true,

    /* 
        That doesn't mean it not do the typechecking. IT still uses the types from ".d.ts" file, give you intellisense.

        It doesn't verify wheather the library's type definations are interanally correct. 
        What happen in large .d.ts file there can be small type issues, OR type conflict with dependency.

        by setting above values true you're ignoring those errors. Otherwise even though your code is fine, you will see Error due to those .d.ts file having trouble.
        
        That doesn't mean typescript doesn't performing type checking.

        It will
        - Make the build process faster
        - Avoid useless third-party type error

        Analogy
        - false: You check every screw inside your machine
        - true: You trust manufacture and only check how you use the machine(your changes)

    */

    
    // "forceConsistentCasingInFileNames": Ensures imports match file name casing(case sentiveness)
    // Prevents bugs when moving between case-sensitive (Linux) and case-insensitive (Windows) systems
    "forceConsistentCasingInFileNames": true

    // Linux is case sensitive with file names. where windows is not. 


  },
  
  // "include": Array of glob patterns specifying which files to compile
  // **/* means all files in all subdirectories
  "include": [
    "src/**/*"
  ],
    // when you run "tsc" in terminal it will execute all typescript(.ts) file inside the src/ folder
    // Without that it will consider the "**/*" means it may get test files, configuration files and try to compile them.


     
    // When you run the "tsc":-
    // 1. It first check : "files": ["src/index.ts"]    It mentions exact files
    // 2. Then it checks the "include"
    // 3. Then if that found then fallback to the "**/*"

    


  // "exclude": Array of glob patterns specifying which files to ignore
  // node_modules is excluded by default, but explicit is clearer
  "exclude": [
    "node_modules",
    "dist"
  ]
}


```

```bash
Compilation Flow:
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  index.ts   │───▶│   tsc        │───▶│  index.js   │
│  (ES6+ TS)  │    │  compiler    │    │  (ES6 JS)   │
└─────────────┘    └──────────────┘    └─────────────┘
```

## Sample 2 : Typescript in Node.js backend configuration


```js

{
  "compilerOptions": {
    
    // ============ ENVIRONMENT OPTIONS ============
    
    // "target": ES2020 for Node.js 14+, ES2021 for Node.js 16+, ES2022 for Node.js 18+
    // Modern Node.js supports recent ECMAScript features natively
    "target": "ES2022",
    
    // "module": NodeNext for modern Node.js with ES modules support
    // Handles both .mjs (ES modules) and .cjs (CommonJS) properly
    "module": "NodeNext",
    
    // "moduleResolution": How TypeScript looks up/resolves imports


    // "NodeNext" = modern Node.js resolution (supports package.json "exports" field)
    // "Node" = traditional Node.js resolution
    // "Bundler" = for bundlers like webpack/vite
    "moduleResolution": "NodeNext",




    // Typescript follow how node.js resolves the ECMAScript modules(ESM)
    // TypeScript correctly chooses the right one. Wheather it is CommonJS or ESM no need to specify the file's extesion(js,cjs,mjs)

    /*

   package.json "exports" fields are like __init__.py in python, Pakage level exports.
   
    Inside package.json:-
    {
      "name": "your-package",
      "exports": {
          ".": "./dist/index.js",          // Main entry point
          "./feature": "./dist/feature.js" // Named export
        }
    }

    Using imports:
    import main from 'your-package';          // Resolves to ./dist/index.js
    import feature from 'your-package/feature'; // Resolves to ./dist/feature.js

    Conditional exports:-
    {
      "name": "your-package",
      "exports": {
        ".": {
          "require": "./dist/cjs/index.js",  // CommonJS entry
          "import": "./dist/esm/index.js"   // ESM entry
        }
      }
    }

    Node.js will automatically choose the correct entry point based on wheather the user uses "require()" or "import"

    -----

    If a package defines an "exports" field in package.json, TypeScript will only "allow imports that match the exported entry points". This prevent non-exported files from being imported. 

    Means,
    That typescript settings says:  you can only import that exports fields which are defined in package.json. Anything else will not allowed and give error. 


    ----


    Also another thing is when you use ESM modules you need to use the file extension(.js,.mjs,.cjs) in import statement.
    otherwise it will give error 

    // ✅ Correct (ESM)
    import { foo } from './module.js';
    import { bar } from '../utils/index.js';

    // ❌ Incorrect (missing extension)
    import { foo } from './module'; // Error: Cannot find module.



    However, this thing is optional if you're using "type": "commonjs". Node.js will atutomaticallly resolves that.

    // ✅ Works (CommonJS)
    const { foo } = require('./module');



    -----------------------------


    Also the directiory import requires to add "index.js" at the end of the path.
    
    // ❌ Incorrect (unless "exports" defines "./utils")
    import { utils } from './utils'; // Error unless configured

    // ✅ Correct
    import { utils } from './utils/index.js';


    > RECAP:
    - If your package.json has "type": "module", all .js files are treated as ESM.
    - If "type": "commonjs", .js files are treated as CommonJS (extensions optional)


    */



    
    // "lib": Specifies which built-in API declarations to include
    // ES2022 = all ES2022 features (Array.at(), Object.hasOwn(), etc.)
    // Without this, TypeScript uses default lib based on target
    "lib": ["ES2022"],

    // target => control what JS code is generated
    // lib => controls what built-in APIs(methods/propeties) Typescript believes exist



    // if you're builing for browser
    // "lib": ["DOM", "ES2022"]
   
    // DOM -> adds window,documents,etc. 



    /*

    ------------ Top level await ------------------------

    That means you can use the "await" outside any function, directly at top level.
    
    In CommonJS you had to wrap the "await" inside "async" function.


    The top-level await works only if:
    1. You're using ESM
    2. Target set to: ES2022 / ESNext
    3. Node v16+

    Top-level await will pause the execution of the a module file. 


    */

    
    // ============ OUTPUT OPTIONS ============
    
    "outDir": "./dist",
    "rootDir": "./src",
    
    // "declaration": Generates .d.ts declaration files alongside .js files
    // Useful if your code will going be imported by other TypeScript projects
    "declaration": true,
    
    // "declarationMap": Creates sourcemaps for .d.ts files
    // Allows "Go to Definition" to jump to original .ts source
    "declarationMap": true,
    // .d.ts  file is declarative file, it only has declaration of function not it's implementation.
    // You never share your actual typescript code, if you're creating your own package. You always share the .d.ts file. For abstraction and user can not know your actual typescript code. 

    // You need to install that `npmm install @types/express` for a module, OR in nowadays modules comes with their .d.ts files.
    // DefinitelyTyped is a large open-source repository that provides community-maintained type definitions for JavaScript libraries used with the TypeScript language
    // Package namespace: @types/



    // "sourceMap": Generates .js.map files for debugging
    // Allows debuggers to show original TypeScript code
    "sourceMap": true,
    
    // When inde.js gives error that time you don't know where to make changes in typescript file. because you wrote typescript not javascript. so, index.js.map is the file thta tells: "Line 5 in index.js actually came from line 8 in src/index.ts"



    // ============ STRICT OPTIONS ============
    
    "strict": true,
    
    // "noImplicitReturns": Error when function doesn't return in all code paths
    // function getValue(x: boolean): number {
    //   if (x) return 1;
    //   // Error: Not all code paths return a value
    // }
    "noImplicitReturns": true,
    
    /*
    function getNumber(x: boolean): number {
    if (x) {
        return 10;
    }
    // nothing returned here
    }
    ⚠ Problem:If x is false, the function returns undefined — but the return type says number.
    
    // Typescipt instellisense shows error
    */


    // "noFallthroughCasesInSwitch": Error for switch case fall-through without break
    // switch(x) {
    //   case 1:
    //     doSomething();
    //     // Error: Fallthrough case in switch
    //   case 2:
    //     doOther();
    // }
    "noFallthroughCasesInSwitch": true,

    // If case 1 -> true then case 2 also execute since there is no break. When you avoid break; typescript intellisense gives error
    
    // "noUncheckedIndexedAccess": makes array and object index access safer by assuming the value might be undefined.
    // const arr = [1, 2, 3];
    // const x = arr[5]; // value can be "number" or "undefined". x becomes undefined 
    // vallue.toFixed(2);  //  here typescript give error. becaus it can be undefined. You need to check it is not undefeind using if satatement "value !== undefined" and then use property/method over it.
    "noUncheckedIndexedAccess": true,


    // undefined means 'not initialized'
    
    // ============ INTEROP OPTIONS ============
    
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    // "resolveJsonModule": Allows importing .json files
    // import config from './config.json';
    "resolveJsonModule": true,
    
    // "isolatedModules": Ensures each file can be "transpiled" independently
    // Required for tools like esbuild, swc that compile file-by-file
    // Prevents features that require whole-program analysis
    "isolatedModules": true
  },
  
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}

```


## Sample 3: React Frontend configuration

```js

{
  "compilerOptions": {
    
    // ============ REACT-SPECIFIC OPTIONS ============
    
    // "target": ES6 for modern browser support with good compatibility
    "target": "ES6",
    
    // "lib": Specifies which APIs are available at runtime.

    // 1. DOM = browser APIs (document, window, HTMLElement, etc.)
    // 2. DOM.Iterable = forEach on NodeList, HTMLCollection, etc.
    // 3. ES6 = modern JavaScript features

    "lib": ["DOM", "DOM.Iterable", "ES6"],
    



    // "jsx": How to transform JSX syntax
    // "preserve" = keep JSX as-is, let bundler handle (<div /> → <div />)
    // "react" = transform element to React.createElement (Eg. <div /> → React.createElement("div")) // HTML --> React
    // "react-jsx" = transform to _jsx (React 17+ automatic runtime) (Eg. <div /> → _jsx("div"))
    // "react-jsxdev" = same as react-jsx but with debug info (React 17+ automatic runtime)
    "jsx": "react-jsx",
    
    // "module": ESNext for modern bundlers (Vite, webpack, etc.)
    // Bundlers understand ES modules and can tree-shake unused code
    "module": "ESNext",
    
    // "moduleResolution": "Bundler" is ideal for Vite, webpack, etc.
    // Understands package.json "exports", doesn't require file extensions
    "moduleResolution": "Bundler",
    
    /*
    TypeScript relaxes the strict ESM rules and behaves more like popular bundlers (e.g., Webpack, Vite, or esbuild).

    How it is different from NodeNext
    - No file extensions are required. You can omit the extension in import statements even for the ESM
    - mimic how bundlers resolve module
    - ignore "type" : "module". Even if your package.json has "type": "module", TypeScript won't enforce strict ESM rules.
    - still repect "exports" field in package.json but may not enforce the it as strictly as "NodeNext"

    */



    // ============ PATH CONFIGURATION ============
    
    // "baseUrl": set the root direciory to the current directiory(where the tsconfig.json is located). You can use the absolute imports starting from this root.  (very useful during production)

    // Allows: import Button from 'components/Button'
    // Instead of: import Button from '../../components/Button'
    "baseUrl": ".",
    
    // "paths": Path aliases for cleaner imports
    // Maps alias patterns to actual file paths
    "paths": {
      // "@/*" maps to "./src/*"
      // import Button from '@/components/Button' → ./src/components/Button
      "@/*": ["src/*"],
      
      // "@components/*" maps to "./src/components/*"
      // import Button from '@components/Button' → ./src/components/Button
      "@components/*": ["src/components/*"],
      
      // "@hooks/*" maps to "./src/hooks/*"
      "@hooks/*": ["src/hooks/*"],
      
      // "@utils/*" maps to "./src/utils/*"
      "@utils/*": ["src/utils/*"]
    },
    
    // ============ STRICT OPTIONS ============
    
    "strict": true,
    // THis enables Typescript strictest type-checking options, helping to catch potential errors with robust code. 
    
    // "noUnusedLocals": Error on unused local variables
    // const x = 5; // Error if x is never used
    "noUnusedLocals": true,
    
    // "noUnusedParameters": Error on unused function parameters
    // Prefix with _ to ignore: function foo(_unused: number) {}
    "noUnusedParameters": true,



    
    // ============ COMPATIBILITY OPTIONS ============
    
    // "allowJs": Allows importing .js files in TypeScript
    // Useful when migrating or using JS libraries without types
    "allowJs": true,
    
    // "checkJs": Enables type checking in .js files
    // Uses JSDoc comments for type information
    "checkJs": false, // (default)


    // By default the type checking is enable iside the Typescript file only. and TypeScript ignore .js/.jsx files for checking type errors.  
    
    // "allowSyntheticDefaultImports": Allows you to import the module that don't explicitly export a default value.
    // used with "esModuleInterop"
    // esModuleInterop : simplifies interportability with commonjs and es modules. 

    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,

    
    "skipLibCheck": true,
    // skip type chcking of declaration file(.d.ts). This way avoid unexpected error.

    "forceConsistentCasingInFileNames": true,
    // Ensures consistent casing in file names. The fine name in the import match the case of actual file name.

    "resolveJsonModule": true, // Allow to import json directly

    // otherwise you need to do this 
    // import data from './data.json' assert { type: 'json' } 
    // asserr : If condition true gives nothing, if false gives error
   

    "isolatedModules": true,
    // Each file will be compiled independently. This is required for traspilation-only(no bundler) tool e.g. Babel, etc.
    
    // "noEmit": Don't generate output files
    // Let the bundler (Vite/webpack) handle compilation
    // TypeScript only does type checking
    "noEmit": true
  },
  
  "include": ["src"],
  
  // "references": For project references in monorepos
  // Points to other tsconfig files this project depends on
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}


```


## Sample 4: NPM library/package configuration

```json
{
  "compilerOptions": {
    
    // ============ OUTPUT TARGETS ============
    
    // "target": ES2018 for good modern support while maintaining compatibility
    // Includes async/await, rest/spread, for-await-of
    "target": "ES2018",
    
    // "module": ES2020 supports dynamic import() and import.meta
    // Best for libraries - consumers can use any module system
    "module": "ES2020",
    
    // "lib": Include only what your library actually needs
    "lib": ["ES2018", "ES2019", "ES2020"],
    
    // ============ DECLARATION FILES ============
    
    // "declaration": ESSENTIAL for libraries
    // Generates .d.ts files so TypeScript users get type information
    "declaration": true,
    
    // "declarationDir": Separate directory for declaration files
    // Keeps types organized, useful for package.json "types" field
    "declarationDir": "./dist/types",
    
    // "emitDeclarationOnly": Only output .d.ts files, no .js
    // Use when bundler (rollup/esbuild) handles JS compilation
    // Set to false if you want tsc to output both
    "emitDeclarationOnly": false,
    
    // "declarationMap": Enables "Go to Definition" to show .ts source
    "declarationMap": true,
    
    // ============ OUTPUT CONFIGURATION ============
    
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    
    // "inlineSources": Includes source code in sourcemaps
    // Allows debugging without original .ts files
    "inlineSources": true,
    
    // ============ STRICT OPTIONS (Extra strict for libraries) ============
    
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // "exactOptionalPropertyTypes": Differentiates between undefined and missing
    // interface Config { name?: string }
    // { name: undefined } ← Error! Must be { } (empty) or { name: "value" }
    "exactOptionalPropertyTypes": true,

    /* 

      ? : THis makes a property optional.

      Without "exactOptionalPropertyTypes": true
      age?: number; // Typescript see, Age can be number or undefined `number | undefined`
      
      
      With "exactOptionalPropertyTypes": true
      After this setting, Only the propery's delcared type is allowed. Undefiend is not allowed. 

      // RECAP: undefined means "not initialized"
      age?: number; // TypeScript treats this as `number` (not `number | undefined`)



      // Example:
      interface User {
        name: string;
        age?: number; // Only `number` (not `number | undefined`)
      }

      const user: User = { name: "Alice", age: undefined }; // ❌ Error



      If you need you can explicitly declare it:
      interface User {
        name: string;
        age?: number | undefined; // Explicitly allow `undefined`
      }



    */

    
    // "noPropertyAccessFromIndexSignature": Forces bracket notation for dynamic keys
    // interface Dict { [key: string]: string }
    // dict.foo ← Error! Use dict["foo"]
    "noPropertyAccessFromIndexSignature": true,
    
    // ============ COMPATIBILITY ============
    
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    
    // "moduleResolution": Node for widest compatibility
    "moduleResolution": "Node",
    
    // "stripInternal": Removes @internal JSDoc declarations from output
    // /** @internal */ export function _privateHelper() {} ← Not in .d.ts
    "stripInternal": true,

    // This is used to remove @internal annotations from generated declaration files (.d.ts).
   // This is not part of typescript language but looks like it is. Eg. api-extractor (by Microsoft), tsdoc, typedoc


    /*
      @internal is a JSDoc tag used to mark APIs as "internal" (not meant for public use).
      It is not part of Typescript language.

      @internal is not added one of these ways:
      1. manually by developers
      2. Generated by tools(Build scripts, tsdoc, etc.)

    */


    
    // "composite": Enables project references feature
    // Required for incremental builds in monorepos
    "composite": true,

    // Allow you to divide your project into smaller sub-projects. Each sub-project can be built independently.
    // It requires "incremental: true". Allow other projet to depends on this project's output.(.d.ts files)

  // In a monorepo or multi-project setup, you can reference this project from another tsconfig.json



    
    // "incremental": Saves compilation info for faster subsequent builds
    // Creates dist/.tsbuildinfo file. Her eit save the information of the last build. It stores which files are compiled, Their dependencies, etc,
    // After first builds, Future build use this file to skip unchanged files. 
    "incremental": true
  },
  
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/__tests__/**"
  ]
}
```

> Git Topic
- monorepo: Entire project is in a single repository.
- polyrepo or multi-repo: Each library, service lives in its own repository. as a separate git repo.

```bash

┌──────────────────────────────────────────────────────────────┐
│                    LIBRARY OUTPUT STRUCTURE                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📁 dist/                                                    │
│  ├── index.js              ← CommonJS output (require)       │
│  ├── index.js.map          ← Sourcemap for debugging         │
│  ├── index.mjs             ← ES Module output (import)       │
│  └── 📁 types/                                               │
│      ├── index.d.ts        ← Type declarations               │
│      └── index.d.ts.map    ← Type sourcemap                  │
│                                                              │
│  Consumer Usage:                                             │
│  ┌────────────────────────────────────────┐                  │
│  │ // TypeScript/ES Modules               │                  │
│  │ import { helper } from 'my-library';   │                  │
│  │ // Gets types from dist/types/         │                  │
│  │                                        │                  │
│  │ // Node.js CommonJS                    │                  │
│  │ const { helper } = require('my-lib');  │                  │
│  └────────────────────────────────────────┘                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Sample 5 : Strict Enterprise configuration

```json

{
  "compilerOptions": {
    
    // ============ ENVIRONMENT ============
    
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    
    // ============ OUTPUT ============
    
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,  // create .d.ts files
    "declarationMap": true,
    "sourceMap": true,
    
    // ============ STRICT TYPE CHECKING (ALL OPTIONS EXPLAINED) ============
    
    // Master switch - enables all strict options below
    "strict": true,
    
    // --- Options included in "strict": true ---
    
    // "noImplicitAny": Error when type is implicitly 'any'
    // function greet(name) {} ← Error! 'name' implicitly has 'any' type
    // Fix: function greet(name: string) {}
    "noImplicitAny": true,
    
    // "strictNullChecks": null/undefined are distinct types
    // const x: string = null; ← Error!
    // const x: string | null = null; ← OK
    "strictNullChecks": true,
    
    // "strictFunctionTypes": Stricter function type checking (contravariance)
    // Prevents unsound function assignments
    "strictFunctionTypes": true,

    /*
    
      // Without strictFunctionTypes (unsafe!)

      interface Animal {
        name: string;
      }

      interface Dog extends Animal {
        breed: string;
      }

      // Function that works with any Animal
      let feedAnimal: (animal: Animal) => void;

      // Function that ONLY works with Dogs
      let feedDog = (dog: Dog) => {
        console.log(`Feeding ${dog.breed}`);
        //                      ^^^^^ needs 'breed' property
      };

      // 🚨 WITHOUT strictFunctionTypes: This is ALLOWED (but dangerous!)
      feedAnimal = feedDog;

      // Now what happens?
      let cat: Animal = { name: "Whiskers" }; // Cat has no 'breed'
      feedAnimal(cat); // 💥 RUNTIME ERROR! cat.breed is undefined

    */
    // Without "strictFunctionTypes": true, the program can be bug-prone.



    
    // "strictBindCallApply": Type check bind(), call(), apply()
    // function greet(x: string) {}
    // greet.call(null, 42); ← Error! 42 is not string
    "strictBindCallApply": true,
    
    // "strictPropertyInitialization": Class properties must be initialized
    // class User {
    //   name: string; ← Error! Not initialized
    //   age: string = ""; ← OK
    //   id!: number; ← OK with ! (definite assignment assertion)
    // }
    "strictPropertyInitialization": true,
    
    // "noImplicitThis": Error when 'this' has implicit 'any' type
    // const obj = {
    //   name: "test",
    //   greet() {
    //     setTimeout(function() {
    //       console.log(this.name); ← Error! 'this' is any
    //     }, 100);
    //   }
    // }
    "noImplicitThis": true,
    
    // "useUnknownInCatchVariables": catch variable is 'unknown' not 'any'
    // try {} catch (e) {
    //   e.message ← Error! 'e' is unknown
    //   if (e instanceof Error) e.message ← OK
    //   e.message ← now it work
    // }
    "useUnknownInCatchVariables": true,
    
    // "alwaysStrict": Emit "use strict" in all output files
    "alwaysStrict": true,
    
    // --- Additional strict options NOT in "strict": true ---
    
    // "noImplicitReturns": All code paths must return a value
    "noImplicitReturns": true,
    
    // "noFallthroughCasesInSwitch": No switch case fall-through
    "noFallthroughCasesInSwitch": true,
    
    // "noUncheckedIndexedAccess": Array index returns T | undefined
    "noUncheckedIndexedAccess": true,
    
    // "noImplicitOverride": Subclass methods must use 'override' keyword
    // class Animal { speak() {} }
    // class Dog extends Animal {
    //   override speak() {} ← Must have 'override'
    // }
    "noImplicitOverride": true,
    // You have to mention that you are overriding the method.


    /*
    
      undefined vs unknown

      udefined is value assigned to variable. But is actully a symbol that represents variable is not initialized. 

      unknown is a type that represents a variable can have any value.
    
    
    
    
    */




    
    // "exactOptionalPropertyTypes": Optional property ≠ undefined
    "exactOptionalPropertyTypes": true,
    
    // "noPropertyAccessFromIndexSignature": Use brackets for index signatures. Use object[key]
    "noPropertyAccessFromIndexSignature": true,
    
    // ============ CODE QUALITY ============
    
    // "noUnusedLocals": Error on unused local variables
    "noUnusedLocals": true,
    
    // "noUnusedParameters": Error on unused function parameters
    "noUnusedParameters": true,
    
    // "allowUnusedLabels": Error on unused labels
    // loop1: for (;;) {} ← Error if label not used
    "allowUnusedLabels": false,
    


    /*

    You can use label on the loop and use the break and continue keyword.

    outerLoop: for (let i = 0; i < 3; i++) {
      innerLoop: for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
          break outerLoop; // Exits the outer loop entirely
        }
        console.log(`i=${i}, j=${j}`);
      }
    }

    With this settings typescript will give error if the label is not used 


    */


    // "allowUnreachableCode": Error on unreachable code
    // function test() {
    //   return;
    //   console.log("unreachable"); ← Error!
    // }
    "allowUnreachableCode": false,
    
    // ============ INTEROP ============
    
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    // "verbatimModuleSyntax": Enforces explicit type imports
    // import type { User } from './types'; ← For types only
    // import { createUser } from './types'; ← For values
    "verbatimModuleSyntax": true,

    // You need to import "module" and "module's type" separately
    
    // ============ BUILD OPTIMIZATION ============
    
    "composite": true,
    "incremental": true,
    
    // "tsBuildInfoFile": Custom location for build cache
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  
  // "watchOptions": Configuration for file watching in development
  "watchOptions": {
    // "watchFile": Strategy for watching individual files
    // "useFsEvents" = use native file system events (most efficient)
    "watchFile": "useFsEvents",
    
    // "watchDirectory": Strategy for watching directories
    "watchDirectory": "useFsEvents",
    
    // "fallbackPolling": Polling strategy when fs events unavailable
    "fallbackPolling": "dynamicPriority",
    
    // "synchronousWatchDirectory": Faster but uses more CPU
    "synchronousWatchDirectory": true
  }
}
```

- `tsc --watch` or `tsc -w`. This tells tsc to monitor your files for changes and automatically recompile them whenever you save a file.

- `tsc -w --preserveWatchOutput`: Prevent compiler from clearing from clearing the screen between rebuilds. make it easy to see logs.
- `tsc -w --onSuccess "node dist/server.js"` Run the command after successful compilation (Usecase eg. : Restart server )
- `tsc -w -p path/to/your/tsconfig.json` : Specify the path to your tsconfig.json file 



Integrating with tools like `nodemon` or `ts-node-dev` for smooth development experience.
- `npx ts-node-dev --respawn --transpile-only src/index.ts`

Builders like vite/webpack has their own watch mode still you can use `tsc -w` for type checking.