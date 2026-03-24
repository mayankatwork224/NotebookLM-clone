
import { DocumentInterface } from "@langchain/core/documents";

export function reciprocalRankFusion(results:DocumentInterface<Record<string, any>>[], k = 60){

    // When you hover on the "result" in retriver2.ts you will see it inferes to, const result: DocumentInterface<Record<string, any>>[]
    
    // Here  "results" is equal to, an array of Document objects. 5 questions => 5 Document object. Queried in vector database and get the chunk that has highest relevancyScore with aksed user query



    const fusedScores = new Map(); // dictionary-like object contains key-value pairs

    // Inside this Map() i will write down each unique doc(key) and it's score(key)

    
    // Iterate through each ranked list
    for(const docs of results){
        docs.forEach((doc,rank) => {
            const key = doc.pageContent;
            const previousScore = fusedScores.get(key) || 0;
            fusedScores.set(key, previousScore + 1 / (rank + k))
        });
    }


    // Use Document content as unique name(key). Because two Document might have same content so to treat them as ONE Doucment
    // Imagine same Document object come twice in list, check if RRF score is already assigned as value to that Document(key) if yes then get that socre. If not assigned then  "fusedScores.get(key)" will return "undefined". Boolean(undefined) => false. so it will assiend value as 0

    // Boolean(n) ==> true , for all non-zero numbers

    // set key, then as value score = previousScore(i.e. 0 )  + calculate_RRF score. 
    // This way if there are duplicate Document object then we get accumulated score.

    // A map object can not contain duplicated keys
    // A "new Map()" expects iterable like : [ ["first", 1] ]
    // It will not accept JS object. With JS object it will give error.

    // using "Object.entries(JS_object)" you can convert the JS object to iterable 2D array





    
    
    // convert map to the array of {doc, score} and sort by score descending
    const reranked = Array.from(fusedScores.entries())
    .map(([key, score]) => {
        
        // Take one child array from the 2D array. compare it's key with result's pageContent

        const doc = results.flat().find(d => d.pageContent === key)
        // Till now the problem is solved we calculate RRF value for each document, also remove the duplicate.
        // Save the document text content as key and The score as value
        // The problem is Map() object fusedScores doesn't have metadata of Document() object. 
        // Without this line you will miss the metadata        

        // when find() will return true then that Document() object will going to be returned

        // and we store that in JS object as 'key'. and 1D array's value i.e. score(RRF score) corresponds to that Document() object that we store in dictionary as 'value'

        return {doc , score};


        // So it will return array of JS obect [ {...}, {...}  ]

    })
    .sort((a,b) => b.score - a.score);
    
    
    // using Array.from() convert Map() object to the 2D array. [ [ 'first', 1 ] ]. Take one array out of it as a argument.
    // .flat() will make the 2D array -> 1D array. same way, 3D --> 2D

    // sort() function by default sort in ascending order. but if you want descending order then you need to pass a callback. That works as, 
    // It will take 0th and 1st positioned values from the array. check the condition. if the condition is true then keep the position as it its. Otherwise swap them. This is how sort() function's internally work when you pass a callback function 
    // Here, In this case it will take 1st and 2nd JS object. compare's score as condition .  This way it sort the array in descending order [Document with highest score come first]  


    return reranked

}


// use this function in generator2.ts


/* RRF(Reciprocal Rank Fusion) in RAG

What is RRF ?
RRF is rank aggregation technique used to combine results from multiple retrieval modethods/queries into a single, unified ranked list

Problem: In advanced RAG, we often retrive documents from multiple source or queries.  Each query retrieves its own ranked list of documents:

```
Original Query: "What causes climate change?"

Generated Sub-queries (e.g., via Multi-Query Retrieval):
├── Query 1: "greenhouse gas emissions and global warming"
├── Query 2: "human activities contributing to climate change"
└── Query 3: "natural vs anthropogenic causes of climate change"

Query 1 Results:  [Doc A (rank 1), Doc C (rank 2), Doc E (rank 3)]
Query 2 Results:  [Doc B (rank 1), Doc A (rank 2), Doc D (rank 3)]
Query 3 Results:  [Doc A (rank 1), Doc B (rank 2), Doc F (rank 3)]


```


Two key points 
1. Duplicates - Doc A appears in ALL three lists
2. How to merge ? - Which documents are tryly most relevant across all queries ?



## What Fusion Does:

Multiple Ranked Lists -------> Single Merged List
(with duplicates)               (no duplicates, re-ranked by combined relevance)



## How RRF removes Duplicates & Merges - step by step

Formula :
```
RRF_score(doc) = Σ  1 / (k + rank(doc))
```

Where k is a constant (typically 60) to prevent high-rank document from dominating


## why 60 ?
This is formula. No reason. Just hit and trial and 60  gives better result that's why.
No reason





## Example 

step 1: calculate RRF score for EACH UNIQUE Document

```
k = 60

# Doc A appears in Query1(rank1), Query2(rank2), Query3(rank1)
RRF(Doc A) = 1/(60+1) + 1/(60+2) + 1/(60+1)
           = 0.01639  + 0.01613  + 0.01639
           = 0.04891  ✅ Highest! (appears in most lists at high ranks)

# Doc B appears in Query2(rank1), Query3(rank2)
RRF(Doc B) = 1/(60+1) + 1/(60+2)
           = 0.01639  + 0.01613
           = 0.03252

# Doc C appears in Query1(rank2)
RRF(Doc C) = 1/(60+2)
           = 0.01613

# Doc D appears in Query2(rank3)
RRF(Doc D) = 1/(60+3)
           = 0.01587

# Doc E appears in Query1(rank3)
RRF(Doc E) = 1/(60+3)
           = 0.01587

# Doc F appears in Query3(rank3)
RRF(Doc F) = 1/(60+3)
           = 0.01587
```



Step 2: Sort by RRF Score -> Final Merged List ( no duplicates )

```
Final Fused Ranking:
┌──────┬───────┬─────────────────────────────────────┐
│ Rank │  Doc  │ RRF Score                            │
├──────┼───────┼─────────────────────────────────────┤
│  1   │ Doc A │ 0.04891  (appeared in 3 lists)       │
│  2   │ Doc B │ 0.03252  (appeared in 2 lists)       │
│  3   │ Doc C │ 0.01613  (appeared in 1 list)        │
│  4   │ Doc D │ 0.01587  (appeared in 1 list)        │
│  5   │ Doc E │ 0.01587  (appeared in 1 list)        │
│  6   │ Doc F │ 0.01587  (appeared in 1 list)        │
└──────┴───────┴─────────────────────────────────────┘
```


Visual Summary
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Query 1    │  │   Query 2    │  │   Query 3    │
│  Retrieval   │  │  Retrieval   │  │  Retrieval   │
│              │  │              │  │              │
│ 1. Doc A     │  │ 1. Doc B     │  │ 1. Doc A     │
│ 2. Doc C     │  │ 2. Doc A  ◄──┼──┼───────────────── Duplicate!
│ 3. Doc E     │  │ 3. Doc D     │  │ 2. Doc B ◄── Duplicate!
└──────┬───────┘  └──────┬───────┘  │ 3. Doc F     │
       │                 │          └──────┬───────┘
       └────────┬────────┘                 │
                │         ┌────────────────┘
                ▼         ▼
       ┌─────────────────────────┐
       │   Reciprocal Rank       │
       │      Fusion (RRF)       │
       │                         │
       │  • Accumulate scores    │
       │  • Deduplicate via      │
       │    dictionary keys      │
       │  • Re-rank by combined  │
       │    RRF scores           │
       └───────────┬─────────────┘
                   ▼
       ┌─────────────────────────┐
       │  Final Unified List     │
       │  (No Duplicates)        │
       │                         │
       │  1. Doc A (score: high) │
       │  2. Doc B (score: med)  │
       │  3. Doc C (score: low)  │
       │  4. Doc D               │
       │  5. Doc E               │
       │  6. Doc F               │
       └─────────────────────────┘
```


What fusion does : Merge multiple ranked list into one unified list
Why needed : Multiple queries/retrivers produce separate list of overlaps
How dedup works: Use Dictionary/hasmap - some doc ID accumulates score instead of duplicating
Why RRF specifically : Score-agnostic (doesn't need normalized scores), simple, and effective
Key benefits : Documents appearing in MORE lists get HIGHER fused scores -> better ranking


*/



