- `.ssh/config` this file is only used to determine the different github account connected with same local computer. This automatically distinguish and show you(local computer) as valid user who can access the repo from account1 and account2. Autotmatically the validation happen during code push.

- You need to change the `local` username and especially local gmail that must be same as the github account's logged gmil id. Otherwise it will looks like on your github repo, Someone other had push the code. 

    - make sure your it is git repo. Then immediately before commit the changes you should run below commands
    ```bash
    git config --local user.name "jamesbot-007"
    git config --local user.email "kapadanemayank007@gmail.com"
    ```
    - you can verify by `git config --list --local`