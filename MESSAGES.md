# MESSAGE

## NOTE: Try to write date and recipient for the message

> **Sambeg to Everyone** > **DATE: 20 Aug, 2020**
>
> Things to note regarding `config/`
>
> 1. the new dotenv file must be named `config.env` (No major additions have been made inside the file)
>
> **ASK ME IF YOU NEED HELP ORGANIZING THE FILE**

---

> **Yogesh to Sambeg** > **DATE: 19 July, 2020**
>
> Points to remember
>
> 1. Assign the awaited value to a variable.
> 2. Temporarily console log the variable to see what things you can do with it. _dont have to. I just like seeing the returned object. :v_
> 3. When you await a promise error Aaye si it will automatically throw it so tala bhako catch block le catch garcha
> 4. Operate on the variable you got from step 1.
> 5. Manual errors need to be thrown. So throw an object containing the error message and if possible error code Pani manually.
> 6. keep one try catch block in a controller. _wrap everything in the controller with the try catch. Variables inside the try catch block wont be accessible from outside the block. Just a reminder._
>
> I made some changes to the confirmEmailSender function. Line 23. There was a `res.send()` which was creating the headers wala issue.
> So I console logged the error instead of sending it back. Solved the issue temporarily. Look into it. I will as well.
> and I have changed the names like queried_user to more literal meanings like userFound or tokenFound or savedUser or savedToken.
>
> I also awaited the confirmEmailSender function to see if that was causing the headers wala issue. Its still awaited.
>
> references:
> awaited: used await keyword while calling it.
>
> Good luck :v

---

> **Sambeg to Sambeg**
>
> ```
> 	sudo kill -9 `sudo lsof -t -i:port`
> ```
