# Server Actions

Server Actions allow client-side forms and handlers to call server-side functions directly securely.

## Guidelines

1. **Location & Export**:
   - Write Server Actions in distinct files named `actions.ts` or within module directories (e.g., `src/modules/auth/actions/`).
   - Add the `"use server"` directive at the top of the file.
   - Example:
     ```typescript
     "use server";

     import { getRequestContext } from "@opennextjs/cloudflare";
     import { z } from "zod";

     const schema = z.object({
       email: z.string().email(),
     });

     export async function subscribeUser(prevState: any, formData: FormData) {
       const validated = schema.safeParse({
         email: formData.get("email"),
       });

       if (!validated.success) {
         return { success: false, errors: validated.error.flatten().fieldErrors };
       }

       const env = getRequestContext().env;
       // DB or API calls go here...
       
       return { success: true };
     }
     ```

2. **Validation**:
   - Always validate inputs using a library like Zod on the server. Never trust parameters sent from the client.

3. **Error Handling**:
   - Do not throw uncaught errors from Server Actions. Return standard JSON structures (e.g., `{ success: false, error: "message" }`) to represent failure states.

4. **Security**:
   - Verify authentication state before executing sensitive database writes.
