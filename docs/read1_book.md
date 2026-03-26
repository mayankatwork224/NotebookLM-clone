# Overview

From left panel you can select sources
- google drive 
- link : website , cyoutube
- pasted text


Chat section
- It has memory. Remember previous questions(Remember your name)


From right panel. We can generate
- summary
- guide
- brief in doc
- faq
- audio
- mind map


Paymane integration


Authentication we use Google

---------------------------------------------------


## Prequsites

- React 
- Node/ Express Basics


- Vector databases
- Embedding models 
- RAG(Retrival Augamented Generation) from scratch
- Lanchain 
- Payment with stripe
- Background job
- Google Auth
- AI Agent with memory
- AI Agent that uses Tools 
- Prompt engineering


## Tech Stack

MERN Stack
- MongoDB
- Expressjs
- React
- Nodejs

Designing
- shadcn UI
- Tailwind CSS



Model providers
- ChatFireWork( no longer free Paid)
- ChatCerebra(free)

- ChatTogether (paid)


--------------------------------------------------------------

# Chapter 1 : Setup and Start Project 


## Run the commands


Node version : 22.x

```bash  
npm i -g typescript             : Install typescript globally

# you can check the verson of Typescript using
tsc -v

npm init -y

npm i express
npm i multer   # Used for file upload 
npm i dotenv
npm i -D nodemon typescript @types/node  ts-node
```

Run the command `npm run build`, To build our project.


----



`-D` is alias for `--save-dev`: It will add your package inside the `devDependencies` section of your `package.json` file
- Packages Installed this way were instended only for local developmenent and testing (like Nodemon) and will not included when application deployed to producion.

------------------------------------------------------------------------

- `@type/node`: It is package that provide type defination for buit-in node.js API like `fs`, `path`, `http`. Since node.js is written in Javascript. Typescript doesn't know what a fucntion expect or return. 
    - That package tells typescript things like `process.env` , `__dirname` exist so you don't get "cannot find name" errors

    - The `@` and `/` indicate **scoped package** that acts as a namespace to group related packages together.
        - @scope-name/package-name :  The scope name aka symbol. It is uniqe in the world of npm. Generally scope name = publisher name (in your case "mayank")
        - **Namespace** is like a folder or last name(same family). A containt that keep names organized; so that they don't crash into each other. The same analogy: One folder can not have two files with same name. Without namespace only one person in the world of npm could own the name `utils`. With namesapce(scope) thousands of peoeple can have their own `utils`. (google's utils, microsoft's utils, Your own utils, etc...)

----------------------------------------------------------------------------

- `ts-node`(Execution engine) : Typescript execution engine allows you to run Typescript files directly without manually compiling the to javascript first. 
    - It "hooks"(fit) into the node.js and trasforms Typescript code into javascript on the fly(JIT) right before execution.    
        - **hook means** jump into the middle of node and act as traslator. Everytime node tries to read `.ts` file `ts-node` quickly traslate it to into Javascript on the fly and feed that javascript back to Node.js 

        ```js
        ts-node app.ts
        ```


        - The Node.js version 22.6+. Now has built-in traslator using method called **type stripping** This means you don't need to install extra `ts-node` tool anymore. Node can just strip away the typescript parts itsefd and run the code as normal javascript.

        ```js
        node --experimental-strip-types hello.ts
        ```
        > What Node does: It sees colon(:) string and removes it, then runs the remaining JavaScript.
        
        In, Node 23.6.0+
        This feature enbaled by deafault
        ```js
        node hello.ts
        ```



    - instead of running `node server.js` you can run `npx ts-nodeserver.ts`
    - It is primarily used for development and testing. For production it is still recommeded to compile your code into standard javascript using `tsc` for better performance. 


Here since yu gave not installed `ts-node` globally. and you installed it as development dependency `npm install --save-dev ts-node`. You can not run the **ts-node index.ts** directly in the command line. 
By default the command line tries to find it in gloabl `node_modules/` folder Either you should download
- Either you should download it globally OR `npx ts-node index.ts` OR `npm run <script-name>`. sciprt-name is mentioned inside the package.json, it can access local workspace's *node_modules/.bin*
- When you run `npx ts-node index.ts`. First it look in local workspace `./node_modules/.bin`, if not found -> check global `./node_modules/.bin`. If still not found download the temporary copy and store it in npm cache.

Usually, npm cache location:
- Linux: `~/.npm/_npx/`
- Windows: `C:\Users\<your-username>\AppData\Local\npm-cache\`

You can get the exact path using: `npm config get cache`



> Node js is runtime of javascript , means Nodei s is the environment where we can run the javascript code outside the browser. 


`tsc`(TypeScript Compiler): It compiles typescript to javascript file. Creates `.js` files on disk. You run the outout JS files with node.js. *Used for production builds*.

`ts-node` compiles and run TypeScript directly. No `.js` files creates (compile in memory - RAM). Like running a `.ts` file instatntly. *Used for development*.


> visit:  src/index.ts

-------------------------------------------------------------------------------------------

## Install langchain and langgraph


`ChatTogetherAI` it is API offers 50+ open source models
langchain itself mention that : https://docs.langchain.com/oss/javascript/integrations/llms/together  (Now paid)

Too see all proders : https://docs.langchain.com/oss/javascript/integrations/providers/all_providers


> Firework
- tempmail: woceli3554@dnsclick.com
- password: salatuvalAtuboy1234@3456

(Firework no longer offer completely free LLM models, It charges some amount at lest $0.1 )  

profile > settings > api_key

----------


`npm install @langchain/community --legacy-peer-deps`

- **--legacy-peer-deps** is flag you pass to `npm install` to tell to bahave more like old npm v4-v6 did when handling peer dependencies

    - npm 6 and earlier : peer dependency give just warnings. npm install anyway even if versions don't match.
    - npm7 and 7+ peer deps becomes errors by default. npm refuse to install if any dependency conflict exist. 
    - In fast-moving ecosystem like LangChain, React, Next.js, etc. They using narrow version ranges from 1-2 years 
    - so `--legecy-peer-deps` basically says: "Please go back to the old, more forgving behaviour: treat peer dependency mismatches as warnings instead of hard erros, and let me install anyway"

-----------------------------------

- `dependencies`: packages your code needs to run (production time)
- `devDependencies`: packages only needed to run development (testing, linting, building, etcl)
- `peerDepedency`: Package(eg. React) your library(eg. shadcn) expects the consumer(your app) already provide the exact/similar version.
    - This way npm won't install React again when you install shadcn - It expects the app already has React 18. this prevents duplicate React copies. 
    - shadcn says: "hey consumer(you React app) you need to give me this exact/simiar version of React - don't make me bundle by installing React's another copy along with me!". That it says by mentionin react inside the peer dependencies.

        ```js
        {
        "peerDependencies": {
            "react": "^18.0.0",
            "react-dom": "^18.0.0"
        },
        "devDependencies": {
            "react": "^18.2.0",          // ← you still need React to develop & test your components locally
            "@types/react": "^18.2.0",
            "vite": "^5.0.0",
            "typescript": "^5.0.0"
        }
        }
        ```

------------------------------------------

`overrides` in package.json. overrides gives you control over dependency tree for any dependency or trasitive dependency. When automatic resolution pick a wrong version. 
1. npm install builds full dependency tree
2. it normally respect what each package declared in their **peerDependencies** or **devDependencies** 
3. When npm sees overrides entry in your `root package.json` , It rewrite the dependency tree with maching package everywhere in the tree.

```json
// Force a single package to a fixed version everywhere
{
  "overrides": {
    "dotenv": "^17.2.3"
  }
}
// → Every time any package in your tree asks for dotenv (direct or nested), npm installs ^17.2.3 instead.



// more Powerful
// override only when a certain parent package "@browserbasehq/stagehand"" depends on dotenv
{
  "overrides": {
    "@browserbasehq/stagehand": {
      "dotenv": "^17.2.3"
    }
  }
}
// → When resolving dependencies of @browserbasehq/stagehand, force dotenv to ^17.2.3.
// → Other packages that ask for dotenv keep their original requested version.

// Simple explantioin simple way one statement
// @browserbasehq/stagehand depends on dotenv v16 but npm force it to use dotenv v17 
// because most of ther packages uses v17 or v17 is already installed

```

`overrides` only works in root's package.json

After adding changes always run
```bash
rm -rf node_modules package-lock.json
npm install
```

so that newly required version's packages can be installed.



-----------------------------------------------------------

`tsx` is command line tool CLI for running typescript directly from Node.js. Without need to compile it to javascript first. (like you do with tsc)

tsx is currently(2026) is one of the easiest, fastest, and most developer friendly way to run Typescript scripts and small servers direcly in node.js that's why it becomes goto recommenddation for many developers who usse `ts-node`

code example 
```bash

# tsx
npx tsx src/index2.ts

# ts-node
npx ts-node-esm src/index2.ts

```


> NOTE:
- `ts-node` Run the typescript using CommonJS. works when your project does **NOT use "type":"module"**. Use `requires()` internally.
- `ts-node-esm` : Run Typescript using ES Modules (ESM). Needed when your **package.json has "type":"module"**. Uses `import/export`

<br>

`tsx` is not downloaded by default with the installation of tsc.

tsc is TypeScript Compiler. It converts .ts --> .js . Does full type-checking. Create output file. Used for production. Used to build project. 

tsx i TypeScript eXecutor(runner). Run .ts file. No separate build step [no any intermidiatory .js file is created]. Faster for scripts. Uses lightweight taspilation(esbuild). It is used to Run the file, Faster than tsc

<br>

The `ts-node` and `tsx` Both do the same work. Run typescript files directly without creating a `.js`.
- ts-node is old tool, heavy memory usage, slow.
- `tsx` is new tool, very fast, lightweight. 

> This is how tsx win the battle
- It is faster than ts-node
- excellent support with tsconfig.json
- memory usage ~35 mb, whereas ts-node use ~125 mb
- installation size is also less compared to ts-node
- beginner friendly. zero configuration required just install and start using it. 



-------------------------------------------------------

After `import 'dotenv/config';` what happen

1. dotenv reads your **.env** file
2. It parses the key-value pairs
3. It add them to `process.env`. process.env is **built-in global object in Node.js**

It does this so that, below functionality can works
```js
console.log(process.env.DATABASE_URL); // works
```

`process` is object that is has information about process(.js file running process). It has **property / key** `env` and it's value will be another JS object(key-vlaue pairs). That contians information basically your environment variable.

This is not a global variable that you declared by yourself 
```js
const MY_KEY = "f-ssdjladna....."
```
You can  not do `console.log(MY_KEY)`. You must write `process.env.MY_KEY`



In Widows Operating system, This thing `console.log(process.env)` when you run in Node.js script. It shows merged view that includes both : *System env variables*(for all users) + *User env variables*(for currently logged-in user)

It doesn't show only one of them, It shows both. It starting with all system variables, Then overwriting as per user variables(if repeated.)

For Windows OS, Node.js uses `;` to separate two paths, Whereas In Linux it uses ` 

> In Github Codespace type **lsb_release -a** to know what Linux distribution it is using.

-------------------------------

The popular Global variables  JS have and Node.js have

1. JS have (Browser / Client-side JavaScript)
- `window` : A global object
- `document` : DOM root
- `console` : logging/debugging
- `fetch` : HTTP request API
- `setTimeout` : scheduling function 
- `alert` / prompt / confirm : Classic popup dialogs
- `localStorage`/sessionStorage : Browser storage
- `navigator` : Browser & device infornation
- `location`: Current URL ( used to implement React functionality [Like functionality dynamically change the browser URL without reloading the page] from scratch )
- `history` : browser history
- Buit-in JS objects : Math, Date, JSON, Array, ... (same in Node.js)


> These all things comes from broswer, Not your JS .js file contains these functioinalities. 

In browser script( non-module `<script>` tag, type != module. It's CommonJS). declaring `var x = 10` or `x=10` will makes it property of `window` -> `window.x`


2. Node.js (server-side javascript)
In Node.js, the global object is called `global` or `globalThis` (modern).

The top-level `var / let / const` do NOT become global by default - they say module scoped. (This is biggest difference)

- process : Current Node.js process information & control (An Object)
- console : mostly identical to browser's console object
- __dirname : directiory of current file [A property]
- __filename : full path + file name of current file
- module: Current module information (ESM , CommonJS)
- require : commonJS module loader [Available globally] [-- A function]
- Buffer: Binarydata handling
- setTimeout / setInterval / setImmediate : Same as browser + setImmediate
- queueMicrotask : modern scheduling
- URL / `URLSearchParams` : URL parsing and manipulation


To create a real global variable in node.js you must do `global.myvar = 123;`


> NOTE:

Value of `this` in:
- commonJS : window object
- module : undefined


# Chapter 2 Prompt Enginnering




visit: index2.ts

visit: index3.ts


The process of **writing refining and optimizing inputs** to encourage Generative AI to create a a specific high-quality outputs.

1. Zero shots ---> **Don't provide example** to AI model how it should perform the task
```js
{
  role: "system",
  content: "You are a helpful assistant that translates English to Hindi. Translate the user sentence.",
}
```

2. Few shots ---> **Guide** the model how to perform the Task by providing few exmples. For what input what output you expects.
```js
{
  role: "system",
  content: `You are a helpful assistant that translates English to Hindi. Translate the user sentence.
  
  eg. How are you ? : केसे हो तुम ?
  
  `,
},
```
3. chain of thoughts (COT) --> COT is prompt engineering technique that tell AI to think step by step. 



----------------------------------------------------------


## We have different types of messages
- SystemMessage : SystemMessage is like we give the AI a specific role.
- AIMessage
- HumanMessage : A message(question,input) provided by human




## Few example of TypeScript configuration files, So that you can understand the Typescript configuration files.
Typescript configuration file examples

visit : ./typescript_example.md

### ESM(ES Module) vs CommonJS


ESM
- Asynchronous (parallel fetching style)
- "type": "module" , ".mjs" , and In Typescript "module": "ESNext"
- Before code run plan how the execution is going to perform. Parse(see) all module -> execute them in their dependency order
- Main thread is non-blocking usually

Parse all `import` statement. Build dependency graph. rewire everything. Start execution from the entry point(eg. index.js or main.jsx) , but actually evalute deepest dependency first [like post-order traversal]

<br>

CommonJS
- Synchrounous (blocking nature)
- "type": "commonjs" , ".cjs" files
- When it see`require()` it immediately load and execute
- Block the Main thread until the module is fully loaded and executed. Block untill the module is fully loaded & execute.

immeidately(sunchronous) way read the file. execute it top-to-bottom. If it has `require()` call it. (recursively in sub-files also, blocking nature.)

<br>

Both ESM and CommonJS(CJS) execute top-to-bottom. But the difference is when and how modules are loaded and initialiezed, not the execution order inside a file.

### The difference between `import "dotenv/config";` vs `import dotenv from "dotenv";` 

1. `import "dotenv/config";`
It Automatically calls `dotenv.config()` for you at import time. One liner, clean, no extra setup
- It assumes the `.env` is present in current directiory where your `.js` file is present [ inside which you use the import statement ] .
- OR you can set an environment variable and run the `.js` file `DOTENV_CONFIG_PATH=/custom/path/.env node app.js`  



2. `import dotenv from "dotenv";`
- `dotenv.config({ path: './custom/.env', debug: true });`
- Default import gives you `dotenv` object. You need to call the **dotenv.config()** method.
- Allows customization (custom path, encoding, debu, override, etc.)

---

OR use the CLI **--env-file** flag `node --env-file=./custom/.env app.js`. This is node.js feature not **dotenv**

## Ueful commands 

```bash
npm --> npx
pnpm --> pnpx (older) ->`pnpm dlx tsx index3_3_groq.ts` (modern)
```

```
git commit -a --amend --no-edit
git commit -a --amend --no-edit
```

# Chapter 3: Tool Calling

Tool allow the Agent to perform an action.

If we ask the current weather in New Yourk. The LLM has cutoff time the agent is not trained on latest data(Today's weather). OR if we ask it to generate chart about current population(latest data) in miami. Then still it can't anwer. 

But if you ask what is value of x if x + y = 12 then it will say "12-y". The models are trained on some mathematical book, That contains some basic arithmatic operations, equation solving, tables, etc.. So it is able to solve this .


That is where we give a tool to the Agent in order to perform an action.

**Agent  + [ search_tool, chart_generator, json_convertor ]**

now we can ask questions like 
- current weahter
- chart about population
- math problem

before understanding tool, Understand `Runnable`

### Runnable
Runnable is way of taking the output of function and pass it as input to another Runnable. 
- Runnable has some common methods already implemented `.invoke(), .batch(), .stream()`


Runnable1 --> Runnable2 --> Runnable3


### more

Q. The newer version of dotenv prints the log message of loading `.env` each time when you run the program `[dotenv@17.3.1] injecting env (4) from ../.env -- tip: ⚙️  write to custom object with { processEnv: myObject }` to remove it 

Solution: `dotenv.config({ path: '../.env',debug: false, quiet: true});`


Q. After migrating to the pnpm there is big command i need to write to run the code `pnpm dlx tsx index.ts`

Solution:

- `dlx`  standas for DownLoad and eXecute. Download package temporarily, run it, and then discard it. You don't need to unstall the package permanenetly in your project or globally
- `pnpx` and `pnpm dlx` both are almost same idea interally "pnpx" calls "pnpm dlx". so, **pnpx = pnpm dlx**

> It is just recommendation to use `pnpm dlx` because it gives more readability. However both internally does same thing

<br>

1. Add package.json command , But then it will no longer be dynamic
2. install tsx locally (much faster because it doesn't downloda each time)
```bash
pnpm add -D tsx
pnpm tsx index.ts
```

3. install tsx globally
```bash
pnpm add -g tsx
tsx index.ts
```

4. Create a shell alias
```bash
alias tsrun="pnpm dlx tsx"
tsrun index.ts
```


**My Recommedation**
> pnpm add -D tsx + set:  `alias run="pnpm tsx"`

problem: But with "pnpm tsx" you need to mention the path relative to the package.json



**More easy**<br>
```bash
pnpm add -g tsx

#If it gives :  ERR_PNPM_NO_GLOBAL_BIN_DIR  Unable to find the global bin directory

#then run : 
pnpm setup
source /home/codespace/.bashrc
```

> Now you can also run this way `tsx index.ts`. OR if you want to make it more reliable then, add **shabang** at top

```js
#!/usr/bin/env tsx

console.log("Hello from TypeScript 🚀")
```

```bash
chmod +x index.ts

# NOTE: if the file doesn't have execute permission then even after you hit the tab ( ./inde). A linux compatiable machine will not do autocompletion.

./index.ts
```

very clean

---

### something cool  `ask "What is langchain?"`

The trick can be done using a command runner so your script behave like real CLI commands. A popular tool used in many dev / AI repos is `just`

Just is an open-source software toolkit for automating and managing build and test workflows, developed by Microsoft. 

just was intially created for javascript/Typescript but now it is general-purpose command line runner and work with almost every programming language. 

1. Install just 
```bash
sudo apt install just
```

2. create a `justfile`
```bash
project/
 ├ package.json
 ├ justfile   <---------- Here is the file
 └ scripts/
      ask.ts
      rag.ts
      embed.ts
```

Example:
```bash
ask question:
    tsx scripts/ask.ts {{question}}

rag file:
    tsx scripts/rag.ts {{file}}

embed file:
    tsx scripts/embed.ts {{file}}
```

Run the command:
```bash
just ask "What is LangChain?"
```

> MK: It is not like that you have to put the command line input. If you use it to just reduce your large command-line command then still ok 
>> This is something MK is finding since a long time. 
> This works on Windows🪟 also 

For that you need to modify code so that LangChain can get the question from the command line


```js
// ask.ts

const question = process.argv[2];
console.log("Question:", question);
```

```bash
just ask "What is RAG?"
# output: Question: What is RAG?
```


Explanation
```text
process.argv
[
  node_path,
  script_path,
  arg1,
  arg2,
  ...
]

```


## TavilySearch

install tavily

and set the api key in .env file

---


command to remove the cache from the git repo. Previously tracking some files but now don't want to track
If Git was previously tracking files but you added them to .gitignore and want Git to stop tracking them, you need to remove them from the Git index (cache) while keeping them in your local filesystem.
`git rm --cached path/to/file`

# LangGraph

Langraph is a framework built on top of langchain. LangGraph allows to create a ai workflow.  Ai workflow is composed by set of nodes and edges. 



No conditional Node:
```bash
Start --> A --> B --> C --> End
```

Conditional Node:
```bash
          | --> B --> |
Start --> A           D --> End
          | --> C --> |
```


# RAG

RAG stands for Retrival Augamented Generation

RAG is technique that enhances a model's generation capabilities by retrieving the relevant information from external memory source. An external memory source can be : an internal database, a user's previous chat session, or the internet.

1. Retrieval  : Retrived Data
2. Augamented : Take retrieved data and augament the LLM
3. Generation : LLM generate response based on retrieved data

LLM is trained on huge amount of data on internet so, LLM becomes genius. If you ask chatGPT "what is javascript?" It respond immediately, Because it is trained on Javascript documentation.

But if you ask chatGPT about something on which it is not trained on, "Who is morris the deragon?" (It is character of your some imaginary story, ChatGPT doesn't know about that, also that thing is not avaiable on internet. ChatGPT is not trained on that)

This is limitation of LLM. RAG solve this limitation. There is another solution also **Fine-tuning** but it is computationally very expensive. 

LLM Are Limited:
- Don't have access to internet data (Although we can add Tavily Tool. But natively as vanilla LLM. LLM can not search internet)
- Don't have access to external data sources



User ---> external data(eb, wiki) / internal data(database, pdf, html) ---> Chunks(chunk1, chunk2, chunk3, ...) --> Embedding model --> [ [123, 127, 6, .. 79], [..], [...] ], ... --> Vector DB  <--->

Context Window: It is the maximum amount of text an LLM can proces in one go.
eg. 32k tokens

That is the reason we need to devide the entire data into chunks and then passed to embedding model, instead of passing it all at once

Vector database is something that store vector(numbers, 1D array). It stores [(chunk1, [vector]), (chunk2, [vector]), ...]

## Main components of RAG

1. retriver: It allows to retrive data from vector database. 

question --> Embedding model --> send that embedded question to Vector database --> Vectr database will return N similar Document chunks using similarity search algorithm(using cosine similarity)

2. Generator: Generate the Document chunks to the LLM as context so that it can give answer 


Document chunks --> LLM --> Answer/respond



We're going to use Cohere LLM provider. For embedding model. so, make sure you login to their website and add it to the `.env` file

Then as Vector database we're going to use the Pinecone vector database. Create using tempmail(fake account). Because Pinecone offers only 1 Vector database free per account. Then it ask for payment. 

- We need to create index(Database). Give the name to index. select the provider and make sure you don't chhose any subscription option.
- You need to get the API key. set it in `.env` file


```bash
PINECONE_API_KEY=
PINECONE_INDEX=
```

----

Now both 
```js
if (!(process.env.COHERE_API_KEY && process.env.PINECONE_API_KEY && process.env.PINECONE_INDEX)) {
  throw new Error("One or more required environment variables are missing in .env: PINECONE_API_KEY, PINECONE_INDEX, or COHERE_API_KEY");
}
```

are same 
```js
if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX || !process.env.COHERE_API_KEY) {
  throw new Error("One or more required environment variables are missing in .env: PINECONE_API_KEY, PINECONE_INDEX, or COHERE_API_KEY");
}
```

Both of these statements are logically equivalent due to **De Morgan's Laws** in boolean algebra.
- De Morgan's Laws: `!(A && B && C)` is equivalent to `!A || !B || !C`.


I need to use the same pinecone index again and again but the thing one index already have some documents,emebddings already.

There is no way to make the pinecone database completely empty using the Pinecone UI(console) directly. 
However you can delete the index entirely and create a new one. OR you can search vectors and delete them but you can not make it empty.

You can make it empty programatically. 

```js
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index("your-index-name");

// ✅ Delete everything in default namespace
await index.deleteAll();
```

----

Pinecone terminologies and it's relation with the SQL database

Pinecone                    SQL Equivalent
────────────────────────────────────────────
Pinecone Service    →       Database Server (MySQL/PostgreSQL)
Index               →       Database/Table
Namespace           →       Schema/Partition within a Table
Vectors             →       Rows


**What is index ?**<br>
An index is main container for your vector data. Think of it like database table in SQL. 

Index:
- has fiexed dimention (eg. 1536)
- has specific similarity search technique a.k.a. metric (cosine, euclidean, dotproduct)
- You are limited in how many indexes you can create (based on plan)


**What is Namespace ?**<br>
A namespace is a subdivision/partition inside an index. Think of it like partitions or schemas within a table. 

```js
// Different namespaces inside the same index
const userDocs = index.namespace("user-documents");
const companyDocs = index.namespace("company-documents");
const blogPosts = index.namespace("blog-posts");

// SQL equivalent:
// SELECT * FROM my_index WHERE partition = 'user-documents';
// SELECT * FROM my_index WHERE partition = 'company-documents';
```

Namespaces
- Free to create - no extra cost
- Unlimited namespaces within an index
- Data in one namespacce is isolated from another
- You don't need to pre-create then - they are created automatically

Visual Representation
```bash
┌─────────────────── Pinecone Service ────────────────────┐
│                                                         │
│  ┌─────────────── Index: "my-app" ────────────────────┐ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  Namespace: "user-1"                         │  │ │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐            │  │ │
│  │  │  │Vector 1│ │Vector 2│ │Vector 3│            │  │ │
│  │  │  └────────┘ └────────┘ └────────┘            │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  Namespace: "user-2"                         │  │ │
│  │  │  ┌────────┐ ┌────────┐                       │  │ │
│  │  │  │Vector 1│ │Vector 2│                       │  │ │
│  │  │  └────────┘ └────────┘                       │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  Namespace: "" (default)                     │  │ │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │  │ │
│  │  │  │Vector 1│ │Vector 2│ │Vector 3│ │Vector 4│ │  │ │
│  │  │  └────────┘ └────────┘ └────────┘ └────────┘ │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Actually you can delete `namespace` by click on **namespace** tab on dashboard. Click on 3 dots and click on delete


Visit:
- ingestion_pipeline.ts
- retriver.ts

# Multi Qyeert generation
Previously we learn how to retrive the data from the vector database using single query, this can lead to poor retrieval.

The user's question can be too broad or can be too specific. The user's question sometimes may be can not align with the vocabulary of documents. In order to mitigate this kind of issue. LLM 


        | --- q1 --> vector-store --> document  --> reranker model ---> |
LLLM -- | --- q2 --> vector-store --> document  --> reranker model --- |------> pick 1 doc with high rank score (top 1) --> Fusion --> LLM --> Answer
        | --- q3 --> vector-store --> document  --> reranker model ---> |


Here **Fusion** means [RRF(Reciprocal Rank Fusion)](https://medium.com/@devalshah1619/mathematical-intuition-behind-reciprocal-rank-fusion-rrf-explained-in-2-mins-002df0cc5e2a)


In order to generate query we use this prompt here,

Prompt Engineering technique: StepBack Prompting
```

You are AI search assistant.
  The user asked: {question}

  Step back and consider this qestion more broadly!
  1. Reframe it in general terms
  2. Idedntify the main themes or dimentions involved
  3. Generate 5 diverse search queries that cover these dimentions, ensuring-each query explores a different perspective or phrasing.


```

visit order:
- ingestion_pipeline.ts
- retriver.ts
- generator.ts
- geerator2.ts
- retriver2.ts
- RRPF.ts



### StepBack Prompting
Instead of directly answering a narrow question, you:
1. Ask a more general or conceptual question
2. Then use that broader understanding to answer the original question



Example: 
Q. "What factord affects chemical reacting rates?"
Then asked Q. "Give those factors, why does increasing temparture increase reaction rate?"

Another Example:
Direct: “Why is my async function not returning data?”

Step-back
- “How do async functions work in JavaScript?”
- “Based on that, why might an async function not return data?”



Compared to Other Techniques
- `Chain-of-Thought prompting` → step-by-step reasoning
- `Step-back prompting` → zoom out → understand → zoom in


Use it when:
- The queston is complex
- You want deeper understanding
- The model gives vague or incorrect answers

Think of it like: 
> "Before solvung the problem, understand the theory behind it."


# Different RAG techniques

RAG : We said RAG is technique that allows to enhance the model's generation by proving the model the possibility to get access to the external data sources 

**We have different RAG techniques**:

1. Native RAG: The most basic form, directly using retrived data as input for generation without further processing or refinement.

2. Advanced RAG: Employs more sophisticated techniques for retrieval and generation, often involving deep learning-based methods and neural search algorithms

3. Modular RAG: Break down the RAG process into functional modules(eg. search, memory, fusion) that can be customized and rearranged for specific tasks, offering greater flexibility

4. Corrective RAG: Includ a verification and correction step after the initial generation, aiming to minimize error and improve response accuracy.

5. Speculative RAG: Anticipate user needs by predicting queries and preparing relevant response in advance, potentially improving response time. 

6. Agentic RAG: Integrates an autonomous agent into the RAG pipeline, enabling the system to learn user preferences and adapt over time through repeated interactions. 

7. Self-RAG: Here model retrive information on demand and critiques its own generated output using special tokens to ensure high accuracy.



-------------------------------



Here, We will focus only one the **Native RAG** and **Corrective RAG**.


**Native RAG**

We have doucment. 
Inside the document we talk about python, Python programming language. We take that document and we will store it into the vector database. and we're goig to ask `What is Python?`

and then we get this defination from the model `Given retried Data, Python is interpreated language`

Now suppose the book has falsy defiation of python. `Python  is compiled language`. Ok we got defective response. 


In order to solve this kind of issue, We're gonna leverage Corrective RAG.

**Corrective RAG**

User asked as question(query). We fetch(retrive) data from the vector database. Inside our vector database we have false defination of python. Once we got that data LLM is going to evaluate the user question versus retrived data.


If the LLM says, data received from vector database is irrelevant to the user question, we're going to perform a web search. We've the web data. We pass it to the LLM in order to generate response for the user. 


If the user question is relevant, we return the response
If not, make web search


```bash
     |--q1->vector-store->doc-->reranke-->|high rank doc|                                                                             |-> if relevant doc found , pass to ----------------------------------> LLM ---> Answer
LLM--|--q2->vector-store->doc-->reranke-->|high rank doc|-->Fusion (Array)->Loop over that array to find relevant Document--"router"--|                                                                     ↑    
     |--q3->vector-store->doc-->reranke-->|high rank doc|                                                                             |-> If no relevant document found -> web search and get web data ---> ↑
--> LLM --> Answer 
```


(zoom-out for better view)

visit: **qa_overdocs.ts**

# Map Reduce Technique

A "devide and conquer" approch that involves breaking document into chunks, <u>generating a summary for each chunk</u> and then combining and summerizing those smaller summaries into a final consolidated one

- Summary
- Study guide
- Briefing DOC
- FAQ
- MindMap (Knowledge graph)


Workflow :
```bash
source doc --> text splitter --> Chunks of Doc --> Final Summary(LLM) --> Array of summaries 
                                                      ^-----------------v
```


our graph will look like this:
```bash
Doc --> Break into multiple chunks --> MapSummary ----> Take pice by piece ---> Pass to LLM ---> Sumaries [array] ---> summaries 
                                              |                                                              |                                                                   
                                              |                                                              |                                                                   
                                              v                                                              |                                                        
                                      Iterate thorugh array of documents                                  Count no of Tokens of summary   (Check condition)                                                                                                                                                                 



condition : 


const max_tokens = 1k # max_no_token_llm_can_have_as_context

If Count < max_tokens

  GenerateFinalSummary

else 

collapseSummary --> split summaries into small summaries ( untill TokenLength of summaries becomes < max_tokens ) --> Summaries [array] --> GenerateFinalSummary

```


## Send() Function

It is basicallly a function that we use in order to send the data from one to another node in a graph. It is langgraph's functionality

visit: test.ts
visit  : summary.ts


---

Very few times you see the Depreciation warning during installation of package like `pnpm add langchain`

example 
```bash
 WARN  3 deprecated subdependencies found: @types/marked@6.0.0, node-domexception@1.0.0, whatwg-encoding@3.1.1

```

To avoid it: you want to suppress those deprecation warnings in the future, you can add to your `.npmrc`: loglevel=error

```bash
cd /workspaces/NotebookLM-clone
touch .npmrc
echo "loglevel=error" >> .npmrc
```

Now you will see clear output without deprecation warnings
```bash
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 788ms using pnpm v10.23.0
``` 

-----


Now, using the same technique(map reduce technique) to generate **study-guide**.

visit:
- study_guide.ts
- briefing_doc.ts


# Mind Map

Till now we learned about : summary, study guide, briefing doc, generate faq
and we learn about Prompt Engineering also.

Now we need to create **mind-map**.

At the end we will see how to generate:
- **audio** and
- **video**
(We will work on these two things at the end)

After this section we will work on backend
0. Refactor a backend
1. Build the Express Server
2. Setup Auth using Google
3. Google Drive Integration
4. user api
5. Notes api
6. Setup React Project
7. Build UI
8. API intergraion (React)


## What is a `MindMap`

A mindmap is diagram that allows to visualize a topic to make it easy to understand 

Workflow

```bash


Source : Prompt Engineering   --> LLM --> FAQ, Summary, Study guide, Briefing doc, MindMap, Audio, Video --> Study guide --> use `study_guide` to generate mind_map

```

In order to generate mind map we use [mind elixer](https://docs.mind-elixir.com/) library. Mind elixir is the open-source JS library.
To create an mind map we need to force The LLM to generate object like this 


```
import MindElixir, { MindElixirData, Options } from 'mind-elixir'

const options: Options = {
  el: '#map',
}
const data: MindElixirData = {
  nodeData: {
    id: 'root',
    topic: 'root',
    children: [
      {
        id: 'sub1',
        topic: 'sub1',
        children: [
          {
            id: 'sub2',
            topic: 'sub2',
          },
        ],
      },
    ],
  },
}
const mei = new MindElixir(options)
mei.init(data)
```

code from :https://docs.mind-elixir.com/docs/getting-started/typescript-support


# Creating Backend ( Build Express Server)

Folder structure
```bash
src/app/
├── bootstrap/
│   ├── exceptions/
│   └── express/
│       └── expressServer.ts
└── http/
    └── controllers/
        ├── auth/
        └── notes/
```

visit:

- expressServer.ts


install type definations of express for typescript support `.t.ds` files

`pnpm add -D @types/express`



now we use another module called `tsconfig-paths`. We're going to use this module in order to define path alias for module resolution in typescript projects

we're going to use in order to run the express server. 

`nodemon --exec ts-node -r tsconfig-paths/register src/index.ts`


--------------------------

NPM has strict rules for package names:
- ❌ No uppercase letters
- ✅ Only lowercase letters allowed
- ✅ Can use `-`, `_`, `.`
- ❌ No special characters like !, spaces, etc.
- ❌ Cannot start with `.` or `_`

👉 “all the characters… must be lowercase”

If the name is already taken on npm, you can use scoped packages: `"name": "@yourname/notebooklm-clone"`


-------------------------------------

## Workflow Explanation

Over all workflow:
1. src/index.ts : Entry point that starts everything
2. src/app/bootstrap/index.ts : Coordinates the setup process
3. src/app/bootstrap/express/expressServer.ts : Configure and actually start express server
4. src/app/bootstrap/exceptions/handleExpressionError.ts : Handle errors that occur in the app. The safety inspector who handle problems

Explain the code : 

1. `src/index.ts` (The Starting Point)

perform necessary imports.
Import bootstrap function that will setup server. 

`app=express()` create a new Express application (a web server instance)

call the bootstrap function to setup and start server. Pass express application and port. 

2. `src/app/bootstrap/index.ts` (The Coordinator)

import Express type for TypeScript, helps with code type checking.
import the function `expressServer` that will actually start the server.

create a function named `bootStrap` take two parameters. 

3. `src/app/bootstrap/express/expressServer.ts` (The Builder)

import **CORS(Cross-Origin Resource Sharing)**. This allows your server to accept requests from web browsers on different domains. Different domain can send request to your server.
- without CORS your server reject request from `http://example.com`
- with CORS your server accepts requests from any websites.

import the Error handling function `handleExpressError`

create and export `expressServer` function. Takes the Express app and PORT number as inputs. Configure CORS **middleware**. 
- `origin: "*"` means "accept requests from any website"
- `credentials:true` allow cookies and authentication headers

`app.use(express.json())` Adding a middleware that can parse incoming JSON data. When someone can send `{"name": "John"}`, Express can understand it

`app.use(express.urlencoded({extended:true}))` : Adds middleware to parse URL-encoded data (form submissions). `extened: true` allow rich object and array to be encoded

- rich object = complex, nested data structures
  - simple(not rich): `name=John&age=25`
  - rich objects (extended: true) : `user[name]=John&user[address][city]=NYC&hobbies[0]=reading&hobbies[1]=coding`

  ```json
  {
    "user": {
      "name": "John",
      "address": { "city": "NYC" }
    },
    "hobbies": ["reading", "coding"]
  }
  ```


`app.use(handleExpressError)` Use error handling middleware

Create a GET request root path `"/"`. req = incoming request, res = outgoing response. Send the JSON response with success message. 

Tell the server to start listening on specific PORT.

4. `src/app/bootstrap/exceptions/handleExrpressError.ts` (The Safety Inspector)

create an error handling function. Take 4 parameters(this is required when you create a custom error handler for Express )
- `err`: error the occurred
- `req` : request object, `res`: response object
- `next`: Function to pass "the control" to next middleware

determine the HTTP status code. If the response status code is not 200(success) use the status code. othersie set it to 500(internal server error)

keep the status code and sned JSON data.

**Q. When the Error Middleware called ?**
- called when any route/middleware throws and error
- you explicitly call `next(error)`

**Q. Inside `handleExpressError()` we haven't call the next() does this is valid ?**
Error handler are the end of the chain. They send a resposne(`res.json()`) and stop. so, No need to pass to next middleware

Rule:
- Regular middleware --> call next() to conitnue
- Error Middleware --> send response and stop


**There is mistake in your code you should Pat the `handleExpressError()` after the route GET "/"**

The reason behind that is, Express reads top to bottom

```js
app.use(handleExpressError)  // Nothing to catch yet!
app.get("/", ...)            // Errors here won't be caught
```

```js
app.get("/", ...)            // Route runs first
app.use(handleExpressError)  // Catches errors from above
```

Error handler must be place after route


**How express will know to call specifically this "handleExpressError" middleware when the error happen**

Express identifies error handlers by counting the parameters:
- Middleware (3 parameters) -> Regular middleware
- Middleware (4 parameters - with 'err' first) --> Error handler

There can be multiple error handling middlewares 

Express calls them in order until one sends a response,
```js
// 1. Handle database errors specifically
app.use((err, req, res, next) => {
  if (err.name === 'MongoError') {
    return res.status(503).json({ error: "Database error" });
  }
  next(err);  // Not a DB error, pass it on
});

// 2. Handle validation errors
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: "Invalid data" });
  }
  next(err);  // Not a validation error, pass it on
});

// 3. Catch everything else (fallback)
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong!" });
});
```


Full Code example: Error handlers with express routes

```js

// expressServer.ts

import express from "express";
import { Express } from "express";
import cors from "cors";

export function expressServer(app: Express, PORT: number) {
  
  // ========== 1. GLOBAL MIDDLEWARE (First) ==========
  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  
  // ========== 2. ROUTES (Middle) ==========
  
  // Basic route
  app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
  });

  // Route that throws error
  app.get("/error", (req, res, next) => {
    const error = new Error("Something broke!");
    next(error);  // Triggers error handlers below
  });

  // Route with custom error
  app.get("/users/:id", (req, res, next) => {
    if (!req.params.id) {
      const error: any = new Error("User ID required");
      error.status = 400;
      return next(error);
    }
    res.json({ user: "John" });
  });

  
  // ========== 3. ERROR HANDLERS (Last) ==========
  
  // Error Handler 1: Log all errors
  app.use((err, req, res, next) => {
    console.error("Error logged:", err.message);
    next(err);  // Pass to next handler
  });

  // Error Handler 2: Handle 404 Not Found
  app.use((err, req, res, next) => {
    if (err.status === 404) {
      return res.status(404).json({
        error: { message: "Not found", status: 404 }
      });
    }
    next(err);  // Not a 404, pass it on
  });

  // Error Handler 3: Handle validation errors
  app.use((err, req, res, next) => {
    if (err.status === 400) {
      return res.status(400).json({
        error: { message: err.message, status: 400 }
      });
    }
    next(err);  // Not a validation error
  });

  // Error Handler 4: Final catch-all
  app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      error: {
        message: err.message || "Internal Server Error",
        status: statusCode
      }
    });
  });

  
  // ========== 4. START SERVER ==========
  app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
  });
}

// Request → Middleware → Routes → Error Handlers (1→2→3→4) → Response

```

> Here for Better organition tutor keep separation of files


**Q. Why it is like when i use .js extension it gives error and when i don't include that .js extesion in import statement it not gives error. Explain in very simple language**

When you run the `npm run dev` or `pnpm dev` it runs `ts-node`,, which executes TypeScript files directly (.ts files).

The problem is when you write the `.js` extension. Node.js look for `file.js`. but actually file is `file.ts`
So it says: "Cannot find module file.js" - because that file doesn't exist!

Without Extension:
TypeScript (ts-node) is smart! It says:
- "Let me look for file.ts" ✅
- Found it! Import successful!

When you would use `.js` ? 
Only after compiling TS code to JS (command : `tsc`)
Then your dist/ folder has .js files, and .js extensions would work.

Summary
- Development (ts-node): Don't use .js extension → imports .ts files
- Production (compiled): .js extension could work → imports .js files

For your project: Always remove .js when importing in .ts files! 🎯


# Authentication

To setup authenticaion we need to install some packages
- `express-session`
- `passport-google-oauth20` <-- for Google authentication

In order to get API key ( use 007 account )
seach google auth on google. click on **developers.google.com Using OAuth2**
Then scroll page little bit and click on Google API console. 

Click on projects : New project
- project name : notebooklm-clone



From left side bar: API and Services > Google Auth Platform > Overview > get started > 
- app name: notebooklm
- email: select your email (i choose 007)

- Audiance : external
- contact information: select your email (i choose 007)
- click  on checkbox agree and continue 

Create

From left side bar: API and Services > Data access > Add or remove scopes > select:
- ../auth/userinfo.email
- ../auth/userinfo.profile

click on update

click on > Add or remove scopes
Enter the property name : 

- "https://www.googleapis.com/auth/drive.readonly" copy it without quotes and pastet near by filter

becaus we're going to access drive files.

- "https://www.googleapis.com/auth/drive.file"

below there is input field that contains Manually Add Inputfields 

```bash
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/drive.file
```

click on **Add to table**

click on **save**


click on > `Clients` > create client

Create Auth clients: 
- Application type: web application
- Authorized javascript login : Add login => URL: http://localhost:8000
- Authorized redirect URL : Add URI => URI : http://localhost:8000/auth/google/callback

Add a `CALL_BACK_URL` in environment variable

Click on > create

You will get  Client ID and client secret set it in .env file as 
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

-------------------------------------------------------------


This explains how to use express-session: https://www.npmjs.com/package/express-session

same way for passport : https://www.npmjs.com/package/passport


Now in order to check authentication.

API and services > google auth platform >Audience > Add users


Add the email address you want to authenticte ( 007 email address ) [ open gmail click on profile icon and copy email and paste]

and click on **save**



Test it's working or not.

1. Run the application `pnpm dev`
2. and visit : http://localhost:8000/auth/google
3. it will redirect you to the google login 

4. **click on the account**
It will it is not safe you want to continue ? I know that application is created by me and fully trusted so yaah! 
5. **continue**
6. Select what `notebooklm`(name of the app you define in "google console api") can access > select all checkbox > continue


your server actually log you've created a user
```json
create user: {
  id: '102343583523670203993',
  displayName: 'Mayank Kapadane',
  name: { familyName: 'Kapadane', givenName: 'Mayank' },
  emails: [ { value: 'kapadanemayank007@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA=s96-c'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "102343583523670203993",\n' +
    '  "name": "Mayank Kapadane",\n' +
    '  "given_name": "Mayank",\n' +
    '  "family_name": "Kapadane",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA\\u003ds96-c",\n' +
    '  "email": "kapadanemayank007@gmail.com",\n' +
    '  "email_verified": true\n' +
    '}',
  _json: {
    sub: '102343583523670203993',
    name: 'Mayank Kapadane',
    given_name: 'Mayank',
    family_name: 'Kapadane',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA=s96-c',
    email: 'kapadanemayank007@gmail.com',
    email_verified: true
  }
}
user in serialize : {
  id: '102343583523670203993',
  displayName: 'Mayank Kapadane',
  name: { familyName: 'Kapadane', givenName: 'Mayank' },
  emails: [ { value: 'kapadanemayank007@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA=s96-c'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "102343583523670203993",\n' +
    '  "name": "Mayank Kapadane",\n' +
    '  "given_name": "Mayank",\n' +
    '  "family_name": "Kapadane",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA\\u003ds96-c",\n' +
    '  "email": "kapadanemayank007@gmail.com",\n' +
    '  "email_verified": true\n' +
    '}',
  _json: {
    sub: '102343583523670203993',
    name: 'Mayank Kapadane',
    given_name: 'Mayank',
    family_name: 'Kapadane',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA=s96-c',
    email: 'kapadanemayank007@gmail.com',
    email_verified: true
  }
}
```

This is the email i provided to the Audiance menu `'kapadanemayank007@gmail.com'`

We use that email for testing purpose. 

that's why above it's show verified true
`emails: [ { value: 'kapadanemayank007@gmail.com', verified: true } ],`


# Setup DB (MongoDB)
This is the time to store user in DB. 

we're going to setup database connection

Create two environment variables: JWT_TOKEN_KEY, REFRESH_TOKEN_KEY
and assign them value using : `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`


This way we only set the temporary value the actual/real value comes from the React Frontend.
Create npm command for that. 


```json
{
  "scripts": {
    "generate-keys": "node -e \"const crypto = require('crypto'); console.log(crypto.randomBytes(64).toString('hex')); \""
  }
}
```

`npm run generate-keys` OR `pnpm generate-keys`

So that next time you only need to Copy the output to your `.env` file! 🔐

visit
- dbConnections.ts
- models/ \<all schemas\>
- userRepository.ts
- createUserController.ts
- jwt.ts
- bootstrap/index.ts
- expressServer.ts

Use `Ctrl+P` in vs code to quickly open the file. No need to find the file in explorer. Just type filename and open it. 

Run: `pnpm dev` and visit : http://localhost:8000/auth/google


sometime if document is not well formated then also you may get error So it is good to do Format document 

> The problem is i am using Github Codespace and i downloaded the mongoDB in my local machine 



option 1: download mongo in codespace
option 2: use Alas ( recommended )
option 3: use docker


1. Create a free account at MongoDB Atlas
2. Create a free cluster
3. Get your connection string (looks like this): `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notebooklm`

> save CONNECTION URL in environment variable `.env` file 

Create a default user :
- username : root  , password : root


Important: Whitelist your IP in Atlas:
Go to Network Access → Add IP Address → Allow Access from Anywhere set it to : 0.0.0.0 (for development)


Run: `pnpm dev` and 
visit : http://localhost:8000/auth/google
login as google account. After login you will be redirected to the localhost:5173 i.e. react app URL

visit : http://localhost:8000/auth/me This end point is used to check the authenticated user in current session
This will restore the data of our session

You will see we actually have here

> Github not allow to push with this exposed so reaplce the value with `...`. AccessToken 

```json
{
  "authData": {
    "name": "Mayank Kapadane",
    "email": "kapadanemayank007@gmail.com",
    "image": "https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA=s96-c",
    "googleAccessToken": "...",
    "googleRefreshToken": "...",
    "_id": "69c4b1aadc92459009617141",
    "createdAt": "2026-03-26T04:10:18.765Z",
    "updatedAt": "2026-03-26T04:10:18.765Z",
    "__v": 0,
    "token": {
      "accessToken": "..",
      "refreshToken": "..."
    }
  }
}
```

We get:
- Name of user, email id
- Image of google account
- We use `accessToken` and `refreshToken` in order to access Google Drive files






------------------------------------------------------------------------------------------------------------------

We're gonna install googleapi package and then we have possibility to get access to the user draft files. 
Kaap your server running, and open another terminal `pnpm add googleapis`



 > NOTE: After you completed a file ask the LMArean like 
 ```
Review this code
      
{YOUR CODE HERE}
      
```

It will tell what are the fixes you need to do. What typo or mistakes you've made. Good thing. Better always stay away from unexpected / non-understandable errors. 


If you restart the express server session . ALL the sessions will be deleted/removed you need to login again

Run: `pnpm dev` and wait untill
server say
```bash
Express server is running at http://127.0.0.1:8000
Connected to MongoDB
```




------------------------------------------------------------------------------------------------------------------


In order to get data from the session we use a package `connect-mongo`

then,
visit : http://localhost:8000/auth/google
login as google account. After login you will be redirected to the localhost:5173 i.e. react app URL

visit : http://localhost:8000/auth/me This end point is used to check the authenticated user in current session
This will restore the data of our session

http://localhost:8000/api/v1/users/files